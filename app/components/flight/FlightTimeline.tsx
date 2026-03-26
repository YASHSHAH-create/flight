import React from 'react';
import { OptimizedFlightPayload } from './types';

export const FlightTimeline = ({ flight }: { flight: OptimizedFlightPayload }) => {
    return (
        <div className="flex flex-col items-center justify-center relative w-full px-4">
            <div className="text-xs font-bold text-slate-400 mb-1">
                {flight.totalDuration || "Duration"}
            </div>
            <div className="w-full h-0.5 bg-slate-200 relative flex items-center justify-between">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                <div className="absolute left-1/2 -translate-x-1/2 bg-white px-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 rotate-90">
                        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 3.5L7 15l-3.5-.5L2 16l4 3 3 4 .5-1.5-.5-3.5 3.5-2 3.5 6l1.2-.7c.4-.2.7-.6.6-1.1z"/>
                    </svg>
                </div>
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            </div>
            <div className="text-xs font-bold text-slate-400 mt-1">
                {flight.stops === 0 ? "Non-stop" : `${flight.stops} Stop(s)`}
            </div>
        </div>
    );
};
