'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bus } from 'lucide-react';
import BusShell from '@/app/components/bus/BusShell';
import TicketCard from '@/app/components/bus/TicketCard';
import { useSession } from '@/context/SessionContext';
import { api, ApiError } from '@/app/lib/bus/client';
import type { BookingView } from '@/app/lib/bus/types';

interface Row { ref: string; bookingId: string; createdAt: string | null; ticket: NonNullable<BookingView['ticket']> }

export default function MyBusBookingsPage() {
    const { user, loading: sessionLoading, requireLogin, logout } = useSession();
    const [rows, setRows] = useState<Row[] | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (sessionLoading) return;
        if (!user) { setRows([]); return; }
        api<{ bookings: Row[] }>('/api/bus/my-bookings')
            .then((r) => setRows(r.bookings))
            .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load bookings.'));
    }, [user, sessionLoading]);

    return (
        <BusShell>
            <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                    <p className="eyebrow mb-1">Paymm account</p>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-ink font-display tracking-tight">My bus bookings</h1>
                </div>
                {user && <button onClick={logout} className="btn-ghost text-sm">Sign out</button>}
            </div>

            {!sessionLoading && !user && (
                <div className="card p-10 text-center">
                    <Bus className="mx-auto mb-3 text-brand" size={36} />
                    <h2 className="text-lg font-extrabold text-ink mb-1">Sign in to see your tickets</h2>
                    <p className="text-sm text-ink-2 mb-4">Use the same mobile number as the Paymm app — your app bookings show here too.</p>
                    <button onClick={() => requireLogin()} className="btn-primary">Sign in</button>
                </div>
            )}

            {user && rows === null && !error && <div className="space-y-4">{[1, 2].map((i) => <div key={i} className="card h-44 shimmer" />)}</div>}
            {error && <div className="card p-6 text-err font-semibold">{error}</div>}
            {user && rows && rows.length === 0 && (
                <div className="card p-10 text-center">
                    <h2 className="text-lg font-extrabold text-ink mb-1">No bus bookings yet</h2>
                    <p className="text-sm text-ink-2 mb-4">Your confirmed bus tickets will appear here.</p>
                    <Link href="/bus" className="btn-primary">Book a bus</Link>
                </div>
            )}
            {user && rows && rows.length > 0 && (
                <div className="space-y-4">
                    {rows.map((r) => (
                        <Link key={r.ref} href={`/bus/booking/${encodeURIComponent(r.ref)}`} className="block hover:-translate-y-0.5 transition-transform">
                            <TicketCard t={r.ticket} compact />
                        </Link>
                    ))}
                </div>
            )}
        </BusShell>
    );
}
