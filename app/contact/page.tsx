import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-12">
                <header className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                        Get in Touch
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        We are here to help you with your travel needs. Reach out to us for any queries or support.
                    </p>
                </header>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Email Card */}
                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center hover:bg-slate-900/80 transition-colors">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 text-xl mb-4">
                            <FaEnvelope />
                        </div>
                        <h3 className="font-semibold text-white mb-2">Email Us</h3>
                        <p className="text-slate-400 text-sm mb-4">For general inquiries and support</p>
                        <a href="mailto:support@paymm.in" className="text-blue-400 font-medium hover:underline">support@paymm.in</a>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center hover:bg-slate-900/80 transition-colors">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 text-xl mb-4">
                            <FaPhone />
                        </div>
                        <h3 className="font-semibold text-white mb-2">Call Us</h3>
                        <p className="text-slate-400 text-sm mb-4">Mon-Sat, 9am to 6pm</p>
                        <a href="tel:+919343300271" className="text-emerald-400 font-medium hover:underline">+91 9343300271</a>
                    </div>

                    {/* Details Card */}
                    <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center hover:bg-slate-900/80 transition-colors">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 text-xl mb-4">
                            <FaMapMarkerAlt />
                        </div>
                        <h3 className="font-semibold text-white mb-2">Legal Entity</h3>
                        <p className="text-slate-400 text-sm mb-4">Registered for GST</p>
                        <p className="text-purple-400 font-medium">10AAMCP7167L1Z1</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
