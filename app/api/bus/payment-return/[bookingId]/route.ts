import { NextResponse } from 'next/server';
import { recallPayment } from '@/app/lib/bus/session';

export const runtime = 'nodejs';

/**
 * Gateway return URL. PhonePe sends the browser here with a GET; PayU POSTs
 * its result form. Nothing in the request is trusted — we only bounce the
 * customer to the status page, which asks the payment server to verify the
 * order with the gateway.
 */
const bounce = async (req: Request, params: Promise<{ bookingId: string }>) => {
    const { bookingId } = await params;
    const safeId = /^[A-Za-z0-9-]{8,64}$/.test(bookingId) ? bookingId : '';
    const remembered = await recallPayment();
    const ref = remembered && remembered.bookingId === safeId ? remembered.txnid : safeId;
    const url = new URL(`/bus/booking/${encodeURIComponent(ref || 'unknown')}`, req.url);
    url.searchParams.set('return', '1');
    return NextResponse.redirect(url, 303);
};

export async function GET(req: Request, ctx: { params: Promise<{ bookingId: string }> }) { return bounce(req, ctx.params); }
export async function POST(req: Request, ctx: { params: Promise<{ bookingId: string }> }) { return bounce(req, ctx.params); }
