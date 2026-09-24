/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import 'server-only';
import { NextResponse } from 'next/server';
import { UpstreamError } from './server';
import { ValidationError } from './validate';

/**
 * Request-level protections for the /api/bus and /api/bus-auth handlers.
 *
 * - CSRF: state-changing requests must come from our own origin. The session
 *   cookie is SameSite=Lax, and on top of that we require the browser's
 *   Origin / Sec-Fetch-Site headers to match — a cross-site form post or a
 *   fetch from another domain is rejected before it touches anything.
 * - Rate limiting: a small in-memory token bucket per client IP + route.
 *   Serverless instances each keep their own bucket, so this is a first line
 *   only; the payment server enforces its own limits underneath.
 * - Body size: JSON bodies are capped so nobody can post megabytes at us.
 */

export class HttpError extends Error {
    status: number;
    constructor(message: string, status: number) { super(message); this.status = status; }
}

const hostOf = (v: string | null) => {
    if (!v) return '';
    try { return new URL(v).host.toLowerCase(); } catch { return ''; }
};

export function assertSameOrigin(req: Request) {
    const reqHost = (req.headers.get('x-forwarded-host') || req.headers.get('host') || '').toLowerCase();
    const site = req.headers.get('sec-fetch-site');
    if (site && site !== 'same-origin' && site !== 'none') throw new HttpError('Cross-site request blocked', 403);
    const origin = hostOf(req.headers.get('origin'));
    const referer = hostOf(req.headers.get('referer'));
    if (origin) { if (origin !== reqHost) throw new HttpError('Cross-site request blocked', 403); return; }
    if (referer) { if (referer !== reqHost) throw new HttpError('Cross-site request blocked', 403); return; }
    // No Origin and no Referer on a state-changing request: modern browsers always send
    // at least one for fetch/XHR; a bare client is not a browser session we trust.
    throw new HttpError('Missing origin', 403);
}

export function clientIp(req: Request): string {
    const xff = req.headers.get('x-forwarded-for');
    if (xff) return xff.split(',')[0].trim();
    return req.headers.get('x-real-ip') || 'unknown';
}

const buckets = new Map<string, { n: number; reset: number }>();
let lastSweep = 0;

export function rateLimit(req: Request, bucket: string, max: number, windowMs: number) {
    const now = Date.now();
    if (now - lastSweep > 60_000) {
        lastSweep = now;
        for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
    }
    const key = `${bucket}:${clientIp(req)}`;
    const cur = buckets.get(key);
    if (!cur || cur.reset < now) { buckets.set(key, { n: 1, reset: now + windowMs }); return; }
    cur.n += 1;
    if (cur.n > max) throw new HttpError('Too many requests. Please slow down and try again in a minute.', 429);
}

export async function readJson<T = any>(req: Request, maxBytes = 64 * 1024): Promise<T> {
    const len = Number(req.headers.get('content-length') || 0);
    if (len > maxBytes) throw new HttpError('Request too large', 413);
    const text = await req.text();
    if (text.length > maxBytes) throw new HttpError('Request too large', 413);
    if (!text) return {} as T;
    try { return JSON.parse(text) as T; } catch { throw new HttpError('Invalid JSON', 400); }
}

export function ok(data: unknown, init?: ResponseInit) {
    return NextResponse.json(data, { ...init, headers: { 'Cache-Control': 'no-store', ...(init?.headers || {}) } });
}

export function fail(err: unknown) {
    if (err instanceof ValidationError) return NextResponse.json({ success: false, message: err.message, field: err.field }, { status: 400 });
    if (err instanceof HttpError) return NextResponse.json({ success: false, message: err.message }, { status: err.status });
    if (err instanceof UpstreamError) {
        const status = err.status === 401 ? 401 : err.status === 403 ? 403 : err.status === 404 ? 404 : err.status === 409 ? 409 : err.status === 429 ? 429 : err.status >= 500 ? 502 : 400;
        return NextResponse.json({ success: false, message: err.message }, { status });
    }
    console.error('[bus api] unexpected', err);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again.' }, { status: 500 });
}

/** Wrap a route handler with uniform error handling. */
export const handler = (fn: (req: Request, ctx: any) => Promise<Response>) =>
    async (req: Request, ctx: any) => {
        try { return await fn(req, ctx); } catch (err) { return fail(err); }
    };
