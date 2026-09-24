'use client';

import React, { useState } from 'react';
import { ChevronDown, MapPin, Snowflake, Ticket, Wifi, Zap } from 'lucide-react';
import type { BusSummary } from '@/app/lib/bus/types';
import { fmtDuration, fmtINR, fmtTime } from '@/app/lib/bus/client';

interface Props {
    bus: BusSummary;
    onSelect: (bus: BusSummary) => void;
    highlight?: 'cheapest' | 'fastest' | null;
}

const amenityIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('wifi')) return <Wifi size={12} />;
    if (n.includes('charg')) return <Zap size={12} />;
    if (n.includes('blanket') || n.includes('ac')) return <Snowflake size={12} />;
    return null;
};

const BusCard = ({ bus, onSelect, highlight }: Props) => {
    const [open, setOpen] = useState(false);
    const few = bus.seatsLeft > 0 && bus.seatsLeft <= 5;

    return (
        <article className="card overflow-hidden hover:shadow-[0_8px_30px_rgba(79,43,208,0.08)] transition-shadow">
            <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-3 items-center">
                {/* Operator */}
                <div className="md:col-span-4 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-ink text-base md:text-lg leading-tight truncate">{bus.operator}</h3>
                        {highlight === 'cheapest' && <span className="pill-soft bg-gold-soft text-gold">Cheapest</span>}
                        {highlight === 'fastest' && <span className="pill-soft bg-ok-soft text-ok">Fastest</span>}
                    </div>
                    <p className="text-xs md:text-sm text-ink-2 mt-0.5 truncate">{bus.busType}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {bus.ac && <span className="pill-soft bg-brand-soft text-brand"><Snowflake size={11} /> AC</span>}
                        {bus.sleeper && <span className="pill-soft bg-brand-soft text-brand">Sleeper</span>}
                        {bus.seater && !bus.sleeper && <span className="pill-soft bg-brand-soft text-brand">Seater</span>}
                        {bus.mTicket && <span className="pill-soft bg-lav text-ink-2"><Ticket size={11} /> m-Ticket</span>}
                        {bus.liveTracking && <span className="pill-soft bg-lav text-ink-2"><MapPin size={11} /> Live tracking</span>}
                    </div>
                </div>

                {/* Timeline */}
                <div className="md:col-span-5 flex items-center gap-3">
                    <div className="text-left">
                        <div className="text-xl md:text-2xl font-extrabold text-ink tracking-tight">{fmtTime(bus.departure)}</div>
                        <div className="text-[11px] text-ink-3 truncate max-w-[120px]">{bus.firstBoarding?.name || 'Departure'}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                        <span className="text-[11px] font-bold text-ink-2">{fmtDuration(bus.duration)}</span>
                        <span className="w-full h-px bg-hair relative my-1"><span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand" /><span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand" /></span>
                        {bus.nextDay && <span className="text-[10px] font-semibold text-warn">Next day</span>}
                    </div>
                    <div className="text-right">
                        <div className="text-xl md:text-2xl font-extrabold text-ink tracking-tight">{fmtTime(bus.arrival)}</div>
                        <div className="text-[11px] text-ink-3 truncate max-w-[120px]">{bus.lastDropping?.name || 'Arrival'}</div>
                    </div>
                </div>

                {/* Price + CTA */}
                <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between gap-2">
                    <div className="text-left md:text-right">
                        <div className="text-[11px] text-ink-3 font-semibold">Starts from</div>
                        <div className="text-2xl font-black text-ink tracking-tight">{fmtINR(bus.fare)}</div>
                        <div className={`text-[11px] font-bold ${few ? 'text-err' : 'text-ok'}`}>{bus.seatsLeft > 0 ? `${bus.seatsLeft} seats left` : 'Sold out'}</div>
                    </div>
                    <button type="button" onClick={() => onSelect(bus)} disabled={bus.seatsLeft <= 0}
                        className="btn-primary px-5 py-2.5 text-sm whitespace-nowrap">
                        Select seats
                    </button>
                </div>
            </div>

            <div className="border-t border-hair px-4 md:px-5 py-2 flex items-center justify-between text-xs">
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-ink-2">
                    {bus.amenities.slice(0, 4).map((a) => (
                        <span key={a} className="inline-flex items-center gap-1">{amenityIcon(a)}{a}</span>
                    ))}
                    {bus.amenities.length === 0 && <span className="text-ink-3">{bus.boardingCount} boarding · {bus.droppingCount} dropping points</span>}
                </div>
                <button type="button" onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1 font-bold text-brand hover:underline">
                    Cancellation policy <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
            </div>
            {open && (
                <div className="border-t border-hair bg-lav px-4 md:px-5 py-3 text-xs text-ink-2">
                    {bus.cancellationPolicies.length ? (
                        <table className="w-full text-left">
                            <thead><tr className="text-ink-3"><th className="font-semibold pb-1">Cancel before departure</th><th className="font-semibold pb-1 text-right">Charge</th></tr></thead>
                            <tbody>
                                {bus.cancellationPolicies.map((p, i) => (
                                    <tr key={i} className="border-t border-hair"><td className="py-1">{p.from}{p.to ? ` – ${p.to}` : ''} hrs</td><td className="py-1 text-right font-bold text-ink">{/%|₹|rs/i.test(p.charge) ? p.charge : `${p.charge}%`}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Cancellation charges are set by the operator and shown before you pay. {bus.partialCancellation ? 'Partial cancellation is allowed on this bus.' : 'This bus does not allow cancelling only some seats.'}</p>
                    )}
                    <p className="mt-2 text-ink-3">{bus.boardingCount} boarding · {bus.droppingCount} dropping points · Max {bus.maxSeats} seats per booking{bus.idProofRequired ? ' · Photo ID required at boarding' : ''}</p>
                </div>
            )}
        </article>
    );
};

export default BusCard;
