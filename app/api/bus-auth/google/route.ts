/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import { flightServer, pg } from '@/app/lib/bus/server';
import { setSession } from '@/app/lib/bus/session';
import { assertSameOrigin, handler, HttpError, ok, rateLimit } from '@/app/lib/bus/security';

export const runtime = 'nodejs';

/**
 * POST → exchanges the site's Google sign-in (Passport session on the flight
 * server, cookie forwarded server-side) for a Paymm account session.
 *
 * The identity is taken from the flight server's own session, never from the
 * request body, so a caller cannot sign in as an arbitrary email.
 */
export const POST = handler(async (req) => {
    assertSameOrigin(req);
    rateLimit(req, 'google-exchange', 20, 10 * 60 * 1000);
    const cookie = req.headers.get('cookie') || '';
    const gu = await flightServer.currentUser(cookie);
    if (!gu) throw new HttpError('Google sign-in not found. Please sign in with Google first.', 401);

    const googleId = String(gu.googleId || gu.id || gu._id || '');
    const email = String(gu.email || '').toLowerCase();
    if (!googleId || !email) throw new HttpError('Google account is missing an email address.', 400);

    const name = String(gu.name || '').trim();
    const [firstname, ...rest] = name.split(' ');
    const out = await pg.googleLogin({ googleId, email, name, firstname: firstname || '', lastname: rest.join(' ') });
    if (!out?.success || !out?.token) throw new HttpError(out?.message || 'Could not sign in', 401);

    const u = out.user || {};
    const display = [u.firstname, u.lastname].filter(Boolean).join(' ').trim() || name;
    const user = { userId: String(u.userId), email: String(u.email || email), name: display, phone: u.phone ? String(u.phone) : undefined };
    await setSession(String(out.token), user);
    return ok({ success: true, user });
});
