'use client';

import React from 'react';
import { Bus, CalendarDays, MapPin, Users } from 'lucide-react';
import type { BookingView } from '@/app/lib/bus/types';
import { fmtDate, fmtINR, fmtTime } from '@/app/lib/bus/client';

const TicketCard = ({ t, compact }: { t: NonNullable<BookingView['ticket']>; compact?: boolean }) => (
    <div className={`card overflow-hidden ${t.cancelled ? 'opacity-80' : ''}`}>
        <div className="bg-brand text-white px-5 py-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider font-bold text-white/70">m-Ticket</p>
                <h3 className="font-extrabold text-lg leading-tight truncate">{t.from || 'Origin'} → {t.to || 'Destination'}</h3>
                <p className="text-xs text-white/80 truncate">{t.operator || 'Bus operator'}{t.busType ? ` · ${t.busType}` : ''}</p>
            </div>
            <div className="text-right shrink-0">
                <p className="text-[11px] uppercase tracking-wider font-bold text-white/70">PNR</p>
                <p className="font-black text-xl tracking-wide">{t.pnr || '—'}</p>
                {t.cancelled && <span className="pill-soft bg-err-soft text-err mt-1">Cancelled</span>}
            </div>
        </div>
        <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><p className="text-[11px] font-bold uppercase tracking-wide text-ink-3 flex items-center gap-1"><CalendarDays size={12} /> Journey</p><p className="font-bold text-ink">{t.date ? fmtDate(t.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</p><p className="text-xs text-ink-2">{t.departure ? `${fmtTime(t.departure)}${t.arrival ? ` – ${fmtTime(t.arrival)}` : ''}` : ''}</p></div>
            <div><p className="text-[11px] font-bold uppercase tracking-wide text-ink-3 flex items-center gap-1"><MapPin size={12} /> Boarding</p><p className="font-bold text-ink">{t.boardingPoint || '—'}</p>{t.droppingPoint && <p className="text-xs text-ink-2">Drop: {t.droppingPoint}</p>}</div>
            <div><p className="text-[11px] font-bold uppercase tracking-wide text-ink-3 flex items-center gap-1"><Bus size={12} /> Ticket no.</p><p className="font-bold text-ink break-all">{t.ticketNo || '—'}</p>{t.embarkBookingId && <p className="text-xs text-ink-2">Ref {t.embarkBookingId}</p>}</div>
            <div><p className="text-[11px] font-bold uppercase tracking-wide text-ink-3">Paid</p><p className="font-black text-ink text-lg">{fmtINR(t.amount)}</p>{t.cancelled && t.cancellation?.refundAmount !== undefined && <p className="text-xs text-ok font-semibold">Refund {fmtINR(t.cancellation.refundAmount || 0)}</p>}</div>
        </div>
        {!compact && (
            <div className="px-5 pb-5">
                <p className="text-[11px] font-bold uppercase tracking-wide text-ink-3 flex items-center gap-1 mb-2"><Users size={12} /> Passengers</p>
                <div className="rounded-xl border border-hair divide-y divide-hair">
                    {t.passengers.map((p, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                            <span className="font-semibold text-ink">{p.name}</span>
                            <span className="text-xs text-ink-2">{[p.age ? `${p.age} yrs` : '', p.gender].filter(Boolean).join(' · ')}</span>
                            <span className="pill-soft bg-brand-soft text-brand">Seat {p.seat || '—'}</span>
                        </div>
                    ))}
                </div>
                {t.contact?.phone && <p className="text-xs text-ink-2 mt-3">Ticket sent to +91 {t.contact.phone}{t.contact.email ? ` and ${t.contact.email}` : ''}. Show this PNR (or the SMS) to the operator when boarding.</p>}
            </div>
        )}
    </div>
);

export default TicketCard;
