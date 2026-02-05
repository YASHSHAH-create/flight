
"use client";
import React, { useState } from 'react';
import { X, Smartphone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-[#0f172a] text-white relative overflow-hidden"
            >
                <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-2 md:py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4 flex-1">
                        <div className="bg-white/10 p-1.5 rounded-lg hidden md:block">
                            <Smartphone size={16} className="text-blue-400" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-3 text-xs md:text-sm">
                            <span className="font-medium opacity-90">
                                Get the full experience on our mobile app!
                            </span>
                            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-white/30" />
                            <span className="text-blue-300 font-medium hidden md:inline">
                                Exclusive deals available
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://play.google.com/store/apps/details?id=in.paymm.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all shadow-sm hover:shadow-blue-500/25 active:scale-95 whitespace-nowrap"
                        >
                            <span>Download App</span>
                            <ArrowRight size={14} />
                        </a>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AppBanner;
