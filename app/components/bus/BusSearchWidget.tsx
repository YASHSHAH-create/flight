'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightLeft, Bus, Calendar, MapPin, Search } from 'lucide-react';
import CitySearchModal, { rememberCity } from './CitySearchModal';
import DatePickerModal from '../search-widget/DatePickerModal';
import { BUS_CITIES } from '@/app/lib/bus/cities';
import type { BusCity } from '@/app/lib/bus/types';
import { addDays, fmtDate, todayYmd } from '@/app/lib/bus/client';
import { rememberSearch } from '@/app/lib/recentSearches';

interface Props {
    initialFrom?: BusCity;
    initialTo?: BusCity;
    initialDate?: string;
    compact?: boolean;
    className?: string;
}

export const busSearchHref = (from: BusCity, to: BusCity, date: string) => {
    const p = new URLSearchParams({
        from: String(from.code), fromName: from.name, to: String(to.code), toName: to.name, date,
    });
    if (from.state) p.set('fromState', from.state);
    if (to.state) p.set('toState', to.state);
    return `/bus/search?${p.toString()}`;
};

const BusSearchWidget = ({ initialFrom, initialTo, initialDate, compact, className }: Props) => {
    const router = useRouter();
    const [from, setFrom] = useState<BusCity>(initialFrom || BUS_CITIES.delhi);
    const [to, setTo] = useState<BusCity>(initialTo || BUS_CITIES.manali);
    const [date, setDate] = useState<string>(initialDate || todayYmd());
    const [picking, setPicking] = useState<'from' | 'to' | null>(null);
    const [dateOpen, setDateOpen] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        document.body.style.overflow = picking || dateOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [picking, dateOpen]);

    const today = todayYmd();
    const tomorrow = addDays(today, 1);

    const swap = () => { setFrom(to); setTo(from); };

    const search = () => {
        setError('');
        if (from.code === to.code) { setError('Source and destination cannot be the same.'); return; }
        if (date < today) { setError('Please pick today or a future date.'); return; }
        rememberCity(from); rememberCity(to);
        rememberSearch(`${from.name} → ${to.name} bus · ${fmtDate(date)}`, busSearchHref(from, to, date));
        router.push(busSearchHref(from, to, date));
    };

    const field = 'w-full bg-lav border border-hair rounded-xl md:rounded-2xl p-3 flex flex-col justify-center cursor-pointer hover:bg-brand-soft/60 hover:border-brand/30 transition-all text-left';

    return (
        <div className={className}>
            <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-12' : 'lg:grid-cols-12'} gap-2 md:gap-3 items-stretch`}>
                <div className={`relative ${compact ? 'md:col-span-4' : 'lg:col-span-4'}`}>
                    <button type="button" onClick={() => setPicking('from')} className={`${field} min-h-[64px] md:min-h-[76px] pr-10`} aria-label="From city">
                        <span className="flex items-center gap-1 text-ink-3 text-[11px] font-bold uppercase tracking-wide"><MapPin size={12} /> From</span>
                        <span className="text-lg md:text-xl font-extrabold text-ink truncate leading-tight">{from.name}</span>
                        {from.state && <span className="text-xs text-ink-2 truncate">{from.state}</span>}
                    </button>
                    <button type="button" onClick={swap} aria-label="Swap cities"
                        className="absolute right-2 top-1/2 -translate-y-1/2 md:right-[-18px] md:z-10 bg-white border border-hair text-brand hover:text-brand-hover hover:shadow-md p-2 rounded-full shadow-sm active:rotate-180 transition-transform">
                        <ArrowRightLeft size={14} />
                    </button>
                </div>
                <div className={compact ? 'md:col-span-4' : 'lg:col-span-4'}>
                    <button type="button" onClick={() => setPicking('to')} className={`${field} min-h-[64px] md:min-h-[76px] md:pl-6`} aria-label="To city">
                        <span className="flex items-center gap-1 text-ink-3 text-[11px] font-bold uppercase tracking-wide"><MapPin size={12} /> To</span>
                        <span className="text-lg md:text-xl font-extrabold text-ink truncate leading-tight">{to.name}</span>
                        {to.state && <span className="text-xs text-ink-2 truncate">{to.state}</span>}
                    </button>
                </div>
                <div className={compact ? 'md:col-span-2' : 'lg:col-span-2'}>
                    <button type="button" onClick={() => setDateOpen(true)} className={`${field} min-h-[64px] md:min-h-[76px]`} aria-label="Travel date">
                        <span className="flex items-center gap-1 text-ink-3 text-[11px] font-bold uppercase tracking-wide"><Calendar size={12} /> Date</span>
                        <span className="text-lg md:text-xl font-extrabold text-ink leading-tight">{fmtDate(date, { day: 'numeric', month: 'short' })}</span>
                        <span className="text-xs text-ink-2">{date === today ? 'Today' : date === tomorrow ? 'Tomorrow' : fmtDate(date, { weekday: 'long' })}</span>
                    </button>
                </div>
                <div className={`${compact ? 'md:col-span-2' : 'lg:col-span-2'} flex flex-col gap-2`}>
                    <button type="button" onClick={search}
                        className="flex-1 min-h-[56px] md:min-h-[76px] w-full bg-brand text-white rounded-xl md:rounded-2xl font-bold hover:bg-brand-hover hover:shadow-[0_10px_30px_rgba(79,43,208,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <Search size={18} /> <span>Search buses</span>
                    </button>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-ink-2 font-semibold hidden sm:inline">Quick pick:</span>
                {[{ l: 'Today', v: today }, { l: 'Tomorrow', v: tomorrow }, { l: fmtDate(addDays(today, 2), { weekday: 'short' }), v: addDays(today, 2) }].map((d) => (
                    <button key={d.v} type="button" onClick={() => setDate(d.v)}
                        className={`px-3 py-1 rounded-full border font-semibold transition-colors ${date === d.v ? 'bg-brand text-white border-brand' : 'bg-white text-ink-2 border-hair hover:border-brand'}`}>{d.l}</button>
                ))}
                <span className="ml-auto inline-flex items-center gap-1 text-ink-3"><Bus size={12} /> Live seats from 1,000s of daily departures</span>
            </div>
            {error && <p className="mt-2 text-sm font-semibold text-err">{error}</p>}

            <CitySearchModal
                isOpen={picking !== null}
                onClose={() => setPicking(null)}
                title={picking === 'from' ? 'Leaving from' : 'Going to'}
                onSelect={(c) => {
                    if (picking === 'from') { if (c.code === to.code) setTo(from); setFrom(c); }
                    else { if (c.code === from.code) setFrom(to); setTo(c); }
                    setPicking(null);
                }}
            />
            <DatePickerModal
                isOpen={dateOpen}
                onClose={() => setDateOpen(false)}
                title="Travel date"
                selectedDate={(() => { const [y, m, d] = date.split('-').map(Number); return new Date(y, m - 1, d); })()}
                onSelect={(d) => {
                    const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                    setDate(ymd); setDateOpen(false);
                }}
            />
        </div>
    );
};

export default BusSearchWidget;
