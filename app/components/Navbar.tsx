import React from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
    const { user, login, logout } = useAuth();

    return (
        <nav className="flex items-center justify-between py-[2vh] px-[4vw] md:px-[6vw] w-full text-slate-800">
            <div className="flex items-center">
                <h1 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold tracking-tighter text-slate-900 drop-shadow-sm">paymm</h1>
            </div>

            <div className="hidden lg:flex items-center space-x-10 text-sm font-semibold text-slate-700/90 backdrop-blur-sm bg-white/10 px-6 py-2 rounded-full border border-white/20 shadow-sm">
                <a href="#" className="hover:text-black transition-colors relative group">
                    Holiday Packages
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-black transition-colors relative group">
                    Flight Schedule
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                </a>
                <Link href="#" className="hover:text-black transition-colors relative group">
                    Account Settings
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                </Link>
                <Link href="/bookings" className="hover:text-black transition-colors relative group">
                    My Bookings
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6 text-sm font-semibold">
                {!user && (
                    <a href="#" className="text-slate-800 hover:text-black transition-colors">Register</a>
                )}

                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            {user.picture ? (
                                <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                    <User size={16} />
                                </div>
                            )}
                           {/* <span className="text-slate-900 font-medium">{user.name}</span> */}
                        </div>
                        <button
                            onClick={() => logout()}
                            className="text-slate-600 hover:text-red-600 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => login()}
                        className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Sign In
                    </button>
                )}

                <button className="flex items-center space-x-1 text-slate-800 hover:text-black font-bold">
                    <span>EN</span>
                    <ChevronDown size={14} strokeWidth={3} />
                </button>
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden flex items-center space-x-4">
                {user ? (
                    <button onClick={() => logout()} className="text-sm font-bold text-slate-900">Logout</button>
                ) : (
                    <button onClick={() => login()} className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold">Sign In</button>
                )}
                <button className="text-slate-900">
                    <Menu size={24} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
