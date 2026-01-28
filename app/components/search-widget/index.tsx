'use client';

import React, { useState, useEffect } from 'react';
import TabSelector from './TabSelector';
import FlightSearch from './FlightSearch';
import HotelSearch from './HotelSearch';
import CarSearch from './CarSearch';

interface SearchWidgetProps {
    initialState?: any;
    className?: string;
}

const SearchWidget = ({ initialState, className }: SearchWidgetProps) => {
    const [activeTab, setActiveTab] = useState('flight');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch for basic initial render if needed, 
    // but usually handled by parent dynamic import. 
    // We can keep it simple.

    return (
        <div className={`w-full max-w-5xl mx-auto mt-2 md:mt-10 relative animate-subtle-up ${className || ''}`}>

            {/* Tabs */}
            <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Main Search Container - Premium Glass Card */}
            <div className="bg-white/95 md:bg-white rounded-[20px] md:rounded-[clamp(1.5rem,2vw,2rem)] p-3 md:p-[clamp(0.75rem,2vw,2rem)] shadow-2xl shadow-slate-900/10 text-slate-800 relative z-0 backdrop-blur-xl border border-white/50 min-h-auto md:min-h-[clamp(300px,35vh,400px)]">
                {activeTab === 'flight' && <FlightSearch initialState={initialState} />}
                {activeTab === 'hotel' && <HotelSearch />}
                {activeTab === 'car' && <CarSearch />}
            </div>
        </div>
    );
};

export default SearchWidget;
