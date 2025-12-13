import React from 'react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="border-b border-slate-800 pb-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400 bg-clip-text text-transparent mb-6">
                        About PayMM
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                        Simplifying travel, one booking at a time.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-3">Who We Are</h2>
                            <p className="text-slate-300 leading-relaxed">
                                PayMM is a cutting-edge travel technology platform dedicated to providing seamless, secure, and efficient booking experiences for travelers. We believe that planning a trip should be as enjoyable as the journey itself.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-3">Our Mission</h2>
                            <p className="text-slate-300 leading-relaxed">
                                To empower travelers with the best tools, transparent pricing, and exceptional support, making travel accessible and hassle-free for everyone.
                            </p>
                        </section>
                    </div>

                    {/* Decorative or abstract representation if no image is available, 
                 or a placeholder for an eventual image */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-6">Why Choose PayMM?</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="bg-blue-500/20 text-blue-400 p-2 rounded-lg mr-4 text-xl">🚀</span>
                                <div>
                                    <h4 className="font-semibold text-slate-200">Fast & Secure</h4>
                                    <p className="text-sm text-slate-400">Lightning fast bookings with top-tier security standards.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-purple-500/20 text-purple-400 p-2 rounded-lg mr-4 text-xl">💎</span>
                                <div>
                                    <h4 className="font-semibold text-slate-200">Best Deals</h4>
                                    <p className="text-sm text-slate-400">Curated offers and competitive pricing on flights.</p>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg mr-4 text-xl">🛡️</span>
                                <div>
                                    <h4 className="font-semibold text-slate-200">Reliable Support</h4>
                                    <p className="text-sm text-slate-400">Dedicated support to assist you 24/7.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <section className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 mt-12">
                    <h2 className="text-2xl font-semibold text-white mb-6 text-center">Company Information</h2>
                    <div className="grid md:grid-cols-2 gap-8 text-center md:text-left">
                        <div>
                            <p className="text-slate-400 mb-1 uppercase text-xs tracking-wider">Registered Entity</p>
                            <p className="text-xl font-medium text-white">paymm</p>
                        </div>
                        <div>
                            <p className="text-slate-400 mb-1 uppercase text-xs tracking-wider">GST Registration</p>
                            <p className="text-xl font-medium text-white">10AAMCP7167L1Z1</p>
                        </div>
                        <div>
                            <p className="text-slate-400 mb-1 uppercase text-xs tracking-wider">Contact Email</p>
                            <p className="text-xl font-medium text-white">support@paymm.in</p>
                        </div>
                        <div>
                            <p className="text-slate-400 mb-1 uppercase text-xs tracking-wider">Contact Phone</p>
                            <p className="text-xl font-medium text-white">+91 9343300271</p>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default AboutPage;
