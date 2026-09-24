import 'server-only';
import { cookies } from 'next/headers';
import type { SessionUser } from './types';

/**
 * Website session for the Paymm account (payment server JWT).
 *
 * The JWT never reaches browser JavaScript: it lives in an httpOnly, Secure,
 * SameSite=Lax cookie and is only ever attached to upstream requests by the
 * route handlers in app/api/bus/*. A second httpOnly cookie carries the
 * display profile so pages can greet the user without another round trip.
 */

export const SESSION_COOKIE = 'pm_session';
const PROFILE_COOKIE = 'pm_profile';
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days — matches the JWT lifetime

const isProd = process.env.NODE_ENV === 'production';

const cookieBase = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
};

export interface Session {
    token: string;
    user: SessionUser;
}

const b64u = {
    enc: (s: string) => Buffer.from(s, 'utf8').toString('base64url'),
    dec: (s: string) => Buffer.from(s, 'base64url').toString('utf8'),
};

export async function getSession(): Promise<Session | null> {
    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE)?.value;
    if (!token || token.length < 20 || token.length > 4096) return null;
    let user: SessionUser | null = null;
    const raw = jar.get(PROFILE_COOKIE)?.value;
    if (raw) {
        try { user = JSON.parse(b64u.dec(raw)); } catch { user = null; }
    }
    if (!user) {
        // Profile cookie missing — recover what we can from the JWT payload
        // (display only; the payment server re-validates the signature).
        try {
            const payload = JSON.parse(b64u.dec(token.split('.')[1] || ''));
            user = { userId: String(payload.userId || payload.id || ''), email: String(payload.email || ''), name: '' };
        } catch { return null; }
    }
    if (!user.userId && !user.email) return null;
    return { token, user };
}

export async function setSession(token: string, user: SessionUser) {
    const jar = await cookies();
    jar.set(SESSION_COOKIE, token, { ...cookieBase, maxAge: MAX_AGE });
    jar.set(PROFILE_COOKIE, b64u.enc(JSON.stringify({
        userId: String(user.userId || ''),
        email: String(user.email || ''),
        name: String(user.name || '').slice(0, 80),
        phone: user.phone ? String(user.phone).slice(0, 15) : undefined,
    })), { ...cookieBase, maxAge: MAX_AGE });
}

export async function clearSession() {
    const jar = await cookies();
    jar.set(SESSION_COOKIE, '', { ...cookieBase, maxAge: 0 });
    jar.set(PROFILE_COOKIE, '', { ...cookieBase, maxAge: 0 });
}

/** Short-lived pointer from a booking draft to its payment txnid (gateway return). */
const PAY_COOKIE = 'pm_pay';
export async function rememberPayment(bookingId: string, txnid: string) {
    const jar = await cookies();
    jar.set(PAY_COOKIE, b64u.enc(JSON.stringify({ bookingId, txnid, at: Date.now() })), { ...cookieBase, maxAge: 60 * 60 });
}
export async function recallPayment(): Promise<{ bookingId: string; txnid: string } | null> {
    const jar = await cookies();
    const raw = jar.get(PAY_COOKIE)?.value;
    if (!raw) return null;
    try {
        const v = JSON.parse(b64u.dec(raw));
        if (v && typeof v.txnid === 'string' && typeof v.bookingId === 'string') return { bookingId: v.bookingId, txnid: v.txnid };
    } catch { /* ignore */ }
    return null;
}
