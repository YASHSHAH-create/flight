import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { COMPANY, ORG_ID, PAYMM_FLIGHT_PRICING, formatAddress } from '../lib/company';

const PAGE_URL = 'https://www.paymm.in/paymm-vs-paytm';
const UPDATED_ISO = '2026-10-09';
const UPDATED_HUMAN = '9 October 2026';

export const metadata: Metadata = {
    title: 'Paymm vs Paytm: Is Paymm the Same as Paytm? (No. Here Is the Difference)',
    description:
        'Paymm (double M, paymm.in) is an independent travel booking app from Patna, Bihar. Paytm is a payments company from Noida. Who owns each, what each does, how to tell them apart and how to verify you are on the right app.',
    alternates: { canonical: PAGE_URL },
    openGraph: {
        title: 'Paymm vs Paytm: not the same company',
        description: 'Paymm is a travel booking app from Patna. Paytm is a payments company from Noida. The names look alike; the companies are unrelated.',
        url: PAGE_URL,
        type: 'article',
    },
};

const { convenienceFeePerPassenger: FEE, instantDiscountPerBooking: OFF } = PAYMM_FLIGHT_PRICING;

const ROWS: { label: string; paymm: string; paytm: string }[] = [
    { label: 'Spelling', paymm: 'P-A-Y-M-M (double M)', paytm: 'P-A-Y-T-M' },
    { label: 'Website', paymm: 'paymm.in', paytm: 'paytm.com' },
    { label: 'Company', paymm: COMPANY.legalName, paytm: 'One97 Communications Limited' },
    { label: 'Head office', paymm: 'Patna, Bihar', paytm: 'Noida, Uttar Pradesh' },
    { label: 'Started', paymm: '2025 (GST registered 14 October 2025)', paytm: '2010' },
    { label: 'Main business', paymm: 'Flight, hotel and bus booking, with mobile recharge and bill payments', paytm: 'UPI payments, wallet, merchant payments and financial services, with travel as one of many categories' },
    { label: 'Android package', paymm: 'in.paymm.app', paytm: 'net.one97.paytm' },
    { label: 'Flight pricing', paymm: `₹${FEE} convenience fee per passenger, flat ₹${OFF} instant discount per booking, no coupon`, paytm: 'Own fee and coupon structure; see paytm.com' },
    { label: 'Listed on a stock exchange', paymm: 'No (private company)', paytm: 'Yes (NSE/BSE: PAYTM)' },
    { label: 'Relationship', paymm: 'None. Not a subsidiary, partner, reseller or brand of Paytm', paytm: 'None with Paymm' },
];

const FAQS: { q: string; a: string }[] = [
    { q: 'Is Paymm the same as Paytm?', a: `No. ${COMPANY.notPaytm}` },
    { q: 'Is Paymm owned by Paytm or One97 Communications?', a: `No. Paymm is owned and operated by ${COMPANY.legalName}, a private company registered in Patna, Bihar (GSTIN ${COMPANY.gstin}). It has no ownership, partnership or licensing relationship with Paytm or One97 Communications.` },
    { q: 'Why does Google show Paytm when I search for Paymm?', a: 'Because the two names differ by one letter, search engines often treat "Paymm" as a misspelling of the much larger brand. Search for "paymm.in" or "Paymm flights" to get Paymm results, or open paymm.in directly.' },
    { q: 'How do I know I am on the real Paymm app?', a: 'The Android package name is in.paymm.app and the publisher shown on Google Play and the App Store is PAYMM ADVISORY PRIVATE LIMITED. The website is paymm.in. Paymm never asks for your UPI PIN, card PIN or OTP over the phone.' },
    { q: 'Can I pay on Paymm using Paytm UPI?', a: 'Yes. Paymm accepts UPI from any app, including Paytm, Google Pay and PhonePe, plus cards, net banking and the Paymm wallet. Payment processing is handled by PhonePe and PayU gateways. Accepting Paytm UPI does not make Paymm part of Paytm.' },
    { q: 'What does Paymm do that Paytm does not?', a: `Paymm is a travel-first app: flights, hotels and intercity buses, with recharge and bills alongside. On flights it applies a flat ₹${OFF} instant discount on every booking automatically, against a ₹${FEE} per-passenger convenience fee, so a solo traveller pays ₹${OFF - FEE} less than the airline fare. Paymm does not offer UPI transfers, a payments bank, loans or stock trading.` },
];

export default function PaymmVsPaytm() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Article',
                '@id': `${PAGE_URL}#article`,
                headline: 'Paymm vs Paytm: is Paymm the same as Paytm?',
                description: metadata.description,
                datePublished: UPDATED_ISO,
                dateModified: UPDATED_ISO,
                mainEntityOfPage: PAGE_URL,
                about: [{ '@id': ORG_ID }, { '@type': 'Organization', name: 'Paytm', url: 'https://paytm.com' }],
                author: { '@type': 'Organization', name: 'Paymm Editorial Team', url: 'https://www.paymm.in/author/paymm-editorial-team' },
                publisher: { '@id': ORG_ID },
            },
            {
                '@type': 'FAQPage',
                mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.paymm.in' },
                    { '@type': 'ListItem', position: 2, name: 'Paymm vs Paytm', item: PAGE_URL },
                ],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-24 md:py-32">
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <article>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Paymm vs Paytm: is Paymm the same as Paytm?
                    </h1>
                    <p className="text-sm text-slate-500 mb-8">
                        By <a href="/author/paymm-editorial-team" className="underline hover:text-blue-600">Paymm Editorial Team</a> · Updated {UPDATED_HUMAN}
                    </p>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8 mb-12">
                        <h2 className="text-lg font-bold text-blue-900 mb-2">Short answer</h2>
                        <p className="text-blue-900 leading-relaxed">
                            <strong>No.</strong> {COMPANY.notPaytm} The two names differ by a single letter, which is why search
                            engines and AI assistants sometimes merge them. This page exists to keep the record straight.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Side by side</h2>
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-100 text-slate-700">
                                <tr>
                                    <th className="p-4 font-semibold w-40"></th>
                                    <th className="p-4 font-semibold">Paymm</th>
                                    <th className="p-4 font-semibold">Paytm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ROWS.map((r) => (
                                    <tr key={r.label} className="border-t border-slate-200 align-top">
                                        <td className="p-4 font-semibold text-slate-900">{r.label}</td>
                                        <td className="p-4 text-slate-700">{r.paymm}</td>
                                        <td className="p-4 text-slate-700">{r.paytm}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">
                        Paytm facts are public information from its own website and stock-exchange filings, as of {UPDATED_HUMAN}. Paytm is a trademark of One97 Communications Limited; it is named here only to explain the difference.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Who Paymm is</h2>
                    <p className="text-slate-700 mb-4 leading-relaxed">
                        Paymm is a travel booking app and website built by {COMPANY.legalName}, registered at {formatAddress()}. It
                        compares live airline inventory for domestic and international flights, books hotels and intercity buses, and
                        handles prepaid, postpaid, DTH and utility payments in the same app. Bookings earn Paymm Coins. Company details,
                        directors and team are on the <Link href="/about" className="text-blue-600 underline">About page</Link>.
                    </p>
                    <p className="text-slate-700 mb-4 leading-relaxed">
                        Independent records of Paymm: the{' '}
                        <a href={COMPANY.profiles.trustpilot} rel="noopener" className="text-blue-600 underline">Trustpilot profile for paymm.in</a>, the{' '}
                        <a href={COMPANY.profiles.tracxn} rel="noopener" className="text-blue-600 underline">Tracxn company profile</a>, and the{' '}
                        <a href={COMPANY.social.playStore} rel="noopener" className="text-blue-600 underline">Google Play</a> and{' '}
                        <a href={COMPANY.social.appStore} rel="noopener" className="text-blue-600 underline">App Store</a> listings, both published under the company name.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How to make sure you are on Paymm</h2>
                    <ul className="list-disc pl-6 text-slate-700 space-y-2">
                        <li>The address bar reads <strong>paymm.in</strong> (www.paymm.in). Nothing else.</li>
                        <li>On Google Play the developer is <strong>{COMPANY.legalName}</strong> and the package is <strong>in.paymm.app</strong>.</li>
                        <li>Support email ends in <strong>@paymm.in</strong>; the phone number is {COMPANY.phoneDisplay}.</li>
                        <li>Paymm never asks for a UPI PIN, card PIN or OTP on a call or chat.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">Frequently asked questions</h2>
                    <div className="space-y-6">
                        {FAQS.map((f) => (
                            <div key={f.q}>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.q}</h3>
                                <p className="text-slate-700 leading-relaxed">{f.a}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mt-12">
                        <h3 className="text-xl font-bold text-blue-900 mb-3">Compare what you actually pay</h3>
                        <p className="text-blue-800 mb-6">
                            Our fee-by-fee comparison of Indian flight booking apps, including Paymm, is on one page.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/cheapest-flight-booking-apps-india" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                                Best flight booking apps compared
                            </Link>
                            <Link href="/downloads" className="inline-block bg-white text-blue-700 border border-blue-200 font-semibold px-6 py-3 rounded-lg hover:bg-blue-100 transition-colors">
                                Get the Paymm app
                            </Link>
                        </div>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
}
