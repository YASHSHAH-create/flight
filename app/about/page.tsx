import React from 'react';
import Navbar from "@/app/components/Navbar";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "About Us | Paymm – Learn About Our Flight Booking Services",
    description: "Learn more about Paymm, a leading travel technology platform in India. Our mission is to simplify flight ticket booking with transparent pricing, citable rates, and 24/7 customer support.",
    alternates: {
        canonical: "https://paymm.in/about"
    }
};

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 pt-32 pb-20 px-4 md:px-8">
            <Navbar />
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
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-3">Who We Are</h2>
                            <p className="text-slate-300 leading-relaxed mb-4">
                                PayMM is a cutting-edge travel technology platform dedicated to providing seamless, secure, and efficient booking experiences for travelers across the globe. Born out of the desire to make travel accessible and completely transparent, we have built a robust search engine that aggregates data from hundreds of airlines, allowing you to compare and find the best fares in real-time.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                Our dedicated team of travel experts and technologists work tirelessly to ensure that you have access to exclusive deals, accurate flight data, and a smooth booking interface. Whether you are a frequent corporate flyer or a family planning your annual vacation, Paymm caters to all your travel needs with unparalleled precision and reliability.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-white mb-3">Our Mission & Vision</h2>
                            <p className="text-slate-300 leading-relaxed mb-4">
                                Our mission is simple: To empower travelers with the best tools, transparent pricing, and exceptional support, making travel accessible and hassle-free for everyone. We believe that planning a trip should be just as enjoyable as the journey itself, devoid of hidden charges and confusing booking processes.
                            </p>
                            <p className="text-slate-300 leading-relaxed">
                                Our vision is to become the world’s most customer-centric travel portal, where discovering new destinations and booking affordable flights is just a click away. We are constantly innovating our technology stack to bring you personalized travel recommendations, predictive pricing models, and 24/7 customer support that truly cares about your travel experience.
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

                <section className="mt-16">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Leadership Team</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center">
                            <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center text-3xl font-bold text-slate-400">
                                JD
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Jane Doe</h3>
                            <p className="text-blue-400 mb-3 text-sm">Chief Executive Officer</p>
                            <p className="text-slate-400 text-sm">
                                With over 15 years in the travel tech industry, Jane leads Paymm's vision to simplify flight bookings globally.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center">
                            <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center text-3xl font-bold text-slate-400">
                                JS
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">John Smith</h3>
                            <p className="text-blue-400 mb-3 text-sm">Chief Technology Officer</p>
                            <p className="text-slate-400 text-sm">
                                John spearheads our engineering team, ensuring that Paymm remains lightning fast, secure, and scalable.
                            </p>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 text-center">
                            <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center text-3xl font-bold text-slate-400">
                                AP
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Anjali Patel</h3>
                            <p className="text-blue-400 mb-3 text-sm">Head of Customer Experience</p>
                            <p className="text-slate-400 text-sm">
                                Anjali is dedicated to providing our travelers with exceptional 24/7 support and ensuring every journey is smooth.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-slate-900/50 p-8 rounded-xl border border-slate-800 mt-16">
                    <h2 className="text-2xl font-semibold text-white mb-6 text-center">Company Information</h2>
                    <div className="grid md:grid-cols-2 gap-8 text-center md:text-left">
                        <div>
                            <p className="text-slate-400 mb-1 uppercase text-xs tracking-wider">Registered Entity</p>
                            <p className="text-xl font-medium text-white">PAYMM ADVISORY PRIVATE LIMITED</p>
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
