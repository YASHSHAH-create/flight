'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Seat } from '@/app/lib/bus/types';

/**
 * Seat map renderer.
 *
 * Embark's coordinate convention (verified against live data + redBus):
 *   RowNo    = position ACROSS the bus, 0 = driver-side window
 *   ColumnNo = position ALONG the bus, 0 = front
 *
 * Layout is chosen by available width:
 *   - wide (≥ 620px): bus drawn HORIZONTALLY, front on the left, driver side on
 *     top — a 15-row sleeper becomes ~220px tall instead of ~900px.
 *   - narrow: drawn vertically (front at top, driver top-right like redBus)
 *     inside a bounded scroll area so the page itself stays short.
 * Decks are tabs, never stacked.
 */

interface Props {
    lower: Seat[];
    upper: Seat[];
    selected: Seat[];
    maxSelectable: number;
    onToggle: (seat: Seat) => void;
}

const GAP = 5;
const isMarker = (s: Seat) => /exit|door|gate|driver|steer/i.test(s.name);

interface DeckGrid { across: Map<number, number>; acrossCount: number; along: number }

const buildGrid = (seats: Seat[]): DeckGrid | null => {
    if (!seats.length) return null;
    const rows = seats.map((s) => s.row);
    const maxRow = Math.max(...rows);
    const minRow = Math.min(...rows);
    const used = new Set(rows);
    const across = new Map<number, number>();
    let x = 0;
    for (let r = maxRow; r >= minRow; r--) {
        if (used.has(r)) { across.set(r, x); x += 1; }
        else if (x > 0) { across.set(r, x); x += 1; } // aisle gap
    }
    const along = Math.max(...seats.map((s) => s.col + s.length));
    return { across, acrossCount: x, along };
};

const Deck = ({ seats, selected, onToggle, horizontal, cell, showDriver }: { seats: Seat[]; selected: Seat[]; onToggle: (s: Seat) => void; horizontal: boolean; cell: number; showDriver: boolean }) => {
    const grid = useMemo(() => buildGrid(seats), [seats]);
    if (!grid) return <p className="text-sm text-ink-3 p-4">No seats on this deck.</p>;
    const isSel = (s: Seat) => selected.some((x) => x.name === s.name && x.upper === s.upper);
    // vertical: x = mirrored across index, y = along. horizontal: x = along, y = across (row 0 on top)
    const W = horizontal ? grid.along : grid.acrossCount;
    const H = horizontal ? grid.acrossCount : grid.along;
    const xOf = (s: Seat) => (horizontal ? s.col : (grid.across.get(s.row) ?? 0));
    const yOf = (s: Seat) => (horizontal ? (grid.acrossCount - 1 - (grid.across.get(s.row) ?? 0)) : s.col);
    const wOf = (s: Seat) => (horizontal ? s.length : s.width);
    const hOf = (s: Seat) => (horizontal ? s.width : s.length);

    return (
        <div className={`inline-block rounded-[20px] border-2 border-hair bg-lav p-2.5 ${horizontal ? 'pl-3' : 'pt-2'}`}>
            <div className={`flex items-center text-[10px] font-bold text-ink-3 uppercase tracking-wider mb-1.5 ${horizontal ? 'justify-between' : 'justify-between'}`}>
                <span>Front{horizontal ? ' →' : ''}</span>
                {showDriver && <span className="w-5 h-5 rounded-full border-2 border-ink-3/60 flex items-center justify-center" title="Driver"><span className="w-2.5 h-2.5 rounded-full border border-ink-3/60" /></span>}
            </div>
            <div className="relative" style={{ width: W * cell - GAP, height: H * cell - GAP }}>
                {seats.map((s) => {
                    const sel = isSel(s);
                    const base = 'absolute rounded-md border text-[10px] font-bold flex flex-col items-center justify-center leading-none transition-all select-none';
                    let cls = '';
                    if (!s.available) cls = 'bg-ink-3/15 border-transparent text-ink-3/60 cursor-not-allowed';
                    else if (sel) cls = 'bg-brand border-brand text-white shadow-md z-10';
                    else if (s.ladies) cls = 'bg-pink-50 border-pink-300 text-pink-700 hover:bg-pink-100 cursor-pointer';
                    else if (s.males) cls = 'bg-sky-50 border-sky-300 text-sky-700 hover:bg-sky-100 cursor-pointer';
                    else cls = 'bg-white border-brand/40 text-ink hover:border-brand hover:bg-brand-soft cursor-pointer';
                    const w = cell * wOf(s) - GAP;
                    const h = cell * hOf(s) - GAP;
                    return (
                        <button
                            key={`${s.upper ? 'U' : 'L'}-${s.name}`}
                            type="button"
                            disabled={!s.available}
                            onClick={() => onToggle(s)}
                            title={`${s.name} · ₹${s.fare}${s.ladies ? ' · Ladies' : ''}${!s.available ? ' · Booked' : ''}`}
                            aria-label={`Seat ${s.name}, ₹${s.fare}${s.available ? '' : ', booked'}${sel ? ', selected' : ''}`}
                            className={`${base} ${cls}`}
                            style={{ left: xOf(s) * cell, top: yOf(s) * cell, width: w, height: h }}
                        >
                            {s.type === 'Sleeper' && (
                                <span className={`absolute rounded-full ${sel ? 'bg-white/60' : 'bg-current opacity-25'} ${horizontal ? 'left-1 top-1/2 -translate-y-1/2 w-1 h-[55%]' : 'top-1 left-1/2 -translate-x-1/2 h-1 w-[55%]'}`} />
                            )}
                            <span>{s.name}</span>
                            {cell >= 38 && <span className={`mt-0.5 text-[9px] font-semibold ${sel ? 'text-white/80' : 'opacity-70'}`}>₹{s.fare}</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const SeatMap = ({ lower, upper, selected, maxSelectable, onToggle }: Props) => {
    const lowerSeats = useMemo(() => lower.filter((s) => !isMarker(s)), [lower]);
    const upperSeats = useMemo(() => upper.filter((s) => !isMarker(s)), [upper]);
    const hasUpper = upperSeats.length > 0;
    const [deck, setDeck] = useState<'lower' | 'upper'>('lower');
    const wrapRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const ro = new ResizeObserver((entries) => setWidth(Math.floor(entries[0].contentRect.width)));
        ro.observe(el);
        setWidth(el.clientWidth);
        return () => ro.disconnect();
    }, []);

    const seats = deck === 'upper' ? upperSeats : lowerSeats;
    const grid = useMemo(() => buildGrid(seats), [seats]);
    const horizontal = width >= 620;
    // Fit the main axis to the available width: 34–44px cells.
    const unitsAcrossWidth = grid ? (horizontal ? grid.along : grid.acrossCount) : 1;
    const cell = Math.max(34, Math.min(44, Math.floor((width - 32) / Math.max(1, unitsAcrossWidth))));

    const toggle = (s: Seat) => {
        const already = selected.some((x) => x.name === s.name && x.upper === s.upper);
        if (!already && selected.length >= maxSelectable) return;
        onToggle(s);
    };
    const count = (list: Seat[]) => selected.filter((x) => list.some((s) => s.name === x.name && s.upper === x.upper)).length;

    return (
        <div ref={wrapRef}>
            <div className="flex items-center justify-between gap-2 mb-2">
                {hasUpper ? (
                    <div role="tablist" className="inline-flex rounded-full bg-lav border border-hair p-0.5">
                        {(['lower', 'upper'] as const).map((d) => (
                            <button key={d} role="tab" aria-selected={deck === d} onClick={() => setDeck(d)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${deck === d ? 'bg-brand text-white' : 'text-ink-2 hover:text-ink'}`}>
                                {d === 'lower' ? 'Lower' : 'Upper'}<span className="hidden sm:inline"> deck</span>{count(d === 'lower' ? lowerSeats : upperSeats) ? ` · ${count(d === 'lower' ? lowerSeats : upperSeats)}` : ''}
                            </button>
                        ))}
                    </div>
                ) : <span className="text-xs font-bold text-ink-2">{lowerSeats.filter((s) => s.available).length} seats available</span>}
                <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-[10px] font-semibold text-ink-2">
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded border border-brand/40 bg-white" /> Free</span>
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-brand" /> Yours</span>
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded bg-ink-3/15" /> Booked</span>
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded border border-pink-300 bg-pink-50" /> Ladies</span>
                </div>
            </div>
            <div className={`${horizontal ? 'overflow-x-auto' : 'max-h-[52vh] overflow-y-auto'} custom-scrollbar rounded-2xl`}>
                <div className={horizontal ? 'min-w-max' : 'flex justify-center'}>
                    {width > 0 && <Deck seats={seats} selected={selected} onToggle={toggle} horizontal={horizontal} cell={cell} showDriver={deck === 'lower'} />}
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
