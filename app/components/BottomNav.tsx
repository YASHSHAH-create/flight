
import React, { useState } from 'react';
import { Home, Search, Calendar, User } from 'lucide-react';

const BottomNav = () => {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full z-50 px-4 pb-4">
            {/* Floating Glass Container */}
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl shadow-slate-900/10 rounded-full px-6 py-3 flex items-center justify-between mx-auto max-w-sm">

                {/* Home Tab */}
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeTab === 'home' ? 'text-black scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} fill={activeTab === 'home' ? "currentColor" : "none"} className={activeTab === 'home' ? "text-black" : ""} />
                </button>

                {/* Search Tab */}
                <button
                    onClick={() => setActiveTab('search')}
                    className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeTab === 'search' ? 'text-black scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <div className={`p-2 rounded-full ${activeTab === 'search' ? 'bg-black text-white shadow-lg' : ''}`}>
                        <Search size={20} strokeWidth={3} />
                    </div>
                </button>

                {/* Bookings/Trips Tab */}
                <button
                    onClick={() => setActiveTab('trips')}
                    className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeTab === 'trips' ? 'text-black scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Calendar size={22} strokeWidth={activeTab === 'trips' ? 2.5 : 2} />
                </button>

                {/* Profile Tab */}
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`flex flex-col items-center space-y-1 transition-all duration-300 ${activeTab === 'profile' ? 'text-black scale-110' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 2} fill={activeTab === 'profile' ? "currentColor" : "none"} />
                </button>
            </div>
        </div>
    );
};

export default BottomNav;
