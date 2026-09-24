/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import { pg } from '@/app/lib/bus/server';
import { assertSameOrigin, handler, ok, rateLimit, readJson } from '@/app/lib/bus/security';
import { validatePhone } from '@/app/lib/bus/validate';

export const runtime = 'nodejs';

/** POST { phone } → sends a login OTP via the payment server (MSG91). */
export const POST = handler(async (req) => {
    assertSameOrigin(req);
    rateLimit(req, 'otp-send', 5, 10 * 60 * 1000);
    const body = await readJson(req, 2048);
    const phone = validatePhone(body.phone);
    const out = await pg.sendLoginOtp(phone, '91');
    return ok({ success: true, newUser: !!out?.newUser, message: 'OTP sent' });
});
