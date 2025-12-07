
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Building, Car, ArrowRightLeft, Calendar, ArrowRight, ChevronDown, MapPin, Users, BedDouble } from 'lucide-react';

const SearchWidget = () => {
    const [activeTab, setActiveTab] = useState('flight');

    return (
        <div className="w-full max-w-5xl mx-auto mt-4 md:mt-10 relative animate-subtle-up">
            {/* Tabs */}
            <div className="flex items-center justify-start space-x-2 pl-2 md:pl-4 mb-2 relative z-10 overflow-x-auto no-scrollbar py-1">
                <button
                    onClick={() => setActiveTab('flight')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-bold text-xs shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0 border ${activeTab === 'flight' ? 'bg-white text-black border-slate-100' : 'bg-white/40 backdrop-blur-md text-slate-800 border-white/20 hover:bg-white/60'}`}
                >
                    <Plane size={14} />
                    <span>Flight</span>
                </button>
                <button
                    onClick={() => setActiveTab('hotel')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-bold text-xs shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0 border ${activeTab === 'hotel' ? 'bg-white text-black border-slate-100' : 'bg-white/40 backdrop-blur-md text-slate-800 border-white/20 hover:bg-white/60'}`}
                >
                    <Building size={14} />
                    <span>Hotel</span>
                </button>
                <button
                    onClick={() => setActiveTab('car')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-bold text-xs shadow-sm transition-all hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0 border ${activeTab === 'car' ? 'bg-white text-black border-slate-100' : 'bg-white/40 backdrop-blur-md text-slate-800 border-white/20 hover:bg-white/60'}`}
                >
                    <Car size={14} />
                    <span>Rent a Car</span>
                </button>
            </div>

            {/* Main Search Container - Premium Glass Card */}
            <div className="bg-white/90 md:bg-white rounded-[20px] md:rounded-[clamp(1.5rem,2vw,2rem)] p-2 md:p-[clamp(0.75rem,2vw,2rem)] shadow-2xl shadow-slate-900/10 text-slate-800 relative z-0 backdrop-blur-xl border border-white/50 min-h-auto md:min-h-[clamp(300px,35vh,400px)]">

                {/* Top Options Row - Compact */}
                <div className="flex flex-wrap items-center gap-3 md:gap-8 mb-4 md:mb-8 text-xs md:text-sm font-bold text-slate-600">
                    <div className="flex items-center space-x-1 bg-slate-100/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                        <span>{activeTab === 'hotel' ? 'Free Cancellation' : 'Round Trip'}</span>
                        <ChevronDown size={14} />
                    </div>
                    <div className="flex items-center space-x-1 bg-slate-100/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                        <span>{activeTab === 'hotel' ? '2 Adults, 1 Room' : '02 Passengers'}</span>
                        <ChevronDown size={14} />
                    </div>
                    <div className="flex items-center space-x-1 bg-slate-100/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                        <span>{activeTab === 'hotel' ? '5 Star' : 'Business Class'}</span>
                        <ChevronDown size={14} />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'flight' && (
                        <motion.div
                            key="flight"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6 items-center"
                        >
                            {/* Origin & Destination */}
                            <div className="lg:col-span-7 flex flex-col md:flex-row items-center gap-2 relative">
                                {/* Origin */}
                                <div className="w-full bg-slate-100/50 border border-slate-200/60 rounded-[14px] md:rounded-[clamp(1rem,1.5vw,1.5rem)] p-1.5 md:p-[clamp(0.75rem,2vw,1.25rem)] flex flex-col justify-center cursor-pointer transition-all hover:bg-white hover:shadow-md hover:border-slate-300 group/field">
                                    <div className="flex items-center space-x-1 text-slate-400 mb-0 transition-colors group-hover/field:text-slate-600">
                                        <MapPin size={9} className="md:w-3 md:h-3" />
                                        <span className="text-[9px] md:text-[clamp(0.6rem,0.8vw,0.75rem)] font-bold uppercase tracking-wider">From</span>
                                    </div>
                                    <div className="text-base md:text-[clamp(1.25rem,2.5vw,1.875rem)] font-black text-slate-900 tracking-tight group-hover/field:text-black">Behance</div>
                                    <div className="text-[8px] md:text-[clamp(0.65rem,0.8vw,0.75rem)] font-semibold text-slate-500 truncate mt-0 md:mt-0.5">BHN, North America, USA</div>
                                </div>

                                {/* Swap Icon */}
                                <div className="flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <button className="bg-white border text-slate-400 hover:text-black hover:scale-110 hover:shadow-md hover:border-slate-300 active:scale-95 transition-all p-2 rounded-full shadow-sm rotate-90 md:rotate-0">
                                        <ArrowRightLeft size={16} strokeWidth={2.5} />
                                    </button>
                                </div>

                                {/* Destination */}
                                <div className="w-full bg-slate-100/50 border border-slate-200/60 rounded-[14px] md:rounded-[clamp(1rem,1.5vw,1.5rem)] p-1.5 md:p-[clamp(0.75rem,2vw,1.25rem)] flex flex-col justify-center cursor-pointer transition-all hover:bg-white hover:shadow-md hover:border-slate-300 group/field">
                                    <div className="flex items-center space-x-1 text-slate-400 mb-0 transition-colors group-hover/field:text-slate-600">
                                        <MapPin size={9} className="md:w-3 md:h-3" />
                                        <span className="text-[9px] md:text-[clamp(0.6rem,0.8vw,0.75rem)] font-bold uppercase tracking-wider">To</span>
                                    </div>
                                    <div className="text-base md:text-[clamp(1.25rem,2.5vw,1.875rem)] font-black text-slate-900 tracking-tight group-hover/field:text-black">Dribbble</div>
                                    <div className="text-[8px] md:text-[clamp(0.65rem,0.8vw,0.75rem)] font-semibold text-slate-500 truncate mt-0 md:mt-0.5">DRB, Cape Town, S. Africa</div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="lg:col-span-5 flex flex-row items-center gap-1.5 md:gap-4 h-full">
                                <div className="flex-1 w-full bg-slate-50/80 border border-slate-200/60 rounded-[14px] md:rounded-[clamp(1rem,1.5vw,1.5rem)] p-1.5 md:p-[clamp(0.75rem,2vw,1.25rem)] flex flex-col justify-center cursor-pointer transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:bg-white group/date h-full min-h-[50px] md:min-h-[clamp(80px,12vh,110px)]">
                                    <div className="flex items-center space-x-1 text-slate-400 mb-0 transition-colors group-hover/date:text-slate-600">
                                        <Calendar size={9} className="md:w-3 md:h-3" />
                                        <span className="text-[9px] md:text-[clamp(0.6rem,0.8vw,0.75rem)] font-bold uppercase tracking-wider">Departure</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="text-xs md:text-[clamp(1rem,1.5vw,1.5rem)] font-black text-slate-900 tracking-tight">Fri, 22 Mar</div>
                                    </div>
                                </div>

                                <div className="flex-1 w-full bg-slate-50/80 border border-slate-200/60 rounded-[14px] md:rounded-[clamp(1rem,1.5vw,1.5rem)] p-1.5 md:p-[clamp(0.75rem,2vw,1.25rem)] flex flex-col justify-center cursor-pointer transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:bg-white group/date h-full min-h-[50px] md:min-h-[clamp(80px,12vh,110px)]">
                                    <div className="flex items-center space-x-1 text-slate-400 mb-0 transition-colors group-hover/date:text-slate-600">
                                        <Calendar size={9} className="md:w-3 md:h-3" />
                                        <span className="text-[9px] md:text-[clamp(0.6rem,0.8vw,0.75rem)] font-bold uppercase tracking-wider">Return</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="text-xs md:text-[clamp(1rem,1.5vw,1.5rem)] font-black text-slate-900 tracking-tight">Mon, 2 Apr</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'hotel' && (
                        <motion.div
                            key="hotel"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6 items-center"
                        >
                            {/* Hotel Location & Guests */}
                            <div className="lg:col-span-7 flex flex-col md:flex-row items-center bg-slate-50/80 border border-slate-200/60 rounded-3xl p-1 relative transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:bg-white group/inputs">
                                {/* Location */}
                                <div className="w-full p-4 md:p-5 flex flex-col justify-center rounded-2xl transition-all cursor-pointer relative hover:bg-slate-100/50 group/field">
                                    <div className="flex items-center space-x-1.5 text-slate-400 mb-1 transition-colors group-hover/field:text-slate-600">
                                        <MapPin size={12} />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">City or Hotel</span>
                                    </div>
                                    <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight group-hover/field:text-black">Dubai</div>
                                    <div className="text-xs font-semibold text-slate-500 truncate mt-0.5">United Arab Emirates</div>
                                </div>

                                {/* Divider */}
                                <div className="md:hidden w-full h-[1px] bg-slate-200/80 mx-4"></div>
                                <div className="hidden md:block w-[1px] h-12 bg-slate-200/80 mx-0"></div>

                                {/* Guests */}
                                <div className="w-full p-4 md:p-5 flex flex-col justify-center rounded-2xl transition-all cursor-pointer text-left md:text-left hover:bg-slate-100/50 group/field border-l-0 border-transparent">
                                    <div className="flex items-center space-x-1.5 text-slate-400 mb-1 transition-colors group-hover/field:text-slate-600">
                                        <Users size={12} />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Guests</span>
                                    </div>
                                    <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight group-hover/field:text-black">2 Guests</div>
                                    <div className="text-xs font-semibold text-slate-500 truncate mt-0.5">1 Room</div>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="lg:col-span-5 flex flex-row items-center gap-2 md:gap-4 h-full">
                                <div className="flex-1 w-full bg-slate-50/80 border border-slate-200/60 rounded-3xl p-4 md:p-5 flex flex-col justify-center cursor-pointer transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:bg-white group/date h-full min-h-[100px]">
                                    <div className="flex items-center space-x-1.5 text-slate-400 mb-1 transition-colors group-hover/date:text-slate-600">
                                        <Calendar size={12} />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Check-in</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Today</div>
                                    </div>
                                </div>

                                <div className="flex-1 w-full bg-slate-50/80 border border-slate-200/60 rounded-3xl p-4 md:p-5 flex flex-col justify-center cursor-pointer transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:bg-white group/date h-full min-h-[100px]">
                                    <div className="flex items-center space-x-1.5 text-slate-400 mb-1 transition-colors group-hover/date:text-slate-600">
                                        <Calendar size={12} />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Check-out</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Tomorrow</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'car' && (
                        <motion.div
                            key="car"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6 items-center"
                        >
                            <div className="lg:col-span-12 flex items-center justify-center p-12 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                                Rental Car Search Coming Soon
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Search Button */}
                <div className="mt-2 md:mt-0 md:absolute md:-bottom-7 md:right-8">
                    <button className="w-full md:w-auto bg-black text-white px-8 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-sm md:text-base shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center space-x-2">
                        <span>Search {activeTab === 'flight' ? 'Flights' : activeTab === 'hotel' ? 'Hotels' : 'Cars'}</span>
                        <ArrowRight size={18} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Popular Destination */}
            <div className="hidden md:flex justify-between items-end mt-20 px-4 animate-subtle-pop">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Popular Destination</h2>
                <a href="#" className="text-sm font-bold text-slate-600 underline decoration-2 decoration-slate-300 hover:text-black hover:decoration-black transition-all">Explore All</a>
            </div>
        </div>
    );
};

export default SearchWidget;
