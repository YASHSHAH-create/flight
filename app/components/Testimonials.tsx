"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, User } from 'lucide-react';

const testimonials = [
    {
        id: 1,
        name: "Sarah Jenkins",
        text: "The best travel experience I've ever had. paymm made everything so easy! I found the perfect flight within minutes.",
        role: "Frequent Flyer",
        rating: 5
    },
    {
        id: 2,
        name: "Michael Chen",
        text: "Incredible prices and amazing customer service. Will definitely book again. The platform is so intuitive and fast.",
        role: "Business Traveler",
        rating: 5
    },
    {
        id: 3,
        name: "Emma Wilson",
        text: "Found the perfect family vacation package. The kids loved it! Highly recommend for anyone planning a trip.",
        role: "Family Traveler",
        rating: 4
    }
];

const Testimonials = () => {
    return (
        <section className="py-16 px-4 md:px-8 bg-slate-50 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow-sm mb-4"
                    >
                        <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold mr-2">New</span>
                        <span className="text-slate-600 text-xs font-medium pr-2">Trusted by 10,000+ travelers</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4"
                    >
                        Loved by Travelers
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 max-w-2xl mx-auto text-lg"
                    >
                        Don't just take our word for it. Here's what people are saying about their paymm experience.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15, duration: 0.5 }}
                            className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/80 transition-all duration-300 border border-slate-100 flex flex-col relative group hover:-translate-y-2"
                        >
                            <div className="absolute top-6 right-8 text-slate-100 group-hover:text-slate-200 transition-colors">
                                <Quote size={40} fill="currentColor" strokeWidth={0} />
                            </div>

                            <div className="flex gap-1 mb-6 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < t.rating ? "currentColor" : "none"} className={i < t.rating ? "" : "text-slate-200"} strokeWidth={i < t.rating ? 0 : 2} />
                                ))}
                            </div>

                            <p className="text-slate-600 mb-8 leading-relaxed relative z-10 flex-grow">
                                "{t.text}"
                            </p>

                            <div className="flex items-center gap-4 mt-auto border-t border-slate-50 pt-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 ring-4 ring-slate-50">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 leading-tight">{t.name}</h4>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
