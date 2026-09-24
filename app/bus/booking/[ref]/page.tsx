'use client';
/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2, Printer, XCircle } from 'lucide-react';
import BusShell from '@/app/components/bus/BusShell';
import Steps from '@/app/components/bus/Steps';
import TicketCard from '@/app/components/bus/TicketCard';
import { useSession } from '@/context/SessionContext';
import { api, ApiError, draftStore } from '@/app/lib/bus/client';
import type { BookingView } from '@/app/lib/bus/types';

const MAX_POLLS = 40;

function BookingInner() {
    const { ref } = useParams<{ ref: string }>();
    const sp = useSearchParams();
    const { user, loading: sessionLoading, requireLogin } = useSession();
    const [view, setView] = useState<BookingView | null>(null);
    const [error, setError] = useState('');
    const [polls, setPolls] = useState(0);
    const [cancelling, setCancelling] = useState(false);
    const [cancelMsg, setCancelMsg] = useState('');
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const load = useCallback(async () => {
        try {
            const v = await api<BookingView>(`/api/bus/booking/${encodeURIComponent(ref)}`);
            setView(v); setError('');
            return v;
        } catch (e) {
            if (e instanceof ApiError && e.status === 401) {
                const ok = await requireLogin();
                if (ok) return null;
            }
            setError(e instanceof ApiError ? e.message : 'Could not load this booking.');
            return null;
        }
    }, [ref, requireLogin]);

    useEffect(() => { if (sp.get('return') === '1') draftStore.clear(); }, [sp]);

    useEffect(() => {
        if (sessionLoading) return;
        let stop = false;
        const tick = async () => {
            const v = await load();
            if (stop) return;
            const pending = !v || v.bookingStatus === 'PENDING';
            if (pending && polls < MAX_POLLS) {
                setPolls((p) => p + 1);
                timer.current = setTimeout(tick, 3000);
            }
        };
        tick();
        return () => { stop = true; if (timer.current) clearTimeout(timer.current); };
    }, [sessionLoading, user, load]); // eslint-disable-line react-hooks/exhaustive-deps

    const cancel = async () => {
        if (!view?.ticket) return;
        if (!window.confirm('Cancel this ticket? The operator’s cancellation charge will be deducted from the refund.')) return;
        setCancelling(true); setCancelMsg('');
        try {
            const res = await api<any>('/api/bus/cancel', { body: { bookingId: ref } });
            setCancelMsg(res?.alreadyCancelled ? 'This ticket was already cancelled.' : `Ticket cancelled. Refund of ₹${Math.round(res?.cancellation?.refundAmount || 0)} will be processed to your original payment method within 5–7 working days.`);
            await load();
        } catch (e) {
            setCancelMsg(e instanceof ApiError ? e.message : 'Cancellation failed. Please contact support.');
        } finally { setCancelling(false); }
    };

    const status = view?.bookingStatus;
    const pending = !view || status === 'PENDING';
    const timedOut = pending && polls >= MAX_POLLS;

    return (
        <BusShell>
            <div className="flex items-center justify-between gap-4 mb-4 print:hidden">
                <Steps current={4} />
                <Link href="/bus/my-bookings" className="text-xs font-bold text-brand hover:underline">My bus bookings</Link>
            </div>

            {error && !view && (
                <div className="card p-8 text-center">
                    <p className="font-bold text-err mb-3">{error}</p>
                    {!user && <button onClick={() => { requireLogin().then((ok) => { if (ok) load(); }); }} className="btn-primary">Sign in</button>}
                </div>
            )}

            {pending && !error && !timedOut && (
                <div className="card p-10 text-center">
                    <Loader2 className="mx-auto mb-4 text-brand animate-spin" size={40} />
                    <h1 className="text-xl font-extrabold text-ink font-display">{view?.paymentStatus === 'SUCCESS' ? 'Payment received — confirming your seats' : 'Confirming your payment'}</h1>
                    <p className="text-sm text-ink-2 mt-2 max-w-md mx-auto">This usually takes a few seconds. Please don’t close this page. If you already left the payment page without paying, nothing has been charged.</p>
                </div>
            )}

            {timedOut && (
                <div className="card p-10 text-center">
                    <h1 className="text-xl font-extrabold text-ink font-display">Still confirming…</h1>
                    <p className="text-sm text-ink-2 mt-2 max-w-md mx-auto">The operator is taking longer than usual. Your ticket will appear under My bookings and be sent on WhatsApp/SMS the moment it is confirmed. If money was deducted and no ticket is issued, it is refunded automatically.</p>
                    <div className="flex justify-center gap-2 mt-4">
                        <button onClick={() => { setPolls(0); load(); }} className="btn-primary">Check again</button>
                        <Link href="/bus/my-bookings" className="btn-outline">My bookings</Link>
                    </div>
                </div>
            )}

            {status === 'SUCCESS' && view?.ticket && (
                <div className="space-y-4">
                    <div className="flex items-start gap-3 rounded-2xl bg-ok-soft border border-ok/20 p-4 print:hidden">
                        <CheckCircle2 className="text-ok shrink-0" size={24} />
                        <div>
                            <h1 className="font-extrabold text-ink text-lg font-display">{view.ticket.cancelled ? 'This ticket is cancelled' : 'Booking confirmed!'}</h1>
                            <p className="text-sm text-ink-2">{view.ticket.cancelled ? 'The refund is being processed to your original payment method.' : 'Your m-ticket is on its way by WhatsApp/SMS and email. Carry a photo ID on the journey.'}</p>
                        </div>
                    </div>
                    <TicketCard t={view.ticket} />
                    {cancelMsg && <p className="text-sm font-semibold text-ink bg-brand-soft rounded-xl p-3">{cancelMsg}</p>}
                    <div className="flex flex-wrap gap-2 print:hidden">
                        <button onClick={() => window.print()} className="btn-outline"><Printer size={16} /> Print / save PDF</button>
                        <Link href="/bus" className="btn-outline">Book another bus</Link>
                        {!view.ticket.cancelled && <button onClick={cancel} disabled={cancelling} className="btn-ghost text-err hover:bg-err-soft ml-auto">{cancelling ? 'Cancelling…' : 'Cancel ticket'}</button>}
                    </div>
                    <p className="text-xs text-ink-3 print:hidden">Need help? WhatsApp or call support Mon–Sat 9 AM – 6 PM IST, or email support@paymm.in with your PNR.</p>
                </div>
            )}

            {(status === 'FAILED' || status === 'PAYMENT_FAILED') && (
                <div className="card p-8 text-center">
                    <XCircle className="mx-auto mb-3 text-err" size={40} />
                    <h1 className="text-xl font-extrabold text-ink font-display">{status === 'PAYMENT_FAILED' ? 'Payment not completed' : 'Booking could not be completed'}</h1>
                    <p className="text-sm text-ink-2 mt-2 max-w-md mx-auto">
                        {status === 'PAYMENT_FAILED'
                            ? 'The payment was cancelled or declined, so no seats were booked and nothing was charged.'
                            : view?.message || 'The operator could not confirm the seats after payment. Your money is refunded automatically to the original payment method within 5–7 working days (wallet payments are refunded instantly).'}
                    </p>
                    <div className="flex justify-center gap-2 mt-5">
                        <Link href="/bus" className="btn-primary">Search again</Link>
                        <Link href="/contact" className="btn-outline">Contact support</Link>
                    </div>
                </div>
            )}
        </BusShell>
    );
}

export default function BusBookingPage() {
    return <Suspense fallback={null}><BookingInner /></Suspense>;
}
