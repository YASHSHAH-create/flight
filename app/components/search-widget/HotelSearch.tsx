import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Users, Calendar, ArrowRight } from 'lucide-react';

const HotelSearch = () => {
    // Placeholder state for demo
    const [city] = useState({ name: 'Dubai', country: 'United Arab Emirates' });
    const [guests] = useState({ count: 2, rooms: 1 });
    const [dates] = useState({ checkIn: 'Today', checkOut: 'Tomorrow' });
    const router = useRouter();

    const handleSearch = () => {
        router.push('/hotels/search');
    };

    return (
        <div className="animate-subtle-up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 md:gap-6 items-center">
                {/* Location & Guests */}
                <div className="lg:col-span-7 grid grid-cols-2 md:flex md:flex-row items-center gap-2 relative">
                    {/* Location */}
                    <div className="col-span-2 md:w-full bg-slate-50 border border-slate-200/80 rounded-xl md:rounded-2xl p-2 md:p-3 flex flex-col justify-center cursor-pointer hover:bg-white hover:shadow-md hover:border-slate-300 min-h-[56px] md:min-h-[70px]">
                        <div className="flex items-center space-x-1 text-slate-400 mb-0.5">
                            <MapPin size={12} className="hidden md:block" />
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">City or Hotel</span>
                        </div>
                        <div className="text-sm md:text-2xl font-black text-slate-900 tracking-tight truncate">{city.name}</div>
                        <div className="text-[10px] md:text-xs font-semibold text-slate-500 truncate">{city.country}</div>
                    </div>

                    {/* Guests */}
                    <div className="col-span-2 md:w-full bg-slate-50 border border-slate-200/80 rounded-xl md:rounded-2xl p-2 md:p-3 flex flex-col justify-center cursor-pointer hover:bg-white hover:shadow-md hover:border-slate-300 min-h-[56px] md:min-h-[70px]">
                        <div className="flex items-center space-x-1 text-slate-400 mb-0.5">
                            <Users size={12} className="hidden md:block" />
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Guests</span>
                        </div>
                        <div className="text-sm md:text-2xl font-black text-slate-900 tracking-tight truncate">{guests.count} Guests</div>
                        <div className="text-[10px] md:text-xs font-semibold text-slate-500 truncate">{guests.rooms} Room</div>
                    </div>
                </div>

                {/* Dates */}
                <div className="lg:col-span-5 flex flex-row items-center gap-2 md:gap-4 h-full">
                    <div className="flex-1 w-full bg-slate-50 border border-slate-200/80 rounded-xl md:rounded-2xl p-2 md:p-3 flex flex-col justify-center cursor-pointer hover:bg-white hover:shadow-md hover:border-slate-300 min-h-[56px] md:min-h-[70px]">
                        <div className="flex items-center space-x-1 text-slate-400 mb-0.5">
                            <Calendar size={12} className="hidden md:block" />
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Check-in</span>
                        </div>
                        <div className="text-sm md:text-2xl font-black text-slate-900 tracking-tight">{dates.checkIn}</div>
                    </div>

                    <div className="flex-1 w-full bg-slate-50 border border-slate-200/80 rounded-xl md:rounded-2xl p-2 md:p-3 flex flex-col justify-center cursor-pointer hover:bg-white hover:shadow-md hover:border-slate-300 min-h-[56px] md:min-h-[70px]">
                        <div className="flex items-center space-x-1 text-slate-400 mb-0.5">
                            <Calendar size={12} className="hidden md:block" />
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">Check-out</span>
                        </div>
                        <div className="text-sm md:text-2xl font-black text-slate-900 tracking-tight">{dates.checkOut}</div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button onClick={handleSearch}
                    className="w-full md:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2">
                    <span>Search Hotels</span>
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default HotelSearch;
