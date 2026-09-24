'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Check, Clock, MapPin } from 'lucide-react';
import BusShell from '@/app/components/bus/BusShell';
import Steps from '@/app/components/bus/Steps';
import SeatMap from '@/app/components/bus/SeatMap';
import { api, ApiError, draftStore, fmtDate, fmtDuration, fmtINR, fmtTime } from '@/app/lib/bus/client';
import type { BusDraft, BusPoint, BusPoints, Seat, SeatLayout } from '@/app/lib/bus/types';

const PointList = ({ title, points, value, onChange }: { title: string; points: BusPoint[]; value?: BusPoint; onChange: (p: BusPoint) => void }) => {
    const [q, setQ] = useState('');
    const list = useMemo(() => points.filter((p) => !q || `${p.name} ${p.address || ''} ${p.location || ''}`.toLowerCase().includes(q.toLowerCase())), [points, q]);
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold text-ink">{title}</h3>
                {points.length > 6 && <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="text-xs border border-hair rounded-full px-3 py-1.5 outline-none focus:border-brand w-28" />}
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar rounded-xl border border-hair divide-y divide-hair bg-white">
                {list.length === 0 && <p className="p-4 text-sm text-ink-3">No points listed.</p>}
                {list.map((p) => {
                    const on = value?.id === p.id;
                    return (
                        <button key={p.id} type="button" onClick={() => onChange(p)} className={`w-full text-left px-3 py-2.5 flex items-start gap-3 transition-colors ${on ? 'bg-brand-soft' : 'hover:bg-lav'}`}>
                            <span className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${on ? 'bg-brand border-brand text-white' : 'border-ink-3/40'}`}>{on && <Check size={12} strokeWidth={3} />}</span>
                            <span className="min-w-0 flex-1">
                                <span className="flex items-center gap-2"><span className="text-sm font-bold text-ink truncate">{p.name}</span><span className="ml-auto text-xs font-bold text-brand whitespace-nowrap">{p.time}</span></span>
                                {(p.address || p.landmark) && <span className="block text-[11px] text-ink-2 truncate">{p.address || p.landmark}</span>}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

function SelectInner() {
    const router = useRouter();
    const [draft, setDraft] = useState<BusDraft | null | undefined>(undefined);
    const [layout, setLayout] = useState<SeatLayout | null>(null);
    const [points, setPoints] = useState<BusPoints>({ boarding: [], dropping: [] });
    const [selected, setSelected] = useState<Seat[]>([]);
    const [boarding, setBoarding] = useState<BusPoint | undefined>();
    const [dropping, setDropping] = useState<BusPoint | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [warn, setWarn] = useState('');

    useEffect(() => {
        const d = draftStore.load();
        setDraft(d || null);
        if (!d) return;
        setSelected(d.seats || []); setBoarding(d.boarding); setDropping(d.dropping);
        api<{ layout: SeatLayout; points: BusPoints }>('/api/bus/seat-layout', { body: { traceId: d.traceId, resultIndex: d.bus.resultIndex, srdvIndex: d.bus.srdvIndex } })
            .then((r) => {
                setLayout(r.layout); setPoints(r.points);
                if (r.points.boarding.length === 1) setBoarding(r.points.boarding[0]);
                if (r.points.dropping.length === 1) setDropping(r.points.dropping[0]);
            })
            .catch((e) => setError(e instanceof ApiError ? e.message : 'Could not load the seat map. Please go back and try again.'))
            .finally(() => setLoading(false));
    }, []);

    const total = selected.reduce((s, x) => s + x.fare, 0);
    const maxSeats = draft?.bus.maxSeats || 6;

    const toggle = (seat: Seat) => {
        setWarn('');
        setSelected((cur) => {
            const on = cur.some((x) => x.name === seat.name && x.upper === seat.upper);
            if (on) return cur.filter((x) => !(x.name === seat.name && x.upper === seat.upper));
            if (cur.length >= maxSeats) { setWarn(`You can book up to ${maxSeats} seats on this bus.`); return cur; }
            return [...cur, seat];
        });
    };

    const proceed = () => {
        if (!draft) return;
        if (!selected.length) { setWarn('Pick at least one seat.'); return; }
        if (!boarding) { setWarn('Choose a boarding point.'); return; }
        if (points.dropping.length && !dropping) { setWarn('Choose a dropping point.'); return; }
        draftStore.update({ seats: selected, boarding, dropping, paxIdRequired: !!(layout?.paxIdRequired || draft.bus.idProofRequired) });
        router.push('/bus/passengers');
    };

    if (draft === null) {
        return (
            <BusShell>
                <div className="card p-10 text-center">
                    <h1 className="text-xl font-extrabold text-ink mb-2">Your search has expired</h1>
                    <p className="text-sm text-ink-2 mb-4">Seat maps are live, so please search again to see current availability.</p>
                    <Link href="/bus" className="btn-primary">Search buses</Link>
                </div>
            </BusShell>
        );
    }

    return (
        <BusShell wide>
            <div className="flex items-center justify-between gap-4 mb-4">
                <Steps current={2} />
                <button onClick={() => router.back()} className="text-xs font-bold text-brand hover:underline">Back to buses</button>
            </div>

            {draft && (
                <div className="panel p-4 md:p-5 mb-4 flex flex-col md:flex-row md:items-center gap-3">
                    <div className="min-w-0">
                        <h1 className="text-lg md:text-xl font-extrabold text-ink font-display truncate">{draft.bus.operator}</h1>
                        <p className="text-xs md:text-sm text-ink-2 truncate">{draft.bus.busType}</p>
                    </div>
                    <div className="md:ml-auto flex items-center gap-4 text-sm">
                        <span className="font-bold text-ink">{draft.from.name} → {draft.to.name}</span>
                        <span className="pill-soft bg-brand-soft text-brand">{fmtDate(draft.date)}</span>
                        <span className="text-ink-2 hidden sm:inline"><Clock size={14} className="inline mr-1" />{fmtTime(draft.bus.departure)} – {fmtTime(draft.bus.arrival)} · {fmtDuration(draft.bus.duration)}</span>
                    </div>
                </div>
            )}

            {error && <div className="card p-5 text-err font-semibold mb-4">{error} <Link href="/bus" className="underline ml-2">Search again</Link></div>}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <section className="lg:col-span-7 card p-4 md:p-6">
                    <h2 className="font-extrabold text-ink mb-1">Pick your seats</h2>
                    <p className="text-xs text-ink-2 mb-4">Tap a seat to select it. Prices shown are per seat, all taxes included.</p>
                    {loading ? (
                        <div className="h-[420px] rounded-2xl shimmer" />
                    ) : layout ? (
                        <SeatMap lower={layout.lower} upper={layout.upper} selected={selected} maxSelectable={maxSeats} onToggle={toggle} />
                    ) : null}
                </section>

                <aside className="lg:col-span-5 space-y-4">
                    <div className="card p-4 md:p-5 space-y-5">
                        {loading ? <div className="h-40 rounded-xl shimmer" /> : (
                            <>
                                <PointList title="Boarding point" points={points.boarding} value={boarding} onChange={setBoarding} />
                                {points.dropping.length > 0 && <PointList title="Dropping point" points={points.dropping} value={dropping} onChange={setDropping} />}
                            </>
                        )}
                    </div>

                    <div className="card p-4 md:p-5 sticky bottom-4 lg:static shadow-[0_-8px_30px_rgba(79,43,208,0.08)] lg:shadow-none">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-ink-2">{selected.length ? `Seat${selected.length > 1 ? 's' : ''} ${selected.map((s) => s.name).join(', ')}` : 'No seats selected'}</span>
                            <span className="text-2xl font-black text-ink">{fmtINR(total)}</span>
                        </div>
                        {boarding && <p className="text-xs text-ink-2 flex items-center gap-1 truncate"><MapPin size={12} /> {boarding.name} · {boarding.time}</p>}
                        {warn && <p className="text-xs font-bold text-err mt-2">{warn}</p>}
                        <button onClick={proceed} disabled={loading || !layout} className="btn-primary w-full mt-3 py-3.5">Continue <ArrowRight size={16} /></button>
                        <p className="text-[11px] text-ink-3 mt-2 text-center">No convenience fee · Secure payment</p>
                    </div>
                </aside>
            </div>
        </BusShell>
    );
}

export default function BusSelectPage() {
    return <Suspense fallback={null}><SelectInner /></Suspense>;
}
