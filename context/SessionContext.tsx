'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { SessionUser } from '@/app/lib/bus/types';

/**
 * Paymm account session (phone-OTP / Google login backed by the payment
 * server). Separate from the legacy flight-site AuthContext: this one owns
 * wallet, bookings and payments. Auth state is read from a same-origin
 * endpoint; the JWT itself never reaches the browser.
 */
interface SessionState {
    user: SessionUser | null;
    walletBalance: number | null;
    loading: boolean;
    refresh: () => Promise<void>;
    logout: () => Promise<void>;
    /** Opens the login modal; resolves true when a session exists afterwards. */
    requireLogin: () => Promise<boolean>;
    loginOpen: boolean;
    closeLogin: (loggedIn: boolean) => void;
}

const Ctx = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<SessionUser | null>(null);
    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [loginOpen, setLoginOpen] = useState(false);
    const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null);

    const refresh = useCallback(async () => {
        try {
            const res = await fetch('/api/bus-auth/me', { credentials: 'same-origin', cache: 'no-store' });
            const data = await res.json();
            if (data?.user) {
                setUser(data.user);
                setWalletBalance(typeof data.walletBalance === 'number' ? data.walletBalance : null);
            } else {
                setUser(null);
                setWalletBalance(null);
            }
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { refresh(); }, [refresh]);

    const logout = useCallback(async () => {
        await fetch('/api/bus-auth/logout', { method: 'POST', credentials: 'same-origin' });
        setUser(null);
        setWalletBalance(null);
    }, []);

    const requireLogin = useCallback(() => new Promise<boolean>((resolve) => {
        if (user) { resolve(true); return; }
        setResolver(() => resolve);
        setLoginOpen(true);
    }), [user]);

    const closeLogin = useCallback((loggedIn: boolean) => {
        setLoginOpen(false);
        if (loggedIn) refresh();
        resolver?.(loggedIn);
        setResolver(null);
    }, [resolver, refresh]);

    return (
        <Ctx.Provider value={{ user, walletBalance, loading, refresh, logout, requireLogin, loginOpen, closeLogin }}>
            {children}
        </Ctx.Provider>
    );
}

export const useSession = () => {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useSession must be used inside SessionProvider');
    return ctx;
};
