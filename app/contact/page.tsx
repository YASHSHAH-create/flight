import React from 'react';
import Link from 'next/link';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { Metadata } from 'next';
import { COMPANY, ORG_ID, formatAddress } from '@/app/lib/company';

export const metadata: Metadata = {
    title: "Contact Paymm – Flight Booking Support & Helpline",
    description: `Contact Paymm for booking help, cancellations and refunds. Phone support ${COMPANY.support.phoneHours}, email support 7 days a week. Registered office details and GSTIN included.`,
    alternates: {
        canonical: "https://www.paymm.in/contact"
    },
    openGraph: {
        title: "Contact Paymm",
        description: `Phone ${COMPANY.support.phoneHours} · Email 7 days a week`,
        url: "https://www.paymm.in/contact",
        type: "website",
    },
};

const ContactPage = () => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ContactPage",
                "@id": "https://www.paymm.in/contact#webpage",
                url: "https://www.paymm.in/contact",
                name: "Contact Paymm",
                about: { "@id": ORG_ID },
                publisher: { "@id": ORG_ID },
                dateModified: "2026-09-06",
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.paymm.in" },
                    { "@type": "ListItem", position: 2, name: "Contact", item: "https://www.paymm.in/contact" },
                ],
            },
            {
                "@type": "FAQPage",
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "What are Paymm's customer support hours?",
                        acceptedAnswer: { "@type": "Answer", text: `Phone support is available ${COMPANY.support.phoneHours} on ${COMPANY.phoneDisplay}. ${COMPANY.support.emailHours}` },
                    },
                    {
                        "@type": "Question",
                        name: "How do I cancel a flight booked on Paymm?",
                        acceptedAnswer: { "@type": "Answer", text: "Open My Bookings in the Paymm app or website, select the ticket and tap Cancel. Refunds follow the airline's fare rules and are credited to your original payment method or Paymm wallet within 5–7 working days." },
                    },
                    {
                        "@type": "Question",
                        name: "Where is Paymm registered?",
                        acceptedAnswer: { "@type": "Answer", text: `Paymm is operated by ${COMPANY.legalName}, GSTIN ${COMPANY.gstin}, registered in ${formatAddress()}.` },
                    },
                ],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-4 md:px-8">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                        Contact Paymm
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Booking help, cancellations, refunds or invoices: reach a real person on the channels below. {COMPANY.support.summary}.
                    </p>
                </header>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center hover:bg-slate-900/80 transition-colors">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 text-xl mb-4">
                            <FaEnvelope />
                        </div>
                        <h2 className="font-semibold text-white mb-2 text-base">Email Us</h2>
                        <p className="text-slate-400 text-sm mb-4">{COMPANY.support.emailHours}</p>
                        <a href={`mailto:${COMPANY.email}`} className="text-blue-400 font-medium hover:underline">{COMPANY.email}</a>
                    </div>

                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center hover:bg-slate-900/80 transition-colors">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 text-xl mb-4">
                            <FaPhone />
                        </div>
                        <h2 className="font-semibold text-white mb-2 text-base">Call Us</h2>
                        <p className="text-slate-400 text-sm mb-4">{COMPANY.support.phoneHours}</p>
                        <a href={`tel:${COMPANY.phoneTel}`} className="text-emerald-400 font-medium hover:underline">{COMPANY.phoneDisplay}</a>
                        <a href={`https://wa.me/${COMPANY.phoneTel.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white">
                            <FaWhatsapp className="text-emerald-400" /> Message on WhatsApp
                        </a>
                    </div>

                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center hover:bg-slate-900/80 transition-colors">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 text-xl mb-4">
                            <FaMapMarkerAlt />
                        </div>
                        <h2 className="font-semibold text-white mb-2 text-base">Registered Office</h2>
                        <p className="text-slate-300 text-sm mb-1 px-2">{COMPANY.legalName}</p>
                        <p className="text-slate-400 text-sm mb-2 px-2">{formatAddress()}</p>
                        <p className="text-purple-400 font-medium text-sm">GSTIN: {COMPANY.gstin}</p>
                    </div>
                </div>

                <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
                    <h2 className="text-xl font-bold text-white">Before you call: quick answers</h2>
                    <dl className="space-y-4 text-sm">
                        <div>
                            <dt className="font-semibold text-slate-200">Need to cancel or change a ticket?</dt>
                            <dd className="text-slate-400 mt-1">Go to <Link href="/bookings" className="text-blue-400 hover:underline">My Bookings</Link>, open the ticket and choose Cancel or Reschedule. Airline fare rules apply and are shown before you confirm. Refund timelines are in our <Link href="/refund" className="text-blue-400 hover:underline">refund policy</Link>.</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-200">Want a GST invoice?</dt>
                            <dd className="text-slate-400 mt-1">Enter your company GSTIN on the traveller details screen before payment. The invoice is emailed with your ticket and is also available under My Bookings.</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-200">Haven&apos;t received your ticket?</dt>
                            <dd className="text-slate-400 mt-1">Tickets are sent by email and WhatsApp within minutes of payment. Check spam, then email us with your booking reference and we will resend it.</dd>
                        </div>
                        <div>
                            <dt className="font-semibold text-slate-200">Grievance officer</dt>
                            <dd className="text-slate-400 mt-1">For complaints not resolved by support within 7 days, write to {COMPANY.email} with the subject line &quot;Grievance&quot; and your booking reference.</dd>
                        </div>
                    </dl>
                </section>

                <p className="text-center text-xs text-slate-500">
                    Follow Paymm on <a href={COMPANY.social.instagram} className="hover:text-slate-300 underline" target="_blank" rel="noopener noreferrer">Instagram</a>, <a href={COMPANY.social.linkedin} className="hover:text-slate-300 underline" target="_blank" rel="noopener noreferrer">LinkedIn</a> and <a href={COMPANY.social.x} className="hover:text-slate-300 underline" target="_blank" rel="noopener noreferrer">X ({COMPANY.social.xHandle})</a>.
                </p>
            </div>
        </div>
    );
};

export default ContactPage;
