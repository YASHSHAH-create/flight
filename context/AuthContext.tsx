'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    picture?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => void;
    logout: () => Promise<void>;
    checkUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        try {
            const res = await fetch(`/api/auth/user`, {
                method: 'GET',
            });

            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error checking user session:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = () => {
        // Redirect to the backend Google Auth endpoint (proxied)
        window.location.href = `/auth/google`;
    };

    const logout = async () => {
        try {
            await fetch(`/api/auth/logout`, {
                method: 'GET',
            });
            setUser(null);
            // Optional: Redirect to home page after logout
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
