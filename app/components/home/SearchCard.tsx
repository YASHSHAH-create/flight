'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Zap } from 'lucide-react';
import FlightSearch from '../search-widget/FlightSearch';
import HotelSearch from '../search-widget/HotelSearch';
import BusSearchWidget from '../bus/BusSearchWidget';
import { readRecentSearches as readRecent, type RecentSearch as Recent } from '@/app/lib/recentSearches';

type Tab = 'flights' | 'hotels' | 'buses' | 'recharge' | 'bills';

const TABS: { id: Tab; label: string; emoji: string; tint: string }[] = [
    { id: 'flights', label: 'Flights', emoji: '✈️', tint: 'from-[#EFEAFB] to-[#E4DCFA]' },
    { id: 'hotels', label: 'Hotels', emoji: '🏨', tint: 'from-[#FFE9E3] to-[#FFD9CF]' },
    { id: 'buses', label: 'Buses', emoji: '🚌', tint: 'from-[#E0F5F1] to-[#CBEEE5]' },
    { id: 'recharge', label: 'Recharge', emoji: '📱', tint: 'from-[#FFF4D6] to-[#FFE9B3]' },
    { id: 'bills', label: 'Bill Pay', emoji: '🧾', tint: 'from-[#E3F0FF] to-[#CFE3FF]' },
];

const OPERATORS = ['Jio', 'Airtel', 'Vi', 'BSNL', 'Tata Play', 'Dish TV'];
const BILL_CATS = ['Electricity', 'Water', 'Gas', 'Broadband', 'FASTag', 'Credit card', 'Insurance'];

const AppOnly = ({ what, children }: { what: string; children: React.ReactNode }) => (
    <div>
        {children}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl bg-gold-soft/70 border border-gold/20 p-3.5">
            <Smartphone size={18} className="text-gold shrink-0" />
            <p className="text-sm text-ink flex-1">{what} is live in the Paymm app — same account, PayMM Coins on every transaction.</p>
            <Link href="/downloads" className="btn-primary text-sm py-2.5 whitespace-nowrap">Continue in app</Link>
        </div>
    </div>
);

const SearchCard = ({ initialTab = 'flights' }: { initialTab?: Tab }) => {
    const [tab, setTab] = useState<Tab>(initialTab);
    const [recent, setRecent] = useState<Recent[]>([]);
    const [mobile, setMobile] = useState('');
    const [rtype, setRtype] = useState<'Prepaid' | 'Postpaid' | 'DTH'>('Prepaid');
    const [billCat, setBillCat] = useState('Electricity');

    useEffect(() => { setRecent(readRecent()); }, []);

    const operatorGuess = mobile.length >= 4 ? (['6', '9'].includes(mobile[0]) ? 'Jio' : mobile[0] === '7' ? 'Airtel' : 'Vi') : '';

    return (
        <div className="panel shadow-[0_24px_70px_rgba(79,43,208,0.12)] p-3 md:p-6 w-full max-w-[1100px] mx-auto text-left">
            <div role="tablist" aria-label="Search type" className="flex gap-1 md:gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 pb-2.5 mb-3 border-b border-hair">
                {TABS.map((t) => {
                    const on = t.id === tab;
                    return (
                        <button key={t.id} role="tab" aria-selected={on} onClick={() => setTab(t.id)}
                            className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3.5 py-1.5 md:py-2 rounded-full text-[13px] md:text-sm font-bold whitespace-nowrap transition-colors ${on ? 'bg-brand-soft text-brand' : 'text-ink-2 hover:bg-lav'}`}>
                            <span className={`w-7 h-7 rounded-lg bg-gradient-to-br ${t.tint} flex items-center justify-center text-base shadow-[inset_0_-2px_0_rgba(0,0,0,0.05)]`} aria-hidden>{t.emoji}</span>
                            {t.label}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
                <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                    {tab === 'flights' && <FlightSearch />}
                    {tab === 'hotels' && <HotelSearch />}
                    {tab === 'buses' && (
                        <div>
                            <BusSearchWidget />
                            <p className="text-xs text-ink-2 mt-3">Live seat layout · Sleeper &amp; AC filters · No convenience fee · Free cancellation on select operators</p>
                        </div>
                    )}
                    {tab === 'recharge' && (
                        <AppOnly what="Mobile &amp; DTH recharge">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                <div className="md:col-span-7 rounded-2xl border border-hair p-3 hover:bg-brand-soft/40 transition-colors">
                                    <span className="field-label">Mobile number</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-ink-2 font-bold">+91</span>
                                        <input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" placeholder="Enter mobile number" className="flex-1 bg-transparent outline-none text-lg font-extrabold text-ink placeholder:font-semibold placeholder:text-ink-3" />
                                        {operatorGuess && <span className="pill-soft bg-brand-soft text-brand"><Zap size={11} /> {operatorGuess} · auto-detect</span>}
                                    </div>
                                </div>
                                <div className="md:col-span-5 flex items-center gap-1 rounded-2xl border border-hair p-1.5 bg-lav">
                                    {(['Prepaid', 'Postpaid', 'DTH'] as const).map((t) => (
                                        <button key={t} onClick={() => setRtype(t)} className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors ${rtype === t ? 'bg-white text-brand shadow-sm' : 'text-ink-2'}`}>{t}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-2">
                                <span className="font-semibold">Operators:</span>
                                {OPERATORS.map((o) => <span key={o} className="px-2.5 py-1 rounded-full bg-lav border border-hair font-semibold text-ink">{o}</span>)}
                            </div>
                        </AppOnly>
                    )}
                    {tab === 'bills' && (
                        <AppOnly what="Bill payment">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {BILL_CATS.map((c) => (
                                    <button key={c} onClick={() => setBillCat(c)} className={`px-3.5 py-2 rounded-full text-sm font-bold border transition-colors ${billCat === c ? 'bg-brand-soft border-brand text-brand' : 'bg-white border-hair text-ink-2 hover:border-brand/40'}`}>{c}</button>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-hair p-3"><span className="field-label">{billCat} biller</span><span className="field-value text-ink-3 font-semibold">Select biller</span></div>
                                <div className="rounded-2xl border border-hair p-3"><span className="field-label">Consumer number</span><span className="field-value text-ink-3 font-semibold">As printed on your bill</span></div>
                            </div>
                        </AppOnly>
                    )}
                </motion.div>
            </AnimatePresence>

            {recent.length > 0 && (
                <div className="mt-4 pt-3 border-t border-hair flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-ink-3 whitespace-nowrap">Recent</span>
                    {recent.map((r) => (
                        <Link key={r.href} href={r.href} className="px-3 py-1.5 rounded-full bg-lav border border-hair text-xs font-bold text-ink whitespace-nowrap hover:border-brand hover:text-brand transition-colors">{r.label}</Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchCard;
