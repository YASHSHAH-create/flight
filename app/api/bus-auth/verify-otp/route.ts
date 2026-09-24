/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import { pg } from '@/app/lib/bus/server';
import { setSession } from '@/app/lib/bus/session';
import { assertSameOrigin, handler, ok, rateLimit, readJson } from '@/app/lib/bus/security';
import { validateOtp, validatePhone } from '@/app/lib/bus/validate';

export const runtime = 'nodejs';

/** POST { phone, otp } → verifies with the payment server and starts the session. */
export const POST = handler(async (req) => {
    assertSameOrigin(req);
    rateLimit(req, 'otp-verify', 10, 10 * 60 * 1000);
    const body = await readJson(req, 2048);
    const phone = validatePhone(body.phone);
    const otp = validateOtp(body.otp);
    const out = await pg.verifyLoginOtp(phone, otp, '91');
    if (!out?.success || !out?.token || !out?.user) {
        return ok({ success: false, message: out?.message || 'Invalid OTP' }, { status: 400 });
    }
    const u = out.user;
    const name = [u.firstname, u.lastname].filter(Boolean).join(' ').trim() || u.name || '';
    const user = { userId: String(u.userId), email: String(u.email || ''), name: name === 'User' ? '' : name, phone: u.phone ? String(u.phone) : phone };
    await setSession(String(out.token), user);
    return ok({ success: true, user, isNewUser: !!out.isNewUser });
});
