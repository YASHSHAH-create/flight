/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import { blockSeats, getBoardingPoints, getSeatLayout, pg, SITE_URL, UpstreamError, type EmbarkPassenger } from '@/app/lib/bus/server';
import { getSession, rememberPayment } from '@/app/lib/bus/session';
import { assertSameOrigin, handler, HttpError, ok, rateLimit, readJson } from '@/app/lib/bus/security';
import { validateCheckout, ValidationError } from '@/app/lib/bus/validate';
import type { CheckoutResponse } from '@/app/lib/bus/types';

export const runtime = 'nodejs';
export const maxDuration = 120;

/**
 * POST → holds the seats, saves the booking draft and starts the payment.
 *
 * Trust boundary: the browser only tells us *which* seats and *who* travels.
 * Prices are re-read from the supplier here, the hold is placed server-side,
 * and the payment server independently enforces the blocked fare as the
 * minimum chargeable amount (bus-server /block-fare, internal key).
 */
export const POST = handler(async (req) => {
    assertSameOrigin(req);
    rateLimit(req, 'checkout', 8, 60 * 1000);

    const session = await getSession();
    if (!session) throw new HttpError('Please sign in to continue.', 401);

    const input = validateCheckout(await readJson(req, 32 * 1024));

    // 1. Re-read the live seat map — the only source of truth for fares/availability.
    const [layout, points] = await Promise.all([
        getSeatLayout(input.traceId, input.resultIndex, input.srdvIndex),
        getBoardingPoints(input.traceId, input.resultIndex, input.srdvIndex),
    ]);
    const seatIndex = new Map([...layout.lower, ...layout.upper].map((s) => [s.name.toUpperCase(), s]));

    const boarding = points.boarding.find((p) => p.id === input.boardingPointId);
    const dropping = points.dropping.find((p) => p.id === input.droppingPointId);
    if (!boarding) throw new ValidationError('Please choose a valid boarding point.', 'boardingPointId');
    if (!dropping && points.dropping.length) throw new ValidationError('Please choose a valid dropping point.', 'droppingPointId');

    let total = 0;
    const embarkPassengers: EmbarkPassenger[] = input.passengers.map((p, i) => {
        const seat = seatIndex.get(p.seatName.toUpperCase());
        if (!seat) throw new ValidationError(`Seat ${p.seatName} is no longer on this bus. Please reselect.`, `passengers.${i}.seatName`);
        if (!seat.available) throw new UpstreamError(`Seat ${seat.name} was just booked by someone else. Please pick another seat.`, 409);
        if (seat.ladies && p.gender !== 2) throw new ValidationError(`Seat ${seat.name} is reserved for women.`, `passengers.${i}.gender`);
        if (seat.males && p.gender !== 1) throw new ValidationError(`Seat ${seat.name} is reserved for men.`, `passengers.${i}.gender`);
        total += seat.fare;
        return {
            LeadPassenger: i === 0,
            Title: p.title,
            FirstName: p.firstName,
            LastName: p.lastName,
            Email: input.contact.email,
            PhoneNo: input.contact.phone,
            Phoneno: input.contact.phone,
            Age: p.age,
            Gender: p.gender,
            SeatName: seat.name,
            Fare: seat.supplierFare,
            SeatType: seat.type,
            IdType: input.idProof?.type === 'Aadhaar' ? 'Aadhaar' : input.idProof?.type === 'Passport' ? 'Passport' : input.idProof?.type === 'Voter ID' ? 'VoterId' : input.idProof?.type === 'Driving Licence' ? 'DrivingLicense' : 'PAN',
            // Operators that do not check ID at boarding still expect a value in the Block call.
            IdNumber: input.idProof?.number || 'ABCDE1234F',
            Address: [input.from.name, 'India'].join(', '),
        };
    });
    if (layout.paxIdRequired && !input.idProof) throw new ValidationError('This operator checks a photo ID at boarding. Please add the lead passenger\'s ID.', 'idProof.number');
    if (total <= 0) throw new UpstreamError('Fare could not be confirmed. Please search again.', 502);

    // 2. Hold the seats with the operator.
    const block = await blockSeats({
        traceId: input.traceId, resultIndex: input.resultIndex, srdvIndex: input.srdvIndex,
        boardingPointId: boarding.id, droppingPointId: dropping?.id || input.droppingPointId,
        passengers: embarkPassengers,
    });

    // 3. Save the booking draft on the payment server (owner = JWT user).
    const journeyDate = input.date;
    const draft = await pg.saveDraft(session.token, {
        service: 'bus',
        type: 'bus',
        channel: 'WEB',
        traceId: input.traceId,
        resultIndex: input.resultIndex,
        srdvIndex: input.srdvIndex,
        blockRefId: block.blockRefId,
        boardingPointId: boarding.id,
        droppingPointId: dropping?.id || input.droppingPointId,
        boardingName: boarding.name,
        droppingName: dropping?.name || '',
        boardingTime: boarding.time,
        droppingTime: dropping?.time || '',
        passengers: embarkPassengers,
        totalFare: total,
        journeyDate,
        busName: input.bus.operator,
        busType: input.bus.busType,
        departureTime: input.bus.departure,
        arrivalTime: input.bus.arrival,
        fromCityName: input.from.name,
        toCityName: input.to.name,
        fromCityCode: input.from.code,
        toCityCode: input.to.code,
        email: input.contact.email,
        phone: input.contact.phone,
        userGoogleId: session.user.userId,
    });
    const bookingId: string = String(draft?.uniqueId || '');
    if (!bookingId) throw new UpstreamError('Could not create the booking reference. Please try again.', 502);

    const lead = input.passengers[0];
    const userInfo = { firstname: lead.firstName, lastname: lead.lastName, email: input.contact.email, phone: input.contact.phone };

    // 4a. Wallet: debit + supplier booking happen synchronously on the payment server.
    if (input.payMethod === 'WALLET') {
        const res = await pg.payWithWallet(session.token, { amount: total, bookingId, userInfo });
        const txnid = `WALLET_${bookingId}`;
        const out: CheckoutResponse = {
            success: true, bookingId, txnid, amount: total, payMethod: 'WALLET',
            bookingStatus: res?.success && res?.bookingStatus === 'SUCCESS' ? 'SUCCESS' : res?.bookingStatus === 'FAILED' ? 'FAILED' : 'PENDING',
        };
        if (!res?.success && res?.message && !/refund/i.test(String(res.message)) && out.bookingStatus !== 'FAILED') {
            throw new UpstreamError(res.message, 402);
        }
        return ok(out);
    }

    // 4b. Gateway: hosted checkout page, returns to our payment-return handler.
    const redirectUrl = `${SITE_URL}/api/bus/payment-return/${encodeURIComponent(bookingId)}`;
    const pay = await pg.createPayment(session.token, {
        amount: total,
        bookingId,
        channel: 'WEB',
        redirectUrl,
        userInfo,
        coinsToRedeem: 0,
    });
    if (!pay?.success || !pay?.data?.txnid) throw new UpstreamError(pay?.message || 'Payment could not be started. Please try again.', 502);
    const hosted = String(pay.data.redirectUrl || pay.data.payment_url || '');
    if (!/^https?:\/\//.test(hosted)) throw new UpstreamError('Payment gateway did not return a checkout page.', 502);

    await rememberPayment(bookingId, String(pay.data.txnid));
    const out: CheckoutResponse = { success: true, bookingId, txnid: String(pay.data.txnid), amount: total, payMethod: 'GATEWAY', redirectUrl: hosted };
    return ok(out);
});
