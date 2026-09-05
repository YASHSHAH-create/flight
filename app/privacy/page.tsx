import React from 'react';
import { Metadata } from 'next';
import { COMPANY, formatAddress } from '@/app/lib/company';

export const metadata: Metadata = {
    title: "Privacy Policy – How Paymm Collects, Uses and Protects Your Data",
    description: "Read the Paymm Privacy Policy to understand how we collect, use, and protect your personal information and flight booking details.",
    alternates: {
        canonical: "https://www.paymm.in/privacy"
    }
};

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="border-b border-slate-800 pb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-400">
                        Last Updated: 6 September 2026
                    </p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">1. Overview</h2>
                    <p>
                        At PayMM ("we," "us," or "our"), we value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you access our website or use our services.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">2. Information We Collect</h2>
                    <p>
                        We may collect the following types of information:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                        <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth, and passport details (for flight bookings).</li>
                        <li><strong>Payment Information:</strong> Credit/debit card details, UPI IDs, or other banking information required to process payments. Note that we do not store sensitive payment credentials directly; they are processed by secure payment gateways.</li>
                        <li><strong>Usage Data:</strong> Information about how you use our Platform, including device information, IP address, and browser type.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">3. How We Use Your Information</h2>
                    <p>
                        We use your information for the following purposes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                        <li>To provide and maintain our services, including processing bookings and payments.</li>
                        <li>To communicate with you regarding your bookings, updates, and customer support.</li>
                        <li>To improve our Platform, services, and user experience.</li>
                        <li>To comply with legal obligations and prevent fraud.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">4. Sharing of Information</h2>
                    <p>
                        We may share your information with:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                        <li><strong>Service Providers:</strong> Airlines, hotels, and other travel providers to fulfill your bookings.</li>
                        <li><strong>Payment Processors:</strong> To facilitate secure payment transactions.</li>
                        <li><strong>Legal Authorities:</strong> If required by law or to protect our rights and safety.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">4A. Cookies, Analytics and Advertising (Google AdSense)</h2>
                    <p>
                        We use cookies and similar technologies to keep you signed in, remember your searches and measure how the site is used. Specifically:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                        <li><strong>Google Analytics and Google Tag Manager</strong> collect anonymised usage data (pages viewed, device type, approximate location) so we can improve the Platform. IP addresses are anonymised.</li>
                        <li><strong>Google AdSense:</strong> Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or other websites. Google&apos;s use of advertising cookies (including the DoubleClick / DART cookie) enables it and its partners to serve ads to you based on your visit to paymm.in and/or other sites on the Internet.</li>
                        <li>You may opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a> or <a href="https://www.aboutads.info/choices/" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>. You can also block cookies in your browser settings; some Platform features may then not work.</li>
                        <li>We do not sell your personal information. Advertising partners only receive pseudonymous identifiers, never your name, phone number or booking details.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">4B. Data Retention</h2>
                    <p>
                        Booking records are retained for 8 years to meet Indian tax and GST record-keeping requirements. Account data is deleted within 30 days of a verified deletion request (see our <a href="/delete-account" className="text-blue-400 hover:underline">account deletion page</a>). Analytics data is retained for 14 months.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">5. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">6. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or delete your personal information held by us. You may also withdraw your consent for certain data processing activities. To exercise these rights, please contact us.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">7. Contact Us</h2>
                    <p>
                        If you have any questions or concerns about this Privacy Policy, please contact our Grievance Officer/Support Team at:
                    </p>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <p><span className="font-semibold text-white">Email:</span> {COMPANY.email}</p>
                        <p><span className="font-semibold text-white">Phone:</span> {COMPANY.phoneDisplay} ({COMPANY.support.phoneHours})</p>
                        <p><span className="font-semibold text-white">Registered Entity:</span> {COMPANY.legalName} (GSTIN {COMPANY.gstin})</p>
                        <p><span className="font-semibold text-white">Registered Office:</span> {formatAddress()}</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPage;
