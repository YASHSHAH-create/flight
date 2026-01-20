"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "Why is flight ticket booking the cheapest on Paymm?",
        answer: "Paymm directly searches multiple airline websites for the cheapest fares. Many airlines sell their cheapest flight tickets on Paymm. Additionally, with its exclusive offers and deals, including several bank and partner offers, Paymm serves as the best and cheap platform to book cheap flights online."
    },
    {
        question: "How do I book cheap flight tickets?",
        answer: "Here's how you can book cheap flight tickets: \n\n• Book your flights from Paymm in advance (2 to 3 weeks prior to your journey) to get the cheapest deals. New users also get Flat 12% off with code 'NEW'\n• Be flexible, and consider flying during off-peak hours to get cheaper flight tickets.\n• Use Paymm's fare alerts feature, it sends you notifications when the air ticket price on your route gets cheap.\n• Try taking a stopover flight if you have the time, these flights are frequently less expensive.\n• Weekend travel is best avoided because airfares are typically higher during this time."
    },
    {
        question: "What are the benefits of flight booking with Paymm?",
        answer: "Cheap fares, simple flight booking, live flight status tracking, exclusive flight ticket offers, flexible date options, price lock, travel insurance, automatic web-checkin, 24*7 customer care support and quick refunds are all advantages of booking flights with Paymm."
    },
    {
        question: "Can I modify or cancel my booking?",
        answer: "Yes, you can modify or cancel your flight with Assured and Assured Flex fares. Assured offers free cancellations on new bookings, while Assured Flex provides free cancellations or one-time free rescheduling, including date, airline, and route changes."
    }
];

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleIndex = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-16 px-4 md:px-16 w-full max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-slate-900">Frequently Asked Questions</h2>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-4 md:p-8">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`border-b border-slate-100 last:border-0 ${index === 0 ? 'pb-6' : index === faqs.length - 1 ? 'pt-6' : 'py-6'}`}
                    >
                        <button
                            onClick={() => toggleIndex(index)}
                            className="flex justify-between items-start w-full text-left focus:outline-none group"
                        >
                            <span className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors pr-8">
                                {faq.question}
                            </span>
                            <span className="text-slate-400 group-hover:text-slate-900 transition-colors mt-1 shrink-0">
                                {activeIndex === index ? (
                                    <ChevronUp size={20} />
                                ) : (
                                    <ChevronDown size={20} />
                                )}
                            </span>
                        </button>

                        <AnimatePresence>
                            {activeIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="pt-4 text-slate-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}

                <div className="text-center mt-12">
                    <a href="#" className="text-orange-500 font-bold hover:underline">View More</a>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
