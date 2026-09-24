'use client';

import React, { useMemo } from 'react';
import type { Seat } from '@/app/lib/bus/types';

/**
 * Seat map renderer.
 *
 * Embark's coordinate convention (verified against live data + redBus):
 *   RowNo    = position ACROSS the bus, 0 = driver-side window
 *   ColumnNo = position ALONG the bus, 0 = front
 * We draw the bus vertically (front at the top, like redBus), so x is the
 * mirrored RowNo (driver side ends up on the right, where the steering wheel
 * is) and y is ColumnNo. Sleeper berths span `length` cells vertically.
 */

interface Props {
    lower: Seat[];
    upper: Seat[];
    selected: Seat[];
    maxSelectable: number;
    onToggle: (seat: Seat) => void;
}

const CELL = 44;   // px, incl. gap
const GAP = 6;

const Deck = ({ title, seats, selected, onToggle, showDriver }: { title: string; seats: Seat[]; selected: Seat[]; onToggle: (s: Seat) => void; showDriver: boolean }) => {
    const grid = useMemo(() => {
        if (!seats.length) return null;
        const rows = seats.map((s) => s.row);
        const maxRow = Math.max(...rows);
        const minRow = Math.min(...rows);
        const cols = seats.map((s) => s.col + s.length - 1);
        const maxCol = Math.max(...cols);
        // Column indexes that hold no seat are an aisle — keep one visual gap only.
        const used = new Set(seats.map((s) => s.row));
        const xIndex = new Map<number, number>();
        let x = 0;
        for (let r = maxRow; r >= minRow; r--) {
            if (used.has(r)) { xIndex.set(r, x); x += 1; }
            else if (x > 0 && xIndex.size < used.size) { xIndex.set(r, x); x += 1; } // aisle
        }
        return { xIndex, width: x, height: maxCol + 1 };
    }, [seats]);

    if (!grid) return null;
    const isSel = (s: Seat) => selected.some((x) => x.name === s.name && x.upper === s.upper);

    return (
        <div className="flex flex-col items-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-2">{title}</div>
            <div className="rounded-[22px] border-2 border-hair bg-lav p-3 pt-2">
                <div className="flex items-center justify-between px-1 mb-2 h-6">
                    <span className="text-[10px] font-bold text-ink-3 uppercase tracking-wider">Front</span>
                    {showDriver && (
                        <span className="w-6 h-6 rounded-full border-2 border-ink-3/60 flex items-center justify-center" title="Driver">
                            <span className="w-3 h-3 rounded-full border border-ink-3/60" />
                        </span>
                    )}
                </div>
                <div className="relative" style={{ width: grid.width * CELL - GAP, height: grid.height * CELL - GAP }}>
                    {seats.map((s) => {
                        const x = grid.xIndex.get(s.row) ?? 0;
                        const sel = isSel(s);
                        const w = CELL * s.width - GAP;
                        const h = CELL * s.length - GAP;
                        const base = 'absolute rounded-lg border text-[11px] font-bold flex flex-col items-center justify-center transition-all select-none';
                        let cls = '';
                        if (!s.available) cls = 'bg-ink-3/15 border-transparent text-ink-3/60 cursor-not-allowed';
                        else if (sel) cls = 'bg-brand border-brand text-white shadow-md scale-[1.04] z-10';
                        else if (s.ladies) cls = 'bg-pink-50 border-pink-300 text-pink-700 hover:bg-pink-100 cursor-pointer';
                        else if (s.males) cls = 'bg-sky-50 border-sky-300 text-sky-700 hover:bg-sky-100 cursor-pointer';
                        else cls = 'bg-white border-brand/40 text-ink hover:border-brand hover:bg-brand-soft cursor-pointer';
                        return (
                            <button
                                key={`${s.upper ? 'U' : 'L'}-${s.name}`}
                                type="button"
                                disabled={!s.available}
                                onClick={() => onToggle(s)}
                                title={`${s.name} · ₹${s.fare}${s.ladies ? ' · Ladies' : ''}${!s.available ? ' · Booked' : ''}`}
                                aria-label={`Seat ${s.name}, ₹${s.fare}${s.available ? '' : ', booked'}${sel ? ', selected' : ''}`}
                                className={`${base} ${cls}`}
                                style={{ left: x * CELL, top: s.col * CELL, width: w, height: h }}
                            >
                                {s.type === 'Sleeper' && <span className={`w-[60%] h-1 rounded-full mb-1 ${sel ? 'bg-white/60' : 'bg-current opacity-30'}`} />}
                                <span className="leading-none">{s.name}</span>
                                <span className={`leading-none mt-0.5 text-[9px] font-semibold ${sel ? 'text-white/80' : 'opacity-70'}`}>₹{s.fare}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const SeatMap = ({ lower, upper, selected, maxSelectable, onToggle }: Props) => {
    const lowerSeats = useMemo(() => lower.filter((s) => !/exit|door|gate|driver|steer/i.test(s.name)), [lower]);
    const upperSeats = useMemo(() => upper.filter((s) => !/exit|door|gate|driver|steer/i.test(s.name)), [upper]);

    const toggle = (s: Seat) => {
        const already = selected.some((x) => x.name === s.name && x.upper === s.upper);
        if (!already && selected.length >= maxSelectable) return;
        onToggle(s);
    };

    return (
        <div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-semibold text-ink-2 mb-4">
                <span className="flex items-center gap-1.5"><i className="w-4 h-4 rounded border border-brand/40 bg-white" /> Available</span>
                <span className="flex items-center gap-1.5"><i className="w-4 h-4 rounded bg-brand" /> Selected</span>
                <span className="flex items-center gap-1.5"><i className="w-4 h-4 rounded bg-ink-3/15" /> Booked</span>
                <span className="flex items-center gap-1.5"><i className="w-4 h-4 rounded border border-pink-300 bg-pink-50" /> Ladies</span>
                {upperSeats.length > 0 && <span className="flex items-center gap-1.5"><i className="w-4 h-4 rounded border border-brand/40 bg-white relative"><i className="absolute left-1 right-1 top-[3px] h-[2px] bg-ink/30 rounded" /></i> Sleeper berth</span>}
            </div>
            <div className="flex flex-wrap justify-center gap-6 overflow-x-auto pb-2">
                <Deck title={upperSeats.length ? 'Lower deck' : 'Seats'} seats={lowerSeats} selected={selected} onToggle={toggle} showDriver />
                {upperSeats.length > 0 && <Deck title="Upper deck" seats={upperSeats} selected={selected} onToggle={toggle} showDriver={false} />}
            </div>
        </div>
    );
};

export default SeatMap;
