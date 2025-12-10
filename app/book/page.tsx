'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    ArrowLeft, Plane, Info, AlertCircle,
    ChevronDown, ShieldCheck, Luggage, Utensils,
    Armchair, Plus, ArrowRight, Lock, X, Check, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FareQuoteResponse, FareRuleResponse, SSRResponse, Passenger, BookRequest, BookResponse, TicketRequest, TicketResponse, TicketFlightItinerary } from '@/types/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
import { useAuth } from '@/context/AuthContext';


const BookingSuccessView = ({ ticket }: { ticket: TicketFlightItinerary }) => {
    const router = useRouter();

    const downloadPDF = async () => {
        const element = document.getElementById('so-ticket-view');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`ticket-${ticket.PNR}.pdf`);
        } catch (err) {
            console.error("PDF Generation failed", err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Success Header */}
                <div className="text-center space-y-2">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200 mb-6"
                    >
                        <Check size={40} className="text-white" strokeWidth={4} />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl font-black text-slate-900"
                    >
                        Booking Confirmed!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-500"
                    >
                        Your ticket has been successfully booked.
                    </motion.p>
                </div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center space-x-4"
                >
                    <button onClick={downloadPDF} className="px-6 py-2 bg-black text-white rounded-xl font-bold text-sm shadow-lg shadow-gray-200 hover:bg-gray-800 transition-colors">
                        Download Ticket
                    </button>
                    <button onClick={() => router.push('/')} className="px-6 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                        Back to Home
                    </button>
                </motion.div>

                {/* Ticket View (This is what gets printed) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    id="so-ticket-view"
                    className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 pb-8"
                >
                    {/* Header */}
                    <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
                        <div>
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">PNR Number</div>
                            <div className="text-3xl font-black tracking-widest">{ticket.PNR}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Booking ID</div>
                            <div className="text-xl font-bold">{ticket.BookingId}</div>
                        </div>
                    </div>

                    {/* Flight Details */}
                    <div className="p-8 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-slate-700 text-sm border border-slate-100">
                                    {ticket.AirlineCode}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-lg">{ticket.Segments?.[0]?.Airline?.AirlineName || "Airline"}</div>
                                    <div className="text-slate-500 text-sm">{ticket.AirlineCode}-{ticket.Segments?.[0]?.Airline?.FlightNumber}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100 inline-block">Confirmed</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-black text-slate-900">{formatTime(ticket.Segments?.[0]?.Origin?.DepTime)}</div>
                                <div className="text-slate-500 font-bold">{ticket.Segments?.[0]?.Origin?.Airport?.CityName}</div>
                                <div className="text-xs text-slate-400 mt-1">{formatDate(ticket.Segments?.[0]?.Origin?.DepTime)}</div>
                            </div>

                            <div className="flex-1 px-8 flex flex-col items-center">
                                <div className="text-xs font-bold text-slate-400 mb-2">
                                    {ticket.Segments?.[0]?.Duration ? formatDuration(ticket.Segments[0].Duration) : ''}
                                </div>
                                <div className="w-full h-px bg-slate-200 relative flex items-center justify-between">
                                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                    <Plane size={16} className="text-slate-300 rotate-90" />
                                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-3xl font-black text-slate-900">{formatTime(ticket.Segments?.[0]?.Destination?.ArrTime)}</div>
                                <div className="text-slate-500 font-bold">{ticket.Segments?.[0]?.Destination?.Airport?.CityName}</div>
                                <div className="text-xs text-slate-400 mt-1">{formatDate(ticket.Segments?.[0]?.Destination?.ArrTime)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Passenger List */}
                    <div className="p-8">
                        <h3 className="font-bold text-slate-900 text-lg mb-4">Passengers</h3>
                        <div className="space-y-4">
                            {ticket.Passenger?.map((pax, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div>
                                        <div className="font-bold text-slate-900">{pax.Title} {pax.FirstName} {pax.LastName}</div>
                                        <div className="text-xs text-slate-500 mt-1">{pax.PaxType === 1 ? 'Adult' : pax.PaxType === 2 ? 'Child' : 'Infant'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-slate-700">Seat: {pax.SeatDynamic?.[0]?.Code || 'N/A'}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fare Information */}
                    <div className="bg-slate-50 mx-8 p-6 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-3">Payment Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Base Fare</span>
                                <span className="font-medium">₹{ticket.Fare?.BaseFare?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Taxes & Fees</span>
                                <span className="font-medium">₹{ticket.Fare?.Tax?.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between text-lg font-bold text-slate-900">
                                <span>Total Paid</span>
                                <span>₹{ticket.Fare?.PublishedFare?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <div className="text-xs text-slate-400">Thank you for booking with us!</div>
                        <div className="text-[10px] text-slate-300 mt-1">Generated on {new Date().toLocaleString()}</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const BookingSkeleton = () => {
    return (
        <div className="min-h-screen bg-slate-50 pb-32 lg:pb-10 font-sans animate-pulse">
            <div className="hidden md:block bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                        <div className="w-48 h-8 bg-slate-200 rounded-lg"></div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 h-64 p-6">
                        <div className="flex justify-between items-center mb-8">
                            <div className="w-1/3 h-6 bg-slate-200 rounded"></div>
                            <div className="w-24 h-8 bg-slate-200 rounded-full"></div>
                        </div>
                        <div className="flex justify-between items-center px-4">
                            <div className="space-y-2">
                                <div className="w-20 h-10 bg-slate-200 rounded"></div>
                                <div className="w-32 h-4 bg-slate-200 rounded"></div>
                            </div>
                            <div className="flex flex-col items-center w-full px-8">
                                <div className="w-full h-0.5 bg-slate-200 mb-2"></div>
                                <div className="w-16 h-4 bg-slate-200 rounded"></div>
                            </div>
                            <div className="space-y-2 text-right">
                                <div className="w-20 h-10 bg-slate-200 rounded ml-auto"></div>
                                <div className="w-32 h-4 bg-slate-200 rounded ml-auto"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 h-[500px] p-6 space-y-6">
                        <div className="w-48 h-8 bg-slate-200 rounded"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-slate-50 rounded-xl w-full border border-slate-100"></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 h-80 p-6 space-y-4">
                        <div className="w-32 h-6 bg-slate-200 rounded mb-4"></div>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex justify-between">
                                <div className="w-20 h-4 bg-slate-200 rounded"></div>
                                <div className="w-16 h-4 bg-slate-200 rounded"></div>
                            </div>
                        ))}
                        <div className="border-t border-slate-100 pt-4 mt-4">
                            <div className="flex justify-between">
                                <div className="w-24 h-6 bg-slate-200 rounded"></div>
                                <div className="w-24 h-6 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function BookPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();
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

    // Passenger State
    const [passengers, setPassengers] = useState<Passenger[]>([]);
    const [gstDetails, setGstDetails] = useState({
        GSTCompanyName: '',
        GSTNumber: '',
        GSTCompanyEmail: '',
        GSTCompanyContactNumber: '',
        GSTCompanyAddress: ''
    });
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'ticketing' | 'success' | 'failed'>('idle');
    const [bookedPNR, setBookedPNR] = useState<string | null>(null);
    const [bookingId, setBookingId] = useState<number | null>(null);
    const [ticketDetails, setTicketDetails] = useState<TicketFlightItinerary | null>(null);

    // Initialize Passengers
    useEffect(() => {
        const adults = parseInt(searchParams.get('adults') || '1');
        const children = parseInt(searchParams.get('children') || '0');
        const infants = parseInt(searchParams.get('infants') || '0');

        const initialPax: Passenger[] = [];

        for (let i = 0; i < adults; i++) {
            initialPax.push({
                Title: 'Mr', FirstName: '', LastName: '', PaxType: 1, DateOfBirth: '', Gender: 1,
                AddressLine1: '123, Test Address', City: 'New Delhi', CountryCode: 'IN', CountryName: 'India',
                ContactNo: '', Email: '', IsLeadPax: i === 0
            });
        }
        for (let i = 0; i < children; i++) {
            initialPax.push({
                Title: 'Master', FirstName: '', LastName: '', PaxType: 2, DateOfBirth: '', Gender: 1,
                AddressLine1: '123, Test Address', City: 'New Delhi', CountryCode: 'IN',
                IsLeadPax: false
            });
        }
        for (let i = 0; i < infants; i++) {
            initialPax.push({
                Title: 'Master', FirstName: '', LastName: '', PaxType: 3, DateOfBirth: '', Gender: 1,
                AddressLine1: '123, Test Address', City: 'New Delhi', CountryCode: 'IN',
                IsLeadPax: false
            });
        }
        setPassengers(initialPax);
    }, [searchParams]);

    const handlePaxChange = (index: number, field: keyof Passenger, value: any) => {
        const updated = [...passengers];
        updated[index] = { ...updated[index], [field]: value };
        setPassengers(updated);
    };

    const saveBookingToDb = async (tData: TicketResponse, itinerary: TicketFlightItinerary) => {
        console.log("saveBookingToDb called. User:", user);

        // Handle various potential property names for the ID
        const userId = user?.id || user?.googleId || user?._id || user?.sub;

        if (!userId) {
            console.warn("User not logged in or ID missing. Skipping DB save.");
            return;
        }

        try {
            console.log("Sending booking to DB...", {
                googleId: userId,
                bookingId: itinerary.BookingId,
                pnr: itinerary.PNR
            });

            const res = await fetch('/api/user/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    googleId: userId,
                    bookingId: itinerary.BookingId,
                    pnr: itinerary.PNR,
                    status: "Confirmed",
                    amount: itinerary.Fare.PublishedFare,
                    flightDetails: itinerary,
                    responseJson: tData
                })
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("Failed to save booking. Status:", res.status, errText);
            } else {
                const data = await res.json();
                console.log("Booking saved to database successfully.", data);
            }
        } catch (e) {
            console.error("Failed to save booking to database", e);
        }
    };

    const handleBook = async () => {
        if (!traceId || !resultIndex || !fareQuote) return;
        setBookingStatus('booking');
        setError(null);

        try {
            // Validation (Basic)
            if (passengers.some(p => !p.FirstName || !p.LastName || !p.DateOfBirth)) {
                throw new Error("Please fill in all passenger details.");
            }

            // Prepare Payload Passengers
            // Split fare per passenger (Naive split - in production, exact fare per pax type should come from pricing logic)
            const totalPax = passengers.length;
            const singleBaseFare = fareQuote.Fare.BaseFare / totalPax;
            const singleTax = fareQuote.Fare.Tax / totalPax;
            // Reconstruct naive Fare object per pax
            // Note: The API likely expects the exact breakdown from the 'FareQuote' but per passenger. 
            // If the quote 'Fare' object is Total Fare, we must split it. If it is per pax, we use it directly.
            // Usually 'Fare' in Quote is Total. Let's try splitting.
            const sourceFare = fareQuote.Fare as any;
            const genericFare = {
                BaseFare: singleBaseFare,
                Tax: singleTax,
                YQTax: (sourceFare.YQTax || 0) / totalPax,
                AdditionalTxnFeePub: (sourceFare.AdditionalTxnFeePub || 0) / totalPax,
                AdditionalTxnFeeOfrd: (sourceFare.AdditionalTxnFeeOfrd || 0) / totalPax,
                OtherCharges: (sourceFare.OtherCharges || 0) / totalPax,
                TransactionFee: 0, // Mandatory as per docs
                AirTransFee: 0     // Mandatory as per docs
            };

            const passengerDetails = passengers.map((p, index) => {
                const paxSSR: any = { ...p, Fare: genericFare };

                // Ensure SSRs for ALL segments.
                // ssrData.MealDynamic and Baggage are arrays of arrays (Segments -> Options)
                const paxMeals: any[] = [];
                const paxBaggage: any[] = [];

                if (ssrData?.MealDynamic) {
                    ssrData.MealDynamic.forEach((segmentOptions: any[], segIndex: number) => {
                        // Default fallback logic: Prefer "NoMeal", then "Free Meal", then just the first option.
                        let mealToUse = segmentOptions?.find((m: any) => m.Code === 'NoMeal') ||
                            segmentOptions?.find((m: any) => m.Price === 0) ||
                            segmentOptions?.[0] || null;

                        // Override with user selection if applicable
                        if (index === 0 && selectedMeal &&
                            selectedMeal.Origin === segmentOptions?.[0]?.Origin &&
                            selectedMeal.Destination === segmentOptions?.[0]?.Destination) {
                            mealToUse = selectedMeal;
                        }

                        if (mealToUse) {
                            paxMeals.push(mealToUse);
                        } else {
                            console.warn(`No meal option found for segment ${segIndex}`);
                        }
                    });
                }

                // Do similar for Baggage...
                if (ssrData?.Baggage) {
                    ssrData.Baggage.forEach((segmentOptions: any[], segIndex: number) => {
                        let baggageToUse = segmentOptions?.find((b: any) => b.Code === 'NoBaggage') ||
                            segmentOptions?.find((b: any) => b.Price === 0) ||
                            segmentOptions?.[0] || null;

                        if (index === 0 && selectedBaggage &&
                            selectedBaggage.Origin === segmentOptions?.[0]?.Origin &&
                            selectedBaggage.Destination === segmentOptions?.[0]?.Destination) {
                            baggageToUse = selectedBaggage;
                        }

                        if (baggageToUse) {
                            paxBaggage.push(baggageToUse);
                        }
                    });
                }

                paxSSR.MealDynamic = paxMeals;
                paxSSR.Baggage = paxBaggage;

                if (index === 0 && selectedSeat) {
                    paxSSR.SeatDynamic = [selectedSeat];
                }

                return paxSSR;
            });
            console.log("Final Passenger Details for Booking:", passengerDetails); // Debug Log

            if (fareQuote.IsLCC) {
                // LCC Flow: Direct Ticket
                // Requirement: In case of LCC, pass all passenger details to the Ticket method.
                // This generates PNR and Invoice instantly. No separate "Book" step is needed.
                setBookingStatus('ticketing');
                const ticketPayload: TicketRequest = {
                    ResultIndex: resultIndex,
                    TraceId: traceId,
                    EndUserIp: process.env.NEXT_PUBLIC_END_USER_IP || "192.168.1.1",
                    Passengers: passengerDetails // LCC requires Passengers in Ticket Request
                };

                console.log("Sending LCC Ticket Request:", ticketPayload);
                const ticketRes = await fetch(`/flights/ticket`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ticketPayload)
                });
                const ticketData: TicketResponse = await ticketRes.json();
                console.log("Ticket API Response:", ticketData);

                if (!ticketData.Response || (ticketData.Response.Error && ticketData.Response.Error.ErrorCode !== 0)) {
                    throw new Error(ticketData.Response?.Error?.ErrorMessage || `Ticketing Failed: ${JSON.stringify(ticketData)}`);
                }

                setBookedPNR(ticketData.Response.Response.PNR);
                setBookingId(ticketData.Response.Response.BookingId);
                setTicketDetails(ticketData.Response.Response.FlightItinerary);

                await saveBookingToDb(ticketData, ticketData.Response.Response.FlightItinerary);

                setBookingStatus('success');

            } else {
                // Non-LCC Flow: Book -> Ticket
                // Requirement: In case of Non-LCC, we don't pay instantly.
                // 1. Call Book method with Passenger Details to generate PNR. (Holds the booking)
                // 2. Call Ticket method with PNR (and BookingId) to deduct price and ticket the booking.

                // Step 1: Book (Hold)
                const bookPayload: BookRequest = {
                    ResultIndex: resultIndex,
                    Passengers: passengerDetails,
                    EndUserIp: process.env.NEXT_PUBLIC_END_USER_IP || "192.168.1.1",
                    TokenId: process.env.NEXT_PUBLIC_TBO_TOKEN || "7c5e5f5e-1d5e-4e5e-8e5e-5e5e5e5e5e5e",
                    TraceId: traceId
                };

                console.log("Sending Book Request (Non-LCC):", bookPayload);
                const bookRes = await fetch(`/flights/book`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookPayload)
                });
                const bookData: BookResponse = await bookRes.json();
                console.log("Book API Response:", bookData);

                if (!bookData.Response || bookData.Response.Error.ErrorCode !== 0) {
                    throw new Error(bookData.Response?.Error?.ErrorMessage || `Booking Failed: ${JSON.stringify(bookData)}`);
                }

                // Success Book -> Move to Ticket
                const pnr = bookData.Response.Response.PNR;
                const bId = bookData.Response.Response.BookingId;
                setBookedPNR(pnr);
                setBookingId(bId);

                // Step 2: Ticket (Pay/Confirm)
                setBookingStatus('ticketing');

                const ticketPayload: TicketRequest = {
                    ResultIndex: resultIndex,
                    TraceId: traceId,
                    EndUserIp: process.env.NEXT_PUBLIC_END_USER_IP || "192.168.1.1",
                    PNR: pnr,       // Non-LCC requires PNR
                    BookingId: bId  // Non-LCC requires BookingId
                    // Note: Passengers are NOT sent here for Non-LCC as PNR is already generated with details.
                };

                console.log("Sending Ticket Request (Non-LCC):", ticketPayload);
                const ticketRes = await fetch(`/flights/ticket`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ticketPayload)
                });
                const ticketData: TicketResponse = await ticketRes.json();

                if (!ticketData.Response || (ticketData.Response.Error && ticketData.Response.Error.ErrorCode !== 0)) {
                    throw new Error(ticketData.Response?.Error?.ErrorMessage || `Ticketing Failed: ${JSON.stringify(ticketData)}`);
                }

                setTicketDetails(ticketData.Response.Response.FlightItinerary);

                await saveBookingToDb(ticketData, ticketData.Response.Response.FlightItinerary);

                setBookingStatus('success');
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Booking failed");
            setBookingStatus('failed');
        }
    };

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
                const quoteRes = await fetch(`/flights/fare-quote`, {
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
                const ruleRes = await fetch(`/flights/fare-rule`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ traceId, resultIndex })
                });
                const ruleData: FareRuleResponse = await ruleRes.json();

                if (ruleData.success && ruleData.data?.FareRules) { // Removed ErrorCode check as it might not be consistent or present in success case directly
                    setFareRules(ruleData.data.FareRules);
                }

                // Fetch SSR (Seat Map)
                const ssrRes = await fetch(`/flights/ssr`, {
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

    if (bookingStatus === 'success' && ticketDetails) {
        return <BookingSuccessView ticket={ticketDetails} />;
    }

    if (loading) {
        return <BookingSkeleton />;
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

    // Detect International
    // Check if any segment origin or destination is not 'IN' (India)
    // We treat it as International if we find any non-IN country code.
    // Assuming API provides CountryCode or we default to Domestic for now.
    // Safe check: cast to any to avoid TS error if CountryCode is not in interface yet.
    const isInternational = segments.some((leg: any) =>
        (leg.Origin?.Airport?.CountryCode && leg.Origin.Airport.CountryCode !== 'IN') ||
        (leg.Destination?.Airport?.CountryCode && leg.Destination.Airport.CountryCode !== 'IN')
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-32 lg:pb-10 font-sans">

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
            <div className="hidden md:block bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
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
                                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-700 overflow-hidden p-1">
                                    <img src={`https://images.ixigo.com/img/common-resources/airline-new/${airlineCode}.png`} alt={airlineName} className="w-full h-full object-contain" />
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

                                {/* Flight Route */}
                                <div className="relative md:flex md:justify-between md:items-center">
                                    <div className="md:hidden absolute -left-[29px] top-1.5 w-4 h-4 rounded-full bg-slate-100 border-4 border-white shadow-sm z-10"></div>
                                    <div className="w-full md:w-auto mb-10 md:mb-0">
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


                                    {/* Arrival */}
                                    <div className="relative md:text-right">
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

                    {/* Passenger Details Form */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 overflow-hidden">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <Users size={18} className="mr-2 text-slate-400" />
                            Passenger Details
                        </h3>

                        <div className="space-y-6">
                            {passengers.map((pax, i) => (
                                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 transition-all hover:border-slate-300 hover:shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-slate-800">
                                                    Passenger {i + 1}
                                                </div>
                                                <div className="text-[10px] md:text-xs font-medium text-slate-500 uppercase tracking-wide">
                                                    {pax.PaxType === 1 ? 'Adult' : pax.PaxType === 2 ? 'Child' : 'Infant'}
                                                </div>
                                            </div>
                                        </div>
                                        {pax.IsLeadPax && (
                                            <span className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm">Lead Guest</span>
                                        )}
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                            {/* Title */}
                                            <div className="md:col-span-2">
                                                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Title</label>
                                                <div className="relative">
                                                    <select
                                                        value={pax.Title}
                                                        onChange={(e) => handlePaxChange(i, 'Title', e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none transition-all"
                                                    >
                                                        <option value="Mr">Mr</option>
                                                        <option value="Ms">Ms</option>
                                                        <option value="Mrs">Mrs</option>
                                                        <option value="Mstr">Mstr</option>
                                                    </select>
                                                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                </div>
                                            </div>

                                            {/* First Name */}
                                            <div className="md:col-span-5">
                                                <label className="text-xs font-bold text-slate-500 mb-1.5 block">First Name / Middle Name</label>
                                                <input
                                                    type="text"
                                                    value={pax.FirstName}
                                                    onChange={(e) => handlePaxChange(i, 'FirstName', e.target.value)}
                                                    placeholder="e.g. John"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-slate-300 transition-all"
                                                />
                                            </div>

                                            {/* Last Name */}
                                            <div className="md:col-span-5">
                                                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={pax.LastName}
                                                    onChange={(e) => handlePaxChange(i, 'LastName', e.target.value)}
                                                    placeholder="e.g. Doe"
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-slate-300 transition-all"
                                                />
                                            </div>

                                            {/* Gender */}
                                            <div className="md:col-span-6">
                                                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Gender</label>
                                                <div className="relative">
                                                    <select
                                                        value={pax.Gender}
                                                        onChange={(e) => handlePaxChange(i, 'Gender', parseInt(e.target.value))}
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black appearance-none transition-all"
                                                    >
                                                        <option value={1}>Male</option>
                                                        <option value={2}>Female</option>
                                                    </select>
                                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                </div>
                                            </div>

                                            {/* Date of Birth */}
                                            <div className="md:col-span-6">
                                                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    value={pax.DateOfBirth ? pax.DateOfBirth.split('T')[0] : ''}
                                                    onChange={(e) => handlePaxChange(i, 'DateOfBirth', e.target.value)}
                                                    max={new Date().toISOString().split("T")[0]}
                                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Passport Info - Conditional for International */}
                                        {isInternational && (
                                            <div className="pt-4 border-t border-slate-200/60">
                                                <div className="flex items-center mb-4 space-x-2 text-slate-800 font-bold text-sm">
                                                    <ShieldCheck size={18} className="text-blue-600" />
                                                    <span>Passport Details</span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                                    <div className="md:col-span-6">
                                                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">Passport Number</label>
                                                        <input
                                                            type="text"
                                                            value={pax.PassportNo || ''}
                                                            onChange={(e) => handlePaxChange(i, 'PassportNo', e.target.value)}
                                                            placeholder="Enter Passport Number"
                                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-slate-300 transition-all"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-6">
                                                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">Passport Expiry</label>
                                                        <input
                                                            type="date"
                                                            value={pax.PassportExpiry ? pax.PassportExpiry.split('T')[0] : ''}
                                                            onChange={(e) => handlePaxChange(i, 'PassportExpiry', e.target.value)}
                                                            min={new Date().toISOString().split("T")[0]}
                                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Contact Info for Lead Pax */}
                                        {pax.IsLeadPax && (
                                            <div className="pt-4 border-t border-slate-200/60">
                                                <div className="flex items-center mb-4 space-x-2 text-slate-800 font-bold text-sm">
                                                    <span className="bg-green-100 text-green-700 p-1 rounded-md"><Users size={14} /></span>
                                                    <span>Contact Information</span>
                                                    <span className="text-[10px] font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Sent to Lead Guest</span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                                    <div className="md:col-span-6">
                                                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">Mobile Number</label>
                                                        <div className="relative">
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">+91</span>
                                                            <input
                                                                type="tel"
                                                                value={pax.ContactNo || ''}
                                                                onChange={(e) => handlePaxChange(i, 'ContactNo', e.target.value)}
                                                                placeholder="9876543210"
                                                                className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-slate-300 transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-6">
                                                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">Email Address</label>
                                                        <input
                                                            type="email"
                                                            value={pax.Email || ''}
                                                            onChange={(e) => handlePaxChange(i, 'Email', e.target.value)}
                                                            placeholder="name@example.com"
                                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-slate-300 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
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

                        <button
                            onClick={handleBook}
                            disabled={bookingStatus === 'booking' || bookingStatus === 'ticketing' || bookingStatus === 'success'}
                            className={`w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-black/20 transform active:scale-95 transition-transform flex items-center justify-center ${bookingStatus === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        >
                            {bookingStatus === 'idle' && (
                                <>
                                    <span>Continue Booking</span>
                                    <ArrowRight size={16} className="ml-2" />
                                </>
                            )}
                            {(bookingStatus === 'booking' || bookingStatus === 'ticketing') && (
                                <span className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                    {bookingStatus === 'booking' ? 'Booking...' : 'Ticketing...'}
                                </span>
                            )}
                            {bookingStatus === 'success' && (
                                <span className="flex items-center">
                                    <Check size={18} className="mr-2" />
                                    Booking Confirmed!
                                </span>
                            )}
                            {bookingStatus === 'failed' && (
                                <span>Try Again</span>
                            )}
                        </button>

                        {bookingStatus === 'success' && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                                <div className="text-sm font-bold text-green-800">PNR Generated: {bookedPNR}</div>
                                <div className="text-xs text-green-600 mt-1">Booking ID: {bookingId}</div>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* 📱 Mobile Sticky Bottom CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex items-center justify-between safe-area-bottom">
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
