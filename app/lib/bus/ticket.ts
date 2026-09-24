/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import type { BookingView } from './types';

const str = (v: unknown) => (v === undefined || v === null ? '' : String(v)).trim();

/** Build the ticket card from a successful_bookings / failed_bookings record. */
export const toTicket = (rec: any): BookingView['ticket'] | undefined => {
    if (!rec) return undefined;
    const data = rec.bookingData || {};
    const bus = rec.busResponse || {};
    const db = bus.dbRecord || {};
    const embark = (bus.data && bus.data.Result) || {};
    const paxSrc: any[] = (Array.isArray(db.passengers) && db.passengers.length ? db.passengers : data.passengers || data.Passengers || []);
    const passengers = paxSrc.map((p: any) => ({
        name: str(p.name || p.Name || [p.Title, p.FirstName, p.LastName].filter(Boolean).join(' ')).replace(/\s+/g, ' '),
        age: p.age ?? p.Age,
        gender: typeof p.gender === 'string' ? p.gender : (p.Gender === 2 || p.Gender === '2' ? 'Female' : p.Gender === 1 || p.Gender === '1' ? 'Male' : undefined),
        seat: str(p.seatName || p.SeatName || p.seat),
    }));
    const cancellation = rec.cancellation;
    return {
        pnr: str(rec.pnr && rec.pnr !== 'CONFIRMED' ? rec.pnr : bus.pnr || db.pnr),
        ticketNo: str(bus.ticketNumber || db.ticketNumber || (bus.data && (bus.data.TicketNo || (bus.data.Result && bus.data.Result.TicketNo)))),
        embarkBookingId: str(bus.bookingId || db.bookingId),
        operator: str(data.busName || embark.TravelName || db.busName),
        busType: str(data.busType || embark.BusType || db.busType),
        from: str(data.fromCityName || db.fromCityName || data.boardingName),
        to: str(data.toCityName || db.toCityName || data.droppingName),
        date: str(data.journeyDate || db.travelDate),
        departure: str(data.departureTime || db.departureTime),
        arrival: str(data.arrivalTime || db.arrivalTime),
        boardingPoint: [str(data.boardingName), str(data.boardingTime)].filter(Boolean).join(' · '),
        droppingPoint: [str(data.droppingName), str(data.droppingTime)].filter(Boolean).join(' · '),
        passengers,
        amount: Number(data.totalFare || db.totalFare || rec.paymentDetails?.amount || 0),
        contact: { email: str(data.email), phone: str(data.phone) },
        cancelled: !!(cancellation && cancellation.status === 'CANCELLED'),
        cancellation: cancellation ? { refundAmount: cancellation.refundAmount, cancellationCharge: cancellation.cancellationCharge, cancelledAt: cancellation.cancelledAt } : undefined,
    };
};

