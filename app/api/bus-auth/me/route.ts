/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import { pg } from '@/app/lib/bus/server';
import { clearSession, getSession } from '@/app/lib/bus/session';
import { handler, ok } from '@/app/lib/bus/security';

export const runtime = 'nodejs';

/**
 * GET → { user, walletBalance } for the current session, or { user: null }.
 * The token is re-validated against the payment server on every call (a
 * revoked / expired JWT clears the cookie).
 */
export const GET = handler(async () => {
    const session = await getSession();
    if (!session) return ok({ user: null });
    try {
        const bal = await pg.walletBalance(session.token);
        const walletBalance = Number(bal?.balance ?? bal?.data?.balance);
        return ok({ user: session.user, walletBalance: Number.isFinite(walletBalance) ? walletBalance : null });
    } catch (err: any) {
        if (err?.status === 401 || err?.status === 403) {
            await clearSession();
            return ok({ user: null });
        }
        // Wallet service hiccup — still signed in
        return ok({ user: session.user, walletBalance: null });
    }
});
