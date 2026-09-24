import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Clock, IndianRupee, Route, Bus as BusIcon } from 'lucide-react';
import Navbar from '../../components/Navbar';
import BusSearchWidget from '../../components/bus/BusSearchWidget';
import { COMPANY, ORG_ID } from '@/app/lib/company';
import { ALL_ROUTE_SLUGS, formatHours, resolveRouteSlug, routesForCity } from '@/app/lib/bus/routes';

export const dynamicParams = false;

export function generateStaticParams() {
    return ALL_ROUTE_SLUGS.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const r = resolveRouteSlug(slug);
    if (!r) return {};
    const title = `${r.from.name} to ${r.to.name} Bus Tickets from ₹${r.route.fare[0]} – Book Online`;
    const description = `Book ${r.from.name} to ${r.to.name} bus tickets online on Paymm. ${r.route.buses ? `${r.route.buses}+ daily buses, ` : ''}AC, sleeper and Volvo options, ${formatHours(r.route.hours)} journey, live seat maps and no convenience fee.`;
    return {
        title,
        description,
        alternates: { canonical: `${COMPANY.url}/bus/${r.slug}` },
        robots: r.route.index ? { index: true, follow: true } : { index: false, follow: true },
        openGraph: { title, description, url: `${COMPANY.url}/bus/${r.slug}`, type: 'website' },
    };
}

export default async function BusRoutePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const r = resolveRouteSlug(slug);
    if (!r) notFound();

    const { from, to, route } = r;
    const fareLow = route.fare[0].toLocaleString('en-IN');
    const fareHigh = route.fare[1].toLocaleString('en-IN');
    const overnight = route.hours[0] >= 7;
    const more = routesForCity(r.fromSlug, 10).filter((x) => x.slug !== r.slug).slice(0, 8);
    const reverse = resolveRouteSlug(r.reverseSlug);

    const faqs = [
        { q: `How long does the ${from.name} to ${to.name} bus take?`, a: `Most ${from.name} to ${to.name} buses take ${formatHours(route.hours)} for roughly ${route.km} km, depending on the operator, boarding point and traffic. ${overnight ? 'Overnight departures are the most popular because you arrive early morning.' : 'Day departures are frequent, so you can usually pick a time that suits you.'}` },
        { q: `What is the cheapest ${from.name} to ${to.name} bus fare?`, a: `Fares on this route typically start around ₹${fareLow} for non-AC seaters and go up to about ₹${fareHigh} for AC sleepers and multi-axle Volvos. Live fares are shown on the seat map before you pay, and Paymm adds no convenience fee.` },
        { q: `Which operators run ${from.name} to ${to.name} buses?`, a: `Well-known operators on this corridor include ${route.operators.join(', ')}. Availability changes daily, so search your date to see every bus with live seats.` },
        { q: `Can I cancel a ${from.name} to ${to.name} bus ticket?`, a: 'Yes. Open the ticket under My bus bookings and tap Cancel. Each operator sets its own cancellation charge, which you can read on the bus card before paying. The balance is refunded to your original payment method (wallet refunds are instant).' },
    ];

    const schema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': `${COMPANY.url}/bus/${r.slug}#webpage`,
                url: `${COMPANY.url}/bus/${r.slug}`,
                name: `${from.name} to ${to.name} Bus Tickets | Paymm`,
                isPartOf: { '@id': `${COMPANY.url}/#website` },
                about: { '@id': ORG_ID },
                inLanguage: 'en-IN',
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: COMPANY.url },
                    { '@type': 'ListItem', position: 2, name: 'Bus tickets', item: `${COMPANY.url}/bus` },
                    { '@type': 'ListItem', position: 3, name: `${from.name} to ${to.name}`, item: `${COMPANY.url}/bus/${r.slug}` },
                ],
            },
            {
                '@type': 'BusTrip',
                name: `${from.name} to ${to.name} bus`,
                departureBusStop: { '@type': 'BusStation', name: from.name, address: { '@type': 'PostalAddress', addressLocality: from.name, addressRegion: from.state, addressCountry: 'IN' } },
                arrivalBusStop: { '@type': 'BusStation', name: to.name, address: { '@type': 'PostalAddress', addressLocality: to.name, addressRegion: to.state, addressCountry: 'IN' } },
                provider: { '@id': ORG_ID },
                offers: { '@type': 'AggregateOffer', priceCurrency: 'INR', lowPrice: route.fare[0], highPrice: route.fare[1], url: `${COMPANY.url}/bus/${r.slug}` },
            },
            { '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
        ],
    };

    return (
        <div className="min-h-screen bg-lav font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
            <Navbar />

            <section className="relative overflow-hidden pt-28 md:pt-36 pb-8">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(60% 50% at 50% 0%, rgba(124,92,230,0.16) 0%, rgba(248,247,252,0) 70%)' }} />
                <div className="relative max-w-6xl mx-auto px-4 md:px-6">
                    <nav aria-label="Breadcrumb" className="text-xs text-ink-3 mb-3 flex items-center gap-1">
                        <Link href="/" className="hover:text-brand">Home</Link><span>/</span><Link href="/bus" className="hover:text-brand">Bus tickets</Link><span>/</span><span className="text-ink">{from.name} to {to.name}</span>
                    </nav>
                    <p className="eyebrow mb-2">{from.state} → {to.state}</p>
                    <h1 className="font-display text-[clamp(1.75rem,5vw,3rem)] font-extrabold text-ink tracking-[-0.02em] leading-[1.08] max-w-3xl">
                        {from.name} to {to.name} bus tickets from ₹{fareLow}
                    </h1>
                    <p className="text-ink-2 text-base md:text-lg mt-3 max-w-2xl">{route.buses ? `${route.buses}+ buses a day` : 'Daily buses'} · {formatHours(route.hours)} · ~{route.km} km · AC, sleeper &amp; Volvo · No convenience fee</p>
                    <div className="panel p-3 md:p-5 mt-6 shadow-[0_20px_60px_rgba(79,43,208,0.10)]">
                        <BusSearchWidget initialFrom={from} initialTo={to} />
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 md:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { icon: Route, l: 'Distance', v: `~${route.km} km` },
                    { icon: Clock, l: 'Journey time', v: formatHours(route.hours) },
                    { icon: IndianRupee, l: 'Fare range', v: `₹${fareLow} – ₹${fareHigh}` },
                    { icon: BusIcon, l: 'Daily buses', v: route.buses ? `${route.buses}+` : 'Multiple' },
                ].map((s) => (
                    <div key={s.l} className="card p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-ink-3 flex items-center gap-1"><s.icon size={12} /> {s.l}</p>
                        <p className="text-lg font-extrabold text-ink mt-1">{s.v}</p>
                    </div>
                ))}
            </section>

            <section className="max-w-6xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <article className="lg:col-span-2 space-y-6">
                    <div className="card p-6">
                        <h2 className="font-display text-xl md:text-2xl font-extrabold text-ink tracking-tight mb-3">About the {from.name} to {to.name} bus route</h2>
                        <p className="text-ink-2 leading-relaxed">
                            {route.note || `${from.name} to ${to.name} is a well-served ${overnight ? 'overnight' : 'daytime'} bus corridor of about ${route.km} km, usually covered in ${formatHours(route.hours)}. Operators such as ${route.operators.slice(0, 3).join(', ')} run AC sleepers, Volvo semi-sleepers and seater coaches, with fares from about ₹${fareLow}. On Paymm you see every bus with its live seat map and per-seat price, choose boarding and dropping points, and pay by UPI, card or wallet with no convenience fee.`}
                        </p>
                        {route.note && (
                            <p className="text-ink-2 leading-relaxed mt-3">On Paymm, every {from.name}–{to.name} bus shows its live seat map, per-seat fares and boarding points before you pay, so you can compare operators on one page. There is no convenience fee, and cancellation charges are shown on the bus card up front.</p>
                        )}
                    </div>

                    <div className="card p-6">
                        <h2 className="font-display text-xl font-extrabold text-ink tracking-tight mb-3">Bus types on this route</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {[
                                ['AC Sleeper', `Flat berths, best for the ${overnight ? 'overnight run' : 'longer departures'}. Usually the most booked class.`],
                                ['Volvo / Multi-axle', 'Reclining semi-sleeper seats with the smoothest ride; often the fastest buses.'],
                                ['AC Seater', 'Cheaper and frequent; comfortable for daytime travel.'],
                                ['Non-AC Sleeper / Seater', `Lowest fares, from about ₹${fareLow}.`],
                            ].map(([t, d]) => (
                                <li key={t} className="rounded-xl border border-hair p-3"><span className="block font-bold text-ink">{t}</span><span className="text-ink-2">{d}</span></li>
                            ))}
                        </ul>
                    </div>

                    <div className="card p-6">
                        <h2 className="font-display text-xl font-extrabold text-ink tracking-tight mb-3">Popular operators</h2>
                        <div className="flex flex-wrap gap-2">{route.operators.map((o) => <span key={o} className="pill-soft bg-brand-soft text-brand text-sm py-1.5 px-3">{o}</span>)}</div>
                        <p className="text-xs text-ink-3 mt-3">Operator availability varies by date; the search shows every bus with live seats for your day of travel.</p>
                    </div>

                    <div className="card p-6">
                        <h2 className="font-display text-xl font-extrabold text-ink tracking-tight mb-3">{from.name} to {to.name} bus FAQs</h2>
                        <div className="space-y-2">
                            {faqs.map((f) => (
                                <details key={f.q} className="rounded-xl border border-hair p-4 group">
                                    <summary className="cursor-pointer font-bold text-ink flex items-center justify-between list-none">{f.q}<span className="text-brand group-open:rotate-45 transition-transform text-xl leading-none">+</span></summary>
                                    <p className="text-sm text-ink-2 mt-2">{f.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </article>

                <aside className="space-y-4">
                    {reverse && (
                        <Link href={`/bus/${reverse.slug}`} className="card p-4 flex items-center justify-between hover:border-brand/40 transition-colors">
                            <span className="font-bold text-ink">{to.name} → {from.name} buses</span><ArrowRight size={16} className="text-brand" />
                        </Link>
                    )}
                    {more.length > 0 && (
                        <div className="card p-4">
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-2">More buses from {from.name}</h3>
                            <ul className="divide-y divide-hair">
                                {more.map((m) => (
                                    <li key={m.slug}><Link href={`/bus/${m.slug}`} className="flex items-center justify-between py-2 text-sm font-semibold text-ink hover:text-brand">{from.name} → {m.to.name}<span className="text-xs text-ink-3">from ₹{m.route.fare[0]}</span></Link></li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="card p-4 bg-brand text-white border-transparent">
                        <p className="font-extrabold text-lg leading-tight">Get PayMM Coins on every bus booking</p>
                        <p className="text-sm text-white/80 mt-1">Coins unlock after your journey and can be used on flights, hotels and recharges in the Paymm app.</p>
                        <Link href="/downloads" className="inline-flex mt-3 bg-white text-brand rounded-full px-4 py-2 text-sm font-bold">Download the app</Link>
                    </div>
                </aside>
            </section>
            <div className="h-16" />
        </div>
    );
}
