'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftRight, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import BusShell from '@/app/components/bus/BusShell';
import BusCard from '@/app/components/bus/BusCard';
import Steps from '@/app/components/bus/Steps';
import BusSearchWidget, { busSearchHref } from '@/app/components/bus/BusSearchWidget';
import { addDays, api, ApiError, draftStore, fmtDate, todayYmd } from '@/app/lib/bus/client';
import type { BusCity, BusSearchResult, BusSummary } from '@/app/lib/bus/types';

type SortKey = 'departure' | 'price' | 'duration' | 'seats';
const SLOTS = [
    { id: 'night', label: 'Before 6 am', test: (h: number) => h < 6 },
    { id: 'morning', label: '6 am – 12 pm', test: (h: number) => h >= 6 && h < 12 },
    { id: 'afternoon', label: '12 pm – 6 pm', test: (h: number) => h >= 12 && h < 18 },
    { id: 'evening', label: 'After 6 pm', test: (h: number) => h >= 18 },
];

const hourOf = (iso: string) => { const m = /T(\d{2})/.exec(iso); return m ? Number(m[1]) : 0; };

function SearchInner() {
    const sp = useSearchParams();
    const router = useRouter();

    const from: BusCity | null = useMemo(() => {
        const code = Number(sp.get('from')); const name = sp.get('fromName') || '';
        return code && name ? { code, name, state: sp.get('fromState') || undefined } : null;
    }, [sp]);
    const to: BusCity | null = useMemo(() => {
        const code = Number(sp.get('to')); const name = sp.get('toName') || '';
        return code && name ? { code, name, state: sp.get('toState') || undefined } : null;
    }, [sp]);
    const date = sp.get('date') || todayYmd();

    const [result, setResult] = useState<BusSearchResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modify, setModify] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [sort, setSort] = useState<SortKey>('departure');
    const [slots, setSlots] = useState<string[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [ops, setOps] = useState<string[]>([]);

    useEffect(() => {
        if (!from || !to) { setLoading(false); setError('Pick your cities to search buses.'); return; }
        const ctrl = new AbortController();
        setLoading(true); setError(''); setResult(null);
        api<BusSearchResult>('/api/bus/search', { body: { from, to, date }, signal: ctrl.signal })
            .then(setResult)
            .catch((e) => { if (e?.name !== 'AbortError') setError(e instanceof ApiError ? e.message : 'Could not load buses. Please try again.'); })
            .finally(() => setLoading(false));
        return () => ctrl.abort();
    }, [from, to, date]);

    const operators = useMemo(() => Array.from(new Set((result?.buses || []).map((b) => b.operator))).sort(), [result]);

    const buses = useMemo(() => {
        let list = [...(result?.buses || [])];
        if (slots.length) list = list.filter((b) => slots.some((id) => SLOTS.find((s) => s.id === id)!.test(hourOf(b.departure))));
        if (types.length) list = list.filter((b) =>
            (types.includes('ac') ? b.ac : true) && (types.includes('nonac') ? !b.ac : true) && (types.includes('sleeper') ? b.sleeper : true) && (types.includes('seater') ? b.seater : true));
        if (ops.length) list = list.filter((b) => ops.includes(b.operator));
        const cmp: Record<SortKey, (a: BusSummary, b: BusSummary) => number> = {
            departure: (a, b) => a.departure.localeCompare(b.departure),
            price: (a, b) => a.fare - b.fare,
            duration: (a, b) => a.duration - b.duration,
            seats: (a, b) => b.seatsLeft - a.seatsLeft,
        };
        return list.sort(cmp[sort]);
    }, [result, slots, types, ops, sort]);

    const cheapest = useMemo(() => buses.length ? buses.reduce((m, b) => (b.fare < m.fare ? b : m)) : null, [buses]);
    const fastest = useMemo(() => buses.length ? buses.reduce((m, b) => (b.duration > 0 && b.duration < m.duration ? b : m)) : null, [buses]);

    const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, v: string) =>
        setter((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

    const select = (bus: BusSummary) => {
        if (!from || !to || !result) return;
        draftStore.save({ traceId: result.traceId, date, from, to, bus, seats: [], paxIdRequired: bus.idProofRequired, createdAt: Date.now() });
        router.push(`/bus/select?ri=${encodeURIComponent(bus.resultIndex)}`);
    };

    const dayLink = (n: number) => (from && to ? busSearchHref(from, to, addDays(date, n)) : '/bus');
    const activeFilters = slots.length + types.length + ops.length;

    const Filters = (
        <div className="space-y-6">
            <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-2">Departure time</h4>
                <div className="grid grid-cols-2 gap-2">
                    {SLOTS.map((s) => (
                        <button key={s.id} onClick={() => toggle(setSlots, s.id)} className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${slots.includes(s.id) ? 'bg-brand-soft border-brand text-brand' : 'bg-white border-hair text-ink-2 hover:border-brand/40'}`}>{s.label}</button>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-2">Bus type</h4>
                <div className="grid grid-cols-2 gap-2">
                    {[{ id: 'ac', l: 'AC' }, { id: 'nonac', l: 'Non-AC' }, { id: 'sleeper', l: 'Sleeper' }, { id: 'seater', l: 'Seater' }].map((t) => (
                        <button key={t.id} onClick={() => toggle(setTypes, t.id)} className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${types.includes(t.id) ? 'bg-brand-soft border-brand text-brand' : 'bg-white border-hair text-ink-2 hover:border-brand/40'}`}>{t.l}</button>
                    ))}
                </div>
            </div>
            {operators.length > 1 && (
                <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-2">Operators</h4>
                    <div className="max-h-56 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                        {operators.map((o) => (
                            <label key={o} className="flex items-center gap-2 text-sm text-ink cursor-pointer py-1">
                                <input type="checkbox" checked={ops.includes(o)} onChange={() => toggle(setOps, o)} className="accent-brand w-4 h-4" />
                                <span className="truncate">{o}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
            {activeFilters > 0 && <button onClick={() => { setSlots([]); setTypes([]); setOps([]); }} className="btn-ghost text-sm w-full">Clear filters</button>}
        </div>
    );

    return (
        <BusShell wide>
            <div className="flex items-center justify-between gap-4 mb-4">
                <Steps current={1} />
                <Link href="/bus" className="text-xs font-bold text-brand hover:underline">New search</Link>
            </div>

            {/* Route header */}
            <div className="panel p-4 md:p-5 mb-4">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                    <div className="flex items-center gap-3 min-w-0">
                        <h1 className="text-xl md:text-2xl font-extrabold text-ink tracking-tight font-display truncate">
                            {from?.name || '—'} <ArrowLeftRight size={16} className="inline mx-1 text-ink-3" /> {to?.name || '—'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-1 md:ml-auto">
                        {date > todayYmd() && <Link href={dayLink(-1)} className="w-9 h-9 rounded-full border border-hair flex items-center justify-center hover:bg-brand-soft" aria-label="Previous day"><ChevronLeft size={16} /></Link>}
                        <span className="px-3 py-1.5 rounded-full bg-brand-soft text-brand text-sm font-bold">{fmtDate(date, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        <Link href={dayLink(1)} className="w-9 h-9 rounded-full border border-hair flex items-center justify-center hover:bg-brand-soft" aria-label="Next day"><ChevronRight size={16} /></Link>
                        <button onClick={() => setModify((m) => !m)} className="btn-outline text-sm ml-2 py-2">{modify ? 'Close' : 'Modify'}</button>
                    </div>
                </div>
                {modify && from && to && (
                    <div className="mt-4 pt-4 border-t border-hair">
                        <BusSearchWidget compact initialFrom={from} initialTo={to} initialDate={date} />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <aside className="hidden lg:block lg:col-span-3">
                    <div className="card p-4 sticky top-28">
                        <h3 className="font-extrabold text-ink mb-4 flex items-center gap-2"><SlidersHorizontal size={16} /> Filters</h3>
                        {Filters}
                    </div>
                </aside>

                <section className="lg:col-span-9">
                    <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar">
                        <button onClick={() => setFiltersOpen(true)} className="lg:hidden btn-outline text-xs py-2 whitespace-nowrap"><SlidersHorizontal size={14} /> Filters{activeFilters ? ` (${activeFilters})` : ''}</button>
                        <span className="text-xs font-bold text-ink-3 whitespace-nowrap ml-1">Sort:</span>
                        {([['departure', 'Departure'], ['price', 'Price'], ['duration', 'Duration'], ['seats', 'Seats left']] as [SortKey, string][]).map(([k, l]) => (
                            <button key={k} onClick={() => setSort(k)} className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${sort === k ? 'bg-brand text-white border-brand' : 'bg-white border-hair text-ink-2 hover:border-brand/40'}`}>{l}</button>
                        ))}
                        {result && <span className="ml-auto text-xs text-ink-3 whitespace-nowrap">{buses.length} of {result.count} buses</span>}
                    </div>

                    {loading && (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => <div key={i} className="card h-32 shimmer" />)}
                            <p className="text-center text-sm text-ink-2 pt-2">Checking live seats with operators…</p>
                        </div>
                    )}
                    {!loading && error && (
                        <div className="card p-8 text-center">
                            <p className="font-bold text-err mb-2">{error}</p>
                            <Link href="/bus" className="btn-primary">Search again</Link>
                        </div>
                    )}
                    {!loading && !error && buses.length === 0 && (
                        <div className="card p-10 text-center">
                            <h3 className="text-lg font-extrabold text-ink mb-1">{result?.count ? 'No buses match these filters' : 'No buses found for this date'}</h3>
                            <p className="text-sm text-ink-2 mb-4">{result?.count ? 'Try clearing a filter.' : 'Try the next day, or a nearby city — many operators list only the main city.'}</p>
                            <div className="flex justify-center gap-2">
                                {result?.count ? <button onClick={() => { setSlots([]); setTypes([]); setOps([]); }} className="btn-primary">Clear filters</button> : <Link href={dayLink(1)} className="btn-primary">Try {fmtDate(addDays(date, 1))}</Link>}
                            </div>
                        </div>
                    )}
                    {!loading && buses.length > 0 && (
                        <div className="space-y-3">
                            {buses.map((b) => (
                                <BusCard key={b.resultIndex} bus={b} onSelect={select}
                                    highlight={cheapest && b.resultIndex === cheapest.resultIndex ? 'cheapest' : fastest && b.resultIndex === fastest.resultIndex && buses.length > 2 ? 'fastest' : null} />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {filtersOpen && (
                <div className="fixed inset-0 z-[110] lg:hidden">
                    <div className="absolute inset-0 bg-ink/50" onClick={() => setFiltersOpen(false)} />
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-extrabold text-ink">Filters</h3>
                            <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-full hover:bg-brand-soft" aria-label="Close"><X size={18} /></button>
                        </div>
                        {Filters}
                        <button onClick={() => setFiltersOpen(false)} className="btn-primary w-full mt-5">Show {buses.length} buses</button>
                    </div>
                </div>
            )}
        </BusShell>
    );
}

export default function BusSearchPage() {
    return (
        <Suspense fallback={<BusShell wide><div className="card h-40 shimmer" /></BusShell>}>
            <SearchInner />
        </Suspense>
    );
}
