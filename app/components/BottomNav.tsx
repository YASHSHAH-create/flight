"use client";
import React, { useState, useEffect } from 'react';
import { Home, Search, Calendar, User, SlidersHorizontal, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavProps {
    onFilterClick?: () => void;
    onMapClick?: () => void;
}

const BottomNav = ({ onFilterClick, onMapClick }: BottomNavProps) => {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState('home');

    useEffect(() => {
        if (pathname.includes('/search') || pathname.includes('/hotels')) {
            setActiveTab('search');
        } else if (pathname.includes('/trips')) {
            setActiveTab('trips');
        } else if (pathname.includes('/profile')) {
            setActiveTab('profile');
        } else {
            setActiveTab('home');
        }
    }, [pathname]);

    return (
        <div className="md:hidden fixed bottom-6 left-0 w-full z-50 px-4 pointer-events-none">
            {/* Floating Dynamic Dock */}
            <motion.div
                layout
                className="pointer-events-auto bg-white/90 backdrop-blur-3xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-[2rem] px-2 py-2 flex items-center justify-between mx-auto max-w-[340px] relative overflow-hidden ring-1 ring-black/5"
            >
                {/* Background Glass Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none" />

                {/* Home */}
                <Link href="/" onClick={() => setActiveTab('home')}>
                    <div className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center relative ${activeTab === 'home' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
                        <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} className={`transition-colors ${activeTab === 'home' ? 'text-black' : 'text-slate-400'}`} />
                        {activeTab === 'home' && <motion.div layoutId="nav-dot" className="absolute -bottom-1 w-1 h-1 bg-black rounded-full" />}
                    </div>
                </Link>

                {/* Dynamic Center Action */}
                <div className="flex-1 flex justify-center px-2">
                    <AnimatePresence mode="wait">
                        {onFilterClick ? (
                            <motion.button
                                key="filter-action"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={onFilterClick}
                                whileTap={{ scale: 0.95 }}
                                className="bg-black text-white px-5 py-2.5 rounded-full flex items-center space-x-2 shadow-lg shadow-black/20 hover:shadow-black/30 transition-all font-bold text-sm mx-1"
                            >
                                <SlidersHorizontal size={16} strokeWidth={2.5} />
                                <span>Filter</span>
                            </motion.button>
                        ) : (
                            <motion.div
                                key="search-action"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                            >
                                <Link href="/search" onClick={() => setActiveTab('search')}>
                                    <div className={`p-3 px-6 bg-black rounded-full text-white shadow-lg shadow-black/20 flex items-center justify-center ${activeTab === 'search' ? 'ring-2 ring-black ring-offset-2' : ''}`}>
                                        <Search size={22} strokeWidth={3} />
                                    </div>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Map Toggle or Trips */}
                {onMapClick ? (
                    <button onClick={onMapClick}>
                        <div className="p-3 rounded-full transition-all duration-300 flex items-center justify-center relative hover:bg-slate-50">
                            <Map size={22} strokeWidth={2} className="text-slate-400 hover:text-black transition-colors" />
                        </div>
                    </button>
                ) : (
                    <Link href="/trips" onClick={() => setActiveTab('trips')}>
                        <div className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center relative ${activeTab === 'trips' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
                            <Calendar size={22} strokeWidth={activeTab === 'trips' ? 2.5 : 2} className={`transition-colors ${activeTab === 'trips' ? 'text-black' : 'text-slate-400'}`} />
                            {activeTab === 'trips' && <motion.div layoutId="nav-dot" className="absolute -bottom-1 w-1 h-1 bg-black rounded-full" />}
                        </div>
                    </Link>
                )}

                {/* Profile */}
                <Link href="/profile" onClick={() => setActiveTab('profile')}>
                    <div className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center relative ${activeTab === 'profile' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}>
                        <User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 2} className={`transition-colors ${activeTab === 'profile' ? 'text-black' : 'text-slate-400'}`} />
                        {activeTab === 'profile' && <motion.div layoutId="nav-dot" className="absolute -bottom-1 w-1 h-1 bg-black rounded-full" />}
                    </div>
                </Link>

            </motion.div>
        </div>
    );
};

export default BottomNav;
