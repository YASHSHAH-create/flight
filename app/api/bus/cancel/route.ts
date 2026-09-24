/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import { pg } from '@/app/lib/bus/server';
import { getSession } from '@/app/lib/bus/session';
import { assertSameOrigin, handler, HttpError, ok, rateLimit, readJson } from '@/app/lib/bus/security';

export const runtime = 'nodejs';
export const maxDuration = 60;

/** POST { bookingId } → cancels the ticket (ownership enforced by the payment server). */
export const POST = handler(async (req) => {
    assertSameOrigin(req);
    rateLimit(req, 'cancel', 5, 10 * 60 * 1000);
    const session = await getSession();
    if (!session) throw new HttpError('Please sign in.', 401);
    const body = await readJson(req, 2048);
    const bookingId = String(body.bookingId || '').trim();
    if (!/^[A-Za-z0-9_-]{6,80}$/.test(bookingId)) throw new HttpError('Invalid booking reference', 400);
    const res = await pg.cancelBus(session.token, bookingId);
    return ok(res);
});
