/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import { pg } from '@/app/lib/bus/server';
import { getSession } from '@/app/lib/bus/session';
import { handler, HttpError, ok, rateLimit } from '@/app/lib/bus/security';
import type { BookingView } from '@/app/lib/bus/types';
import { toTicket } from '@/app/lib/bus/ticket';

const str = (v: unknown) => (v === undefined || v === null ? '' : String(v)).trim();

export const runtime = 'nodejs';
export const maxDuration = 60;

/** GET → verifies the payment with the gateway if needed and returns the booking state. */
export const GET = handler(async (req, ctx: { params: Promise<{ ref: string }> }) => {
    rateLimit(req, 'booking-status', 90, 60 * 1000);
    const session = await getSession();
    if (!session) throw new HttpError('Please sign in to view this booking.', 401);
    const { ref } = await ctx.params;
    if (!/^[A-Za-z0-9_-]{6,80}$/.test(ref)) throw new HttpError('Invalid booking reference', 400);

    const view: BookingView = { ref, paymentStatus: 'UNKNOWN', bookingStatus: 'UNKNOWN' };
    const isWallet = ref.startsWith('WALLET_');

    if (!isWallet) {
        try {
            const v = await pg.verifyPayment(session.token, ref);
            const d = v?.data || {};
            view.paymentStatus = d.paymentStatus === 'SUCCESS' ? 'SUCCESS' : d.paymentStatus === 'FAILED' ? 'FAILED' : 'PENDING';
            view.bookingStatus = d.bookingStatus === 'SUCCESS' ? 'SUCCESS' : d.bookingStatus === 'FAILED' ? 'FAILED' : d.bookingStatus === 'PAYMENT_FAILED' ? 'PAYMENT_FAILED' : 'PENDING';
        } catch (err: any) {
            if (err?.status === 403) throw new HttpError('This booking belongs to another account.', 403);
            if (err?.status !== 404) {
                // Gateway/verify hiccup: fall through to booking-status only
                view.paymentStatus = 'PENDING';
            }
        }
    } else {
        view.paymentStatus = 'SUCCESS';
    }

    try {
        const s = await pg.bookingStatus(session.token, ref);
        if (s?.success && s?.status === 'FAILED') {
            view.bookingStatus = 'FAILED';
            view.message = s.message;
            view.refunded = !!s.refunded;
            view.ticket = toTicket(s.data);
        } else if (s?.success && s?.data) {
            const owner = str(s.data.bookingData?.ownerUserId);
            const ownerEmail = str(s.data.bookingData?.ownerEmail).toLowerCase();
            const mine = !owner || owner === session.user.userId || (ownerEmail && ownerEmail === session.user.email.toLowerCase());
            if (!mine) throw new HttpError('This booking belongs to another account.', 403);
            view.bookingStatus = 'SUCCESS';
            view.paymentStatus = 'SUCCESS';
            view.ticket = toTicket(s.data);
        }
    } catch (err: any) {
        if (err instanceof HttpError) throw err;
        // 404 = not yet processed; keep PENDING
    }

    if (view.bookingStatus === 'UNKNOWN') view.bookingStatus = view.paymentStatus === 'FAILED' ? 'PAYMENT_FAILED' : 'PENDING';
    return ok(view);
});
