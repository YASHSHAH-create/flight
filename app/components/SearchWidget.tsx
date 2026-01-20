"use client";
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Building, Car, ArrowRightLeft, Calendar, ArrowRight, ChevronDown, MapPin, Users, Plus, X } from 'lucide-react';

const airports = [
    // Top Metros (India)
    { code: 'DEL', city: 'New Delhi', airport: 'Indira Gandhi International Airport', country: 'India' },
    { code: 'BOM', city: 'Mumbai', airport: 'Chhatrapati Shivaji Maharaj International Airport', country: 'India' },
    { code: 'BLR', city: 'Bengaluru', airport: 'Kempegowda International Airport', country: 'India' },
    { code: 'MAA', city: 'Chennai', airport: 'Chennai International Airport', country: 'India' },
    { code: 'CCU', city: 'Kolkata', airport: 'Netaji Subhash Chandra Bose International Airport', country: 'India' },
    { code: 'HYD', city: 'Hyderabad', airport: 'Rajiv Gandhi International Airport', country: 'India' },

    // Top International
    { code: 'DXB', city: 'Dubai', airport: 'Dubai International Airport', country: 'UAE' },
    { code: 'JFK', city: 'New York', airport: 'John F. Kennedy International Airport', country: 'USA' },
    { code: 'LHR', city: 'London', airport: 'Heathrow Airport', country: 'UK' },
    { code: 'SIN', city: 'Singapore', airport: 'Changi Airport', country: 'Singapore' },
    { code: 'CDG', city: 'Paris', airport: 'Charles de Gaulle Airport', country: 'France' },
    { code: 'HND', city: 'Tokyo', airport: 'Haneda Airport', country: 'Japan' },
    { code: 'SYD', city: 'Sydney', airport: 'Kingsford Smith Airport', country: 'Australia' },
    { code: 'BKK', city: 'Bangkok', airport: 'Suvarnabhumi Airport', country: 'Thailand' },
    { code: 'YYZ', city: 'Toronto', airport: 'Pearson International Airport', country: 'Canada' },

    // Other Major Indian Airports
    { code: 'AMD', city: 'Ahmedabad', airport: 'Sardar Vallabhbhai Patel International Airport', country: 'India' },
    { code: 'COK', city: 'Kochi', airport: 'Cochin International Airport', country: 'India' },
    { code: 'GOI', city: 'Goa (Dabolim)', airport: 'Dabolim Airport', country: 'India' },
    { code: 'GOX', city: 'Goa (Mopa)', airport: 'Manohar International Airport', country: 'India' },
    { code: 'PNQ', city: 'Pune', airport: 'Pune Airport', country: 'India' },
    { code: 'GAU', city: 'Guwahati', airport: 'Lokpriya Gopinath Bordoloi International Airport', country: 'India' },
    { code: 'JAI', city: 'Jaipur', airport: 'Jaipur International Airport', country: 'India' },
    { code: 'LKO', city: 'Lucknow', airport: 'Chaudhary Charan Singh International Airport', country: 'India' },
    { code: 'TRV', city: 'Thiruvananthapuram', airport: 'Thiruvananthapuram International Airport', country: 'India' },
    { code: 'BBI', city: 'Bhubaneswar', airport: 'Biju Patnaik International Airport', country: 'India' },
    { code: 'CCJ', city: 'Kozhikode', airport: 'Calicut International Airport', country: 'India' },
    { code: 'SXR', city: 'Srinagar', airport: 'Sheikh ul-Alam International Airport', country: 'India' },
    { code: 'IDR', city: 'Indore', airport: 'Devi Ahilya Bai Holkar Airport', country: 'India' },
    { code: 'IXC', city: 'Chandigarh', airport: 'Shaheed Bhagat Singh International Airport', country: 'India' },
    { code: 'NAG', city: 'Nagpur', airport: 'Dr. Babasaheb Ambedkar International Airport', country: 'India' },
    { code: 'VNS', city: 'Varanasi', airport: 'Lal Bahadur Shastri International Airport', country: 'India' },
    { code: 'PAT', city: 'Patna', airport: 'Jay Prakash Narayan Airport', country: 'India' },
    { code: 'IXB', city: 'Bagdogra', airport: 'Bagdogra Airport', country: 'India' },
    { code: 'ATQ', city: 'Amritsar', airport: 'Sri Guru Ram Dass Jee International Airport', country: 'India' },
    { code: 'VTZ', city: 'Visakhapatnam', airport: 'Visakhapatnam Airport', country: 'India' },
    { code: 'RPR', city: 'Raipur', airport: 'Swami Vivekananda Airport', country: 'India' },
    { code: 'IXM', city: 'Madurai', airport: 'Madurai Airport', country: 'India' },
    { code: 'IXR', city: 'Ranchi', airport: 'Birsa Munda Airport', country: 'India' },
    { code: 'CJB', city: 'Coimbatore', airport: 'Coimbatore International Airport', country: 'India' },
    { code: 'UDR', city: 'Udaipur', airport: 'Maharana Pratap Airport', country: 'India' },
    { code: 'JDH', city: 'Jodhpur', airport: 'Jodhpur Airport', country: 'India' },
    { code: 'VGA', city: 'Vijayawada', airport: 'Vijayawada Airport', country: 'India' },
    { code: 'TRZ', city: 'Tiruchirappalli', airport: 'Tiruchirappalli International Airport', country: 'India' },
    { code: 'IXE', city: 'Mangaluru', airport: 'Mangaluru International Airport', country: 'India' },
    { code: 'IXJ', city: 'Jammu', airport: 'Jammu Civil Enclave', country: 'India' },
    { code: 'IXA', city: 'Agartala', airport: 'Maharaja Bir Bikram Airport', country: 'India' },
    { code: 'STV', city: 'Surat', airport: 'Surat Airport', country: 'India' },
    { code: 'BHO', city: 'Bhopal', airport: 'Raja Bhoj Airport', country: 'India' },
    { code: 'BDQ', city: 'Vadodara', airport: 'Vadodara Airport', country: 'India' },
    { code: 'IMF', city: 'Imphal', airport: 'Bir Tikendrajit International Airport', country: 'India' },
    { code: 'DIB', city: 'Dibrugarh', airport: 'Dibrugarh Airport', country: 'India' },
    { code: 'DMU', city: 'Dimapur', airport: 'Dimapur Airport', country: 'India' },
    { code: 'AJL', city: 'Aizawl', airport: 'Lengpui Airport', country: 'India' },
    { code: 'JRH', city: 'Jorhat', airport: 'Jorhat Airport', country: 'India' },
    { code: 'IXS', city: 'Silchar', airport: 'Silchar Airport', country: 'India' },
    { code: 'TEZ', city: 'Tezpur', airport: 'Tezpur Airport', country: 'India' },
    { code: 'IXI', city: 'Lilabari', airport: 'Lilabari Airport', country: 'India' },
    { code: 'SHL', city: 'Shillong', airport: 'Shillong Airport', country: 'India' },
    { code: 'IXZ', city: 'Port Blair', airport: 'Veer Savarkar International Airport', country: 'India' },
    { code: 'IXL', city: 'Leh', airport: 'Kushok Bakula Rimpochee Airport', country: 'India' },
    { code: 'DED', city: 'Dehradun', airport: 'Jolly Grant Airport', country: 'India' },
    { code: 'AGX', city: 'Agatti', airport: 'Agatti Airport', country: 'India' },
    { code: 'IXD', city: 'Prayagraj', airport: 'Prayagraj Airport', country: 'India' },
    { code: 'HSR', city: 'Rajkot', airport: 'Hirasar Airport', country: 'India' },
    { code: 'BKB', city: 'Bikaner', airport: 'Nal Airport', country: 'India' },
    { code: 'JSA', city: 'Jaisalmer', airport: 'Jaisalmer Airport', country: 'India' },
    { code: 'ISK', city: 'Nashik', airport: 'Nashik Airport', country: 'India' },
    { code: 'SAG', city: 'Shirdi', airport: 'Shirdi Airport', country: 'India' },
    { code: 'DHM', city: 'Dharamshala', airport: 'Kangra Airport', country: 'India' },
    { code: 'GWL', city: 'Gwalior', airport: 'Rajmata Vijaya Raje Scindia Air Terminal', country: 'India' },
    { code: 'JLR', city: 'Jabalpur', airport: 'Jabalpur Airport', country: 'India' },
    { code: 'MYQ', city: 'Mysuru', airport: 'Mysore Airport', country: 'India' },
    { code: 'HBX', city: 'Hubballi', airport: 'Hubballi Airport', country: 'India' },
    { code: 'IXG', city: 'Belagavi', airport: 'Belagavi Airport', country: 'India' },
    { code: 'GOP', city: 'Gorakhpur', airport: 'Mahayogi Gorakhnath Airport', country: 'India' },
    { code: 'TIR', city: 'Tirupati', airport: 'Tirupati Airport', country: 'India' },
    { code: 'RJA', city: 'Rajahmundry', airport: 'Rajahmundry Airport', country: 'India' },
    { code: 'KDP', city: 'Kadapa', airport: 'Kadapa Airport', country: 'India' },
];

interface SearchWidgetProps {
    initialState?: {
        fromCode?: string;
        toCode?: string;
        date?: string; // DDMMYYYY
        adults?: number;
        children?: number;
        infants?: number;
        cabinClass?: string; // e, pe, b, f
        journeyType?: string; // 1, 2, 3
    };
    className?: string;
}

const SearchWidget = ({ initialState, className }: SearchWidgetProps) => {
    const [activeTab, setActiveTab] = useState('flight');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Helper to find airport by code
    const findAirport = (code: string) => airports.find(a => a.code === code);

    // Initial State Logic
    // Flight Data State
    const [flightData, setFlightData] = useState(() => {
        if (initialState?.fromCode && initialState?.toCode) {
            const from = findAirport(initialState.fromCode);
            const to = findAirport(initialState.toCode);
            if (from && to) {
                return {
                    from: { ...from, airport: from.airport.replace(' Airport', '') }, // adjust if needed
                    to: { ...to, airport: to.airport.replace(' Airport', '') }
                };
            }
        }
        return {
            from: { code: 'DEL', city: 'New Delhi', airport: 'Indira Gandhi International', country: 'India' },
            to: { code: 'DXB', city: 'Dubai', airport: 'Dubai International', country: 'UAE' }
        };
    });

    // Detailed Flight State
    const [tripType, setTripType] = useState(() => {
        if (initialState?.journeyType) {
            return initialState.journeyType === '2' ? 'Round Trip' : 'One Way'; // Simplified for now
        }
        return 'One Way';
    });

    const [travellers, setTravellers] = useState(() => ({
        adults: initialState?.adults || 1,
        children: initialState?.children || 0,
        infants: initialState?.infants || 0
    }));

    const [travelClass, setTravelClass] = useState(() => {
        const map: Record<string, string> = { 'e': 'Economy', 'pe': 'Premium Economy', 'b': 'Business', 'f': 'First Class' };
        return map[initialState?.cabinClass || 'e'] || 'Economy';
    });

    const [dates, setDates] = useState(() => {
        let departure = new Date().toISOString().split('T')[0];
        if (initialState?.date) {
            // DDMMYYYY -> YYYY-MM-DD
            const d = initialState.date;
            if (d.length === 8) {
                departure = `${d.substring(4, 8)}-${d.substring(2, 4)}-${d.substring(0, 2)}`;
            }
        }
        return { departure, return: '' };
    });

    // UI State for partials
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Search Slider State
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeSearchField, setActiveSearchField] = useState<string>('from');
    const [searchQuery, setSearchQuery] = useState('');

    // Date Picker State
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [activeDateField, setActiveDateField] = useState<string>('departure');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Multi City State
    const [multiCitySegments, setMultiCitySegments] = useState([
        { id: 1, from: airports[0], to: airports[1], date: new Date().toISOString().split('T')[0] },
        { id: 2, from: airports[1], to: airports[2], date: new Date(Date.now() + 86400000).toISOString().split('T')[0] }
    ]);

    const [rotation, setRotation] = useState(0);

    const handleSwap = () => {
        setRotation(prev => prev - 180);
        setFlightData(prev => ({
            from: prev.to,
            to: prev.from
        }));
    };

    const openSearch = (field: string) => {
        setActiveSearchField(field);
        setSearchQuery('');
        setIsSearchOpen(true);
    };

    const openDatePicker = (field: string) => {
        setActiveDateField(field);
        setIsDatePickerOpen(true);
    };

    const handleDateSelect = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        // Adjust for timezone offset to ensure correct string representation
        const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        const dateStr = offsetDate.toISOString().split('T')[0];

        if (activeDateField.startsWith('date-')) {
            const index = parseInt(activeDateField.split('-')[1]);
            setMultiCitySegments(prev => {
                const newSegments = [...prev];
                newSegments[index].date = dateStr;
                return newSegments;
            });
        } else {
            setDates(prev => ({
                ...prev,
                [activeDateField]: dateStr
            }));
        }

        // Auto-switch to return date if we just picked departure and it's a round trip
        if (activeDateField === 'departure' && tripType === 'Round Trip') {
            setActiveDateField('return');
            // Don't close, let user pick return date
        } else {
            setIsDatePickerOpen(false);
        }
    };

    const changeMonth = (increment: number) => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + increment, 1));
    };

    const handleSelectAirport = (airport: typeof airports[0]) => {
        if (activeSearchField.startsWith('from-') || activeSearchField.startsWith('to-')) {
            const [type, indexStr] = activeSearchField.split('-');
            const index = parseInt(indexStr);
            setMultiCitySegments(prev => {
                const newSegments = [...prev];
                const segment = { ...newSegments[index] };
                if (type === 'from') {
                    segment.from = { ...airport, airport: airport.airport.replace(' Airport', '') };
                } else {
                    segment.to = { ...airport, airport: airport.airport.replace(' Airport', '') };
                }
                newSegments[index] = segment;
                return newSegments;
            });
        } else {
            setFlightData(prev => ({
                ...prev,
                [activeSearchField]: {
                    code: airport.code,
                    city: airport.city,
                    airport: airport.airport,
                    country: airport.country
                }
            }));
        }
        setIsSearchOpen(false);
    };

    const filteredAirports = airports.filter(airport =>
        airport.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airport.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airport.airport.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Helpers
    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Select Date';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const toggleDropdown = (name: string) => {
        if (openDropdown === name) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(name);
        }
    };

    const totalPassengers = travellers.adults + travellers.children + travellers.infants;

    return (
        <div className={`w-full max-w-5xl mx-auto mt-2 md:mt-10 relative animate-subtle-up ${className || ''}`} onClick={() => setOpenDropdown(null)}>
            {/* Tabs */}
            <div className="flex items-center justify-center space-x-2 mb-4 relative z-10 py-1">
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
            <div className="bg-white/95 md:bg-white rounded-[20px] md:rounded-[clamp(1.5rem,2vw,2rem)] p-3 md:p-[clamp(0.75rem,2vw,2rem)] shadow-2xl shadow-slate-900/10 text-slate-800 relative z-0 backdrop-blur-xl border border-white/50 min-h-auto md:min-h-[clamp(300px,35vh,400px)]">

                {/* Top Options Row - Compact - Only show for flights */}
                {activeTab === 'flight' && (
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-8 mb-4 md:mb-8 text-xs md:text-sm font-bold text-slate-600 relative z-20">

                        {/* Trip Type Dropdown */}
                        <div className="relative">
                            <div
                                onClick={(e) => { e.stopPropagation(); toggleDropdown('tripType'); }}
                                className="flex items-center space-x-1 bg-slate-100/50 px-2 md:px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors select-none whitespace-nowrap"
                            >
                                <span>{tripType}</span>
                                <ChevronDown size={14} />
                            </div>
                            {openDropdown === 'tripType' && (
                                <div className="absolute top-full left-0 mt-2 z-50 w-40">
                                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-subtle-down">
                                        {['Round Trip', 'One Way'].map((type) => (
                                            <div
                                                key={type}
                                                onClick={() => {
                                                    setTripType(type);
                                                    setOpenDropdown(null);
                                                    if (type === 'Round Trip' && !dates.return) {
                                                        const nextDay = new Date(new Date(dates.departure).getTime() + 86400000);
                                                        setDates(prev => ({
                                                            ...prev,
                                                            return: nextDay.toISOString().split('T')[0]
                                                        }));
                                                    }
                                                }}
                                                className={`px-4 py-2 hover:bg-slate-50 cursor-pointer ${tripType === type ? 'bg-slate-50 font-black text-black' : ''}`}
                                            >
                                                {type}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Travellers Dropdown */}
                        <div className="relative">
                            <div
                                onClick={(e) => { e.stopPropagation(); toggleDropdown('travellers'); }}
                                className="flex items-center space-x-1 bg-slate-100/50 px-2 md:px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors select-none whitespace-nowrap"
                            >
                                <span>{totalPassengers.toString().padStart(2, '0')} Passengers</span>
                                <ChevronDown size={14} />
                            </div>
                            {openDropdown === 'travellers' && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-64" onClick={(e) => e.stopPropagation()}>
                                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-4 animate-subtle-down">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-bold text-slate-800">Adults</div>
                                                    <div className="text-xs text-slate-500">12+ years</div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => setTravellers(p => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                                                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                                                    >-</button>
                                                    <span className="font-bold w-4 text-center">{travellers.adults}</span>
                                                    <button
                                                        onClick={() => setTravellers(p => ({ ...p, adults: p.adults + 1 }))}
                                                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                                                    >+</button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-bold text-slate-800">Children</div>
                                                    <div className="text-xs text-slate-500">2-12 years</div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => setTravellers(p => ({ ...p, children: Math.max(0, p.children - 1) }))}
                                                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                                                    >-</button>
                                                    <span className="font-bold w-4 text-center">{travellers.children}</span>
                                                    <button
                                                        onClick={() => setTravellers(p => ({ ...p, children: p.children + 1 }))}
                                                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                                                    >+</button>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-bold text-slate-800">Infants</div>
                                                    <div className="text-xs text-slate-500">0-2 years</div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => setTravellers(p => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
                                                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                                                    >-</button>
                                                    <span className="font-bold w-4 text-center">{travellers.infants}</span>
                                                    <button
                                                        onClick={() => setTravellers(p => ({ ...p, infants: p.infants + 1 }))}
                                                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                                                    >+</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Class Dropdown */}
                        <div className="relative">
                            <div
                                onClick={(e) => { e.stopPropagation(); toggleDropdown('class'); }}
                                className="flex items-center space-x-1 bg-slate-100/50 px-2 md:px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors select-none whitespace-nowrap"
                            >
                                <span>{travelClass}</span>
                                <ChevronDown size={14} />
                            </div>
                            {openDropdown === 'class' && (
                                <div className="absolute top-full right-0 mt-2 z-50 w-48">
                                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-subtle-down">
                                        {['Economy', 'Premium Economy', 'Business', 'First Class'].map((cls) => (
                                            <div
                                                key={cls}
                                                onClick={() => { setTravelClass(cls); setOpenDropdown(null); }}
                                                className={`px-4 py-2 hover:bg-slate-50 cursor-pointer ${travelClass === cls ? 'bg-slate-50 font-black text-black' : ''}`}
                                            >
                                                {cls}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {activeTab === 'flight' && tripType !== 'Multi City' && (
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
                                <div
                                    onClick={() => openSearch('from')}
                                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl md:rounded-[clamp(1rem,1.5vw,1.5rem)] p-2.5 md:p-[clamp(0.75rem,2vw,1.25rem)] flex flex-col justify-center cursor-pointer transition-all hover:bg-white hover:shadow-md hover:border-slate-300 group/field min-h-[60px] md:min-h-[70px]"
                                >
                                    <div className="flex items-center space-x-1 text-slate-400 mb-0.5 transition-colors group-hover/field:text-slate-600">
                                        <MapPin size={11} className="md:w-3 md:h-3" />
                                        <span className="text-[10px] md:text-[clamp(0.6rem,0.8vw,0.75rem)] font-bold uppercase tracking-wider">From</span>
                                    </div>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={flightData.from.code}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <div className="text-base md:text-[clamp(1.25rem,2vw,1.5rem)] font-black text-slate-900 tracking-tight group-hover/field:text-black truncate">{flightData.from.city}</div>
                                            <div className="text-[10px] md:text-[clamp(0.65rem,0.8vw,0.75rem)] font-semibold text-slate-500 truncate mt-0 md:mt-0.5">{flightData.from.code}, {flightData.from.country}</div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Swap Icon */}
                                <div className="flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <motion.button
                                        animate={{ rotate: rotation }}
                                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleSwap();
                                        }}
                                        className="bg-white border text-slate-400 hover:text-black hover:shadow-md hover:border-slate-300 transition-colors p-2 rounded-full shadow-sm"
                                    >
                                        <ArrowRightLeft size={16} strokeWidth={2.5} />
                                    </motion.button>
                                </div>

                                {/* Destination */}
                                <div
                                    onClick={() => openSearch('to')}
                                    className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl md:rounded-[clamp(1rem,1.5vw,1.5rem)] p-2.5 md:p-[clamp(0.75rem,2vw,1.25rem)] flex flex-col justify-center cursor-pointer transition-all hover:bg-white hover:shadow-md hover:border-slate-300 group/field min-h-[60px] md:min-h-[70px]"
                                >
                                    <div className="flex items-center space-x-1 text-slate-400 mb-0.5 transition-colors group-hover/field:text-slate-600">
                                        <MapPin size={11} className="md:w-3 md:h-3" />
                                        <span className="text-[10px] md:text-[clamp(0.6rem,0.8vw,0.75rem)] font-bold uppercase tracking-wider">To</span>
                                    </div>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={flightData.to.code}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <div className="text-base md:text-[clamp(1.25rem,2vw,1.5rem)] font-black text-slate-900 tracking-tight group-hover/field:text-black truncate">{flightData.to.city}</div>
                                            <div className="text-[10px] md:text-[clamp(0.65rem,0.8vw,0.75rem)] font-semibold text-slate-500 truncate mt-0 md:mt-0.5">{flightData.to.code}, {flightData.to.country}</div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Dates */}
                            <div className={`lg:col-span-12 flex flex-row items-center gap-2 md:gap-4 h-full lg:col-start-8 lg:col-end-13`}>
                                <div
                                    onClick={() => openDatePicker('departure')}
                                    className="relative flex-1 w-full bg-slate-50 border border-slate-200/80 rounded-2xl md:rounded-[clamp(1rem,1.5vw,1.5rem)] p-2.5 md:p-[clamp(0.75rem,2vw,1.25rem)] flex flex-col justify-center cursor-pointer transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:bg-white group/date h-full min-h-[60px] md:min-h-[clamp(80px,12vh,110px)] overflow-hidden"
                                >
                                    <div className="flex items-center space-x-1 text-slate-400 mb-0.5 transition-colors group-hover/date:text-slate-600">
                                        <Calendar size={11} className="md:w-3 md:h-3" />
                                        <span className="text-[10px] md:text-[clamp(0.6rem,0.8vw,0.75rem)] font-bold uppercase tracking-wider">Departure</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <div className={`text-sm md:text-[clamp(1rem,1.5vw,1.25rem)] font-black tracking-tight ${dates.departure ? 'text-slate-900' : 'text-slate-300'}`}>
                                            {formatDate(dates.departure)}
                                        </div>
                                    </div>
                                </div>

                                <AnimatePresence initial={false}>
                                    {tripType !== 'One Way' && (
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: "100%", opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="flex-1 overflow-hidden h-full"
                                        >
                                            <div
                                                onClick={() => openDatePicker('return')}
                                                className="relative w-full h-full bg-slate-50 border border-slate-200/80 rounded-2xl md:rounded-[clamp(1rem,1.5vw,1.5rem)] p-2.5 md:p-[clamp(0.75rem,2vw,1.25rem)] flex flex-col justify-center cursor-pointer transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:bg-white group/date min-h-[60px] md:min-h-[clamp(80px,12vh,110px)] whitespace-nowrap"
                                            >
                                                <div className="flex items-center space-x-1 text-slate-400 mb-0.5 transition-colors group-hover/date:text-slate-600">
                                                    <Calendar size={11} className="md:w-3 md:h-3" />
                                                    <span className="text-[10px] md:text-[clamp(0.6rem,0.8vw,0.75rem)] font-bold uppercase tracking-wider">Return</span>
                                                </div>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className={`text-sm md:text-[clamp(1rem,1.5vw,1.25rem)] font-black tracking-tight ${dates.return ? 'text-slate-900' : 'text-slate-300'}`}>
                                                        {formatDate(dates.return)}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'flight' && tripType === 'Multi City' && (
                        <motion.div
                            key="flight-multicity"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                        >
                            <div className="max-h-[60vh] md:max-h-auto overflow-y-auto pr-2 space-y-3">
                                {multiCitySegments.map((segment, index) => (
                                    <div key={segment.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50/50 p-2 rounded-xl relative group">
                                        {/* Remove Button */}
                                        {multiCitySegments.length > 2 && (
                                            <button
                                                onClick={() => setMultiCitySegments(prev => prev.filter((_, i) => i !== index))}
                                                className="absolute -top-2 -right-2 bg-white text-red-500 p-1 rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}

                                        {/* From */}
                                        <div
                                            onClick={() => openSearch(`from-${index}`)}
                                            className="md:col-span-4 bg-white border border-slate-200 rounded-xl p-3 cursor-pointer hover:border-black/50 transition-all"
                                        >
                                            <div className="text-[10px] text-slate-400 font-bold uppercase">From</div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-800">{segment.from.city}</span>
                                                <span className="text-xs font-black text-slate-400">{segment.from.code}</span>
                                            </div>
                                        </div>

                                        {/* To */}
                                        <div
                                            onClick={() => openSearch(`to-${index}`)}
                                            className="md:col-span-4 bg-white border border-slate-200 rounded-xl p-3 cursor-pointer hover:border-black/50 transition-all"
                                        >
                                            <div className="text-[10px] text-slate-400 font-bold uppercase">To</div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-800">{segment.to.city}</span>
                                                <span className="text-xs font-black text-slate-400">{segment.to.code}</span>
                                            </div>
                                        </div>

                                        {/* Date */}
                                        <div
                                            onClick={() => openDatePicker(`date-${index}`)}
                                            className="md:col-span-4 bg-white border border-slate-200 rounded-xl p-3 cursor-pointer hover:border-black/50 transition-all"
                                        >
                                            <div className="text-[10px] text-slate-400 font-bold uppercase">Date</div>
                                            <div className="font-bold text-slate-800">{formatDate(segment.date)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Flight Button */}
                            {multiCitySegments.length < 5 && (
                                <button
                                    onClick={() => setMultiCitySegments(prev => [
                                        ...prev,
                                        {
                                            id: Date.now(),
                                            from: prev[prev.length - 1].to, // Last segment destination as new origin
                                            to: airports[(airports.findIndex(a => a.code === prev[prev.length - 1].to.code) + 1) % airports.length],
                                            date: new Date(new Date(prev[prev.length - 1].date).getTime() + 86400000).toISOString().split('T')[0]
                                        }
                                    ])}
                                    className="flex items-center space-x-2 text-sm font-bold text-black bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Plus size={16} />
                                    <span>Add Another Flight</span>
                                </button>
                            )}
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
                <div className="mt-4 md:mt-0 md:absolute md:-bottom-7 md:right-8">
                    <button
                        onClick={() => {
                            if (activeTab === 'hotel') {
                                window.location.href = '/hotels/search';
                                return;
                            }

                            const params = new URLSearchParams();
                            params.append('from', flightData.from.code);
                            params.append('to', flightData.to.code);

                            // Format date for API (DDMMYYYY)
                            if (tripType === 'Multi City') {
                                params.append('journeyType', '3');
                                multiCitySegments.forEach(seg => {
                                    params.append('from', seg.from.code);
                                    params.append('to', seg.to.code);
                                    if (seg.date) {
                                        const [year, month, day] = seg.date.split('-');
                                        const formattedDate = `${day}${month}${year}`;
                                        params.append('date', formattedDate);
                                    }
                                });
                            } else {
                                params.append('from', flightData.from.code);
                                params.append('to', flightData.to.code);

                                if (dates.departure) {
                                    const [year, month, day] = dates.departure.split('-');
                                    const formattedDate = `${day}${month}${year}`;
                                    params.append('date', formattedDate);
                                }

                                const jType = tripType === 'One Way' ? '1' : '2';
                                params.append('journeyType', jType);

                                if (jType === '2' && dates.return) {
                                    const [year, month, day] = dates.return.split('-');
                                    const formattedDate = `${day}${month}${year}`;
                                    params.append('returnDate', formattedDate);
                                }
                            }

                            params.append('adults', travellers.adults.toString());
                            params.append('children', travellers.children.toString());
                            params.append('infants', travellers.infants.toString());
                            params.append('class', travelClass === 'Economy' ? 'e' : travelClass === 'Premium Economy' ? 'pe' : travelClass === 'Business' ? 'b' : 'f');

                            window.location.href = `/search?${params.toString()}`;
                        }}
                        className="w-full md:w-auto bg-gradient-to-r from-slate-900 to-slate-800 text-white px-8 py-3.5 md:py-3.5 rounded-2xl md:rounded-2xl font-bold text-base md:text-base shadow-xl shadow-slate-900/20 hover:shadow-slate-900/30 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center space-x-2"
                    >
                        <span>Search {activeTab === 'flight' ? 'Flights' : activeTab === 'hotel' ? 'Hotels' : 'Cars'}</span>
                        <ArrowRight size={18} strokeWidth={3} />
                    </button>
                </div>
            </div>

         

            {/* Date Picker Slider/Modal */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isDatePickerOpen && (
                        <div className="fixed inset-0 z-[100] flex flex-col justify-end md:justify-center bg-slate-900/60 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsDatePickerOpen(false)}
                                className="absolute inset-0 cursor-pointer"
                            />
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="bg-white w-full md:w-[400px] md:rounded-2xl rounded-t-[2rem] shadow-2xl relative z-10 md:mx-auto md:my-auto h-auto flex flex-col overflow-hidden pb-8"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                    <button
                                        onClick={() => changeMonth(-1)}
                                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                    >
                                        <ChevronDown size={20} className="rotate-90" />
                                    </button>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </h3>
                                    <button
                                        onClick={() => changeMonth(1)}
                                        className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                    >
                                        <ChevronDown size={20} className="-rotate-90" />
                                    </button>
                                </div>

                                <div className="p-4">
                                    <div className="text-center font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
                                        Select {activeDateField === 'departure' ? 'Departure' : 'Return'} Date
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                            <div key={d} className="text-center text-xs font-bold text-slate-400 py-1">{d}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
                                            <div key={`empty-${i}`} />
                                        ))}
                                        {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                            const day = i + 1;
                                            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                            const isSelected = activeDateField === 'departure'
                                                ? dates.departure === date.toISOString().split('T')[0]
                                                : dates.return === date.toISOString().split('T')[0];
                                            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                                            return (
                                                <button
                                                    key={day}
                                                    disabled={isPast}
                                                    onClick={() => handleDateSelect(day)}
                                                    className={`
                                                    h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                                    ${isSelected ? 'bg-black text-white shadow-lg scale-110' : 'text-slate-700 hover:bg-slate-100'}
                                                    ${isPast ? 'opacity-20 cursor-not-allowed hover:bg-transparent' : ''}
                                                `}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {mounted && createPortal(
                <AnimatePresence>
                    {isSearchOpen && (
                        <div className="fixed inset-0 z-[100] flex flex-col justify-end md:justify-center bg-slate-900/60 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSearchOpen(false)}
                                className="absolute inset-0 cursor-pointer"
                            />
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="bg-white w-full h-[100dvh] md:h-[600px] md:w-[600px] max-w-none md:max-w-2xl md:rounded-2xl rounded-none shadow-2xl relative z-10 md:mx-auto md:my-auto flex flex-col overflow-hidden"
                            >
                                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                                    <button
                                        onClick={() => setIsSearchOpen(false)}
                                        className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors md:hidden"
                                    >
                                        <ArrowRight className="rotate-180" size={24} />
                                    </button>
                                    <h3 className="text-lg font-bold text-slate-800 flex-1">
                                        Select {activeSearchField === 'from' ? 'Origin' : 'Destination'}
                                    </h3>
                                    <button
                                        onClick={() => setIsSearchOpen(false)}
                                        className="hidden md:flex p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                                    >
                                        <ChevronDown size={20} />
                                    </button>
                                </div>

                                <div className="p-4 bg-slate-50">
                                    <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                                        <MapPin size={18} className="text-slate-400 mr-3" />
                                        <input
                                            type="text"
                                            placeholder="Search airport or city..."
                                            className="bg-transparent border-none outline-none w-full text-slate-800 font-medium placeholder:text-slate-400"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-2">
                                    <div className="space-y-1">
                                        {filteredAirports.map((airport) => (
                                            <div
                                                key={airport.code}
                                                onClick={() => handleSelectAirport(airport)}
                                                className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs group-hover:bg-black group-hover:text-white transition-colors">
                                                        <Plane size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{airport.city}</div>
                                                        <div className="text-xs text-slate-500">{airport.airport}</div>
                                                    </div>
                                                </div>
                                                <div className="text-lg font-black text-slate-200 group-hover:text-slate-900 transition-colors">
                                                    {airport.code}
                                                </div>
                                            </div>
                                        ))}
                                        {filteredAirports.length === 0 && (
                                            <div className="p-8 text-center text-slate-400">
                                                No airports found matching "{searchQuery}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div >
    );
};

export default SearchWidget;
