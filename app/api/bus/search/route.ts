/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import { searchBuses } from '@/app/lib/bus/server';
import { assertSameOrigin, handler, ok, rateLimit, readJson } from '@/app/lib/bus/security';
import { validateCity, validateDate, ValidationError } from '@/app/lib/bus/validate';

export const runtime = 'nodejs';
export const maxDuration = 60;

/** POST { from:{code,name}, to:{code,name}, date } → normalised bus list. */
export const POST = handler(async (req) => {
    assertSameOrigin(req);
    rateLimit(req, 'search', 30, 60 * 1000);
    const body = await readJson(req, 4096);
    const from = validateCity(body.from, 'from');
    const to = validateCity(body.to, 'to');
    if (from.code === to.code) throw new ValidationError('Source and destination cannot be the same.', 'to');
    const date = validateDate(body.date);
    const result = await searchBuses(from, to, date);
    return ok(result);
});
