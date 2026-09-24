'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Copy, MessageCircle, Star } from 'lucide-react';
import { PAYMM_FLIGHT_PRICING } from '@/app/lib/company';

/* ───────────────────────── Offers carousel ───────────────────────── */

type Cat = 'All' | 'Flights' | 'Hotels' | 'Bus' | 'Recharge' | 'Bank offers';

const OFFERS: { cat: Exclude<Cat, 'All'>; title: string; sub: string; code?: string; href: string }[] = [
    { cat: 'Flights', title: `Flat ₹${PAYMM_FLIGHT_PRICING.instantDiscountPerBooking} instant discount`, sub: 'Auto-applied on every domestic flight booking. No code needed.', href: '/flights' },
    { cat: 'Bus', title: '₹0 convenience fee', sub: 'Pay exactly the operator fare on every bus ticket, UPI or wallet.', href: '/bus' },
    { cat: 'Recharge', title: 'Refer & earn 30 coins', sub: 'You and your friend both get 30 PayMM Coins on their first login.', code: 'REFER', href: '/downloads' },
    { cat: 'Hotels', title: 'PayMM Coins on stays', sub: 'Earn coins on every hotel booking; redeem on your next trip.', href: '/hotels/search' },
    { cat: 'Bank offers', title: 'Pay via UPI, cards & wallet', sub: 'PhonePe, Google Pay, Paytm, all major banks. Wallet refunds are instant.', href: '/bus' },
];

export const Offers = () => {
    const [cat, setCat] = useState<Cat>('All');
    const [copied, setCopied] = useState<string | null>(null);
    const list = OFFERS.filter((o) => cat === 'All' || o.cat === cat);
    const copy = (code: string) => { navigator.clipboard?.writeText(code).catch(() => {}); setCopied(code); setTimeout(() => setCopied(null), 1500); };
    return (
        <section className="max-w-[1100px] mx-auto px-4 md:px-6 py-12 md:py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
                <div>
                    <p className="eyebrow mb-2">Offers &amp; deals</p>
                    <h2 className="font-display text-2xl md:text-4xl font-extrabold text-ink tracking-[-0.02em]">Savings that are actually on</h2>
                </div>
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                    {(['All', 'Flights', 'Hotels', 'Bus', 'Recharge', 'Bank offers'] as Cat[]).map((c) => (
                        <button key={c} onClick={() => setCat(c)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${cat === c ? 'bg-brand text-white border-brand' : 'bg-white text-ink-2 border-hair hover:border-brand'}`}>{c}</button>
                    ))}
                </div>
            </div>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2">
                {list.map((o) => (
                    <div key={o.title} className="snap-start shrink-0 w-[280px] md:w-[320px] card p-5 relative border-l-2 border-l-dashed border-l-brand/40">
                        <span className="pill-soft bg-brand-soft text-brand">{o.cat}</span>
                        <h3 className="font-extrabold text-ink mt-3 text-lg leading-tight">{o.title}</h3>
                        <p className="text-sm text-ink-2 mt-1 min-h-[40px]">{o.sub}</p>
                        <div className="flex items-center justify-between mt-4">
                            {o.code ? (
                                <button onClick={() => copy(o.code!)} className="btn-outline text-xs py-2 px-3 font-mono tracking-wider">{copied === o.code ? <><Check size={14} /> Copied</> : <><Copy size={14} /> {o.code}</>}</button>
                            ) : <span className="text-xs font-bold text-ok">Auto-applied</span>}
                            <Link href={o.href} className="btn-ghost text-xs py-2">Book now →</Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

/* ───────────────────────── Testimonials ───────────────────────── */

const TESTIMONIALS = [
    { name: 'Aditi Sharma', city: 'Delhi', text: 'Booking my weekly Delhi–Mumbai flight has never been easier. Paymm compares prices instantly and the ₹200 discount shows up without any code.' },
    { name: 'Vikram Malhotra', city: 'Bengaluru', text: 'As a business traveller between Bengaluru and Delhi, the instant GST invoice and fast loading are exactly what I need.' },
    { name: 'Priya Nair', city: 'Kochi', text: 'Found the cheapest flights for our family trip from Kochi to Goa. Completely transparent — zero hidden fees, and support actually picks up.' },
];

export const HomeTestimonials = () => (
    <section className="max-w-[1100px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <p className="eyebrow mb-2">Loved by travellers</p>
        <h2 className="font-display text-2xl md:text-4xl font-extrabold text-ink tracking-[-0.02em] mb-6">What people say after booking</h2>
        <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto snap-x no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {TESTIMONIALS.map((t, i) => (
                <figure key={t.name} className={`snap-start shrink-0 w-[300px] md:w-auto card p-5 ${i === 1 ? 'bg-brand-soft/70' : ''}`}>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="w-10 h-10 rounded-full bg-brand text-white font-bold flex items-center justify-center">{t.name[0]}</span>
                        <figcaption><span className="block font-extrabold text-ink text-sm">{t.name}</span><span className="text-xs text-ink-2">{t.city}</span></figcaption>
                        <span className="ml-auto flex text-gold">{[0, 1, 2, 3, 4].map((s) => <Star key={s} size={12} fill="currentColor" />)}</span>
                    </div>
                    <blockquote className="text-sm text-ink leading-relaxed">“{t.text}”</blockquote>
                </figure>
            ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-ink-2">
            <span className="pill-soft bg-lav border border-hair">Google Play &amp; App Store</span>
            <span className="pill-soft bg-lav border border-hair">PCI-DSS compliant payments</span>
            <span className="pill-soft bg-lav border border-hair">GST invoices for business travel</span>
        </div>
    </section>
);

/* ───────────────────────── FAQ ───────────────────────── */

const FAQ: Record<string, { q: string; a: string }[]> = {
    Bookings: [
        { q: 'How do I cancel a bus ticket?', a: 'Open the ticket under My bus bookings and tap Cancel ticket. The operator’s cancellation charge (shown on the bus card before you pay) is deducted and the rest is refunded to your original payment method.' },
        { q: 'Can I modify a flight booking?', a: 'Date and route changes go through our support team, who file the change request with the airline and share the fare difference before confirming.' },
        { q: 'Do you charge convenience fees?', a: `Bus tickets have no convenience fee at all. Flights carry a ₹${PAYMM_FLIGHT_PRICING.convenienceFeePerPassenger} per-passenger fee, offset by a flat ₹${PAYMM_FLIGHT_PRICING.instantDiscountPerBooking} instant discount on every booking.` },
    ],
    'Payments & refunds': [
        { q: 'How fast are refunds?', a: 'Wallet payments are refunded to the wallet instantly. UPI, card and net-banking refunds reach the bank in 5–7 working days after the airline or operator processes them.' },
        { q: 'Can I pay with UPI?', a: 'Yes — PhonePe, Google Pay, Paytm and any UPI app, plus debit/credit cards and net banking. Card details are handled by the payment gateway, never stored by Paymm.' },
    ],
    'Wallet & Coins': [
        { q: 'What are PayMM Coins and how do I redeem them?', a: 'Coins are rewards credited after every completed booking or recharge (1 coin = ₹1). They unlock after the journey and can be applied at checkout in the app, up to a cap per booking.' },
        { q: 'Where is my wallet balance?', a: 'Your wallet is shared between the app and the website — sign in with the same mobile number and the balance shows at checkout.' },
    ],
    Recharge: [
        { q: 'Which operators are supported?', a: 'Jio, Airtel, Vi and BSNL prepaid/postpaid plus Tata Play, Dish TV, Airtel Digital TV and other DTH providers, with live plan lists in the app.' },
    ],
};

export const HomeFAQ = () => {
    const tabs = Object.keys(FAQ);
    const [tab, setTab] = useState(tabs[0]);
    const [open, setOpen] = useState<number | null>(0);
    const schema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: tabs.flatMap((t) => FAQ[t]).map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
    return (
        <section id="faq-section" className="max-w-[1100px] mx-auto px-4 md:px-6 py-12 md:py-16">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <p className="eyebrow mb-2">FAQ</p>
            <h2 className="font-display text-2xl md:text-4xl font-extrabold text-ink tracking-[-0.02em] mb-5">Questions, answered</h2>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-4">
                {tabs.map((t) => <button key={t} onClick={() => { setTab(t); setOpen(0); }} className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${tab === t ? 'bg-brand-soft text-brand border-brand' : 'bg-white text-ink-2 border-hair hover:border-brand'}`}>{t}</button>)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {FAQ[tab].map((f, i) => (
                    <div key={f.q} className="card p-4">
                        <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-3 text-left font-bold text-ink">
                            {f.q}<span className={`w-7 h-7 rounded-full bg-brand-soft text-brand flex items-center justify-center shrink-0 transition-transform ${open === i ? 'rotate-45' : ''}`}>+</span>
                        </button>
                        {open === i && <p className="text-sm text-ink-2 mt-3">{f.a}</p>}
                    </div>
                ))}
            </div>
            <a href="https://wa.me/919343300271" target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm mt-4"><MessageCircle size={16} /> Still have questions? Chat on WhatsApp →</a>
        </section>
    );
};

/* ───────────────────────── WhatsApp alerts strip ───────────────────────── */

export const WhatsAppStrip = () => {
    const [phone, setPhone] = useState('');
    const [done, setDone] = useState(false);
    return (
        <section className="max-w-[1100px] mx-auto px-4 md:px-6 py-6 pb-16">
            <div className="card p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 bg-ok-soft/50">
                <div className="flex-1">
                    <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink tracking-tight">Get fare-drop alerts on WhatsApp</h2>
                    <p className="text-sm text-ink-2 mt-1">One message when fares on your routes fall. No spam, unsubscribe anytime.</p>
                </div>
                {done ? <p className="font-bold text-ok">Thanks! Open the Paymm app to pick your routes.</p> : (
                    <form onSubmit={(e) => { e.preventDefault(); if (/^[6-9]\d{9}$/.test(phone)) { window.open(`https://wa.me/919343300271?text=${encodeURIComponent(`Hi Paymm, send me fare drop alerts on ${phone}`)}`, '_blank', 'noopener'); setDone(true); } }} className="flex gap-2">
                        <input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" placeholder="Mobile number" className="w-44 bg-white border border-hair rounded-full px-4 py-3 text-sm font-semibold outline-none focus:border-brand" />
                        <button type="submit" className="btn-primary text-sm">Notify me</button>
                    </form>
                )}
            </div>
            <p className="text-[11px] text-ink-3 mt-2">By tapping Notify me you agree to receive WhatsApp messages from Paymm.</p>
        </section>
    );
};
