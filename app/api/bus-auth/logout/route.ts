import { clearSession } from '@/app/lib/bus/session';
import { assertSameOrigin, handler, ok } from '@/app/lib/bus/security';

export const runtime = 'nodejs';

export const POST = handler(async (req) => {
    assertSameOrigin(req);
    await clearSession();
    return ok({ success: true });
});
