import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, MapPinned, ShieldCheck, Ticket, Wallet } from 'lucide-react';
import Navbar from '../components/Navbar';
import BusSearchWidget from '../components/bus/BusSearchWidget';
import { COMPANY, ORG_ID } from '@/app/lib/company';
import { FEATURED_ROUTE_SLUGS, resolveRouteSlug, formatHours, indexableRoutes } from '@/app/lib/bus/routes';
import { POPULAR_BUS_CITIES } from '@/app/lib/bus/cities';

export const metadata: Metadata = {
    title: 'Bus Ticket Booking Online – Book AC, Sleeper & Volvo Buses',
    description: 'Book bus tickets online on Paymm: live seat maps, 1,000s of daily departures across India, no convenience fee, UPI/card/wallet payments and instant m-tickets on WhatsApp.',
    alternates: { canonical: `${COMPANY.url}/bus` },
    openGraph: {
        title: 'Bus Ticket Booking Online | Paymm',
        description: 'Live seat maps, AC/Sleeper/Volvo buses, no convenience fee. Book bus tickets across India on Paymm.',
        url: `${COMPANY.url}/bus`,
        type: 'website',
    },
};

const FAQS = [
    { q: 'Is there a convenience fee on bus bookings?', a: 'No. On Paymm you pay only the operator’s fare shown on the seat map — there is no booking or convenience fee on bus tickets, whether you pay by UPI, card or Paymm wallet.' },
    { q: 'How do I get my ticket after booking?', a: 'Your m-ticket with the PNR is sent instantly on WhatsApp/SMS and email, and it is always available under My bus bookings on paymm.in and in the Paymm app. Show the PNR to the operator at the boarding point.' },
    { q: 'Can I choose my seat?', a: 'Yes. Every bus shows a live seat map with lower/upper decks, ladies seats and per-seat prices. You pick exact seats, then the boarding and dropping points, before paying.' },
    { q: 'How do I cancel a bus ticket and how fast is the refund?', a: 'Open the ticket under My bus bookings and tap Cancel ticket. The operator’s cancellation charge (shown on every bus before you pay) is deducted and the balance is refunded to your original payment method within 5–7 working days. Wallet payments are refunded to the wallet immediately.' },
    { q: 'Which payment methods are accepted?', a: 'UPI (PhonePe, Google Pay, Paytm), debit and credit cards, net banking and Paymm wallet. Payments run on a PCI-DSS compliant gateway; Paymm never stores card details.' },
    { q: 'Do I need an ID to board?', a: 'Some operators verify a government photo ID (Aadhaar, PAN, passport, voter ID or driving licence) at boarding. Where required, Paymm asks for the lead passenger’s ID during booking and marks it on the ticket. Carry the same ID on the journey.' },
];

export default function BusLandingPage() {
    const featured = FEATURED_ROUTE_SLUGS.map(resolveRouteSlug).filter((r): r is NonNullable<typeof r> => !!r);
    const cities = POPULAR_BUS_CITIES;

    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${COMPANY.url}/bus#webpage`,
                url: `${COMPANY.url}/bus`,
                name: 'Bus Ticket Booking Online | Paymm',
                isPartOf: { '@id': `${COMPANY.url}/#website` },
                about: { '@id': ORG_ID },
                inLanguage: 'en-IN',
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: COMPANY.url },
                    { '@type': 'ListItem', position: 2, name: 'Bus tickets', item: `${COMPANY.url}/bus` },
                ],
            },
            {
                '@type': 'FAQPage',
                mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
            },
            {
                '@type': 'ItemList',
                name: 'Popular bus routes in India',
                itemListElement: featured.map((r, i) => ({ '@type': 'ListItem', position: i + 1, name: `${r.from.name} to ${r.to.name} bus`, url: `${COMPANY.url}/bus/${r.slug}` })),
            },
        ],
    };

    return (
        <div className="min-h-screen bg-lav font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <Navbar />

            {/* Hero */}
            <section className="relative overflow-hidden pt-28 md:pt-36 pb-10">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(60% 50% at 50% 0%, rgba(124,92,230,0.16) 0%, rgba(248,247,252,0) 70%)' }} />
                <div className="relative max-w-6xl mx-auto px-4 md:px-6 text-center">
                    <p className="eyebrow mb-3">Bus tickets across India</p>
                    <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-extrabold text-ink tracking-[-0.02em] leading-[1.05] max-w-3xl mx-auto">
                        Book bus tickets with live seat maps — no convenience fee.
                    </h1>
                    <p className="text-ink-2 text-base md:text-lg mt-4 max-w-2xl mx-auto">AC, sleeper and Volvo buses from thousands of daily departures. Pick your exact seat, pay by UPI, card or wallet, and get your m-ticket on WhatsApp.</p>
                    <div className="panel p-3 md:p-5 mt-8 text-left shadow-[0_20px_60px_rgba(79,43,208,0.10)]">
                        <BusSearchWidget />
                    </div>
                    <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs md:text-sm font-semibold text-ink-2">
                        <li className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-ok" /> Secure UPI · card · wallet</li>
                        <li className="flex items-center gap-1.5"><Ticket size={16} className="text-brand" /> Instant m-ticket on WhatsApp</li>
                        <li className="flex items-center gap-1.5"><Wallet size={16} className="text-gold" /> Instant refund to wallet</li>
                        <li className="flex items-center gap-1.5"><BadgeCheck size={16} className="text-accent" /> Support {COMPANY.support.phoneHours}</li>
                    </ul>
                </div>
            </section>

            {/* Featured routes */}
            <section className="max-w-6xl mx-auto px-4 md:px-6 py-10">
                <div className="flex items-end justify-between mb-5">
                    <div>
                        <p className="eyebrow mb-1">Most searched</p>
                        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink tracking-tight">Popular bus routes</h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {featured.map((r) => (
                        <Link key={r.slug} href={`/bus/${r.slug}`} className="card p-4 hover:border-brand/40 hover:-translate-y-0.5 transition-all group">
                            <div className="flex items-center justify-between">
                                <span className="font-extrabold text-ink">{r.from.name} → {r.to.name}</span>
                                <ArrowRight size={16} className="text-ink-3 group-hover:text-brand group-hover:translate-x-0.5 transition-all" />
                            </div>
                            <p className="text-xs text-ink-2 mt-1">{formatHours(r.route.hours)} · ~{r.route.km} km</p>
                            <p className="text-sm font-bold text-brand mt-2">From ₹{r.route.fare[0].toLocaleString('en-IN')}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Why */}
            <section className="max-w-6xl mx-auto px-4 md:px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {[
                        { icon: MapPinned, t: 'Live seat maps', d: 'Real-time availability with lower/upper decks, ladies seats and per-seat fares.' },
                        { icon: Ticket, t: 'Zero convenience fee', d: 'You pay exactly the operator fare on the seat map. Nothing added at checkout.' },
                        { icon: Wallet, t: 'Refunds that actually arrive', d: 'Cancel from your ticket page; wallet refunds are instant, others in 5–7 working days.' },
                        { icon: ShieldCheck, t: 'Bank-grade payments', d: 'UPI, cards and net banking through a PCI-DSS gateway. We never see your card.' },
                    ].map((f) => (
                        <div key={f.t} className="card p-5">
                            <span className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center mb-3"><f.icon size={20} /></span>
                            <h3 className="font-extrabold text-ink mb-1">{f.t}</h3>
                            <p className="text-sm text-ink-2">{f.d}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section className="max-w-6xl mx-auto px-4 md:px-6 py-10">
                <p className="eyebrow mb-1">How it works</p>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink tracking-tight mb-5">Four taps to a confirmed seat</h2>
                <ol className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {['Search your route and date', 'Pick seats plus boarding & dropping points', 'Add passenger details and sign in with OTP', 'Pay by UPI, card or wallet — ticket arrives on WhatsApp'].map((s, i) => (
                        <li key={s} className="card p-5 flex gap-3"><span className="w-8 h-8 rounded-full bg-brand text-white font-black flex items-center justify-center shrink-0">{i + 1}</span><span className="text-sm font-semibold text-ink">{s}</span></li>
                    ))}
                </ol>
            </section>

            {/* Cities */}
            <section className="max-w-6xl mx-auto px-4 md:px-6 py-10">
                <p className="eyebrow mb-1">Buses from</p>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink tracking-tight mb-5">Top bus cities</h2>
                <div className="flex flex-wrap gap-2">
                    {cities.map((c) => {
                        const first = indexableRoutes().find((r) => r.from.code === c.code);
                        return first ? (
                            <Link key={c.code} href={`/bus/${first.slug}`} className="btn-outline text-sm">{c.name}</Link>
                        ) : <span key={c.code} className="btn-outline text-sm opacity-70">{c.name}</span>;
                    })}
                </div>
            </section>

            {/* FAQ */}
            <section className="max-w-4xl mx-auto px-4 md:px-6 py-10 pb-24">
                <p className="eyebrow mb-1">Good to know</p>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink tracking-tight mb-5">Bus booking FAQs</h2>
                <div className="space-y-2">
                    {FAQS.map((f) => (
                        <details key={f.q} className="card p-4 group">
                            <summary className="cursor-pointer font-bold text-ink flex items-center justify-between list-none">{f.q}<span className="text-brand group-open:rotate-45 transition-transform text-xl leading-none">+</span></summary>
                            <p className="text-sm text-ink-2 mt-2">{f.a}</p>
                        </details>
                    ))}
                </div>
            </section>
        </div>
    );
}
