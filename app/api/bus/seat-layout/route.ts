/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import { getBoardingPoints, getSeatLayout } from '@/app/lib/bus/server';
import { assertSameOrigin, handler, ok, rateLimit, readJson } from '@/app/lib/bus/security';
import { validateIndex, validateTraceId } from '@/app/lib/bus/validate';

export const runtime = 'nodejs';
export const maxDuration = 60;

/** POST { traceId, resultIndex, srdvIndex } → seat map + boarding/dropping points in one go. */
export const POST = handler(async (req) => {
    assertSameOrigin(req);
    rateLimit(req, 'seats', 60, 60 * 1000);
    const body = await readJson(req, 2048);
    const traceId = validateTraceId(body.traceId);
    const resultIndex = validateIndex(body.resultIndex, 'resultIndex');
    const srdvIndex = validateIndex(body.srdvIndex || body.resultIndex, 'srdvIndex');
    const [layout, points] = await Promise.all([
        getSeatLayout(traceId, resultIndex, srdvIndex),
        getBoardingPoints(traceId, resultIndex, srdvIndex).catch(() => ({ boarding: [], dropping: [] })),
    ]);
    return ok({ layout, points });
});
