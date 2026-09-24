'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, MapPin, Search, X } from 'lucide-react';
import { POPULAR_BUS_CITIES } from '@/app/lib/bus/cities';
import type { BusCity } from '@/app/lib/bus/types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (city: BusCity) => void;
    title: string;
}

const RECENT_KEY = 'paymm:bus:recentCities';

const readRecent = (): BusCity[] => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').slice(0, 6); } catch { return []; }
};

export const rememberCity = (c: BusCity) => {
    try {
        const cur = readRecent().filter((x) => x.code !== c.code);
        localStorage.setItem(RECENT_KEY, JSON.stringify([c, ...cur].slice(0, 6)));
    } catch { /* ignore */ }
};

const CitySearchModal = ({ isOpen, onClose, onSelect, title }: Props) => {
    const [q, setQ] = useState('');
    const [results, setResults] = useState<BusCity[]>([]);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [recent, setRecent] = useState<BusCity[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => {
        if (isOpen) {
            setQ(''); setResults([]); setRecent(readRecent());
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const term = q.trim();
        if (term.length < 2) { setResults([]); return; }
        const ctrl = new AbortController();
        const t = setTimeout(async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/bus/cities?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
                const data = await res.json();
                setResults(Array.isArray(data?.cities) ? data.cities : []);
            } catch { /* aborted */ } finally { setLoading(false); }
        }, 220);
        return () => { clearTimeout(t); ctrl.abort(); };
    }, [q, isOpen]);

    if (!mounted) return null;

    const pick = (c: BusCity) => { rememberCity(c); onSelect(c); };
    const showLists = q.trim().length < 2;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex flex-col justify-end md:justify-center bg-ink/60 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0" aria-hidden="true" />
                    <motion.div
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                        className="bg-white w-full h-[100dvh] md:h-[600px] md:w-[560px] md:rounded-2xl shadow-2xl relative z-10 md:mx-auto flex flex-col overflow-hidden"
                        role="dialog" aria-modal="true" aria-label={title}
                    >
                        <div className="p-3 md:p-4 border-b border-hair flex items-center gap-2">
                            <button onClick={onClose} className="md:hidden p-2 -ml-1 rounded-full hover:bg-brand-soft" aria-label="Back"><ArrowLeft size={20} /></button>
                            <div className="flex-1 flex items-center gap-2 bg-lav border border-hair rounded-xl px-3 py-2.5 focus-within:border-brand focus-within:bg-white transition-colors">
                                <Search size={18} className="text-slate-400 shrink-0" />
                                <input
                                    ref={inputRef}
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder={title}
                                    className="flex-1 bg-transparent outline-none text-ink placeholder:text-ink-3 text-base"
                                    autoComplete="off"
                                    inputMode="text"
                                />
                                {q && <button onClick={() => setQ('')} className="text-ink-3 hover:text-ink" aria-label="Clear"><X size={16} /></button>}
                            </div>
                            <button onClick={onClose} className="hidden md:flex p-2 rounded-full hover:bg-brand-soft" aria-label="Close"><X size={20} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {showLists ? (
                                <div className="p-4 space-y-6">
                                    {recent.length > 0 && (
                                        <section>
                                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-2 flex items-center gap-1"><Clock size={12} /> Recent</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {recent.map((c) => (
                                                    <button key={c.code} onClick={() => pick(c)} className="px-3 py-1.5 rounded-full border border-hair bg-white text-sm font-semibold text-ink hover:border-brand hover:bg-brand-soft transition-colors">{c.name}</button>
                                                ))}
                                            </div>
                                        </section>
                                    )}
                                    <section>
                                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-2">Popular cities</h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {POPULAR_BUS_CITIES.map((c) => (
                                                <button key={c.code} onClick={() => pick(c)} className="text-left px-3 py-2.5 rounded-xl border border-hair bg-lav hover:bg-brand-soft hover:border-brand/30 transition-all">
                                                    <div className="text-sm font-bold text-ink">{c.name}</div>
                                                    <div className="text-[11px] text-ink-2">{c.state}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            ) : (
                                <ul className="divide-y divide-hair">
                                    {loading && results.length === 0 && (
                                        <li className="p-6 text-center text-sm text-ink-3">Searching…</li>
                                    )}
                                    {!loading && results.length === 0 && (
                                        <li className="p-6 text-center text-sm text-ink-3">No cities match “{q}”. Try a nearby city or a different spelling.</li>
                                    )}
                                    {results.map((c) => (
                                        <li key={c.code}>
                                            <button onClick={() => pick(c)} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-brand-soft/60 transition-colors">
                                                <span className="w-9 h-9 rounded-full bg-brand-soft flex items-center justify-center text-brand shrink-0"><MapPin size={16} /></span>
                                                <span className="min-w-0">
                                                    <span className="block text-sm font-bold text-ink truncate">{c.name}</span>
                                                    {c.state && <span className="block text-xs text-ink-2">{c.state}</span>}
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body,
    );
};

export default CitySearchModal;
