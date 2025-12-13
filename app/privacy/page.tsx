import React from 'react';

const PrivacyPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="border-b border-slate-800 pb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-slate-400">
                        Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                        <p><span className="font-semibold text-white">Email:</span> support@paymm.in</p>
                        <p><span className="font-semibold text-white">Phone:</span> +91 9343300271</p>
                        <p><span className="font-semibold text-white">GST Registered Entity:</span> PayMM (10AAMCP7167L1Z1)</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPage;
