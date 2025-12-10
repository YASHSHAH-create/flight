'use client';

import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Edit2, SlidersHorizontal, ArrowUpDown, Clock,
    Luggage, Plane, ChevronDown, Check, Heart, X, Info,
    ChevronRight, CreditCard, ShieldCheck, Zap, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResponse, FlightResult } from '@/types/api';
import SearchWidget from '@/app/components/SearchWidget';
import BottomNav from '@/app/components/BottomNav';
import { useAuth } from '@/context/AuthContext';

const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};

const formatDate = (dateStr: string | null) => {
    if (!dateStr || dateStr.length !== 8) return dateStr || '';
    const day = dateStr.substring(0, 2);
    const month = dateStr.substring(2, 4);
    const year = dateStr.substring(4, 8);
    // Create date object (standard usage)
    const d = new Date(`${year}-${month}-${day}`);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const FlightCardSkeleton = () => (
    <div className="bg-white md:rounded-2xl shadow-sm border border-slate-100 p-3 md:p-5 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-0">
            {/* Airline Info Skeleton */}
            <div className="flex items-center space-x-3 min-w-[120px]">
                <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                <div className="space-y-2">
                    <div className="w-24 h-4 bg-slate-200 rounded"></div>
                    <div className="w-16 h-3 bg-slate-200 rounded"></div>
                </div>
            </div>

            {/* Flight Schedule Skeleton - Desktop */}
            <div className="hidden md:flex flex-1 px-4 items-center justify-center space-x-8">
                <div className="text-center w-16 space-y-2">
                    <div className="w-12 h-6 bg-slate-200 rounded mx-auto"></div>
                    <div className="w-8 h-3 bg-slate-200 rounded mx-auto"></div>
                </div>

                <div className="flex flex-col items-center flex-1 max-w-[120px] space-y-2">
                    <div className="w-10 h-3 bg-slate-200 rounded"></div>
                    <div className="w-full h-[1px] bg-slate-200"></div>
                    <div className="w-12 h-3 bg-slate-200 rounded"></div>
                </div>

                <div className="text-center w-16 space-y-2">
                    <div className="w-12 h-6 bg-slate-200 rounded mx-auto"></div>
                    <div className="w-8 h-3 bg-slate-200 rounded mx-auto"></div>
                </div>
            </div>

            {/* Mobile Skeleton */}
            <div className="md:hidden flex items-center justify-between mt-1 mb-1 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50 h-16">
                <div className="w-full h-full bg-slate-200 rounded"></div>
            </div>

            {/* Price & CTA Skeleton */}
            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center min-w-[100px] mt-1 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 md:border-l md:pl-6 space-y-2">
                <div className="space-y-1">
                    <div className="w-20 h-6 bg-slate-200 rounded md:ml-auto"></div>
                    <div className="w-14 h-3 bg-slate-200 rounded md:ml-auto"></div>
                </div>
                <div className="hidden md:block w-24 h-10 bg-slate-200 rounded-xl"></div>
                <div className="md:hidden w-20 h-6 bg-slate-200 rounded-full"></div>
            </div>
        </div>
        <div className="mt-4 flex space-x-2">
            <div className="w-16 h-4 bg-slate-200 rounded"></div>
            <div className="w-16 h-4 bg-slate-200 rounded"></div>
        </div>
    </div>
);

import { Suspense } from 'react';

function SearchResultsContent() {

    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, login } = useAuth();
    const [selectedFlight, setSelectedFlight] = useState<number | null>(null);
    const [flights, setFlights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModifySearchOpen, setIsModifySearchOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter Stats
    const [stats, setStats] = useState({
        minPrice: 0,
        maxPrice: 100000,
        airlines: [] as { name: string; code: string }[]
    });

    // Selected Filters
    const [filters, setFilters] = useState({
        maxPrice: 100000,
        stops: [] as string[],
        airlines: [] as string[],
        times: [] as string[]
    });

    // 🔍 Filter Logic
    const filteredFlights = flights.filter(flight => {
        // Price
        if (flight.price > filters.maxPrice) return false;

        // Stops (Match exact string)
        if (filters.stops.length > 0 && !filters.stops.includes(flight.stops)) return false;

        // Airlines
        if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) return false;

        // Departure Time
        if (filters.times.length > 0) {
            const hour = parseInt(flight.departure.time.split(':')[0]);
            const isMorning = hour >= 6 && hour < 12;
            const isAfternoon = hour >= 12 && hour < 18;
            const isEvening = hour >= 18 && hour < 24;
            const isNight = hour >= 0 && hour < 6; // technically next day early morning

            let match = false;
            if (filters.times.includes('Morning') && isMorning) match = true;
            if (filters.times.includes('Afternoon') && isAfternoon) match = true;
            if (filters.times.includes('Evening') && isEvening) match = true;
            if (filters.times.includes('Night') && isNight) match = true;

            if (!match) return false;
        }

        return true;
    });

    // Toggle Helper Functions
    const toggleFilter = (category: 'stops' | 'airlines' | 'times', value: string) => {
        setFilters(prev => {
            const current = prev[category];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [category]: updated };
        });
    };

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            setError(null);

            try {
                // Construct API URL
                // Construct API URL
                const adults = searchParams.get('adults') || '1';
                const children = searchParams.get('children') || '0';
                const infants = searchParams.get('infants') || '0';
                const cabinClass = searchParams.get('class') || 'e';
                const journeyType = searchParams.get('journeyType') || '1';

                let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/search?adults=${adults}&children=${children}&infants=${infants}&class=${cabinClass}&journeyType=${journeyType}`;

                if (journeyType === '3') {
                    // Multi City: extract all matching params
                    const froms = searchParams.getAll('from');
                    const tos = searchParams.getAll('to');
                    const dates = searchParams.getAll('date');

                    if (froms.length === 0) throw new Error("Missing flight segments");

                    froms.forEach((f, i) => {
                        apiUrl += `&from=${f}`;
                        if (tos[i]) apiUrl += `&to=${tos[i]}`;
                        if (dates[i]) apiUrl += `&date=${dates[i]}`;
                    });
                } else {
                    const from = searchParams.get('from');
                    const to = searchParams.get('to');
                    const date = searchParams.get('date');

                    if (!from || !to || !date) {
                        throw new Error("Missing search parameters");
                    }

                    apiUrl += `&from=${from}&to=${to}&date=${date}`;

                    if (journeyType === '2') {
                        const returnDate = searchParams.get('returnDate');
                        if (returnDate) apiUrl += `&returnDate=${returnDate}`;
                    }
                }

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error("Failed to fetch flights");
                }

                const data: SearchResponse = await response.json();

                if (data.Response.Error.ErrorCode !== 0) {
                    throw new Error(data.Response.Error.ErrorMessage);
                }

                if (data.Response.Results && data.Response.Results.length > 0) {
                    // Flatten results (assuming single leg for now)
                    const fltResults = data.Response.Results[0];
                    const traceId = data.Response.TraceId;

                    // Map to UI format
                    const mappedFlights = fltResults.map((res: FlightResult, index: number) => {
                        const segment = res.Segments[0][0]; // Assuming direct flights for simplicity first
                        const depDate = new Date(segment.Origin.DepTime);
                        const arrDate = new Date(segment.Destination.ArrTime);

                        return {
                            id: index,
                            traceId: traceId, // Add TraceId
                            airline: segment.Airline.AirlineName,
                            airlineCode: segment.Airline.AirlineCode,
                            flightNumber: `${segment.Airline.AirlineCode}-${segment.Airline.FlightNumber}`,
                            departure: {
                                time: depDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                                airport: segment.Origin.Airport.AirportCode,
                                city: segment.Origin.Airport.CityName
                            },
                            arrival: {
                                time: arrDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                                airport: segment.Destination.Airport.AirportCode,
                                city: segment.Destination.Airport.CityName
                            },
                            duration: formatDuration(segment.Duration),
                            stops: segment.StopOver ? "1 Stop" : "Non-stop",
                            price: Math.round(res.Fare.PublishedFare),
                            tags: res.IsLCC ? ["Economy"] : [],
                            benefits: res.IsRefundable ? ["Refundable"] : [],
                            seatsLeft: segment.NoOfSeatAvailable,
                            raw: res // Keep raw data for details
                        };
                    });

                    // Calculate Stats from fetched data
                    const prices = mappedFlights.map((f: any) => f.price);
                    const minPrice = Math.min(...prices);
                    const maxPrice = Math.max(...prices);

                    // Create unique airline objects
                    const airlineMap = new Map();
                    mappedFlights.forEach((f: any) => {
                        if (!airlineMap.has(f.airline)) {
                            airlineMap.set(f.airline, f.airlineCode);
                        }
                    });

                    const specificAirlines = Array.from(airlineMap.entries()).map(([name, code]) => ({
                        name,
                        code
                    }));

                    setStats({
                        minPrice,
                        maxPrice,
                        airlines: specificAirlines
                    });

                    // Initialize max price filter
                    setFilters(prev => ({ ...prev, maxPrice: maxPrice }));

                    setFlights(mappedFlights);
                } else {
                    setFlights([]);
                }

            } catch (err: any) {
                console.error(err);
                setError(err.message || "An error occurred while searching for flights.");
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [searchParams]);

    const handleBook = (flight: any) => {
        router.push(`/book?traceId=${flight.traceId}&resultIndex=${flight.raw.ResultIndex}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20 md:pb-0">

            {/* 📱 Mobile Top Bar - Sticky */}
            <div className="md:hidden sticky top-0 z-50 bg-black/90 backdrop-blur-md text-white p-4 shadow-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button className="p-1 hover:bg-white/20 rounded-full transition-colors" onClick={() => window.history.back()}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center space-x-2 text-sm font-medium uppercase">
                                <span>{searchParams.get('from')}</span>
                                <span className="text-white/60">→</span>
                                <span>{searchParams.get('to')}</span>
                            </div>
                            <div className="text-xs text-slate-300 flex items-center space-x-2">
                                <span>{formatDate(searchParams.get('date'))}</span>
                                <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
                                <span>{searchParams.get('adults') || '1'} Adult</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsModifySearchOpen(true)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                </div>
            </div>

            {/* 📱 Mobile Horizontal Filter Bar - Sticky */}
            <div className="md:hidden sticky top-[72px] z-40 bg-white border-b border-slate-100 shadow-sm overflow-x-auto no-scrollbar py-3 px-4 flex items-center space-x-3">
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center space-x-1 px-4 py-1.5 bg-black text-white rounded-full text-xs font-bold whitespace-nowrap active:scale-95 transition-transform shadow-md shadow-slate-900/10"
                >
                    <SlidersHorizontal size={12} />
                    <span>Filters</span>
                </button>
                <div className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 whitespace-nowrap active:scale-95 transition-transform">
                    <ArrowUpDown size={12} />
                    <span>Price</span>
                </div>
                <div className="flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 whitespace-nowrap active:scale-95 transition-transform">
                    <Clock size={12} />
                    <span>Duration</span>
                </div>
            </div>

            {/* 🖥️ Desktop Top Search Bar - Sticky */}
            <div className="hidden md:block sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all">
                <div className="max-w-[1400px] mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Route Info */}
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center space-x-3 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors group">
                                <button className="p-2 bg-slate-100 rounded-full text-slate-600 group-hover:bg-black group-hover:text-white transition-all" onClick={() => window.history.back()}>
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <div className="flex items-center space-x-3 text-xl font-black text-slate-900 tracking-tight uppercase">
                                        <span>{searchParams.get('from')}</span>
                                        <ArrowRight size={20} className="text-slate-400" />
                                        <span>{searchParams.get('to')}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 mt-0.5">
                                        <span>{formatDate(searchParams.get('date'))}</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span>{searchParams.get('adults') || '1'} Adult</span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span className="uppercase">{searchParams.get('class') === 'e' ? 'Economy' : searchParams.get('class') === 'b' ? 'Business' : 'First Class'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsModifySearchOpen(true)}
                                className="flex items-center space-x-2 px-5 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-balck/20"
                            >
                                <Edit2 size={14} />
                                <span>Modify Search</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 p-0 md:p-6 lg:p-8">

                {/* 🖥️ Desktop Left Sidebar (Filters) */}
                <div className="hidden md:block md:col-span-3 lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-28 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar" data-lenis-prevent>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-800">Filters</h2>
                            <button
                                onClick={() => setFilters({ maxPrice: stats.maxPrice, stops: [], airlines: [], times: [] })}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700"
                            >
                                Reset All
                            </button>
                        </div>

                        {/* Price Slider Filter */}
                        <div className="mb-8">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Price Range</label>
                            <input
                                type="range"
                                min={stats.minPrice}
                                max={stats.maxPrice}
                                value={filters.maxPrice}
                                onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                                className="w-full accent-black h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between mt-2 text-sm font-bold text-slate-700">
                                <span>₹{stats.minPrice.toLocaleString()}</span>
                                <span>₹{filters.maxPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Stops */}
                        <div className="mb-8">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Stops</label>
                            <div className="space-y-3">
                                <div className="space-y-3">
                                    {['Non-stop', '1 Stop', '2+ Stops'].map((stop, i) => (
                                        <label key={i} className="flex items-center space-x-3 cursor-pointer group">
                                            <div
                                                onClick={() => toggleFilter('stops', stop)}
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${filters.stops.includes(stop) ? 'border-black bg-black' : 'border-slate-300 group-hover:border-black'}`}
                                            >
                                                {filters.stops.includes(stop) && <Check size={12} className="text-white" />}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 group-hover:text-black">{stop}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Departure Time */}
                        <div className="mb-8">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Departure Time</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Morning', 'Afternoon', 'Evening', 'Night'].map((time, i) => (
                                    <button
                                        key={i}
                                        onClick={() => toggleFilter('times', time)}
                                        className={`p-2 rounded-lg border text-xs font-bold transition-all ${filters.times.includes(time) ? 'bg-black border-black text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Airlines */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Airlines</label>
                            <div className="space-y-3">
                                <div className="space-y-3">
                                    {stats.airlines.map((airlineObj, i) => (
                                        <label key={i} className="flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    onClick={() => toggleFilter('airlines', airlineObj.name)}
                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${filters.airlines.includes(airlineObj.name) ? 'border-black bg-black' : 'border-slate-300 group-hover:border-black'}`}
                                                >
                                                    {filters.airlines.includes(airlineObj.name) && <Check size={12} className="text-white" />}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <img src={`https://images.ixigo.com/img/common-resources/airline-new/${airlineObj.code}.png`} alt={airlineObj.name} className="w-6 h-6 object-contain" />
                                                    <span className="text-sm font-medium text-slate-700">{airlineObj.name}</span>
                                                </div>
                                            </div>
                                            {/* <span className="text-xs text-slate-400 font-medium">₹4,899</span> */}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 📱 / 🖥️ Center Column (Results) */}
                <div className="col-span-1 md:col-span-9 lg:col-span-6 space-y-4 md:space-y-6">

                    {loading && (
                        <div className="space-y-4 md:space-y-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <FlightCardSkeleton key={i} />
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-red-100">
                            <div className="text-red-500 font-bold mb-2">Oops! Something went wrong</div>
                            <p className="text-slate-500 text-sm">{error}</p>
                            <button onClick={() => window.location.reload()} className="mt-4 bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">Try Again</button>
                        </div>
                    )}

                    {!loading && !error && filteredFlights.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                            <Plane size={48} className="text-slate-300 mb-4" />
                            <p className="text-slate-500 font-medium">No flights match your filters.</p>
                            <button onClick={() => setFilters({ maxPrice: stats.maxPrice, stops: [], airlines: [], times: [] })} className="mt-4 text-blue-600 font-bold text-sm">Clear Filters</button>
                        </div>
                    )}

                    {!loading && !error && filteredFlights.map((flight) => (
                        <motion.div
                            key={flight.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`bg-white md:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden group ${selectedFlight === flight.id ? 'ring-2 ring-black ring-offset-2' : ''}`}
                            onClick={() => setSelectedFlight(selectedFlight === flight.id ? null : flight.id)}
                        >
                            <div className="p-3 md:p-5 cursor-pointer">
                                {/* 📱 Mobile Layout (Refined & Polished) */}
                                <div className="md:hidden flex flex-col gap-2 relative">
                                    {/* Row 1: Airline Info */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                                <img src={`https://images.ixigo.com/img/common-resources/airline-new/${flight.airlineCode}.png`} alt={flight.airline} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="font-bold text-slate-800 text-sm">{flight.airline}</span>
                                            <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded-full">{flight.flightNumber}</span>
                                        </div>
                                        {/* Duration Top Right (Optional placement for balance) */}
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                            <Clock size={10} />
                                            <span>{flight.duration}</span>
                                        </div>
                                    </div>

                                    {/* Row 2: Schedule (The Core) */}
                                    <div className="flex items-center justify-between py-1">
                                        {/* Departure */}
                                        <div className="text-left">
                                            <div className="text-xl font-black text-slate-900 leading-none">{flight.departure.time}</div>
                                            <div className="text-xs font-bold text-slate-400 mt-0.5">{flight.departure.airport}</div>
                                        </div>

                                        {/* Visual Connector */}
                                        <div className="flex flex-col items-center flex-1 px-4">
                                            <div className="w-full h-[1px] bg-slate-200 relative flex items-center justify-center">
                                                <div className="w-1 h-1 rounded-full bg-slate-300 absolute left-0"></div>
                                                <div className="w-1 h-1 rounded-full bg-slate-300 absolute right-0"></div>
                                                <Plane size={12} className="text-slate-300 rotate-90 bg-white px-1" />
                                            </div>
                                            <div className="text-[9px] font-bold text-slate-400 mt-1">{flight.stops}</div>
                                        </div>

                                        {/* Arrival */}
                                        <div className="text-right">
                                            <div className="text-xl font-black text-slate-900 leading-none">{flight.arrival.time}</div>
                                            <div className="text-xs font-bold text-slate-400 mt-0.5">{flight.arrival.airport}</div>
                                        </div>
                                    </div>

                                    {/* Row 3: Action Area (Tags | Price | Button) */}
                                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-dashed border-slate-100">
                                        {/* Tags */}
                                        <div className="flex items-center gap-1">
                                            {flight.benefits.includes("Refundable") ? (
                                                <div className="flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                                    <ShieldCheck size={9} />
                                                    <span>Refundable</span>
                                                </div>
                                            ) : (
                                                <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                                                    {flight.tags[0] || "Economy"}
                                                </span>
                                            )}
                                        </div>

                                        {/* Price & Book */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-end">
                                                <span className="text-lg font-black text-slate-900 leading-tight">₹{flight.price.toLocaleString()}</span>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBook(flight);
                                                }}
                                                className="bg-black text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-lg shadow-black/10 active:scale-95 transition-transform"
                                            >
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 🖥️ Desktop Layout (Hidden on Mobile) */}
                                <div className="hidden md:flex flex-row md:items-center justify-between gap-3 md:gap-0">

                                    {/* Airline Info */}
                                    <div className="flex items-center space-x-3 min-w-[120px]">
                                        <div className="w-10 h-10 flex items-center justify-center">
                                            <img src={`https://images.ixigo.com/img/common-resources/airline-new/${flight.airlineCode}.png`} alt={flight.airline} className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm md:text-base">{flight.airline}</div>
                                            <div className="text-[10px] md:text-xs text-slate-400 font-medium">{flight.flightNumber}</div>
                                        </div>
                                    </div>

                                    {/* Flight Schedule - Desktop */}
                                    <div className="hidden md:flex flex-1 px-4 items-center justify-center space-x-8">
                                        <div className="text-center w-16">
                                            <div className="text-xl font-black text-slate-900">{flight.departure.time}</div>
                                            <div className="text-[10px] font-bold text-slate-400">{flight.departure.airport}</div>
                                        </div>

                                        <div className="flex flex-col items-center flex-1 max-w-[120px]">
                                            <div className="text-[10px] font-bold text-slate-400 mb-1">{flight.duration}</div>
                                            <div className="w-full h-[1px] bg-slate-300 relative flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 absolute left-0"></div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 absolute right-0"></div>
                                                <Plane size={14} className="text-slate-400 rotate-90 bg-white px-0.5" />
                                            </div>
                                            <div className="text-[10px] font-bold text-slate-500 mt-1">{flight.stops}</div>
                                        </div>

                                        <div className="text-center w-16">
                                            <div className="text-xl font-black text-slate-900">{flight.arrival.time}</div>
                                            <div className="text-[10px] font-bold text-slate-400">{flight.arrival.airport}</div>
                                        </div>
                                    </div>

                                    {/* Mobile Flight Schedule Row */}
                                    <div className="md:hidden flex items-center justify-between mt-1 mb-1 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                                        <div>
                                            <div className="text-lg font-black text-slate-900">{flight.departure.time}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">{flight.departure.airport}</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-bold mb-0.5">
                                                <Clock size={10} />
                                                <span>{flight.duration}</span>
                                            </div>
                                            <div className="w-16 h-[1px] bg-slate-300 relative my-1">
                                                <div className="absolute right-0 -top-1">
                                                    <Plane size={10} className="text-slate-400 rotate-90" />
                                                </div>
                                            </div>
                                            <div className="text-[9px] font-bold text-slate-500">{flight.stops}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-black text-slate-900">{flight.arrival.time}</div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase">{flight.arrival.airport}</div>
                                        </div>
                                    </div>

                                    {/* Price & CTA */}
                                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center min-w-[100px] mt-1 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 md:border-l md:pl-6">
                                        <div className="text-left md:text-right">
                                            <div className="text-xl md:text-2xl font-black text-slate-900">₹{flight.price.toLocaleString()}</div>
                                            <div className="text-[10px] md:text-xs text-slate-400 font-medium line-through">₹{Math.round(flight.price * 1.2).toLocaleString()}</div>
                                        </div>

                                        <button
                                            // onClick={() => handleBook(flight)} // Desktop already has one
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBook(flight);
                                            }}
                                            className="hidden md:flex bg-black hover:bg-slate-800 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 transition-all mt-1 active:scale-95"
                                        >
                                            Book Now
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleBook(flight);
                                            }}
                                            className="md:hidden bg-black text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-md shadow-slate-900/10 active:scale-95 transition-transform"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="hidden md:flex mt-2 items-center space-x-2">
                                    {flight.tags.map((tag: string) => (
                                        <span key={tag} className={`text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase tracking-wide border border-emerald-100`}>
                                            {tag}
                                        </span>
                                    ))}
                                    {flight.benefits.includes("Refundable") && (
                                        <div className="flex items-center space-x-1 text-[9px] md:text-[10px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                            <ShieldCheck size={10} />
                                            <span>Refundable</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Expanded Details Section */}
                            <AnimatePresence>
                                {selectedFlight === flight.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-slate-50 border-t border-slate-100"
                                    >
                                        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-2 space-y-4">
                                                <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                                                    <Info size={14} />
                                                    <span>Flight Details</span>
                                                </h4>
                                                <div className="bg-white p-4 rounded-xl border border-slate-200">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                                                            <div className="w-0.5 h-16 bg-slate-200 my-1"></div>
                                                            <div className="w-3 h-3 border-2 border-slate-300 rounded-full bg-white"></div>
                                                        </div>
                                                        <div className="flex-1 space-y-6">
                                                            <div>
                                                                <div className="text-sm font-bold text-slate-800">Indore (IDR)</div>
                                                                <div className="text-xs text-slate-500">{flight.departure.time} • 12 Dec</div>
                                                                <div className="text-xs text-slate-400 mt-1">Devi Ahilyabai Holkar Airport, Terminal 1</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold text-slate-800">New Delhi (DEL)</div>
                                                                <div className="text-xs text-slate-500">{flight.arrival.time} • 12 Dec</div>
                                                                <div className="text-xs text-slate-400 mt-1">Indira Gandhi International Airport, Terminal 3</div>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                                Baggage: 15kg
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                                                    <CreditCard size={14} />
                                                    <span>Fare Breakdown</span>
                                                </h4>
                                                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Base Fare</span>
                                                        <span className="font-bold text-slate-800">₹{flight.price - 850}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Taxes & Surcharges</span>
                                                        <span className="font-bold text-slate-800">₹850</span>
                                                    </div>
                                                    <div className="h-[1px] bg-slate-100 my-2"></div>
                                                    <div className="flex justify-between text-base">
                                                        <span className="font-bold text-slate-800">Total</span>
                                                        <span className="font-black text-slate-900">₹{flight.price}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2 text-xs text-green-600 bg-green-50 p-2 rounded-lg font-medium">
                                                    <Zap size={12} fill="currentColor" />
                                                    <span>You save ₹350 with this fare!</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* 🖥️ Desktop Right Sidebar */}
                <div className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28 h-fit">
                    {!user && (
                        <div className="bg-black rounded-2xl p-6 text-white text-center shadow-xl shadow-slate-900/20">
                            <h3 className="text-xl font-bold mb-2">Login now</h3>
                            <p className="text-slate-400 text-sm mb-4">Login to save more with exclusive pricing and offers.</p>
                            <button
                                onClick={() => login()}
                                className="bg-white text-black px-6 py-2 rounded-xl font-bold text-sm w-full hover:bg-slate-200 transition-colors"
                            >
                                Login / Sign up
                            </button>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
                            <Zap className="mr-2 text-yellow-500" size={18} fill="currentColor" />
                            Offers for you
                        </h3>
                        <div className="space-y-4">
                            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                <div className="text-xs font-bold text-slate-500 uppercase">HDFC Bank</div>
                                <div className="font-bold text-slate-800 mt-1">Flat ₹500 OFF</div>
                                <div className="text-xs text-slate-400 mt-1">Use code: HDFC500</div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                <div className="text-xs font-bold text-slate-500 uppercase">UPI Payment</div>
                                <div className="font-bold text-slate-800 mt-1">Zero Convenience Fee</div>
                                <div className="text-xs text-slate-400 mt-1">Pay via UPI</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* 📱 Mobile Bottom Nav */}
            <BottomNav />

            {/* 🖥️ Desktop Footer (Simplified) */}
            <div className="hidden md:block mt-20 border-t border-slate-200 bg-white py-12">
                <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-4 gap-8">
                    <div>
                        <h4 className="font-bold text-slate-800 mb-4">About Us</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li>Our Story</li>
                            <li>Careers</li>
                            <li>Press</li>
                            <li>Blog</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li>Help Center</li>
                            <li>Cancellations</li>
                            <li>Refunds</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                            <li>Cookie Policy</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 mb-2">Subscribe</h4>
                        <p className="text-xs text-slate-400 mb-4">Get the latest travel deals sent to your inbox.</p>
                        <div className="flex space-x-2">
                            <input type="email" placeholder="Email address" className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm w-full outline-none focus:border-blue-500" />
                            <button className="bg-black text-white px-4 py-2 rounded-lg font-bold text-xs">Join</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modify Search Modal */}
            <AnimatePresence>
                {isModifySearchOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModifySearchOpen(false)}
                            className="absolute inset-0 cursor-pointer"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-5xl bg-transparent relative z-10 pointers-events-none"
                        >
                            <div className="bg-white rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                                <button
                                    onClick={() => setIsModifySearchOpen(false)}
                                    className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-50"
                                >
                                    <X size={20} />
                                </button>
                                <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Modify Search</h3>
                                <SearchWidget
                                    initialState={{
                                        fromCode: searchParams.get('from') || undefined,
                                        toCode: searchParams.get('to') || undefined,
                                        date: searchParams.get('date') || undefined,
                                        adults: parseInt(searchParams.get('adults') || '1'),
                                        children: parseInt(searchParams.get('children') || '0'),
                                        infants: parseInt(searchParams.get('infants') || '0'),
                                        cabinClass: searchParams.get('class') || undefined,
                                        journeyType: searchParams.get('journeyType') || undefined
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Mobile Filters Modal */}
            <AnimatePresence>
                {isFilterOpen && (
                    <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/50 backdrop-blur-sm md:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsFilterOpen(false)}
                            className="absolute inset-0 cursor-pointer"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="bg-white w-full rounded-t-[2rem] shadow-2xl relative z-10 h-[80vh] flex flex-col overflow-hidden"
                        >
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-800">Filters</h3>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setFilters({ maxPrice: stats.maxPrice, stops: [], airlines: [], times: [] })}
                                        className="text-xs font-bold text-blue-600"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={() => setIsFilterOpen(false)}
                                        className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* Price Slider Filter */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Price Range</label>
                                    <input
                                        type="range"
                                        min={stats.minPrice}
                                        max={stats.maxPrice}
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                                        className="w-full accent-black h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between mt-2 text-sm font-bold text-slate-700">
                                        <span>₹{stats.minPrice.toLocaleString()}</span>
                                        <span>₹{filters.maxPrice.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Stops */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Stops</label>
                                    <div className="space-y-3">
                                        {['Non-stop', '1 Stop', '2+ Stops'].map((stop, i) => (
                                            <label key={i} className="flex items-center space-x-3 cursor-pointer group">
                                                <div
                                                    onClick={() => toggleFilter('stops', stop)}
                                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${filters.stops.includes(stop) ? 'border-black bg-black' : 'border-slate-300 group-hover:border-black'}`}
                                                >
                                                    {filters.stops.includes(stop) && <Check size={12} className="text-white" />}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">{stop}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Departure Time */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Departure Time</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Morning', 'Afternoon', 'Evening', 'Night'].map((time, i) => (
                                            <button
                                                key={i}
                                                onClick={() => toggleFilter('times', time)}
                                                className={`p-2 rounded-lg border text-xs font-bold transition-all ${filters.times.includes(time) ? 'bg-black border-black text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Airlines */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Airlines</label>
                                    <div className="space-y-3">
                                        {stats.airlines.map((airlineObj, i) => (
                                            <label key={i} className="flex items-center justify-between cursor-pointer group">
                                                <div className="flex items-center space-x-3">
                                                    <div
                                                        onClick={() => toggleFilter('airlines', airlineObj.name)}
                                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${filters.airlines.includes(airlineObj.name) ? 'border-black bg-black' : 'border-slate-300 group-hover:border-black'}`}
                                                    >
                                                        {filters.airlines.includes(airlineObj.name) && <Check size={12} className="text-white" />}
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <img src={`https://images.ixigo.com/img/common-resources/airline-new/${airlineObj.code}.png`} alt={airlineObj.name} className="w-6 h-6 object-contain" />
                                                        <span className="text-sm font-medium text-slate-700">{airlineObj.name}</span>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border-t border-slate-100">
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="w-full bg-black text-white py-3 rounded-xl font-bold shadow-lg shadow-black/20 active:scale-95 transition-transform"
                                >
                                    Show {filteredFlights.length} Flights
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}

export default function SearchResultsPage() {
    return (
        <Suspense fallback={
            <div className="max-w-[1400px] mx-auto p-6 space-y-4">
                <FlightCardSkeleton />
                <FlightCardSkeleton />
                <FlightCardSkeleton />
            </div>
        }>
            <SearchResultsContent />
        </Suspense>
    );
}
