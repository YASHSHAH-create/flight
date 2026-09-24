"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, LogOut, User, X, Plane, Hotel, Bus, Smartphone, Package, BookOpen, Briefcase, LifeBuoy, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGooglePlay, FaApple } from 'react-icons/fa6';
import { useAuth } from '@/context/AuthContext';
import { useSession } from '@/context/SessionContext';
import { COMPANY } from '@/app/lib/company';

const SERVICES = [
    { name: 'Flights', href: '/flights', icon: Plane, tint: 'bg-brand-soft text-brand' },
    { name: 'Hotels', href: '/hotels/search', icon: Hotel, tint: 'bg-[#FFE9E3] text-[#C2410C]' },
    { name: 'Buses', href: '/bus', icon: Bus, tint: 'bg-[#E0F5F1] text-[#0E7C66]' },
    { name: 'Recharge & Bills', href: '/downloads', icon: Smartphone, tint: 'bg-gold-soft text-gold' },
    { name: 'Packages', href: '/packages', icon: Package, tint: 'bg-[#E3F0FF] text-[#1D4ED8]' },
    { name: 'Blog', href: '/blog', icon: BookOpen, tint: 'bg-ok-soft text-ok' },
];

/**
 * Sticky 72px top nav (Royal Purple system): white with hairline border,
 * blur on scroll. Sign-in opens the Paymm account modal (phone OTP / Google).
 */
const Navbar = () => {
    const { user: googleUser, logout: googleLogout } = useAuth();
    const { user: sessionUser, requireLogin, logout: sessionLogout } = useSession();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    useEffect(() => { setOpen(false); }, [pathname]);

    const user = sessionUser
        ? { name: sessionUser.name || sessionUser.phone || sessionUser.email, email: sessionUser.email, picture: undefined as string | undefined }
        : googleUser ? { name: googleUser.name, email: googleUser.email, picture: googleUser.picture } : null;

    const logout = async () => {
        if (sessionUser) await sessionLogout();
        if (googleUser) await googleLogout();
    };

    const isActive = (href: string) => (href === '/' ? pathname === '/' : (pathname || '').startsWith(href.split('#')[0]));

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${scrolled ? 'bg-white/85 backdrop-blur-xl border-hair' : 'bg-white/60 backdrop-blur-md border-transparent'}`}>
            <nav className="max-w-[1280px] mx-auto px-4 md:px-6 h-[68px] md:h-[72px] flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-2.5 select-none shrink-0" aria-label="Paymm home">
                    <span className="relative w-9 h-9 rounded-xl overflow-hidden bg-white ring-1 ring-hair">
                        <Image src="/paymm.png" alt="Paymm" fill className="object-cover" priority />
                    </span>
                    <span className="font-display text-2xl font-extrabold tracking-[-0.03em] text-brand leading-none">Paymm</span>
                </Link>

                <div className="hidden lg:flex items-center gap-1">
                    {SERVICES.map((s) => (
                        <Link key={s.name} href={s.href} className={`px-3.5 py-2 rounded-full text-sm font-bold transition-colors ${isActive(s.href) && s.href !== '/downloads' ? 'bg-brand-soft text-brand' : 'text-ink-2 hover:text-ink hover:bg-brand-soft/60'}`}>
                            {s.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <Link href="/downloads" className="btn-outline text-sm py-2 px-4">
                        <FaGooglePlay size={12} /><FaApple size={13} /> Download App
                    </Link>
                    <Link href="/contact" className="btn-ghost text-sm py-2 px-3 text-ink-2 hover:text-brand">Support</Link>
                    {user ? (
                        <div className="flex items-center gap-2 pl-2 ml-1 border-l border-hair">
                            <Link href={sessionUser ? '/bus/my-bookings' : '/bookings'} className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-brand-soft transition-colors">
                                {user.picture ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={user.picture} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover ring-2 ring-white" />
                                ) : (
                                    <span className="w-8 h-8 rounded-full bg-brand-soft text-brand flex items-center justify-center"><User size={16} /></span>
                                )}
                                <span className="text-sm font-bold text-ink max-w-[120px] truncate">{user.name}</span>
                            </Link>
                            <button onClick={logout} title="Sign out" className="w-9 h-9 rounded-full text-ink-3 hover:bg-err-soft hover:text-err flex items-center justify-center transition-colors"><LogOut size={16} /></button>
                        </div>
                    ) : (
                        <button onClick={() => requireLogin()} className="btn-primary text-sm py-2.5 px-5">Login / Sign up</button>
                    )}
                </div>

                <div className="md:hidden flex items-center gap-2">
                    {user ? (
                        <Link href={sessionUser ? '/bus/my-bookings' : '/bookings'} className="w-9 h-9 rounded-full bg-brand-soft text-brand flex items-center justify-center" aria-label="Account"><User size={18} /></Link>
                    ) : (
                        <button onClick={() => requireLogin()} className="btn-primary text-xs py-2 px-4">Login</button>
                    )}
                    <button onClick={() => setOpen(true)} className="w-10 h-10 rounded-full flex items-center justify-center text-ink hover:bg-brand-soft" aria-label="Menu"><Menu size={22} /></button>
                </div>
            </nav>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-[110]" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-[86vw] max-w-sm bg-white z-[120] p-5 flex flex-col overflow-y-auto">
                            <div className="flex items-center justify-between mb-5">
                                <span className="font-display text-xl font-extrabold text-brand">Paymm</span>
                                <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-brand-soft" aria-label="Close"><X size={22} /></button>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mb-5">
                                {SERVICES.map((s) => (
                                    <Link key={s.name} href={s.href} className="flex flex-col items-center gap-1.5 rounded-2xl border border-hair p-3 text-center hover:bg-lav">
                                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.tint}`}><s.icon size={20} /></span>
                                        <span className="text-[11px] font-bold text-ink leading-tight">{s.name}</span>
                                    </Link>
                                ))}
                            </div>
                            <div className="divide-y divide-hair rounded-2xl border border-hair overflow-hidden">
                                {[
                                    { name: 'My bus bookings', href: '/bus/my-bookings', icon: Briefcase },
                                    { name: 'My flight bookings', href: '/bookings', icon: Plane },
                                    { name: 'Download app', href: '/downloads', icon: Smartphone },
                                    { name: 'Support', href: '/contact', icon: LifeBuoy },
                                ].map((l) => (
                                    <Link key={l.href} href={l.href} className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-ink hover:bg-lav">
                                        <l.icon size={18} className="text-ink-3" />{l.name}<ChevronRight size={16} className="ml-auto text-ink-3" />
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-auto pt-6">
                                {user ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 h-10 rounded-full bg-brand-soft text-brand flex items-center justify-center"><User size={18} /></span>
                                            <div className="min-w-0"><p className="font-bold text-ink truncate">{user.name}</p><p className="text-xs text-ink-2 truncate">{user.email}</p></div>
                                        </div>
                                        <button onClick={() => { logout(); setOpen(false); }} className="w-full rounded-xl bg-err-soft text-err font-bold py-3 flex items-center justify-center gap-2"><LogOut size={16} /> Sign out</button>
                                    </div>
                                ) : (
                                    <button onClick={() => { setOpen(false); requireLogin(); }} className="btn-primary w-full">Login / Sign up</button>
                                )}
                                <p className="text-[11px] text-ink-3 mt-4 text-center">{COMPANY.support.summary}</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
