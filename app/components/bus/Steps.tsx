'use client';

import React from 'react';
import { Check } from 'lucide-react';

const STEPS = ['Search', 'Seats', 'Passengers', 'Pay'];

const Steps = ({ current }: { current: 1 | 2 | 3 | 4 }) => (
    <ol className="flex items-center gap-2 text-xs font-bold" aria-label="Booking steps">
        {STEPS.map((label, i) => {
            const n = i + 1;
            const done = n < current;
            const active = n === current;
            return (
                <li key={label} className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${done ? 'bg-ok text-white' : active ? 'bg-brand text-white' : 'bg-brand-soft text-ink-3'}`}>
                        {done ? <Check size={12} strokeWidth={3} /> : n}
                    </span>
                    <span className={`${active ? 'text-ink' : 'text-ink-3'} hidden sm:inline`}>{label}</span>
                    {n < STEPS.length && <span className="w-6 md:w-10 h-px bg-hair" />}
                </li>
            );
        })}
    </ol>
);

export default Steps;
