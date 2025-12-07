'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, Plane, Info, AlertCircle,
    ChevronDown, ShieldCheck, Luggage, Utensils,
    Armchair, Plus, ArrowRight, Lock, X, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FareQuoteResponse, FareRuleResponse, SSRResponse } from '@/types/api';

const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });
};

const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};

import { Suspense } from 'react';

function BookPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const traceId = searchParams.get('traceId');
    const resultIndex = searchParams.get('resultIndex');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fareQuote, setFareQuote] = useState<FareQuoteResponse['data']['Results'] | null>(null);
    const [fareRules, setFareRules] = useState<FareRuleResponse['data']['FareRules'] | null>(null);
    const [ssrData, setSsrData] = useState<SSRResponse['data'] | null>(null);
    const [expandedRule, setExpandedRule] = useState(false);
    const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState<any | null>(null); // Type 'Seat' from ssrData
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<any | null>(null); // Type 'Meal'
    const [isBaggageModalOpen, setIsBaggageModalOpen] = useState(false);
    const [selectedBaggage, setSelectedBaggage] = useState<any | null>(null); // Type 'Baggage'

    // Helper to get seat status color
    const getSeatColor = (availability: number, type: number, isSelected: boolean) => {
        if (isSelected) return "bg-blue-600 border-blue-600 text-white shadow-md scale-110 z-10";
        if (availability !== 1) return "bg-slate-100 text-slate-300 cursor-not-allowed border-transparent"; // Booked/Blocked
        if (type === 1) return "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300"; // Window
        if (type === 2) return "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300"; // Aisle
        return "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"; // Middle
    };

    const handleSeatSelect = (seat: any) => {
        if (seat.AvailablityType === 1) {
            setSelectedSeat(selectedSeat?.Code === seat.Code ? null : seat);
        }
    };

    const handleMealSelect = (meal: any) => {
        setSelectedMeal(selectedMeal?.Code === meal.Code ? null : meal);
    };

    const handleBaggageSelect = (bag: any) => {
        setSelectedBaggage(selectedBaggage?.Code === bag.Code ? null : bag);
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!traceId || !resultIndex) {
                // setError("Invalid flight details");
                // For dev flow, we might want to redirect, but let's show error
                setLoading(false);
                return;
            }

            try {
                // Fetch Fare Quote
                const quoteRes = await fetch('http://localhost:3001/flights/fare-quote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ traceId, resultIndex })
                });
                const quoteData: FareQuoteResponse = await quoteRes.json();

                if (!quoteData.success || !quoteData.data || quoteData.data.Error.ErrorCode !== 0) {
                    throw new Error(quoteData.data?.Error?.ErrorMessage || "Failed to fetch fare quote");
                }
                setFareQuote(quoteData.data.Results);

                // Fetch Fare Rules
                const ruleRes = await fetch('http://localhost:3001/flights/fare-rule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ traceId, resultIndex })
                });
                const ruleData: FareRuleResponse = await ruleRes.json();

                if (ruleData.success && ruleData.data?.FareRules) { // Removed ErrorCode check as it might not be consistent or present in success case directly
                    setFareRules(ruleData.data.FareRules);
                }

                // Fetch SSR (Seat Map)
                const ssrRes = await fetch('http://localhost:3001/flights/ssr', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ traceId, resultIndex })
                });
                const ssrResponse: SSRResponse = await ssrRes.json();

                if (ssrResponse.success && ssrResponse.data) {
                    setSsrData(ssrResponse.data);

                    // Helper log for verification (as requested)
                    if (ssrResponse.data.SeatDynamic) {
                        console.log("✈️ Seat Map Loaded:", ssrResponse.data.SeatDynamic.length + " Segments");
                    }
                }

                setLoading(false);
            } catch (err: unknown) {
                console.error(err);
                const errorMessage = err instanceof Error ? err.message : "An error occurred fetching flight details.";
                setError(errorMessage);
                setLoading(false);
            }
        };

        fetchData();
    }, [traceId, resultIndex]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-lg font-bold text-slate-800">Verifying Fare...</h2>
                <p className="text-slate-500 text-sm">Please wait while we confirm the latest price and availability.</p>
            </div>
        );
    }

    if (error || !fareQuote) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h2>
                <p className="text-slate-500 mb-6 max-w-md">{error || "Unable to load flight details. Please try again."}</p>
                <button onClick={() => router.back()} className="px-6 py-3 bg-black text-white rounded-xl font-bold">Go Back</button>
            </div>
        );
    }

    const segment = fareQuote.Segments[0][0]; // Assuming single leg for simplicity
    const airlineCode = segment.Airline.AirlineCode;
    const airlineName = segment.Airline.AirlineName;
    const flightNumber = segment.Airline.AirlineCode + "-" + segment.Airline.FlightNumber; // Changed to match display

    // Calculate total duration (naive, just taking segment duration)
    // For proper multi-segment, we'd sum durations + layovers. 
    // TBO response usually gives accumulation of segments.
    // Let's use the first segment duration for now or the sum if we had mapped it properly. 
    // Actually the 'Duration' in the segment is just for that segment. 
    // If there are multiple segments, fareQuote.Segments[0] is array of segments.
    const segments = fareQuote.Segments[0];
    const firstLeg = segments[0];
    const lastLeg = segments[segments.length - 1];

    // Using any logic because Segments[0] is actually Segment[] and we want to sum properties
    const totalDuration = segments.reduce((acc: number, seg: any) => acc + seg.Duration, 0) + (segments.length > 1 ? (segments.length - 1) * 60 : 0); // rough estimate for layover
    const stops = segments.length - 1;

    return (
        <div className="min-h-screen bg-slate-50 pb-32 md:pb-10 font-sans">

            {/* 📱 Mobile Top Bar */}
            <div className="md:hidden sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center space-x-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-slate-800" />
                </button>
                <div>
                    <h1 className="font-bold text-lg text-slate-900 leading-tight">Flight Details</h1>
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <div className="font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{airlineCode}</div>
                        <span>{airlineName}</span>
                    </div>
                </div>
            </div>

            {/* 🖥️ Desktop Header (Simplified) */}
            <div className="hidden md:block bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft size={24} className="text-slate-800" />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-900">Flight Details</h1>
                    </div>
                    <div className="text-sm font-medium text-slate-500">
                        Step 2 of 3 • Review Booking
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Main Details) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Flight Summary Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="bg-slate-50/50 p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                                    {airlineCode}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">{airlineName}</div>
                                    <div className="text-xs text-slate-500 font-medium">{flightNumber} • {firstLeg.Craft}</div>
                                </div>
                            </div>
                            <div className="mt-2 md:mt-0 flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                <ShieldCheck size={14} />
                                <span className="hidden md:inline">Fare Verified</span>
                                <span className="md:hidden">Verified</span>
                            </div>
                        </div>

                        <div className="p-5 md:p-8">
                            <div className="relative pl-8 md:pl-0">
                                {/* Vertical Timeline Line */}
                                <div className="absolute left-[7px] top-3 bottom-0 w-[2px] border-l-2 border-dashed border-slate-200 md:hidden"></div>

                                {/* Departure */}
                                <div className="relative mb-10 md:mb-0 md:flex md:justify-between md:items-center">
                                    <div className="md:hidden absolute -left-[29px] top-1.5 w-4 h-4 rounded-full bg-slate-100 border-4 border-white shadow-sm z-10"></div>
                                    <div className="w-full">
                                        <div className="text-slate-400 text-xs font-bold uppercase mb-1 tracking-wider">Departure</div>
                                        <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{formatTime(firstLeg.Origin.DepTime)}</div>
                                        <div className="text-lg md:text-xl font-bold text-slate-800 mt-1">{firstLeg.Origin.Airport.CityName} <span className="text-slate-400 font-normal">({firstLeg.Origin.Airport.AirportCode})</span></div>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{formatDate(firstLeg.Origin.DepTime)}</div>
                                            <div className="text-sm text-slate-400">Terminal {firstLeg.Origin.Airport.Terminal}</div>
                                        </div>
                                    </div>

                                    {/* Duration (Desktop Center) */}
                                    <div className="hidden md:flex flex-col items-center px-12">
                                        <div className="text-xs font-bold text-slate-400 mb-2">{formatDuration(totalDuration)}</div>
                                        <div className="w-32 h-0.5 bg-slate-200 relative flex items-center justify-between">
                                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                            <div className="bg-white px-2 relative z-10">
                                                <Plane size={20} className="text-slate-300 rotate-90" />
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                        </div>
                                        <div className="text-xs font-bold text-slate-400 mt-2">{stops === 0 ? 'Non-stop' : `${stops} Stop(s)`}</div>
                                    </div>

                                    {/* Desktop Right Side Alignment Placeholder - Arrival is below on mobile but right on desktop? 
                                       Actually the screenshot implies a vertical flow. Let's stick to the mobile vertical flow which transforms to horizontal on desktop 
                                       OR keep vertical on desktop too if that's the "Card" design. 
                                       However, standard desktop flight details usually span horizontally. 
                                       The user specifically asked for "phone view" rearrangement. 
                                       So I will prioritize Mobile Vertical Layout. 
                                    */}
                                </div>

                                {/* Arrival */}
                                <div className="relative md:flex md:justify-end md:text-right">
                                    {/* Mobile Dot */}
                                    <div className="md:hidden absolute -left-[29px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-4 border-white shadow-sm z-10"></div>
                                    <div className="w-full md:w-auto">
                                        <div className="text-slate-400 text-xs font-bold uppercase mb-1 tracking-wider">Arrival</div>
                                        <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{formatTime(lastLeg.Destination.ArrTime)}</div>
                                        <div className="text-lg md:text-xl font-bold text-slate-800 mt-1">{lastLeg.Destination.Airport.CityName} <span className="text-slate-400 font-normal">({lastLeg.Destination.Airport.AirportCode})</span></div>
                                        <div className="flex md:justify-end items-center space-x-2 mt-2">
                                            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{formatDate(lastLeg.Destination.ArrTime)}</div>
                                            <div className="text-sm text-slate-400">Terminal {lastLeg.Destination.Airport.Terminal}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Baggage Info */}
                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="flex items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <div className="mr-3 p-3 bg-white rounded-xl shadow-sm text-slate-600">
                                        <Luggage size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide">Cabin Baggage</div>
                                        <div className="font-black text-slate-900 text-base md:text-lg">{firstLeg.CabinBaggage || "7 KG"}</div>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <div className="mr-3 p-3 bg-white rounded-xl shadow-sm text-slate-600">
                                        <Luggage size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide">Check-in</div>
                                        <div className="font-black text-slate-900 text-base md:text-lg">{firstLeg.Baggage || "15 KG"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fare Rules */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 overflow-hidden">
                        <div onClick={() => setExpandedRule(!expandedRule)} className="flex items-center justify-between cursor-pointer">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center">
                                <Info size={18} className="mr-2 text-slate-400" />
                                Cancellation & Date Change Policy
                            </h3>
                            <ChevronDown size={20} className={`text-slate-400 transition-transform ${expandedRule ? 'rotate-180' : ''}`} />
                        </div>

                        <AnimatePresence>
                            {expandedRule && fareRules && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="pt-4"
                                >
                                    <div className="space-y-4 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <p className="whitespace-pre-line leading-relaxed">{fareRules[0]?.FareRuleDetail || "Fare rules not available."}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>


                    {/* Add-ons Grid */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-900 text-lg">Customize your trip</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                            <div
                                onClick={() => setIsSeatMapOpen(true)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${selectedSeat ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'bg-white border-slate-100 shadow-sm'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-2.5 rounded-xl transition-colors ${selectedSeat ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <Armchair size={20} />
                                    </div>
                                    {selectedSeat && <div className="bg-blue-600 text-white p-1 rounded-full"><Check size={12} /></div>}
                                </div>
                                <h4 className={`font-bold text-sm ${selectedSeat ? 'text-blue-900' : 'text-slate-700'}`}>Seats</h4>
                                <p className="text-[10px] md:text-xs text-slate-500 mt-1 leading-tight line-clamp-2">
                                    {selectedSeat ? `${selectedSeat.SeatNo}` : "Choose seat"}
                                </p>
                            </div>

                            <div
                                onClick={() => setIsMealModalOpen(true)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${selectedMeal ? 'bg-orange-50 border-orange-200 ring-1 ring-orange-200' : 'bg-white border-slate-100 shadow-sm'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-2.5 rounded-xl transition-colors ${selectedMeal ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <Utensils size={20} />
                                    </div>
                                    {selectedMeal && <div className="bg-orange-600 text-white p-1 rounded-full"><Check size={12} /></div>}
                                </div>
                                <h4 className={`font-bold text-sm ${selectedMeal ? 'text-orange-900' : 'text-slate-700'}`}>Meals</h4>
                                <p className="text-[10px] md:text-xs text-slate-500 mt-1 leading-tight line-clamp-2">
                                    {selectedMeal ? "Added" : "Add meals"}
                                </p>
                            </div>

                            <div
                                onClick={() => setIsBaggageModalOpen(true)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${selectedBaggage ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-100 shadow-sm'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`p-2.5 rounded-xl transition-colors ${selectedBaggage ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-50 text-slate-400'}`}>
                                        <Luggage size={20} />
                                    </div>
                                    {selectedBaggage && <div className="bg-indigo-600 text-white p-1 rounded-full"><Check size={12} /></div>}
                                </div>
                                <h4 className={`font-bold text-sm ${selectedBaggage ? 'text-indigo-900' : 'text-slate-700'}`}>Baggage</h4>
                                <p className="text-[10px] md:text-xs text-slate-500 mt-1 leading-tight line-clamp-2">
                                    {selectedBaggage ? `+${selectedBaggage.Weight}kg` : "Add extra"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Important Info */}
                    <div className="bg-yellow-50 rounded-3xl p-6 border border-yellow-100">
                        <h4 className="font-bold text-yellow-800 mb-3 flex items-center">
                            <AlertCircle size={18} className="mr-2" />
                            Important Information
                        </h4>
                        <ul className="space-y-2 text-sm text-yellow-700/80 list-disc list-inside">
                            <li>All passengers must present a valid photo ID during check-in.</li>
                            <li>Check-in counters close 60 minutes before departure.</li>
                        </ul>
                    </div>

                    {/* Mobile Fare Breakup Reveal (Visible only on mobile) */}
                    <div className="lg:hidden bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="p-5">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Fare Breakdown</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Base Fare</span>
                                    <span className="font-bold text-slate-800">₹{fareQuote.Fare.BaseFare.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Taxes & Surcharges</span>
                                    <span className="font-bold text-slate-800">₹{fareQuote.Fare.Tax.toLocaleString()}</span>
                                </div>
                                {selectedSeat && (
                                    <div className="flex justify-between text-blue-600">
                                        <span>Seat Selection</span>
                                        <span className="font-bold">₹{selectedSeat.Price.toLocaleString()}</span>
                                    </div>
                                )}
                                {selectedMeal && (
                                    <div className="flex justify-between text-orange-600">
                                        <span>Meal</span>
                                        <span className="font-bold">₹{selectedMeal.Price.toLocaleString()}</span>
                                    </div>
                                )}
                                {selectedBaggage && (
                                    <div className="flex justify-between text-indigo-600">
                                        <span>Extra Baggage</span>
                                        <span className="font-bold">₹{selectedBaggage.Price.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="h-px bg-slate-100 my-2"></div>
                                <div className="flex justify-between text-lg">
                                    <span className="font-bold text-slate-800">Total Amount</span>
                                    <span className="font-black text-slate-900">
                                        ₹{(fareQuote.Fare.PublishedFare + (selectedSeat?.Price || 0) + (selectedMeal?.Price || 0) + (selectedBaggage?.Price || 0)).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column (Fare Summary) */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sticky top-28">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Fare Summary</h3>

                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Base Fare</span>
                                <span className="font-bold text-slate-800">₹{fareQuote.Fare.BaseFare.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Taxes & Surcharges</span>
                                <span className="font-bold text-slate-800">₹{fareQuote.Fare.Tax.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-slate-100 my-2"></div>
                            <div className="flex justify-between text-lg">
                                <span className="font-bold text-slate-800">Total Amount</span>
                                <span className="font-black text-slate-900">₹{fareQuote.Fare.PublishedFare.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-xl mb-6">
                            <Lock size={12} />
                            <span>100% Safe & Secure Payment</span>
                        </div>

                        <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-black/20 transform active:scale-95 transition-transform flex items-center justify-center">
                            <span>Continue Booking</span>
                            <ArrowRight size={16} className="ml-2" />
                        </button>
                    </div>
                </div>

            </div>

            {/* 📱 Mobile Sticky Bottom CTA */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between safe-area-bottom">
                <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">Total Fare</div>
                    <div className="text-xl font-black text-slate-800">
                        ₹{(fareQuote.Fare.PublishedFare + (selectedSeat?.Price || 0) + (selectedMeal?.Price || 0) + (selectedBaggage?.Price || 0)).toLocaleString()}
                    </div>
                </div>
                <button className="bg-black text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-gray-900/20 active:scale-95 transition-transform flex items-center space-x-2">
                    <span>Continue</span>
                    <ArrowRight size={16} />
                </button>
            </div>

            {/* Seat Map Modal */}
            <AnimatePresence>
                {isSeatMapOpen && ssrData?.SeatDynamic && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSeatMapOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-lg max-h-[80vh] rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
                        >
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">Select Seats</h3>
                                    <p className="text-xs text-slate-500">{airlineCode}-{flightNumber} • {firstLeg.Origin.Airport.CityName} → {firstLeg.Destination.Airport.CityName}</p>
                                </div>
                                <button onClick={() => setIsSeatMapOpen(false)} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                                <div className="flex items-center justify-center space-x-8 mb-8 text-xs font-bold text-slate-500">
                                    <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded bg-slate-200"></div><span>Booked</span></div>
                                    <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded bg-white border border-slate-300"></div><span>Available</span></div>
                                    <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded bg-blue-100 border border-blue-300"></div><span>Window</span></div>
                                </div>

                                {/* Seat Grid */}
                                <div className="space-y-4">
                                    {/* Cockpit / Front */}
                                    <div className="w-full h-12 bg-gradient-to-b from-slate-200/50 to-transparent rounded-t-[50%] mb-4 border-t-4 border-slate-200 mx-auto max-w-[200px]" />

                                    {ssrData.SeatDynamic[0]?.SegmentSeat[0]?.RowSeats?.map((row, rowIndex) => (
                                        <div key={rowIndex} className="flex justify-center space-x-3 md:space-x-4">
                                            {/* Left Side */}
                                            <div className="flex space-x-2">
                                                {row.Seats.slice(0, 3).map((seat, i) => (
                                                    <div
                                                        key={`${rowIndex}-${i}`}
                                                        onClick={() => handleSeatSelect(seat)}
                                                        className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-[10px] md:text-xs font-bold border transition-all duration-200 ${getSeatColor(seat.AvailablityType, seat.SeatType, selectedSeat?.Code === seat.Code)}`}
                                                        title={`Row ${seat.RowNo}, Seat ${seat.SeatNo} - ₹${seat.Price}`}
                                                    >
                                                        {seat.Code !== 'NoSeat' ? seat.SeatNo : ''}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Aisle */}
                                            <div className="w-6 md:w-8 flex items-center justify-center text-xs text-slate-300 font-medium">
                                                {row.Seats[0]?.RowNo}
                                            </div>

                                            {/* Right Side */}
                                            <div className="flex space-x-2">
                                                {row.Seats.slice(3).map((seat, i) => (
                                                    <div
                                                        key={`${rowIndex}-r-${i}`}
                                                        onClick={() => handleSeatSelect(seat)}
                                                        className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-[10px] md:text-xs font-bold border transition-all duration-200 ${getSeatColor(seat.AvailablityType, seat.SeatType, selectedSeat?.Code === seat.Code)}`}
                                                        title={`Row ${seat.RowNo}, Seat ${seat.SeatNo} - ₹${seat.Price}`}
                                                    >
                                                        {seat.Code !== 'NoSeat' ? seat.SeatNo : ''}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {selectedSeat && (
                                <div className="p-4 border-t border-slate-100 bg-white">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-sm">
                                            <div className="font-bold text-slate-900">Seat {selectedSeat.SeatNo}</div>
                                            <div className="text-xs text-slate-500">{selectedSeat.SeatTypeEnum} • {selectedSeat.DeckEnum}</div>
                                        </div>
                                        <div className="text-lg font-black text-slate-900">₹{selectedSeat.Price}</div>
                                    </div>
                                    <button onClick={() => setIsSeatMapOpen(false)} className="w-full bg-black text-white py-3 rounded-xl font-bold">Confirm Selection</button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Meal Modal */}
            <AnimatePresence>
                {isMealModalOpen && ssrData?.MealDynamic && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMealModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-lg max-h-[80vh] rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
                        >
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">Add Meals</h3>
                                    <p className="text-xs text-slate-500">Delicious in-flight dining options</p>
                                </div>
                                <button onClick={() => setIsMealModalOpen(false)} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 space-y-3">
                                {ssrData.MealDynamic[0]?.map((meal: any, i: number) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedMeal(selectedMeal?.Code === meal.Code ? null : meal)}
                                        className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${selectedMeal?.Code === meal.Code ? 'bg-orange-50 border-orange-200 shadow-sm ring-1 ring-orange-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${meal.Code.includes('VG') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                <Utensils size={18} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{meal.AirlineDescription}</div>
                                                <div className="text-xs text-slate-500">{meal.Code}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="font-bold text-slate-900">₹{meal.Price}</div>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedMeal?.Code === meal.Code ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                                                {selectedMeal?.Code === meal.Code && <Check size={12} className="text-white" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedMeal && (
                                <div className="p-4 border-t border-slate-100 bg-white">
                                    <button onClick={() => setIsMealModalOpen(false)} className="w-full bg-black text-white py-3 rounded-xl font-bold">Confirm Meal</button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Baggage Modal */}
            <AnimatePresence>
                {isBaggageModalOpen && ssrData?.Baggage && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBaggageModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white w-full max-w-lg max-h-[80vh] rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
                        >
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">Add Extra Baggage</h3>
                                    <p className="text-xs text-slate-500">Carry more, worry less</p>
                                </div>
                                <button onClick={() => setIsBaggageModalOpen(false)} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 space-y-3">
                                {ssrData.Baggage[0]?.map((bag: any, i: number) => (
                                    <div
                                        key={i}
                                        onClick={() => handleBaggageSelect(bag)}
                                        className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${selectedBaggage?.Code === bag.Code ? 'bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100 text-indigo-600">
                                                <Luggage size={18} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{bag.Weight}kg Extra Baggage</div>
                                                <div className="text-xs text-slate-500">{bag.Code}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="font-bold text-slate-900">₹{bag.Price}</div>
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedBaggage?.Code === bag.Code ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300'}`}>
                                                {selectedBaggage?.Code === bag.Code && <Check size={12} className="text-white" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedBaggage && (
                                <div className="p-4 border-t border-slate-100 bg-white">
                                    <button onClick={() => setIsBaggageModalOpen(false)} className="w-full bg-black text-white py-3 rounded-xl font-bold">Confirm Baggage</button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default function BookPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-black rounded-full animate-spin"></div>
            </div>
        }>
            <BookPageContent />
        </Suspense>
    );
}
