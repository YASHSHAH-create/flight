'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Phone, ShieldCheck, X } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useSession } from '@/context/SessionContext';
import { api, ApiError } from '@/app/lib/bus/client';

/**
 * Sign-in for the Paymm account: phone number + OTP (same accounts as the
 * app), or Google via the site's existing Google sign-in.
 */
const LoginModal = () => {
    const { loginOpen, closeLogin } = useSession();
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const otpRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => {
        if (loginOpen) { setStep('phone'); setOtp(''); setError(''); setBusy(false); }
        document.body.style.overflow = loginOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [loginOpen]);
    useEffect(() => {
        if (cooldown <= 0) return;
        const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [cooldown]);

    if (!mounted) return null;

    const sendOtp = async () => {
        setError('');
        const p = phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
        if (!/^[6-9]\d{9}$/.test(p)) { setError('Enter a valid 10-digit mobile number.'); return; }
        setBusy(true);
        try {
            await api('/api/bus-auth/send-otp', { body: { phone: p } });
            setPhone(p); setStep('otp'); setCooldown(30);
            setTimeout(() => otpRef.current?.focus(), 60);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : 'Could not send OTP. Please try again.');
        } finally { setBusy(false); }
    };

    const verify = async () => {
        setError('');
        if (!/^\d{4,8}$/.test(otp)) { setError('Enter the OTP sent to your phone.'); return; }
        setBusy(true);
        try {
            await api('/api/bus-auth/verify-otp', { body: { phone, otp } });
            closeLogin(true);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : 'Verification failed. Please try again.');
        } finally { setBusy(false); }
    };

    const google = () => {
        // Site-wide Google sign-in (flight server session). We come back to the
        // same page; the page then exchanges the session for a Paymm login.
        const back = `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.search ? '&' : '?'}glogin=1`;
        window.location.href = `/auth/google?state=${encodeURIComponent(back)}`;
    };

    return createPortal(
        <AnimatePresence>
            {loginOpen && (
                <div className="fixed inset-0 z-[130] flex items-end md:items-center justify-center bg-ink/60 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => closeLogin(false)} className="absolute inset-0" aria-hidden="true" />
                    <motion.div
                        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                        className="relative z-10 bg-white w-full md:w-[420px] rounded-t-[2rem] md:rounded-3xl shadow-2xl p-6 md:p-8"
                        role="dialog" aria-modal="true" aria-label="Sign in to Paymm"
                    >
                        <button onClick={() => closeLogin(false)} className="absolute right-4 top-4 p-2 rounded-full text-ink-3 hover:bg-brand-soft hover:text-ink" aria-label="Close"><X size={18} /></button>

                        {step === 'phone' ? (
                            <>
                                <div className="w-12 h-12 rounded-2xl bg-brand text-white flex items-center justify-center mb-4"><Lock size={20} /></div>
                                <h2 className="text-2xl font-extrabold text-ink font-display tracking-tight">Sign in to continue</h2>
                                <p className="text-sm text-ink-2 mt-1 mb-6">Your ticket, wallet and refunds stay linked to your Paymm account. Same login as the app.</p>

                                <label className="block text-xs font-bold uppercase tracking-wide text-ink-3 mb-1.5">Mobile number</label>
                                <div className="flex items-center gap-2 border border-hair rounded-xl px-3 py-3 focus-within:border-brand transition-colors bg-lav focus-within:bg-white">
                                    <Phone size={16} className="text-ink-3" />
                                    <span className="text-ink-2 font-semibold text-sm">+91</span>
                                    <input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        onKeyDown={(e) => e.key === 'Enter' && sendOtp()}
                                        inputMode="numeric" autoComplete="tel-national" placeholder="98765 43210"
                                        className="flex-1 bg-transparent outline-none text-ink font-semibold text-lg tracking-wide"
                                    />
                                </div>
                                {error && <p className="mt-2 text-sm font-semibold text-err">{error}</p>}
                                <button onClick={sendOtp} disabled={busy}
                                    className="mt-4 w-full bg-brand text-white rounded-xl py-3.5 font-bold hover:bg-brand-hover transition-colors disabled:opacity-60">
                                    {busy ? 'Sending OTP…' : 'Get OTP'}
                                </button>

                                <div className="flex items-center gap-3 my-5 text-xs text-ink-3"><span className="flex-1 h-px bg-hair" />or<span className="flex-1 h-px bg-hair" /></div>
                                <button onClick={google} className="w-full border border-hair rounded-xl py-3 font-bold text-ink hover:bg-brand-soft flex items-center justify-center gap-2 transition-colors">
                                    <FcGoogle size={20} /> Continue with Google
                                </button>
                                <p className="mt-5 text-[11px] text-ink-3 flex items-start gap-1.5"><ShieldCheck size={14} className="shrink-0 mt-[1px]" /> By continuing you agree to Paymm’s Terms and Privacy Policy. We never share your number with operators beyond what the ticket needs.</p>
                            </>
                        ) : (
                            <>
                                <button onClick={() => { setStep('phone'); setError(''); }} className="flex items-center gap-1 text-sm font-semibold text-ink-2 hover:text-brand mb-4"><ArrowLeft size={16} /> Change number</button>
                                <h2 className="text-2xl font-extrabold text-ink font-display tracking-tight">Enter OTP</h2>
                                <p className="text-sm text-ink-2 mt-1 mb-6">Sent to <span className="font-bold text-ink">+91 {phone}</span></p>
                                <input
                                    ref={otpRef}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                    onKeyDown={(e) => e.key === 'Enter' && verify()}
                                    inputMode="numeric" autoComplete="one-time-code" placeholder="••••••"
                                    className="w-full border border-hair rounded-xl px-4 py-3.5 text-center text-2xl font-black tracking-[0.5em] text-ink outline-none focus:border-brand bg-lav focus:bg-white"
                                />
                                {error && <p className="mt-2 text-sm font-semibold text-err">{error}</p>}
                                <button onClick={verify} disabled={busy}
                                    className="mt-4 w-full bg-brand text-white rounded-xl py-3.5 font-bold hover:bg-brand-hover transition-colors disabled:opacity-60">
                                    {busy ? 'Verifying…' : 'Verify & continue'}
                                </button>
                                <button onClick={sendOtp} disabled={busy || cooldown > 0} className="mt-3 w-full text-sm font-semibold text-ink-2 hover:text-brand disabled:opacity-50">
                                    {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                                </button>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body,
    );
};

export default LoginModal;
