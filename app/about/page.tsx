import React from 'react';
import Link from 'next/link';
import Navbar from "@/app/components/Navbar";
import { Metadata } from 'next';
import { COMPANY, ORG_ID, formatAddress, SITE_LAST_UPDATED_HUMAN } from '@/app/lib/company';
import { AUTHORS } from '@/app/lib/authors';

export const metadata: Metadata = {
    title: "About Paymm – Who We Are, Our Team & Company Details",
    description: "Paymm is an Indian online travel agency run by PAYMM ADVISORY PRIVATE LIMITED. Meet the founder, see our registered company details, and learn how we source airfares.",
    alternates: {
        canonical: "https://www.paymm.in/about"
    },
    openGraph: {
        title: "About Paymm",
        description: "Who runs Paymm, how we source fares, and our registered company details.",
        url: "https://www.paymm.in/about",
        type: "website",
    },
};

const AboutPage = () => {
    const founder = AUTHORS["yash-shah"];
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "AboutPage",
                "@id": "https://www.paymm.in/about#webpage",
                url: "https://www.paymm.in/about",
                name: "About Paymm",
                about: { "@id": ORG_ID },
                publisher: { "@id": ORG_ID },
                dateModified: "2026-09-06",
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.paymm.in" },
                    { "@type": "ListItem", position: 2, name: "About", item: "https://www.paymm.in/about" },
                ],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-20 px-4 md:px-8">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="border-b border-slate-800 pb-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400 bg-clip-text text-transparent mb-6">
                        About Paymm
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                        Paymm is an Indian online travel agency that lets you compare and book flights, hotels and bus tickets from one app. It is built and operated by {COMPANY.legalName}.
                    </p>
                    <p className="text-xs text-slate-500 mt-4">Last updated: {SITE_LAST_UPDATED_HUMAN}</p>
                </header>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-3">What Paymm is</h2>
                            <p className="text-slate-300 leading-relaxed mb-4">
                                Paymm is a licensed travel booking platform registered in India (GSTIN {COMPANY.gstin}). We connect to airline inventory through a Global Distribution System (GDS) and directly to low-cost carriers such as IndiGo, Air India Express, Akasa Air and SpiceJet, so the fares you see are live seat availability, not cached estimates.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                Alongside flights, the Paymm app offers hotel bookings, inter-city bus tickets, mobile recharges and bill payments, and a PayMM Coins loyalty programme that rewards repeat bookings.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-3">How we make money</h2>
                            <p className="text-slate-300 leading-relaxed mb-4">
                                We earn a small commission or convenience fee on each booking. The total you pay is shown before you confirm; there are no hidden charges added at payment. Refunds follow the airline&apos;s fare rules, which we display on every fare before booking. See our <Link href="/refund" className="text-blue-400 hover:underline">refund policy</Link>.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-3">How our content is written</h2>
                            <p className="text-slate-300 leading-relaxed">
                                Route pages and blog guides are researched by the <Link href="/author/paymm-editorial-team" className="text-blue-400 hover:underline">Paymm Editorial Team</Link> using airline timetables, airport operator websites and official tourism sources. Indicative fares on route pages are derived from distance and seasonal demand and are clearly labelled as estimates; live prices are always shown in the search widget.
                            </p>
                        </section>
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-6">Why book with Paymm?</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="bg-blue-500/20 text-blue-400 p-2 rounded-lg mr-4 text-xl">✈️</span>
                                <div>
                                    <h4 className="font-semibold text-slate-200">Live airline inventory</h4>
                                    <p className="text-sm text-slate-400">Fares come straight from airline systems, so the price you see is the price you pay.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-purple-500/20 text-purple-400 p-2 rounded-lg mr-4 text-xl">🧾</span>
                                <div>
                                    <h4 className="font-semibold text-slate-200">GST invoices for business travel</h4>
                                    <p className="text-sm text-slate-400">Add your company GSTIN at checkout and receive a compliant invoice with every ticket.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg mr-4 text-xl">🛡️</span>
                                <div>
                                    <h4 className="font-semibold text-slate-200">Real people on support</h4>
                                    <p className="text-sm text-slate-400">{COMPANY.support.summary}. WhatsApp and email confirmations for every booking.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <section className="mt-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Who runs Paymm</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                            <div className="w-20 h-20 bg-blue-500/20 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-blue-300">
                                YS
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">
                                <Link href={`/author/${founder.slug}`} className="hover:text-blue-400">{founder.name}</Link>
                            </h3>
                            <p className="text-blue-400 mb-3 text-sm">{founder.role}</p>
                            <p className="text-slate-400 text-sm leading-relaxed">{founder.bio}</p>
                            <a href={COMPANY.social.linkedin} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-xs text-slate-300 hover:text-white underline">
                                Paymm on LinkedIn
                            </a>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                            <div className="w-20 h-20 bg-purple-500/20 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-purple-300">
                                PE
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">
                                <Link href="/author/paymm-editorial-team" className="hover:text-blue-400">Paymm Editorial Team</Link>
                            </h3>
                            <p className="text-blue-400 mb-3 text-sm">{AUTHORS["paymm-editorial-team"].role}</p>
                            <p className="text-slate-400 text-sm leading-relaxed">{AUTHORS["paymm-editorial-team"].bio}</p>
                        </div>
                    </div>
                </section>

                <section className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 mt-16">
                    <h2 className="text-2xl font-semibold text-white mb-6 text-center">Company Information</h2>
                    <div className="grid md:grid-cols-2 gap-8 text-center md:text-left">
                        <div>
                            <p className="text-slate-400 mb-1 uppercase text-xs tracking-wider">Registered Entity</p>
                            <p className="text-xl font-medium text-white">{COMPANY.legalName}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 mb-1 uppercase text-xs tracking-wider">GST Registration</p>
                            <p className="text-xl font-medium text-white">{COMPANY.gstin}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 mb-1 uppercase text-xs tracking-wider">Registered Office</p>
                            <p className="text-xl font-medium text-white">{formatAddress()}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 mb-1 uppercase text-xs tracking-wider">Support Hours</p>
                            <p className="text-xl font-medium text-white">{COMPANY.support.phoneHours}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 mb-1 uppercase text-xs tracking-wider">Contact Email</p>
                            <p className="text-xl font-medium text-white">{COMPANY.email}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 mb-1 uppercase text-xs tracking-wider">Contact Phone</p>
                            <p className="text-xl font-medium text-white">{COMPANY.phoneDisplay}</p>
                        </div>
                    </div>
                    <p className="text-center text-sm text-slate-500 mt-8">
                        Questions? Visit our <Link href="/contact" className="text-blue-400 hover:underline">contact page</Link> or download the app from <a href={COMPANY.social.playStore} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Play</a> and the <a href={COMPANY.social.appStore} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">App Store</a>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
