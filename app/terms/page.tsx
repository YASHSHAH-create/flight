import React from 'react';

const TermsPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="border-b border-slate-800 pb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-4">
                        Terms of Use
                    </h1>
                    <p className="text-slate-400">
                        Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
                    <p>
                        Welcome to PayMM. These Terms of Use ("Terms") govern your use of our website, mobile application, and services (collectively, the "Platform"). By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Platform.
                    </p>
                    <p>
                        The Platform is owned and operated by PayMM, having its GST registration number <strong>10AAMCP7167L1Z1</strong>.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">2. Eligibility</h2>
                    <p>
                        You must be at least 18 years old to use our Platform. By using our Platform, you represent and warrant that you meet this age requirement and have the legal capacity to enter into a binding contract.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">3. User Accounts</h2>
                    <p>
                        To access certain features of our Platform, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">4. Booking & Payments</h2>
                    <p>
                        When you make a booking through our Platform, you agree to provide accurate and complete information. You authorize us to charge the applicable fees to your selected payment method. All bookings are subject to availability and the terms and conditions of the respective service providers (e.g., airlines).
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">5. Prohibited Activities</h2>
                    <p>
                        You agree not to use our Platform for any unlawful or prohibited purpose. You shall not:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                        <li>Use the Platform in any way that violates applicable laws or regulations.</li>
                        <li>Interfere with or disrupt the integrity or performance of the Platform.</li>
                        <li>Attempt to gain unauthorized access to the Platform or its related systems.</li>
                        <li>Use any automated means to access the Platform without our permission.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">6. Intellectual Property</h2>
                    <p>
                        All content, trademarks, and data on this Platform, including but not limited to software, text, graphics, logos, and images, are the property of PayMM or its licensors and are protected by intellectual property laws.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">7. Limitation of Liability</h2>
                    <p>
                        To the fullest extent permitted by law, PayMM shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your use of the Platform.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">8. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these Terms at any time. We will provide notice of any material changes by posting the new Terms on the Platform. Your continued use of the Platform after such changes constitutes your acceptance of the new Terms.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">9. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at:
                    </p>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <p><span className="font-semibold text-white">Email:</span> support@paymm.in</p>
                        <p><span className="font-semibold text-white">Phone:</span> +91 9343300271</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TermsPage;
