import React from 'react';
import { ChevronDown, Menu } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between py-4 px-4 md:py-6 md:px-12 w-full text-slate-800">
            <div className="flex items-center">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-slate-900 drop-shadow-sm">paymm</h1>
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
                <a href="#" className="hover:text-black transition-colors relative group">
                    Account Settings
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                </a>
                <a href="#" className="hover:text-black transition-colors relative group">
                    Manage Booking
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full"></span>
                </a>
            </div>

            <div className="hidden md:flex items-center space-x-6 text-sm font-semibold">
                <a href="#" className="text-slate-800 hover:text-black transition-colors">Register</a>
                <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    Sign In
                </button>
                <button className="flex items-center space-x-1 text-slate-800 hover:text-black font-bold">
                    <span>EN</span>
                    <ChevronDown size={14} strokeWidth={3} />
                </button>
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden flex items-center space-x-4">
                <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold">Sign In</button>
                <button className="text-slate-900">
                    <Menu size={24} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
