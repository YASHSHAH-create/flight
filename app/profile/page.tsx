'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, login } = useAuth(); // Assuming useAuth provides these

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar />
            </div>

            <main className="pt-32 pb-20 px-4 md:px-16 max-w-3xl mx-auto">
                <h1 className="text-4xl font-black text-slate-900 mb-8">Account Profile</h1>

                {user ? (
                    <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100">
                        <div className="flex items-center gap-6 mb-8 border-b border-slate-100 pb-8">
                            {user.picture ? (
                                <img src={user.picture} alt={user.name} className="w-24 h-24 rounded-full ring-4 ring-slate-50" />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-4xl">
                                    👤
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                                <p className="text-slate-500">{user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900">Account Actions</h3>
                            <div className="grid gap-4">
                                <Link href="/bookings" className="p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors flex justify-between items-center group">
                                    <span className="font-semibold text-slate-700 group-hover:text-blue-700">My Bookings</span>
                                    <span className="text-slate-400 group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                                <button className="p-4 bg-slate-50 rounded-xl hover:bg-red-50 text-left transition-colors flex justify-between items-center group">
                                    <span className="font-semibold text-slate-700 group-hover:text-red-700">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-[2rem] shadow-lg border border-slate-100 text-center">
                        <div className="mb-6 text-6xl">🔒</div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Please Sign In</h2>
                        <p className="text-slate-500 mb-8">Access your profile, manage bookings, and view exclusive deals.</p>
                        <button onClick={() => login()} className="bg-black text-white px-8 py-3 rounded-full font-bold shadow-lg hover:translate-y-[-2px] transition-all">
                            Sign In / Register
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
