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
    const [fareQuote, setFareQuote] = useState<any>(null);
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
        GSTCompanyName: 'Test Corp Ltd',
        GSTNumber: '07AAGFF2194N1Z1',
        GSTCompanyEmail: 'billing@testcorp.com',
        GSTCompanyContactNumber: '9876543210',
        GSTCompanyAddress: 'New Delhi, DL, 110001'
    });
    const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'ticketing' | 'success' | 'failed'>('idle');
    const [bookedPNR, setBookedPNR] = useState<string | null>(null);
    const [bookingId, setBookingId] = useState<number | null>(null);
    const [ticketDetails, setTicketDetails] = useState<TicketFlightItinerary | null>(null);

    // Initialize Passengers from localStorage (saved at search time)
    useEffect(() => {
        if (!fareQuote) return;

        // Priority 1: localStorage (saved when user clicked Book on search page)
        const storedAdults = localStorage.getItem('pax_adults');
        const storedChildren = localStorage.getItem('pax_children');
        const storedInfants = localStorage.getItem('pax_infants');

        let adults = 1, children = 0, infants = 0;

        if (storedAdults !== null) {
            adults = parseInt(storedAdults) || 1;
            children = parseInt(storedChildren || '0');
            infants = parseInt(storedInfants || '0');
        } else if (fareQuote.PaxInfo && Array.isArray(fareQuote.PaxInfo)) {
            // Priority 2: fareQuote.PaxInfo (TBO format)
            fareQuote.PaxInfo.forEach((p: any) => {
                if (p.PaxType === 1) adults = p.PaxCount || 1;
                if (p.PaxType === 2) children = p.PaxCount || 0;
                if (p.PaxType === 3) infants = p.PaxCount || 0;
            });
        } else if (fareQuote.passengers && typeof fareQuote.passengers === 'object') {
            // Priority 3: New API format
            adults = fareQuote.passengers.adults || fareQuote.passengers.adult || 1;
            children = fareQuote.passengers.children || fareQuote.passengers.child || 0;
            infants = fareQuote.passengers.infants || fareQuote.passengers.infant || 0;
        } else {
            // Priority 4: URL params fallback
            adults = parseInt(searchParams.get('adults') || '1');
            children = parseInt(searchParams.get('children') || '0');
            infants = parseInt(searchParams.get('infants') || '0');
        }

        const initialPax: Passenger[] = [];

        for (let i = 0; i < adults; i++) {
            initialPax.push({
                Title: 'Mr', FirstName: '', LastName: '', PaxType: 1, DateOfBirth: '', Gender: 1,
                AddressLine1: '', City: 'New Delhi', CountryCode: 'IN', CountryName: 'India',
                ContactNo: '', Email: '', IsLeadPax: i === 0, PAN: '', PassportNo: '', PassportExpiry: '', PassportIssueDate: '', PassportIssueCountryCode: 'IN'
            });
        }
        for (let i = 0; i < children; i++) {
            initialPax.push({
                Title: 'Master', FirstName: '', LastName: '', PaxType: 2, DateOfBirth: '', Gender: 1,
                AddressLine1: '', City: 'New Delhi', CountryCode: 'IN',
                IsLeadPax: false,
                GuardianDetails: { Title: 'Mr', FirstName: '', LastName: '', PAN: '', PassportNo: '' }
            });
        }
        for (let i = 0; i < infants; i++) {
            initialPax.push({
                Title: 'Master', FirstName: '', LastName: '', PaxType: 3, DateOfBirth: '', Gender: 1,
                AddressLine1: '', City: 'New Delhi', CountryCode: 'IN',
                IsLeadPax: false,
                GuardianDetails: { Title: 'Mr', FirstName: '', LastName: '', PAN: '', PassportNo: '' }
            });
        }
        setPassengers(initialPax);
    }, [fareQuote]);

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
            // Validation (Detailed)
            const segmentsList = fareQuote.segments || fareQuote.Segments?.[0] || [];
            if (!segmentsList.length) throw new Error("No flight segments found in quote");

            const isInternational = fareQuote.IsDomestic === false || fareQuote.isDomestic === false || fareQuote.IsPassportRequiredAtBook || fareQuote.isPassportRequiredAtBook || fareQuote.IsPassportRequiredAtTicket || fareQuote.isPassportRequiredAtTicket || fareQuote.IsPassportFullDetailRequiredAtBook || fareQuote.isPassportFullDetailRequiredAtBook || segmentsList.some((leg: any) =>
                (leg.Origin?.Airport?.CountryCode && leg.Origin.Airport.CountryCode !== 'IN') ||
                (leg.Destination?.Airport?.CountryCode && leg.Destination.Airport.CountryCode !== 'IN')
            );
            
            const isLCC = fareQuote.IsLCC || false;
            const isGDS = !isLCC;
            const airlineCodes = segmentsList.map((leg: any) => leg.Airline?.AirlineCode || (leg.flightNumber ? leg.flightNumber.split('-')[0] : ''));
            const isSpiceJet = airlineCodes.includes('SG');
            const isIndigo = airlineCodes.includes('6E');
            const isAirAsia = airlineCodes.includes('I5') || airlineCodes.includes('AK') || airlineCodes.includes('FD') || airlineCodes.includes('D7') || airlineCodes.includes('Z2') || airlineCodes.includes('QZ');
            const isTruJetZoom = airlineCodes.includes('2T') || airlineCodes.includes('ZO');
            const isFlyDubai = airlineCodes.includes('FZ');
            const isAirIndiaIntl = isInternational && airlineCodes.includes('AI');

            const destCities = segmentsList.map((leg: any) => (leg.Destination?.Airport?.CityName || leg.to || '').toLowerCase());
            const destCountryCodes = segmentsList.map((leg: any) => leg.Destination?.Airport?.CountryCode || '');
            const hasDubaiRiyadhSharjah = destCities.some((c: string) => c.includes('dubai') || c.includes('riyadh') || c.includes('sharjah'));
            const isToNepal = destCountryCodes.includes('NP') || destCities.some((c: string) => c.includes('nepal') || c.includes('kathmandu'));

            if (fareQuote.IsGSTMandatory && (!gstDetails.GSTCompanyName || !gstDetails.GSTNumber || !gstDetails.GSTCompanyEmail || !gstDetails.GSTCompanyContactNumber || !gstDetails.GSTCompanyAddress)) {
                throw new Error("GST Details are mandatory for this booking.");
            }

            const panRequired = fareQuote.IsPanRequiredAtBook || fareQuote.isPanRequiredAtBook || fareQuote.IsPanRequiredAtTicket || fareQuote.isPanRequiredAtTicket || false;
            const passportRequired = fareQuote.IsPassportRequiredAtBook || fareQuote.isPassportRequiredAtBook || fareQuote.IsPassportRequiredAtTicket || fareQuote.isPassportRequiredAtTicket || false;
            const fullPassportRequired = fareQuote.IsPassportFullDetailRequiredAtBook || fareQuote.isPassportFullDetailRequiredAtBook || false;

            for (const p of passengers) {
                if (!p.FirstName || !p.LastName) {
                    throw new Error("Please fill in First Name and Last Name for all passengers.");
                }
                if (!p.Gender) {
                    throw new Error(`Gender is mandatory for passenger ${p.FirstName}`);
                }
                
                if (p.IsLeadPax && !p.ContactNo) {
                    throw new Error(`Phone Number is mandatory for Lead Passenger.`);
                }

                if ((p.PaxType === 2 || p.PaxType === 3) && !p.DateOfBirth) {
                    throw new Error(`Date of Birth is mandatory for Child/Infant ${p.FirstName}`);
                }

                if (isAirAsia && p.PaxType === 1 && !p.DateOfBirth) {
                    throw new Error(`DOB is mandatory for Adult passenger ${p.FirstName} on AirAsia.`);
                }

                if (p.DateOfBirth) {
                    const age = new Date().getFullYear() - new Date(p.DateOfBirth).getFullYear();
                    // Basic 12+ check for adults
                    if (p.PaxType === 1 && age < 12) {
                        throw new Error(`Adult passenger ${p.FirstName} must be at least 12 years old.`);
                    }
                }

                if (isLCC && p.IsLeadPax && (!p.ContactNo || !p.Email)) {
                     throw new Error(`Lead Passenger must provide Contact Number and Email for LCC flights.`);
                }
                if (isLCC && p.IsLeadPax && !p.AddressLine1) {
                     throw new Error(`Address is mandatory for Lead Passenger on LCC flights.`);
                }

                if (isAirAsia && p.IsLeadPax && (!p.CountryCode || !p.CountryName)) {
                    throw new Error(`Country Code and Country Name are mandatory for First Passenger on AirAsia.`);
                }

                if (isSpiceJet) {
                    if (p.FirstName.trim().toLowerCase() === p.LastName.trim().toLowerCase()) {
                        throw new Error(`For SpiceJet, First Name and Last Name must be distinct for ${p.FirstName}`);
                    }
                }

                if (isTruJetZoom && p.LastName.includes(' ')) {
                    throw new Error(`Space is not allowed in Last Name for ${p.FirstName} on TruJet/ZoomAir.`);
                }

                // PAN / Passport checks
                if (panRequired) {
                    if (p.PaxType === 1) {
                         if (!p.PAN && !p.PassportNo) throw new Error(`PAN or Passport is required for Adult ${p.FirstName}`);
                    } else {
                         if (!p.GuardianDetails?.PAN && !p.GuardianDetails?.PassportNo) {
                             throw new Error(`Guardian PAN or Passport is required for Child/Infant ${p.FirstName}`);
                         }
                    }
                }

                let needPassportForThisPax = passportRequired || fullPassportRequired;
                if (isSpiceJet && hasDubaiRiyadhSharjah) needPassportForThisPax = true;
                if (isFlyDubai) needPassportForThisPax = true;
                if ((isSpiceJet || isIndigo) && isToNepal && p.PaxType !== 3) needPassportForThisPax = true;
                if (isGDS && p.PaxType !== 3 && !isToNepal) needPassportForThisPax = true;
                if (isAirIndiaIntl) needPassportForThisPax = true;

                if (needPassportForThisPax) {
                    if (p.PaxType === 1) {
                        if (!p.PassportNo) throw new Error(`Passport is required for Adult ${p.FirstName}`);
                    } else {
                        if (!p.GuardianDetails?.PassportNo) throw new Error(`Guardian Passport is required for Child/Infant ${p.FirstName}`);
                    }
                }
                if ((fullPassportRequired || isAirIndiaIntl) && p.PaxType === 1 && (!p.PassportNo || !p.PassportExpiry || !p.PassportIssueDate || !p.PassportIssueCountryCode)) {
                    throw new Error(`Full Passport Details are required for Adult ${p.FirstName}`);
                }

                // Title Mapping Validation
                if (p.PaxType === 1) { // Adult
                    if (p.Gender === 1 && p.Title !== 'Mr') throw new Error(`Adult Male passenger ${p.FirstName} must have title 'Mr'`);
                    if (p.Gender === 2 && !['Ms', 'Mrs'].includes(p.Title)) throw new Error(`Adult Female passenger ${p.FirstName} must have title 'Ms' or 'Mrs'`);
                }
            }

            // Prepare Payload Passengers
            const totalPax = passengers.length;
            const baseFareValue = fareQuote.price?.base ?? fareQuote.Fare?.BaseFare ?? 0;
            const taxValue = fareQuote.price?.taxes ?? fareQuote.Fare?.Tax ?? 0;
            const singleBaseFare = baseFareValue / totalPax;
            const singleTax = taxValue / totalPax;
            const sourceFare = fareQuote.Fare || fareQuote.price || {};

            const formattedPassengers = passengers.map((p, index) => {
                const paxFare = {
                    Currency: sourceFare.Currency || "INR",
                    BaseFare: Number(singleBaseFare.toFixed(2)),
                    Tax: Number(singleTax.toFixed(2)),
                    YQTax: Number(((sourceFare.YQTax || 0) / totalPax).toFixed(2)),
                    AdditionalTxnFeePub: Number(((sourceFare.AdditionalTxnFeePub || 0) / totalPax).toFixed(2)),
                    AdditionalTxnFeeOfrd: Number(((sourceFare.AdditionalTxnFeeOfrd || 0) / totalPax).toFixed(2)),
                    OtherCharges: Number(((sourceFare.OtherCharges || 0) / totalPax).toFixed(2)),
                    Discount: Number(((sourceFare.Discount || 0) / totalPax).toFixed(2)),
                    PublishedFare: Number(((sourceFare.PublishedFare || 0) / totalPax).toFixed(2)),
                    OfferedFare: Number(((sourceFare.OfferedFare || 0) / totalPax).toFixed(2)),
                    TdsOnCommission: Number(((sourceFare.TdsOnCommission || 0) / totalPax).toFixed(2)),
                    TdsOnPLB: Number(((sourceFare.TdsOnPLB || 0) / totalPax).toFixed(2)),
                    TdsOnIncentive: Number(((sourceFare.TdsOnIncentive || 0) / totalPax).toFixed(2)),
                    ServiceFee: Number(((sourceFare.ServiceFee || 0) / totalPax).toFixed(2))
                };

                const formattedPax: any = {
                    Title: p.Title,
                    FirstName: p.FirstName,
                    LastName: p.LastName,
                    PaxType: p.PaxType,
                    DateOfBirth: p.DateOfBirth ? `${p.DateOfBirth}T00:00:00` : "1990-01-01T00:00:00",
                    Gender: p.Gender,
                    PassportNo: p.PassportNo || "",
                    PassportExpiry: p.PassportExpiry ? `${p.PassportExpiry}T00:00:00` : "2030-01-01T00:00:00",
                    AddressLine1: p.AddressLine1 || "123, Default Address",
                    AddressLine2: p.AddressLine2 || "",
                    Fare: paxFare,
                    City: p.City || "New Delhi",
                    CountryCode: p.CountryCode || "IN",
                    CellCountryCode: "+91-",
                    ContactNo: p.ContactNo || "9999999999",
                    Nationality: "IN",
                    Email: p.Email || "test@test.com",
                    IsLeadPax: p.IsLeadPax || false,
                    FFAirlineCode: p.FFAirlineCode || null,
                    FFNumber: p.FFNumber || "",
                    GSTCompanyAddress: gstDetails.GSTCompanyAddress || "",
                    GSTCompanyContactNumber: gstDetails.GSTCompanyContactNumber || "",
                    GSTCompanyName: gstDetails.GSTCompanyName || "",
                    GSTNumber: gstDetails.GSTNumber || "",
                    GSTCompanyEmail: gstDetails.GSTCompanyEmail || ""
                };

                if (!p.DateOfBirth && p.PaxType === 1) {
                    delete formattedPax.DateOfBirth;
                }
                if (!p.PassportNo) {
                    delete formattedPax.PassportNo;
                    delete formattedPax.PassportExpiry;
                }

                if (index === 0 && selectedMeal && selectedMeal.Code) {
                    formattedPax.Meal = {
                        Code: selectedMeal.Code,
                        Description: selectedMeal.Description || selectedMeal.AirlineDescription || ""
                    };
                }
                if (index === 0 && selectedSeat && selectedSeat.Code) {
                    formattedPax.Seat = {
                        Code: selectedSeat.Code,
                        Description: selectedSeat.Description || ""
                    };
                }

                return formattedPax;
            });

            const bookRequestPayload = {
                EndUserIp: "192.168.11.58",
                TokenId: "TOKEN_INJECTED_BY_BACKEND",
                TraceId: traceId,
                ResultIndex: resultIndex,
                Passengers: formattedPassengers
            };

            console.log("Book Request Payload:", bookRequestPayload);

            setBookingStatus('booking');

            try {
                const bookRes = await fetch('/flights/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookRequestPayload)
                });
                
                const bookData = await bookRes.json();

                if (!bookData.success && !bookData.Response) {
                    throw new Error(bookData.message || bookData.data?.Error?.ErrorMessage || "Booking Failed at Provider");
                }

                // Safely extract booking response depending on wrapper structure
                const bookingResponse = bookData.data?.Response || bookData.Response || bookData.data;

                if (!bookingResponse || !bookingResponse.FlightItinerary) {
                     throw new Error("Invalid Booking Response structure");
                }

                if (bookingResponse.Error && bookingResponse.Error.ErrorCode !== 0) {
                     throw new Error(bookingResponse.Error.ErrorMessage || "Error parsing booking response");
                }

                setBookingStatus('ticketing');

                setBookedPNR(bookingResponse.PNR || bookingResponse.FlightItinerary.PNR);
                setBookingId(bookingResponse.BookingId || bookingResponse.FlightItinerary.BookingId);
                setTicketDetails(bookingResponse.FlightItinerary);
                setBookingStatus('success');

                // Check and trigger Save to DB if user context is required
                if (bookingResponse.FlightItinerary) {
                    await saveBookingToDb(bookData.data || bookData, bookingResponse.FlightItinerary);
                }
            } catch (apiError: any) {
                console.error("Flight Book API Error:", apiError);
                throw new Error("Failed to finalize booking: " + apiError.message);
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

                if (!quoteData.success || !quoteData.data) {
                    throw new Error((quoteData as any).message || (quoteData.data as any)?.Error?.ErrorMessage || "Failed to fetch fare quote");
                }
                setFareQuote((quoteData.data as any).Results || quoteData.data);

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

    const segmentsList = fareQuote.segments || fareQuote.Segments?.[0] || [];
    const firstLeg = segmentsList[0] || {};
    const lastLeg = segmentsList[segmentsList.length - 1] || {};

    const airlineCode = firstLeg.Airline?.AirlineCode || firstLeg.airlineCode || (firstLeg.flightNumber ? firstLeg.flightNumber.split('-')[0] : '');
    const airlineName = firstLeg.Airline?.AirlineName || firstLeg.airline || firstLeg.AirlineName || '';
    const flightNumber = firstLeg.Airline?.FlightNumber ? `${airlineCode}-${firstLeg.Airline.FlightNumber}` : (firstLeg.flightNumber || '');

    const totalDurationStr = fareQuote.totalDuration || 
        `${Math.floor((segmentsList.reduce((acc: number, seg: any) => acc + (seg.Duration || 0), 0) + (segmentsList.length > 1 ? (segmentsList.length - 1) * 60 : 0)) / 60)}h ${(segmentsList.reduce((acc: number, seg: any) => acc + (seg.Duration || 0), 0)) % 60}m`;
    const stopsCount = fareQuote.stops !== undefined ? fareQuote.stops : Math.max(0, segmentsList.length - 1);

    const isInternational = fareQuote.IsDomestic === false || fareQuote.isDomestic === false || fareQuote.IsPassportRequiredAtBook || fareQuote.isPassportRequiredAtBook || fareQuote.IsPassportRequiredAtTicket || fareQuote.isPassportRequiredAtTicket || fareQuote.IsPassportFullDetailRequiredAtBook || fareQuote.isPassportFullDetailRequiredAtBook || segmentsList.some((leg: any) =>
        (leg.Origin?.Airport?.CountryCode && leg.Origin.Airport.CountryCode !== 'IN') ||
        (leg.Destination?.Airport?.CountryCode && leg.Destination.Airport.CountryCode !== 'IN')
    );
    const panRequired = fareQuote.IsPanRequiredAtBook || fareQuote.isPanRequiredAtBook || fareQuote.IsPanRequiredAtTicket || fareQuote.isPanRequiredAtTicket || false;
    const passportRequired = fareQuote.IsPassportRequiredAtBook || fareQuote.isPassportRequiredAtBook || fareQuote.IsPassportRequiredAtTicket || fareQuote.isPassportRequiredAtTicket || false;
    const fullPassportRequired = fareQuote.IsPassportFullDetailRequiredAtBook || fareQuote.isPassportFullDetailRequiredAtBook || false;

    const baseFareAmount = fareQuote.price?.base ?? fareQuote.Fare?.BaseFare ?? 0;
    const taxAmount = fareQuote.price?.taxes ?? fareQuote.Fare?.Tax ?? 0;
    const totalAmount = fareQuote.price?.total ?? fareQuote.Fare?.PublishedFare ?? 0;

    const depTime = firstLeg.Origin?.DepTime || firstLeg.departure || '';
    const depCity = firstLeg.Origin?.Airport?.CityName || firstLeg.from || 'Origin';
    const depCode = firstLeg.Origin?.Airport?.AirportCode || firstLeg.from || '';
    const depTerminal = firstLeg.Origin?.Airport?.Terminal || '1';

    const arrTime = lastLeg.Destination?.ArrTime || lastLeg.arrival || '';
    const arrCity = lastLeg.Destination?.Airport?.CityName || lastLeg.to || 'Destination';
    const arrCode = lastLeg.Destination?.Airport?.AirportCode || lastLeg.to || '';
    const arrTerminal = lastLeg.Destination?.Airport?.Terminal || '1';

    const cabinBaggageStr = firstLeg.CabinBaggage || fareQuote.baggage?.cabin || "7 KG";
    const checkinBaggageStr = firstLeg.Baggage || fareQuote.baggage?.checkin || "15 KG";

    const safeFormatTime = (t: string) => {
        if (!t) return '';
        if (t.includes(':') && t.length <= 5) return t; // Already "HH:MM"
        try { return formatTime(t); } catch(e) { return t; }
    };

    const safeFormatDate = (t: string) => {
        if (!t) return '';
        if (t.includes(':') && t.length <= 5) return 'Today'; 
        try { return formatDate(t); } catch(e) { return t; }
    };

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
                                        <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{safeFormatTime(depTime)}</div>
                                        <div className="text-lg md:text-xl font-bold text-slate-800 mt-1">{depCity} <span className="text-slate-400 font-normal">({depCode})</span></div>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{safeFormatDate(depTime)}</div>
                                            <div className="text-sm text-slate-400">Terminal {depTerminal}</div>
                                        </div>
                                    </div>

                                    {/* Duration (Desktop Center) */}
                                    <div className="hidden md:flex flex-col items-center px-12">
                                        <div className="text-xs font-bold text-slate-400 mb-2">{totalDurationStr}</div>
                                        <div className="w-32 h-0.5 bg-slate-200 relative flex items-center justify-between">
                                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                            <div className="bg-white px-2 relative z-10">
                                                <Plane size={20} className="text-slate-300 rotate-90" />
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                        </div>
                                        <div className="text-xs font-bold text-slate-400 mt-2">{stopsCount === 0 ? 'Non-stop' : `${stopsCount} Stop(s)`}</div>
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
                                            <div className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{safeFormatTime(arrTime)}</div>
                                            <div className="text-lg md:text-xl font-bold text-slate-800 mt-1">{arrCity} <span className="text-slate-400 font-normal">({arrCode})</span></div>
                                            <div className="flex md:justify-end items-center space-x-2 mt-2">
                                                <div className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{safeFormatDate(arrTime)}</div>
                                                <div className="text-sm text-slate-400">Terminal {arrTerminal}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="flex items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <div className="mr-3 p-3 bg-white rounded-xl shadow-sm text-slate-600">
                                        <Luggage size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide">Cabin Baggage</div>
                                        <div className="font-black text-slate-900 text-base md:text-lg">{cabinBaggageStr}</div>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <div className="mr-3 p-3 bg-white rounded-xl shadow-sm text-slate-600">
                                        <Luggage size={20} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide">Check-in</div>
                                        <div className="font-black text-slate-900 text-base md:text-lg">{checkinBaggageStr}</div>
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

                                        {/* Travel Document Details: based on Domestic or International */}
                                        <div className="pt-4 border-t border-slate-200/60">
                                            <div className="flex items-center mb-4 space-x-2 text-slate-800 font-bold text-sm">
                                                <ShieldCheck size={18} className="text-blue-600" />
                                                <span>Travel Documents</span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-wide ${isInternational ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {isInternational ? 'International' : 'Domestic'}
                                                </span>
                                            </div>

                                            {/* Guardian Details for Child/Infant on International */}
                                            {pax.PaxType !== 1 && isInternational && (
                                                <div className="mb-4 bg-amber-50 p-4 rounded-xl border border-amber-200">
                                                    <label className="text-xs font-bold text-amber-700 mb-3 block">Guardian / Parent Details</label>
                                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-4">
                                                        <div className="md:col-span-4">
                                                            <label className="text-[10px] font-bold text-slate-500 mb-1.5 block">First Name</label>
                                                            <input type="text" value={pax.GuardianDetails?.FirstName || ''} onChange={(e) => handlePaxChange(i, 'GuardianDetails', { ...(pax.GuardianDetails || {Title: 'Mr', LastName: '', PAN: '', PassportNo: ''}), FirstName: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 outline-none" />
                                                        </div>
                                                        <div className="md:col-span-4">
                                                            <label className="text-[10px] font-bold text-slate-500 mb-1.5 block">Last Name</label>
                                                            <input type="text" value={pax.GuardianDetails?.LastName || ''} onChange={(e) => handlePaxChange(i, 'GuardianDetails', { ...(pax.GuardianDetails || {Title: 'Mr', FirstName: '', PAN: '', PassportNo: ''}), LastName: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 outline-none" />
                                                        </div>
                                                        <div className="md:col-span-4">
                                                            <label className="text-[10px] font-bold text-slate-500 mb-1.5 block">Passport No.</label>
                                                            <input type="text" value={pax.GuardianDetails?.PassportNo || ''} onChange={(e) => handlePaxChange(i, 'GuardianDetails', { ...(pax.GuardianDetails || {Title: 'Mr', FirstName: '', LastName: '', PAN: ''}), PassportNo: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 outline-none" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* DOMESTIC: PAN for Adults only */}
                                            {!isInternational && pax.PaxType === 1 && (
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                                    <div className="md:col-span-6">
                                                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">
                                                            PAN Number {panRequired && <span className="text-red-500 ml-1">*Required</span>}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={pax.PAN || ''}
                                                            onChange={(e) => handlePaxChange(i, 'PAN', e.target.value.toUpperCase())}
                                                            placeholder="e.g. ABCDE1234F"
                                                            maxLength={10}
                                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all tracking-widest uppercase"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* INTERNATIONAL: Passport for all pax types */}
                                            {isInternational && (
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                                    <div className="md:col-span-6">
                                                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">Passport Number <span className="text-red-500 ml-1">*Required</span></label>
                                                        <input
                                                            type="text"
                                                            value={pax.PassportNo || ''}
                                                            onChange={(e) => handlePaxChange(i, 'PassportNo', e.target.value.toUpperCase())}
                                                            placeholder="e.g. A1234567"
                                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all tracking-widest uppercase"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-6">
                                                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">Nationality</label>
                                                        <input
                                                            type="text"
                                                            value={pax.PassportIssueCountryCode || ''}
                                                            onChange={(e) => handlePaxChange(i, 'PassportIssueCountryCode', e.target.value.toUpperCase())}
                                                            placeholder="e.g. IN"
                                                            maxLength={2}
                                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all uppercase"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-6">
                                                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">Passport Issue Date</label>
                                                        <input
                                                            type="date"
                                                            value={pax.PassportIssueDate ? pax.PassportIssueDate.split('T')[0] : ''}
                                                            onChange={(e) => handlePaxChange(i, 'PassportIssueDate', e.target.value)}
                                                            max={new Date().toISOString().split("T")[0]}
                                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-6">
                                                        <label className="text-xs font-bold text-slate-500 mb-1.5 block">Passport Expiry Date <span className="text-red-500 ml-1">*Required</span></label>
                                                        <input
                                                            type="date"
                                                            value={pax.PassportExpiry ? pax.PassportExpiry.split('T')[0] : ''}
                                                            onChange={(e) => handlePaxChange(i, 'PassportExpiry', e.target.value)}
                                                            min={new Date().toISOString().split("T")[0]}
                                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

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
                    
                    {/* GST Details Form */}
                    {fareQuote.IsGSTMandatory && (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 overflow-hidden">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                                <Info size={18} className="mr-2 text-slate-400" />
                                GST Details (Mandatory)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                <div className="md:col-span-6">
                                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Company Name</label>
                                    <input
                                        type="text"
                                        value={gstDetails.GSTCompanyName}
                                        onChange={(e) => setGstDetails({...gstDetails, GSTCompanyName: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black transition-all"
                                    />
                                </div>
                                <div className="md:col-span-6">
                                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">GST Number</label>
                                    <input
                                        type="text"
                                        value={gstDetails.GSTNumber}
                                        onChange={(e) => setGstDetails({...gstDetails, GSTNumber: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black transition-all"
                                    />
                                </div>
                                <div className="md:col-span-6">
                                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Company Email</label>
                                    <input
                                        type="email"
                                        value={gstDetails.GSTCompanyEmail}
                                        onChange={(e) => setGstDetails({...gstDetails, GSTCompanyEmail: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black transition-all"
                                    />
                                </div>
                                <div className="md:col-span-6">
                                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Company Contact</label>
                                    <input
                                        type="tel"
                                        value={gstDetails.GSTCompanyContactNumber}
                                        onChange={(e) => setGstDetails({...gstDetails, GSTCompanyContactNumber: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black transition-all"
                                    />
                                </div>
                                <div className="md:col-span-12">
                                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">Company Address</label>
                                    <input
                                        type="text"
                                        value={gstDetails.GSTCompanyAddress}
                                        onChange={(e) => setGstDetails({...gstDetails, GSTCompanyAddress: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-black transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

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
                                    <span className="font-bold text-slate-800">₹{baseFareAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Taxes & Surcharges</span>
                                    <span className="font-bold text-slate-800">₹{taxAmount.toLocaleString()}</span>
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
                                        ₹{(totalAmount + (selectedSeat?.Price || 0) + (selectedMeal?.Price || 0) + (selectedBaggage?.Price || 0)).toLocaleString()}
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
                                <span className="font-bold text-slate-800">₹{baseFareAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Taxes & Surcharges</span>
                                <span className="font-bold text-slate-800">₹{taxAmount.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-slate-100 my-2"></div>
                            <div className="flex justify-between text-lg">
                                <span className="font-bold text-slate-800">Total Amount</span>
                                <span className="font-black text-slate-900">₹{totalAmount.toLocaleString()}</span>
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
                        ₹{(totalAmount + (selectedSeat?.Price || 0) + (selectedMeal?.Price || 0) + (selectedBaggage?.Price || 0)).toLocaleString()}
                    </div>
                </div>
                <button
                    onClick={handleBook}
                    disabled={bookingStatus === 'booking' || bookingStatus === 'ticketing' || bookingStatus === 'success'}
                    className={`bg-black text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-gray-900/20 active:scale-95 transition-transform flex items-center space-x-2 ${bookingStatus === 'success' ? 'bg-green-600' : ''}`}
                >
                    {bookingStatus === 'idle' && (
                        <>
                            <span>Continue</span>
                            <ArrowRight size={16} />
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
                            Confirmed!
                        </span>
                    )}
                    {bookingStatus === 'failed' && (
                        <span>Try Again</span>
                    )}
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
                                    <p className="text-xs text-slate-500">{airlineCode}-{flightNumber} • {firstLeg.Origin?.Airport?.CityName || firstLeg.from || 'Origin'} → {firstLeg.Destination?.Airport?.CityName || firstLeg.to || 'Destination'}</p>
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
