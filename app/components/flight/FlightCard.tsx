import React, { useState } from 'react';
import { OptimizedFlightPayload } from './types';
import { FlightTimeline } from './FlightTimeline';

import { ChevronDown, ArrowRight } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface Props {
    flight: OptimizedFlightPayload;
    onBook: () => void;
}

export const FlightCard = ({ flight, onBook }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden group cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="p-4 md:p-6 pb-5">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    
                    {/* Airline & Logo */}
                    <div className="flex items-center gap-3 w-full md:w-48 shrink-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 overflow-hidden shadow-sm">
                            {/* Fallback to initials if no robust logo handling */}
                            <span className="font-bold text-slate-600 text-sm">{flight.airline.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                            <div className="font-black text-slate-900 text-sm">{flight.airline}</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-0.5">{flight.flightNumbers}</div>
                        </div>
                    </div>

                    {/* Timeline Details */}
                    <div className="flex items-center justify-between flex-1 py-2 md:py-0 w-full relative">
                        {/* Departure */}
                        <div className="text-right md:text-center shrink-0 w-16">
                            <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{flight.departureTime}</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{flight.segments[0].from}</div>
                        </div>

                        {/* Center Timeline */}
                        <FlightTimeline flight={flight} />

                        {/* Arrival */}
                        <div className="text-left md:text-center shrink-0 w-16">
                            <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{flight.arrivalTime}</div>
                            <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{flight.segments[flight.segments.length - 1].to}</div>
                        </div>
                    </div>

                    {/* Price and Action Container */}
                    <div className="flex items-center justify-between md:flex-col md:items-end md:w-40 shrink-0 gap-3 border-t md:border-0 border-slate-100 pt-4 md:pt-0 mt-2 md:mt-0 relative z-10" onClick={(e) => e.stopPropagation()}>
                        <div className="text-left md:text-right">
                            <div className="text-2xl font-black text-slate-900">₹{flight.price.offeredFare.toLocaleString()}</div>
                            {flight.price.offeredFare < flight.price.total && (
                                <div className="text-[10px] font-bold text-slate-400 line-through">₹{flight.price.total.toLocaleString()}</div>
                            )}
                        </div>
                        <button
                            onClick={onBook}
                            className="bg-black hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-slate-900/10 active:scale-95 transition-all flex items-center justify-center gap-2 group/btn w-full md:w-auto"
                        >
                            Book
                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>

                </div>

                {/* Footer simple toggle strip */}
                <div className="flex justify-center -mb-2 mt-4">
                    <button 
                        className="text-[10px] font-bold text-slate-400 flex items-center hover:text-black transition-colors"
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                    >
                        {isExpanded ? 'Hide Details' : 'View Details'}
                        <ChevronDown size={14} className={`ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Expanded Content Dropdown */}
        
        </div>
    );
};
