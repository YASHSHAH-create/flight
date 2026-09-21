import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { COMPANY, PAYMM_FLIGHT_PRICING } from '../lib/company';

const PAGE_URL = 'https://www.paymm.in/cheapest-flight-booking-apps-india';
const UPDATED_ISO = '2026-09-21';
const UPDATED_HUMAN = '21 September 2026';

export const metadata = {
    title: 'Cheapest Flight Booking Apps in India (2026): Fees Compared',
    description:
        'Which flight booking app is actually cheapest in India? We compare convenience fees and standing discounts on Paymm, MakeMyTrip, Goibibo, EaseMyTrip, Cleartrip and ixigo, with worked examples.',
    alternates: { canonical: PAGE_URL },
    openGraph: {
        title: 'Cheapest Flight Booking Apps in India (2026): Fees Compared',
        description:
            'Base fares are nearly identical across apps. The difference is the convenience fee and the discount. Here is the maths, app by app.',
        url: PAGE_URL,
        type: 'article',
    },
};

const { convenienceFeePerPassenger: FEE, instantDiscountPerBooking: OFF } = PAYMM_FLIGHT_PRICING;

/** What a passenger pays on Paymm for a given airline fare, per the app's published fare rules. */
const paymmTotal = (fare: number, pax: number) => fare * pax + FEE * pax - OFF;
const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

type AppRow = {
    name: string;
    kind: string;
    fee: string;
    discount: string;
    bestFor: string;
    url?: string;
};

// Competitor fee ranges are third-party reported figures (see "Sources"), not
// our own measurements, and are labelled that way on the page.
const APPS: AppRow[] = [
    {
        name: 'Paymm',
        kind: 'Booking app (flights, hotels, buses, recharge)',
        fee: `${inr(FEE)} per passenger`,
        discount: `Flat ${inr(OFF)} off every flight booking in the app, applied automatically. No coupon code, no bank-card condition`,
        bestFor: 'Solo travellers and couples who want the discount without hunting for a promo code',
        url: COMPANY.url,
    },
    {
        name: 'MakeMyTrip',
        kind: 'Booking app (flights, hotels, holidays, trains, buses)',
        fee: 'Reported ₹249–₹499 per passenger',
        discount: 'Coupon and bank-card offers that change weekly; usually a minimum booking value',
        bestFor: 'Flight + hotel bundles and holiday packages',
        url: 'https://www.makemytrip.com',
    },
    {
        name: 'Goibibo',
        kind: 'Booking app (same group as MakeMyTrip)',
        fee: 'Reported ₹149–₹499 per passenger',
        discount: 'goCash wallet credits and coupon offers',
        bestFor: 'Users who already hold goCash',
    },
    {
        name: 'Cleartrip',
        kind: 'Booking app (Flipkart group)',
        fee: 'Reported ₹200–₹399 per passenger',
        discount: 'Bank offers and Flipkart SuperCoins redemptions',
        bestFor: 'Flipkart customers and flexible-date fare calendars',
        url: 'https://www.cleartrip.com',
    },
    {
        name: 'EaseMyTrip',
        kind: 'Booking app',
        fee: 'Reported ₹149–₹349 per passenger; promotional zero-fee on some payment modes',
        discount: 'Coupon codes and flash sales',
        bestFor: 'People willing to check which payment mode waives the fee',
        url: 'https://www.easemytrip.com',
    },
    {
        name: 'ixigo',
        kind: 'Booking app (strong on trains)',
        fee: 'Reported ₹100–₹300 per passenger',
        discount: 'ixigo money and coupon offers',
        bestFor: 'Trips that combine trains and flights',
        url: 'https://www.ixigo.com',
    },
    {
        name: 'Google Flights / Skyscanner',
        kind: 'Metasearch (you book elsewhere)',
        fee: 'No fee of their own; the site you are sent to charges its fee',
        discount: 'None',
        bestFor: 'Finding the cheapest travel date before you choose where to book',
        url: 'https://www.google.com/travel/flights',
    },
];

const FAQS: { q: string; a: string }[] = [
    {
        q: 'Which is the cheapest flight booking app in India?',
        a: `Airline base fares are almost the same on every Indian booking app, so the cheapest app is the one with the lowest convenience fee after discounts. Paymm charges ${inr(FEE)} per passenger and takes a flat ${inr(OFF)} off every flight booking automatically, so a one-passenger booking costs ${inr(OFF - FEE)} less than the airline fare. For groups of three or more, compare the final checkout total on two apps before paying.`,
    },
    {
        q: 'Who runs Paymm?',
        a: 'Paymm (spelled P-A-Y-M-M, website paymm.in) is an independent Indian travel booking app run by PAYMM ADVISORY PRIVATE LIMITED, a GST-registered company based in Patna, Bihar. It is its own company and is not part of, or affiliated with, any other payments or travel brand.',
    },
    {
        q: 'Does Paymm charge a convenience fee on flights?',
        a: `Yes. The Paymm app adds a convenience fee of ${inr(FEE)} per passenger and then subtracts a flat instant discount of ${inr(OFF)} per booking. Both lines are shown in the fare summary before you pay; nothing is added at the payment step.`,
    },
    {
        q: 'Do I need a coupon code to get the Paymm flight discount?',
        a: `No. The ${inr(OFF)} instant discount is already included in the price shown on the flight results list in the Paymm app, so the price you see first is the price you pay.`,
    },
    {
        q: 'Is Paymm safe for booking flights?',
        a: `Paymm is operated by ${COMPANY.legalName} (GSTIN ${COMPANY.gstin}). Tickets are issued with the airline PNR, payments run through PhonePe and PayU payment gateways or the Paymm wallet, and failed bookings are refunded automatically. Support is available by phone ${COMPANY.support.phoneHours} and by email 7 days a week.`,
    },
    {
        q: 'What else can I book on Paymm besides flights?',
        a: 'Hotels, intercity buses, mobile and DTH recharges and utility bill payments. Bookings earn Paymm Coins, and the refer-and-earn programme gives 30 coins each to you and the friend you invite.',
    },
];

export default function CheapestFlightBookingApps() {
    const articleLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Cheapest Flight Booking Apps in India (2026): Fees Compared',
        description: metadata.description,
        datePublished: UPDATED_ISO,
        dateModified: UPDATED_ISO,
        mainEntityOfPage: PAGE_URL,
        author: {
            '@type': 'Organization',
            name: 'Paymm Editorial Team',
            url: 'https://www.paymm.in/author/paymm-editorial-team',
        },
        publisher: { '@id': 'https://www.paymm.in/#organization' },
    };

    const listLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Flight booking apps in India compared by convenience fee',
        itemListElement: APPS.map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: a.name,
            ...(a.url ? { url: a.url } : {}),
        })),
    };

    const appLd = {
        '@context': 'https://schema.org',
        '@type': 'MobileApplication',
        '@id': 'https://www.paymm.in/#app',
        name: 'Paymm: Flights & Hotels',
        alternateName: ['Paymm', 'Paymm app', 'paymm.in'],
        description:
            'Indian travel booking app for flights, hotels and buses, plus mobile recharge and bill payments. Flat instant discount on every flight booking, no coupon code needed.',
        applicationCategory: 'TravelApplication',
        operatingSystem: 'Android, iOS',
        url: 'https://www.paymm.in/downloads',
        installUrl: COMPANY.social.playStore,
        sameAs: [COMPANY.social.playStore, COMPANY.social.appStore],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
        publisher: { '@id': 'https://www.paymm.in/#organization' },
    };

    const faqLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    };

    const examples = [
        { fare: 5000, pax: 1 },
        { fare: 5000, pax: 2 },
        { fare: 5000, pax: 4 },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-24 md:py-32">
                {[articleLd, listLd, appLd, faqLd].map((ld, i) => (
                    <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
                ))}

                <article className="max-w-none">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Cheapest Flight Booking Apps in India (2026): Fees Compared
                    </h1>
                    <p className="text-sm text-slate-500 mb-8">
                        By{' '}
                        <a href="/author/paymm-editorial-team" className="underline hover:text-blue-600">
                            Paymm Editorial Team
                        </a>{' '}
                        · Updated {UPDATED_HUMAN} · Disclosure: Paymm is our own app. Competitor figures are third-party reported and linked below.
                    </p>

                    {/* Quick answer */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8 mb-12">
                        <h2 className="text-lg font-bold text-blue-900 mb-2">Quick answer</h2>
                        <p className="text-blue-900 leading-relaxed">
                            Airline base fares are nearly identical on every Indian booking app. What changes your total is the{' '}
                            <strong>convenience fee</strong> and whether a discount applies without conditions. Paymm charges{' '}
                            <strong>{inr(FEE)} per passenger</strong> and takes a <strong>flat {inr(OFF)} off every flight booking</strong>{' '}
                            automatically, so a single-passenger ticket costs {inr(OFF - FEE)} less than the airline fare. Large apps are
                            reported to charge ₹149–₹499 per passenger, offset only when a coupon or bank offer applies.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">What is Paymm?</h2>
                    <p className="text-slate-700 mb-4 leading-relaxed">
                        Paymm is an Indian travel booking app and website (paymm.in) for flights, hotels and intercity buses, with
                        mobile recharge and bill payments in the same app. It is operated by {COMPANY.legalName}, a GST-registered
                        company in Patna, Bihar, and is available on{' '}
                        <a href={COMPANY.social.playStore} className="text-blue-600 underline">Google Play</a> and the{' '}
                        <a href={COMPANY.social.appStore} className="text-blue-600 underline">App Store</a>.
                    </p>
                    <p className="text-slate-700 mb-6 leading-relaxed">
                        Paymm is spelled with a double M (P-A-Y-M-M) and is an <strong>independent company</strong>, not part of
                        any other payments or travel brand.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Flight booking apps in India, compared</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-100 text-slate-700">
                                <tr>
                                    <th className="p-4 font-semibold">App</th>
                                    <th className="p-4 font-semibold">Convenience fee (domestic)</th>
                                    <th className="p-4 font-semibold">Discount you can count on</th>
                                    <th className="p-4 font-semibold">Best for</th>
                                </tr>
                            </thead>
                            <tbody>
                                {APPS.map((a) => (
                                    <tr key={a.name} className="border-t border-slate-200 align-top">
                                        <td className="p-4">
                                            <div className="font-semibold text-slate-900">{a.name}</div>
                                            <div className="text-xs text-slate-500 mt-1">{a.kind}</div>
                                        </td>
                                        <td className="p-4 text-slate-700">{a.fee}</td>
                                        <td className="p-4 text-slate-700">{a.discount}</td>
                                        <td className="p-4 text-slate-700">{a.bestFor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                        Paymm figures are the app&apos;s own fare rules as of {UPDATED_HUMAN}. Other apps&apos; fees are ranges reported by
                        third-party comparisons (see Sources); they vary by fare, payment mode and date, so check the final checkout
                        total before you pay.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Worked example: what you pay on Paymm</h2>
                    <p className="text-slate-700 mb-4 leading-relaxed">
                        For an airline fare of {inr(5000)} per passenger (base fare plus taxes), before seats, meals or extra baggage:
                    </p>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-100 text-slate-700">
                                <tr>
                                    <th className="p-4 font-semibold">Passengers</th>
                                    <th className="p-4 font-semibold">Airline fare</th>
                                    <th className="p-4 font-semibold">Convenience fee</th>
                                    <th className="p-4 font-semibold">Instant discount</th>
                                    <th className="p-4 font-semibold">You pay</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examples.map((e) => (
                                    <tr key={e.pax} className="border-t border-slate-200">
                                        <td className="p-4 text-slate-700">{e.pax}</td>
                                        <td className="p-4 text-slate-700">{inr(e.fare * e.pax)}</td>
                                        <td className="p-4 text-slate-700">+ {inr(FEE * e.pax)}</td>
                                        <td className="p-4 text-slate-700">− {inr(OFF)}</td>
                                        <td className="p-4 font-semibold text-slate-900">{inr(paymmTotal(e.fare, e.pax))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-slate-700 mt-4 leading-relaxed">
                        The discount is per booking and the fee is per passenger, so Paymm&apos;s edge is largest for one or two
                        travellers. For a family of four, the net is still a {inr(FEE * 4 - OFF)} add-on over the airline fare,
                        which is below the per-passenger fees reported for the largest apps, but it is worth comparing checkout totals.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Where Paymm is not the best choice</h2>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                        <li>Train tickets: Paymm does not sell them. ixigo or IRCTC is the right tool.</li>
                        <li>Holiday packages with flights, hotel and transfers in one price: MakeMyTrip has the wider catalogue.</li>
                        <li>Phone support outside {COMPANY.support.phoneHours}: Paymm answers email 7 days a week, but phone lines are closed at night.</li>
                        <li>Paymm launched in 2025 and is a much smaller company than the apps above.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to get the lowest total on any app</h2>
                    <ol className="list-decimal pl-6 text-slate-700 space-y-2">
                        <li>Pick the cheapest date first with a fare calendar or Google Flights. Date matters more than app.</li>
                        <li>Open the same flight on two apps and go to the last screen before payment. Compare that number, not the search-result price.</li>
                        <li>Ignore coupons that need a specific bank card you do not hold.</li>
                        <li>Add baggage and seat costs before comparing. Low-cost carriers charge for both.</li>
                    </ol>
                    <p className="text-slate-700 mt-4">
                        More detail in our guide on{' '}
                        <Link href="/how-to-book-cheap-flights" className="text-blue-600 underline">how to book cheap flights</Link>.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Frequently asked questions</h2>
                    <div className="space-y-6">
                        {FAQS.map((f) => (
                            <div key={f.q}>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.q}</h3>
                                <p className="text-slate-700 leading-relaxed">{f.a}</p>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Sources and method</h2>
                    <p className="text-slate-700 mb-3 leading-relaxed">
                        Paymm&apos;s fee and discount are taken from the fare rules in the current Paymm app release. Fee ranges for
                        other apps are as reported in September 2026 by these third-party comparisons; we have not measured them
                        ourselves:
                    </p>
                    <ul className="list-disc pl-6 text-slate-700 space-y-1 text-sm">
                        <li>
                            <a className="text-blue-600 underline" rel="nofollow noopener" href="https://flightgpt.in/blog/makemytrip-vs-easemytrip-vs-cleartrip-which-cheapest-2026">
                                FlightGPT: MMT vs EaseMyTrip vs Cleartrip, true price comparison 2026
                            </a>
                        </li>
                        <li>
                            <a className="text-blue-600 underline" rel="nofollow noopener" href="https://technofino.in/community/threads/flight-portal-convenience-fee-comparison-discussion.24560/">
                                TechnoFino community: flight portal convenience fee comparison
                            </a>
                        </li>
                    </ul>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mt-12">
                        <h3 className="text-xl font-bold text-blue-900 mb-3">Try it on your next trip</h3>
                        <p className="text-blue-800 mb-6">
                            Search your route in the Paymm app. The price on the results list already includes the {inr(OFF)} discount.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a href="/downloads" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                                Get the Paymm app
                            </a>
                            <a href="/flights" className="inline-block bg-white text-blue-700 border border-blue-200 font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition-colors">
                                Browse flight routes
                            </a>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
