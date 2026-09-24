/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import { pg } from '@/app/lib/bus/server';
import { getSession } from '@/app/lib/bus/session';
import { handler, HttpError, ok, rateLimit } from '@/app/lib/bus/security';
import { toTicket } from '@/app/lib/bus/ticket';

export const runtime = 'nodejs';

/** GET → the signed-in user's bus bookings (newest first). */
export const GET = handler(async (req) => {
    rateLimit(req, 'my-bookings', 30, 60 * 1000);
    const session = await getSession();
    if (!session) throw new HttpError('Please sign in.', 401);
    const res = await pg.userBookings(session.token, session.user.userId);
    const rows: any[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : Array.isArray(res?.bookings) ? res.bookings : [];
    const bookings = rows
        .filter((b) => b && (b.service === 'bus' || b.type === 'bus' || b.busResponse))
        .map((b) => ({
            ref: String(b.txnid || b.bookingId || ''),
            bookingId: String(b.bookingId || ''),
            createdAt: b.timestamp || b.createdAt || null,
            ticket: toTicket(b),
        }))
        .filter((b) => b.ref && b.ticket)
        .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    return ok({ bookings });
});
