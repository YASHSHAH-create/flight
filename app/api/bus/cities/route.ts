/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import { NextResponse } from 'next/server';
import { searchCities } from '@/app/lib/bus/server';
import { POPULAR_BUS_CITIES } from '@/app/lib/bus/cities';
import { handler, rateLimit } from '@/app/lib/bus/security';

export const runtime = 'nodejs';

/** GET ?q=del → city suggestions (public, cached). */
export const GET = handler(async (req) => {
    rateLimit(req, 'cities', 120, 60 * 1000);
    const url = new URL(req.url);
    const q = (url.searchParams.get('q') || '').trim().slice(0, 40);
    if (!/^[A-Za-z0-9 .()'-]*$/.test(q)) return NextResponse.json({ cities: [] });
    if (q.length < 2) return NextResponse.json({ cities: POPULAR_BUS_CITIES }, { headers: { 'Cache-Control': 'public, max-age=3600' } });
    const cities = await searchCities(q, 12);
    return NextResponse.json({ cities }, { headers: { 'Cache-Control': 'public, max-age=600, s-maxage=3600' } });
});
