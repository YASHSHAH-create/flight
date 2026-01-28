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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6 items-center">
                {/* Location & Guests */}
                <div className="lg:col-span-7 flex flex-col md:flex-row items-center bg-slate-50/80 border border-slate-200/60 rounded-3xl p-1 relative hover:border-slate-300 hover:shadow-md transition-all">
                    {/* Location */}
                    <div className="w-full p-4 md:p-5 flex flex-col justify-center rounded-2xl cursor-pointer hover:bg-slate-100/50">
                        <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                            <MapPin size={12} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">City or Hotel</span>
                        </div>
                        <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{city.name}</div>
                        <div className="text-xs font-semibold text-slate-500 truncate mt-0.5">{city.country}</div>
                    </div>

                    <div className="md:hidden w-full h-[1px] bg-slate-200/80 mx-4"></div>
                    <div className="hidden md:block w-[1px] h-12 bg-slate-200/80 mx-0"></div>

                    {/* Guests */}
                    <div className="w-full p-4 md:p-5 flex flex-col justify-center rounded-2xl cursor-pointer hover:bg-slate-100/50">
                        <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                            <Users size={12} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Guests</span>
                        </div>
                        <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{guests.count} Guests</div>
                        <div className="text-xs font-semibold text-slate-500 truncate mt-0.5">{guests.rooms} Room</div>
                    </div>
                </div>

                {/* Dates */}
                <div className="lg:col-span-5 flex flex-row items-center gap-2 md:gap-4 h-full">
                    <div className="flex-1 w-full bg-slate-50/80 border border-slate-200/60 rounded-3xl p-4 md:p-5 flex flex-col justify-center cursor-pointer hover:border-slate-300 hover:shadow-md transition-all min-h-[100px]">
                        <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                            <Calendar size={12} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Check-in</span>
                        </div>
                        <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{dates.checkIn}</div>
                    </div>

                    <div className="flex-1 w-full bg-slate-50/80 border border-slate-200/60 rounded-3xl p-4 md:p-5 flex flex-col justify-center cursor-pointer hover:border-slate-300 hover:shadow-md transition-all min-h-[100px]">
                        <div className="flex items-center space-x-1.5 text-slate-400 mb-1">
                            <Calendar size={12} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">Check-out</span>
                        </div>
                        <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{dates.checkOut}</div>
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
