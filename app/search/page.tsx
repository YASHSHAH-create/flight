'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
    ArrowLeft, Edit2, SlidersHorizontal, ArrowUpDown, Clock,
    Luggage, Plane, ChevronDown, Check, Heart, X, Info,
    ChevronRight, CreditCard, ShieldCheck, Zap, ArrowRight,
    Filter, MapPin, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchResponse, FlightResult } from '../../types/api';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import SearchWidget from '../components/search-widget';
import BottomNav from '../components/BottomNav';

// --- Helper Functions ---

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

// --- Components ---

const FlightCardSkeleton = () => (
    <div className="bg-white rounded-[1.5rem] shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 p-5 animate-pulse mb-4 h-[180px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 h-full">
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                <div className="space-y-2">
                    <div className="w-32 h-5 bg-slate-100 rounded"></div>
                    <div className="w-20 h-3 bg-slate-100 rounded"></div>
                </div>
            </div>
            <div className="hidden md:flex flex-1 justify-center space-x-12">
                <div className="w-16 h-8 bg-slate-100 rounded"></div>
                <div className="w-24 h-4 bg-slate-100 rounded"></div>
                <div className="w-16 h-8 bg-slate-100 rounded"></div>
            </div>
            <div className="flex flex-col items-end space-y-3">
                <div className="w-24 h-8 bg-slate-100 rounded-lg"></div>
                <div className="w-32 h-10 bg-slate-100 rounded-xl"></div>
            </div>
        </div>
    </div>
);

const FilterSection = ({ title, defaultOpen = true, children }: { title: string, defaultOpen?: boolean, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-slate-100 py-5 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full mb-3 group"
            >
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors uppercase tracking-wider">{title}</h4>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-2.5 pt-1">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Checkbox = ({ label, checked, onChange, count }: { label: string, checked: boolean, onChange: () => void, count?: number | string }) => (
    <label className="flex items-center justify-between cursor-pointer group py-1.5 select-none" onClick={(e) => { e.stopPropagation(); onChange(); }}>
        <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-all relative ${checked ? 'border-black bg-black' : 'border-slate-200 bg-white group-hover:border-slate-300'}`}>
                <Check size={10} className={`text-white transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} />
            </div>
            <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
        </div>
        {count && <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">{count}</span>}
    </label>
);

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, login } = useAuth();
    const [selectedFlight, setSelectedFlight] = useState<number | null>(null);
    const [flights, setFlights] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModifySearchOpen, setIsModifySearchOpen] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

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
        if (flight.price > filters.maxPrice) return false;
        if (filters.stops.length > 0 && !filters.stops.includes(flight.stops)) return false;
        if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) return false;

        if (filters.times.length > 0) {
            const hour = parseInt(flight.departure.time.split(':')[0]);
            const isMorning = hour >= 6 && hour < 12;
            const isAfternoon = hour >= 12 && hour < 18;
            const isEvening = hour >= 18 && hour < 24;
            const isNight = hour >= 0 && hour < 6;

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

    const fetchFlights = async () => {
        setLoading(true);
        setError(null);
        try {
            const adults = searchParams.get('adults') || '1';
            const children = searchParams.get('children') || '0';
            const infants = searchParams.get('infants') || '0';
            const cabinClass = searchParams.get('class') || 'e';
            const journeyType = searchParams.get('journeyType') || '1';

            const from = searchParams.get('from');
            const to = searchParams.get('to');
            const date = searchParams.get('date');

            let apiUrl = `/flights/search?adults=${adults}&children=${children}&infants=${infants}&class=${cabinClass}&journeyType=${journeyType}`;

            if (journeyType === '3') {
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
                apiUrl += `&from=${from}&to=${to}&date=${date}`;
                if (journeyType === '2') {
                    const returnDate = searchParams.get('returnDate');
                    if (returnDate) apiUrl += `&returnDate=${returnDate}`;
                }
            }

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Failed to fetch flights");
            const data: any = await response.json();

            // Validate error in old format if present
            if (data.Response && data.Response.Error && data.Response.Error.ErrorCode !== 0) {
                throw new Error(data.Response.Error.ErrorMessage);
            }

            let results: any[] = [];
            let globalTraceId = "";

            if (Array.isArray(data)) {
                results = data;
            } else if (data.Response && data.Response.Results) {
                results = data.Response.Results[0];
                globalTraceId = data.Response.TraceId;
            }

            if (results && results.length > 0) {
                const mappedFlights = results.map((res: any, index: number) => {
                    let depDate, arrDate;
                    let airline, airlineCode, flightNumber;
                    let originCode, originCity, destCode, destCity;
                    let duration, stops, price, isLCC, isRefundable, seatsLeft;
                    let resultIndex, traceIdValue;

                    // NEW API FORMAT
                    if (res.flights && res.flights.outbound) {
                        const outbound = res.flights.outbound;
                        const segments = outbound.segments;
                        const firstSeg = segments[0];
                        const lastSeg = segments[segments.length - 1];

                        depDate = new Date(firstSeg.depTime);
                        arrDate = new Date(lastSeg.arrTime);

                        airline = outbound.airlineName || firstSeg.airlineName;
                        airlineCode = firstSeg.airlineCode;
                        flightNumber = segments.map((s: any) => `${s.airlineCode}-${s.flightNumber}`).join(', ');

                        originCode = firstSeg.origin;
                        originCity = firstSeg.originCity;
                        destCode = lastSeg.destination;
                        destCity = lastSeg.destinationCity;

                        duration = formatDuration(outbound.duration);
                        stops = outbound.stops === 0 ? "Non-stop" : `${outbound.stops} Stop${outbound.stops > 1 ? 's' : ''}`;

                        price = Math.round(res.price.total);
                        isLCC = res.isLCC;
                        isRefundable = res.isRefundable;
                        seatsLeft = 9;

                        resultIndex = res.resultIndex;
                        traceIdValue = res.searchId;
                    }
                    // OLD API FORMAT
                    else if (res.Segments && res.Segments[0]) {
                        const segment = res.Segments[0][0];
                        const allSegments = res.Segments[0]; // Assuming one leg, but accessing first array of Segments
                        // In old API Segments is Segment[][]. 
                        // Usually Segments[0] is outbound, Segments[1] is return.
                        // Here we are likely looking at one way or just flattening.
                        const lastSegment = allSegments[allSegments.length - 1];

                        depDate = new Date(segment.Origin.DepTime);
                        arrDate = new Date(lastSegment.Destination.ArrTime);

                        airline = segment.Airline.AirlineName;
                        airlineCode = segment.Airline.AirlineCode;
                        flightNumber = `${segment.Airline.AirlineCode}-${segment.Airline.FlightNumber}`;

                        originCode = segment.Origin.Airport.AirportCode;
                        originCity = segment.Origin.Airport.CityName;
                        destCode = lastSegment.Destination.Airport.AirportCode;
                        destCity = lastSegment.Destination.Airport.CityName;

                        duration = formatDuration(segment.Duration);
                        stops = segment.StopOver ? "1 Stop" : "Non-stop";

                        price = Math.round(res.Fare.PublishedFare);
                        isLCC = res.IsLCC;
                        isRefundable = res.IsRefundable;
                        seatsLeft = segment.NoOfSeatAvailable;

                        resultIndex = res.ResultIndex;
                        traceIdValue = globalTraceId;
                    }

                    return {
                        id: index,
                        traceId: traceIdValue,
                        airline: airline || "Unknown Airline",
                        airlineCode: airlineCode || "",
                        flightNumber: flightNumber || "",
                        departure: {
                            time: depDate ? depDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "",
                            airport: originCode || "",
                            city: originCity || ""
                        },
                        arrival: {
                            time: arrDate ? arrDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "",
                            airport: destCode || "",
                            city: destCity || ""
                        },
                        duration: duration || "",
                        stops: stops || "",
                        price: price || 0,
                        tags: isLCC ? ["Economy"] : [],
                        benefits: isRefundable ? ["Refundable"] : [],
                        seatsLeft: seatsLeft || 0,
                        raw: res,
                        resultIndex: resultIndex,
                        depDate,
                        arrDate
                    };
                });

                const prices = mappedFlights.map((f: any) => f.price);
                const minPrice = mappedFlights.length ? Math.min(...prices) : 0;
                const maxPrice = mappedFlights.length ? Math.max(...prices) : 100000;
                const airlineMap = new Map();
                mappedFlights.forEach((f: any) => {
                    if (f.airline && !airlineMap.has(f.airline)) airlineMap.set(f.airline, f.airlineCode);
                });
                const specificAirlines = Array.from(airlineMap.entries()).map(([name, code]) => ({ name, code }));

                setStats({ minPrice, maxPrice, airlines: specificAirlines });
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

    useEffect(() => {
        const from = searchParams.get('from');
        const to = searchParams.get('to');
        const date = searchParams.get('date');

        if (!from || !to || !date) {
            const today = new Date();
            const d = today.getDate().toString().padStart(2, '0');
            const m = (today.getMonth() + 1).toString().padStart(2, '0');
            const y = today.getFullYear();
            const dateParam = `${d}${m}${y}`;
            const defaultUrl = `/search?from=DEL&to=BLR&date=${dateParam}&adults=1&children=0&infants=0&class=e&journeyType=1`;
            router.replace(defaultUrl);
            return;
        }

        fetchFlights();
    }, [searchParams]);

    const handleBook = (flight: any) => {
        const resultIndex = flight.resultIndex ?? (flight.raw.ResultIndex || flight.raw.resultIndex);
        router.push(`/book?traceId=${flight.traceId}&resultIndex=${resultIndex}`);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans selection:bg-blue-100 selection:text-blue-900 pb-24 md:pb-0">

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all duration-300">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-6 flex-1">
                        <Link href="/" className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors border border-transparent hover:border-slate-200 group">
                            <ArrowRight className="w-5 h-5 rotate-180 text-slate-500 group-hover:text-slate-900 transition-colors" />
                        </Link>

                        {/* Search Pill */}
                        <div className="flex items-center bg-slate-100 hover:bg-slate-200/70 transition-colors border border-slate-200 rounded-full px-1.5 py-1.5 cursor-pointer max-w-full md:max-w-auto overflow-hidden">
                            <div className="px-3 md:px-5 border-r border-slate-300/50 flex-shrink-0">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:block">From</div>
                                <div className="text-sm font-bold text-slate-900">{searchParams.get('from')}</div>
                            </div>
                            <div className="px-3 md:px-5 border-r border-slate-300/50 flex-shrink-0">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:block">To</div>
                                <div className="text-sm font-bold text-slate-900">{searchParams.get('to')}</div>
                            </div>
                            <div className="px-3 md:px-5 mr-0 md:mr-2 flex-shrink-0 hidden sm:block">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden md:block">Depart</div>
                                <div className="text-sm font-bold text-slate-900 whitespace-nowrap">{formatDate(searchParams.get('date'))}</div>
                            </div>
                            <button
                                onClick={() => setIsModifySearchOpen(!isModifySearchOpen)}
                                className="w-9 h-9 bg-black rounded-full flex items-center justify-center text-white shadow-md ml-auto md:ml-0"
                            >
                                <Search size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8 lg:py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-[280px] shrink-0">
                        <div className="sticky top-28 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar" data-lenis-prevent>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-2">
                                <h3 className="font-bold text-lg text-slate-900">Filters</h3>
                                <button
                                    onClick={() => setFilters({ maxPrice: stats.maxPrice, stops: [], airlines: [], times: [] })}
                                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide"
                                >
                                    Reset
                                </button>
                            </div>

                            {/* Price Filter */}
                            <div className="py-6 border-b border-slate-100">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Max Price</label>
                                <input
                                    type="range"
                                    min={stats.minPrice}
                                    max={stats.maxPrice}
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black"
                                />
                                <div className="flex justify-between mt-3 text-sm font-bold text-slate-900">
                                    <span>₹{stats.minPrice.toLocaleString()}</span>
                                    <span>₹{filters.maxPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <FilterSection title="Stops">
                                {['Non-stop', '1 Stop', '2+ Stops'].map((stop) => (
                                    <Checkbox
                                        key={stop}
                                        label={stop}
                                        checked={filters.stops.includes(stop)}
                                        onChange={() => toggleFilter('stops', stop)}
                                    />
                                ))}
                            </FilterSection>

                            <FilterSection title="Departure Time">
                                <div className="grid grid-cols-2 gap-2">
                                    {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
                                        <button
                                            key={time}
                                            onClick={() => toggleFilter('times', time)}
                                            className={`py-2 px-1 rounded-lg text-[11px] font-bold border transition-all ${filters.times.includes(time) ? 'bg-black text-white border-black' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </FilterSection>

                            <FilterSection title="Airlines">
                                {stats.airlines.map((airline) => (
                                    <Checkbox
                                        key={airline.name}
                                        label={airline.name}
                                        checked={filters.airlines.includes(airline.name)}
                                        onChange={() => toggleFilter('airlines', airline.name)}
                                    />
                                ))}
                            </FilterSection>
                        </div>
                    </aside>

                    {/* Results Feed */}
                    <div className="flex-1 min-w-0">
                        {/* Sort Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {loading ? 'Searching...' : `Found ${filteredFlights.length} flights`}
                                </h2>
                                <p className="text-slate-500 text-sm mt-0.5">Prices include taxes and fees</p>
                            </div>
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-500">Sort by:</span>
                                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-800 hover:border-slate-300 transition-colors">
                                    Recommended <ChevronDown size={14} className="text-slate-400" />
                                </button>
                            </div>
                        </div>

                        {/* Flights List */}
                        <div className="space-y-4">
                            {loading && [1, 2, 3, 4, 5].map(i => <FlightCardSkeleton key={i} />)}

                            {!loading && !error && filteredFlights.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Plane size={32} className="text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">No flights found</h3>
                                    <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm">We couldn't find any flights matching your filters. Try adjusting them.</p>
                                    <button
                                        onClick={() => setFilters({ maxPrice: stats.maxPrice, stops: [], airlines: [], times: [] })}
                                        className="mt-6 px-6 py-2 bg-black text-white rounded-full font-bold text-sm"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            )}

                            {!loading && filteredFlights.map((flight) => (
                                <motion.div
                                    key={flight.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group bg-white rounded-[1.5rem] shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 transition-all duration-300 overflow-hidden cursor-pointer"
                                    onClick={() => setSelectedFlight(selectedFlight === flight.id ? null : flight.id)}
                                >
                                    <div className="p-5 md:p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                            {/* Airline Info */}
                                            <div className="flex items-center gap-4 min-w-[140px]">
                                                <div className="w-12 h-12 rounded-xl bg-slate-50 p-2 flex items-center justify-center border border-slate-100">
                                                    <img src={`https://images.ixigo.com/img/common-resources/airline-new/${flight.airlineCode}.png`} alt={flight.airline} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-base">{flight.airline}</div>
                                                    <div className="text-xs font-semibold text-slate-400 mt-0.5">{flight.flightNumber}</div>
                                                </div>
                                            </div>

                                            {/* Flight Path (Desktop) */}
                                            <div className="hidden md:flex flex-1 items-center justify-center gap-8 lg:gap-12">
                                                <div className="text-center w-20">
                                                    <div className="text-xl font-black text-slate-900">{flight.departure.time}</div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">{flight.departure.airport}</div>
                                                </div>

                                                <div className="flex flex-col items-center flex-1 max-w-[140px]">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{flight.duration}</div>
                                                    <div className="w-full h-[2px] bg-slate-100 relative rounded-full overflow-hidden">
                                                        <div className="absolute inset-0 bg-slate-200"></div>
                                                    </div>
                                                    <div className="text-[10px] font-bold text-slate-500 mt-1.5">{flight.stops}</div>
                                                </div>

                                                <div className="text-center w-20">
                                                    <div className="text-xl font-black text-slate-900">{flight.arrival.time}</div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase mt-1">{flight.arrival.airport}</div>
                                                </div>
                                            </div>

                                            {/* Mobile Flight Path */}
                                            <div className="md:hidden flex items-center justify-between bg-slate-50 rounded-xl p-4 border border-slate-100">
                                                <div>
                                                    <div className="text-lg font-black text-slate-900">{flight.departure.time}</div>
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase">{flight.departure.airport}</div>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <div className="text-[10px] font-bold text-slate-400 mb-1">{flight.duration}</div>
                                                    <Plane size={14} className="text-slate-300 rotate-90" />
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1">{flight.stops}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-black text-slate-900">{flight.arrival.time}</div>
                                                    <div className="text-[10px] font-bold text-slate-500 uppercase">{flight.arrival.airport}</div>
                                                </div>
                                            </div>

                                            {/* Price & Action */}
                                            <div className="flex items-center justify-between md:flex-col md:items-end gap-1 md:gap-3 border-t md:border-0 border-slate-100 pt-4 md:pt-0 mt-2 md:mt-0">
                                                <div className="text-left md:text-right">
                                                    <div className="text-2xl font-black text-slate-900">₹{flight.price.toLocaleString()}</div>
                                                    <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">Get ₹350 off</div>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleBook(flight); }}
                                                    className="bg-black hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-900/10 active:scale-95 transition-all flex items-center gap-2 group/btn"
                                                >
                                                    Book
                                                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    <AnimatePresence>
                                        {selectedFlight === flight.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-slate-100 bg-slate-50/50"
                                            >
                                                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="md:col-span-2 space-y-3">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flight Itinerary</h4>
                                                        {(flight.raw.flights?.outbound?.segments || flight.raw.Segments?.[0] || []).map((seg: any, idx: number, arr: any[]) => {
                                                            const isNew = !!flight.raw.flights;
                                                            const depTime = isNew ? new Date(seg.depTime) : new Date(seg.Origin.DepTime);
                                                            const arrTime = isNew ? new Date(seg.arrTime) : new Date(seg.Destination.ArrTime);
                                                            const duration = isNew ? formatDuration(seg.duration) : formatDuration(seg.Duration);
                                                            const layover = isNew ? seg.layoverTime : 0;

                                                            return (
                                                                <div key={idx} className="mb-4 last:mb-0">
                                                                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative">
                                                                        <div className="flex gap-4">
                                                                            <div className="flex flex-col items-center pt-2">
                                                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ring-4 ring-slate-100"></div>
                                                                                <div className="w-0.5 h-full bg-slate-200 min-h-[60px] my-1"></div>
                                                                                <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-800"></div>
                                                                            </div>
                                                                            <div className="flex-1 space-y-6">
                                                                                <div>
                                                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                                                                        <span>{depTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                                                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                                        <span>{isNew ? seg.originCity : seg.Origin.Airport.CityName} ({isNew ? seg.origin : seg.Origin.Airport.AirportCode})</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div>
                                                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                                                                                        <span>{arrTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                                                                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                                        <span>{isNew ? seg.destinationCity : seg.Destination.Airport.CityName} ({isNew ? seg.destination : seg.Destination.Airport.AirportCode})</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="absolute top-5 right-5 text-right">
                                                                            <div className="text-xs font-bold text-slate-900">{isNew ? seg.airlineCode : seg.Airline.AirlineCode}-{isNew ? seg.flightNumber : seg.Airline.FlightNumber}</div>
                                                                            <div className="text-[10px] font-bold text-slate-400 mt-0.5">{duration}</div>
                                                                        </div>
                                                                        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-4 text-xs font-medium text-slate-500">
                                                                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                                                <Luggage size={12} />
                                                                                <span>Check-in: {isNew ? seg.baggage : seg.Baggage}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                                                <Luggage size={12} />
                                                                                <span>Cabin: 7kg</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {idx < arr.length - 1 && layover > 0 && (
                                                                        <div className="flex items-center justify-center py-3">
                                                                            <div className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200">
                                                                                Layover: {formatDuration(layover)}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Fare Breakdown</h4>
                                                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                                                            <div className="flex justify-between text-sm text-slate-600">
                                                                <span>Base Fare</span>
                                                                <span className="font-bold text-slate-900">₹{flight.price - 850}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm text-slate-600">
                                                                <span>Taxes & Fees</span>
                                                                <span className="font-bold text-slate-900">₹850</span>
                                                            </div>
                                                            <div className="h-px bg-slate-100"></div>
                                                            <div className="flex justify-between text-base">
                                                                <span className="font-bold text-slate-900">Total</span>
                                                                <span className="font-black text-slate-900">₹{flight.price}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>



            {/* Modify Search Modal */}
            <AnimatePresence>
                {isModifySearchOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModifySearchOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-y-auto"
                            data-lenis-prevent
                        >
                            <div className="flex min-h-full items-center justify-center p-4 md:p-6">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full max-w-5xl bg-transparent relative"
                                >
                                    <button
                                        onClick={() => setIsModifySearchOpen(false)}
                                        className="absolute -top-12 right-0 md:-right-12 text-white/80 hover:text-white p-2"
                                    >
                                        <X size={32} />
                                    </button>

                                    <SearchWidget
                                        initialState={{
                                            fromCode: searchParams.get('from') || 'DEL',
                                            toCode: searchParams.get('to') || 'BLR',
                                            date: searchParams.get('date')?.replace(/-/g, '') || '',
                                            adults: parseInt(searchParams.get('adults') || '1'),
                                            children: parseInt(searchParams.get('children') || '0'),
                                            infants: parseInt(searchParams.get('infants') || '0'),
                                            cabinClass: searchParams.get('class') || 'e',
                                            journeyType: searchParams.get('journeyType') || '1'
                                        }}
                                        className="!mt-0 shadow-2xl"
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Filter Modal */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilters(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] z-50 lg:hidden max-h-[85vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white p-5 flex justify-between items-center border-b border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900">Filters</h3>
                                <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-slate-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 pb-24 space-y-6">
                                {/* Duplicate controls for mobile */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Max Price</label>
                                    <input
                                        type="range"
                                        min={stats.minPrice}
                                        max={stats.maxPrice}
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-black"
                                    />
                                    <div className="flex justify-between mt-3 text-sm font-bold text-slate-900">
                                        <span>₹{stats.minPrice.toLocaleString()}</span>
                                        <span>₹{filters.maxPrice.toLocaleString()}</span>
                                    </div>
                                </div>
                                <FilterSection title="Stops">
                                    {['Non-stop', '1 Stop', '2+ Stops'].map((stop) => (
                                        <Checkbox
                                            key={stop}
                                            label={stop}
                                            checked={filters.stops.includes(stop)}
                                            onChange={() => toggleFilter('stops', stop)}
                                        />
                                    ))}
                                </FilterSection>
                                <FilterSection title="Departure Time">
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => toggleFilter('times', time)}
                                                className={`py-3 px-1 rounded-xl text-xs font-bold border transition-all ${filters.times.includes(time) ? 'bg-black text-white border-black' : 'bg-slate-50 text-slate-600 border-slate-100'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </FilterSection>
                            </div>
                            <div className="sticky bottom-0 bg-white p-4 border-t border-slate-100 flex gap-4">
                                <button className="flex-1 font-bold text-slate-500" onClick={() => setFilters({ maxPrice: stats.maxPrice, stops: [], airlines: [], times: [] })}>Reset</button>
                                <button onClick={() => setShowMobileFilters(false)} className="flex-[2] bg-black text-white py-3.5 rounded-xl font-bold">Apply Filters</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <BottomNav onFilterClick={() => setShowMobileFilters(true)} />
        </div>
    );
}

export default function SearchResults() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div></div>}>
            <SearchResultsContent />
        </Suspense>
    );
}
