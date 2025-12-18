"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, LogOut, User, Globe, Package, CalendarDays, Settings, Briefcase, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
    const { user, login, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${scrolled
                ? 'bg-white/80 backdrop-blur-xl border-slate-200/60 py-3 shadow-lg shadow-slate-900/5'
                : 'bg-transparent border-transparent py-5'
                }`}
        >
            <nav className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-slate-900 text-white overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                        <span className="font-black italic text-lg md:text-xl">P</span>
                    </div>
                    <span className={`text-xl md:text-2xl font-black tracking-tighter transition-colors ${scrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                        paymm
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className={`hidden lg:flex items-center space-x-1 p-1 rounded-full transition-all duration-300 ${scrolled ? 'bg-slate-100/50 border border-slate-200/50' : 'bg-white/40 backdrop-blur-md border border-white/40 shadow-sm'
                    }`}>
                    {[
                        { name: 'Holiday Packages', href: '#', icon: Package },
                        { name: 'Flight Schedule', href: '#', icon: CalendarDays },
                        { name: 'Account Settings', href: '#', icon: Settings },
                        { name: 'My Bookings', href: '/bookings', icon: Briefcase },
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-white hover:shadow-md ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-700 hover:text-slate-900'
                                }`}
                        >
                            <item.icon size={16} className={`transition-transform duration-300 group-hover:scale-110 ${scrolled ? 'text-slate-400 group-hover:text-slate-600' : 'text-slate-600 group-hover:text-slate-800'}`} strokeWidth={2.5} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center space-x-4">


                    {/* Auth */}
                    {user ? (
                        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                            <div className="flex items-center gap-2 group cursor-pointer">
                                {user.picture ? (
                                    <img
                                        src={user.picture}
                                        alt={user.name}
                                        referrerPolicy="no-referrer"
                                        className="w-9 h-9 rounded-full ring-2 ring-white shadow-md object-cover cursor-pointer"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shadow-sm ring-2 ring-white">
                                        <User size={18} />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-900 leading-none">{user.name}</span>
                                    <span className="text-[10px] text-slate-500 font-medium">Traveler</span>
                                </div>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <a href="#" className={`text-sm font-bold transition-colors ${scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-700 hover:text-slate-900'}`}>
                                Register
                            </a>
                            <button
                                onClick={() => login()}
                                className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-slate-900/20 active:scale-95 hover:-translate-y-0.5"
                            >
                                Sign In
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-2">
                            {user.picture ? (
                                <img
                                    src={user.picture}
                                    alt={user.name}
                                    referrerPolicy="no-referrer"
                                    className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shadow-sm ring-2 ring-white">
                                    <User size={16} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={() => login()}
                            className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold"
                        >
                            Sign In
                        </button>
                    )}
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-900">
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-[80vw] max-w-sm bg-white shadow-2xl z-[120] p-6 flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-xl font-black text-slate-900 tracking-tight">Menu</span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col space-y-2">
                                {[
                                    { name: 'Holiday Packages', href: '#', icon: Package },
                                    { name: 'Flight Schedule', href: '#', icon: CalendarDays },
                                    { name: 'Account Settings', href: '#', icon: Settings },
                                    { name: 'My Bookings', href: '/bookings', icon: Briefcase },
                                ].map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-4 px-4 py-4 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 active:bg-slate-100 transition-colors"
                                    >
                                        <item.icon size={20} className="text-slate-400" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-auto border-t border-slate-100 pt-6">
                                {user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 px-2">
                                            {user.picture ? (
                                                <img
                                                    src={user.picture}
                                                    alt={user.name}
                                                    referrerPolicy="no-referrer"
                                                    className="w-10 h-10 rounded-full ring-2 ring-slate-100 object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                    <User size={20} />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{user.name}</span>
                                                <span className="text-xs text-slate-500">{user.email}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 transition-colors"
                                        >
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            login();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors shadow-lg shadow-slate-900/20"
                                    >
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
