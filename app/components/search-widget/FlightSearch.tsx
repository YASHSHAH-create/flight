import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowRightLeft, Calendar, ChevronDown, MapPin, Plus, X } from 'lucide-react';
import AirportSearchModal from './AirportSearchModal';
import DatePickerModal from './DatePickerModal';
import { airports } from './data';

interface FlightSearchProps {
    initialState?: any;
}

const FlightSearch = ({ initialState }: FlightSearchProps) => {
    const router = useRouter();
    // ---- STATE ----
    const [tripType, setTripType] = useState('One Way');
    const [travellers, setTravellers] = useState({ adults: 1, children: 0, infants: 0 });
    const [travelClass, setTravelClass] = useState('Economy');

    // One Way / Round Trip Data
    const [flightData, setFlightData] = useState({
        from: airports.find((a: any) => a.code === 'DEL') || airports[0],
        to: airports.find((a: any) => a.code === 'DXB') || airports[1],
    });

    const [dates, setDates] = useState({
        departure: new Date().toISOString().split('T')[0],
        return: '',
    });

    // Multi City Data
    const [multiCitySegments, setMultiCitySegments] = useState([
        { id: 1, from: airports[0], to: airports[1], date: new Date().toISOString().split('T')[0] },
        { id: 2, from: airports[1], to: airports[2], date: new Date(Date.now() + 86400000).toISOString().split('T')[0] }
    ]);

    // Modals
    const [activeSearchField, setActiveSearchField] = useState<string | null>(null); // 'from', 'to', 'from-0', etc.
    const [activeDateField, setActiveDateField] = useState<string | null>(null); // 'departure', 'return', 'date-0', etc.
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Lock body scroll when modal is open
    React.useEffect(() => {
        if (activeSearchField || activeDateField) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [activeSearchField, activeDateField]);


    // ---- HANDLERS ----

    const handleAirportSelect = (airport: typeof airports[0]) => {
        if (!activeSearchField) return;

        if (activeSearchField === 'from') {
            setFlightData(prev => ({ ...prev, from: airport }));
        } else if (activeSearchField === 'to') {
            setFlightData(prev => ({ ...prev, to: airport }));
        } else if (activeSearchField.startsWith('from-')) {
            const idx = parseInt(activeSearchField.split('-')[1]);
            setMultiCitySegments(prev => {
                const newArr = [...prev];
                newArr[idx].from = airport;
                return newArr;
            });
        } else if (activeSearchField.startsWith('to-')) {
            const idx = parseInt(activeSearchField.split('-')[1]);
            setMultiCitySegments(prev => {
                const newArr = [...prev];
                newArr[idx].to = airport;
                return newArr;
            });
        }
        setActiveSearchField(null);
    };

    const handleDateSelect = (date: Date) => {
        if (!activeDateField) return;

        // Adjust for timezone to get YYYY-MM-DD correctly
        const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
        const dateStr = offsetDate.toISOString().split('T')[0];

        if (activeDateField === 'departure') {
            setDates(prev => ({ ...prev, departure: dateStr }));
            if (tripType === 'Round Trip') {
                setActiveDateField('return'); // Auto switch
                return;
            }
        } else if (activeDateField === 'return') {
            setDates(prev => ({ ...prev, return: dateStr }));
        } else if (activeDateField.startsWith('date-')) {
            const idx = parseInt(activeDateField.split('-')[1]);
            setMultiCitySegments(prev => {
                const newArr = [...prev];
                newArr[idx].date = dateStr;
                return newArr;
            });
        }
        setActiveDateField(null);
    };

    const handleSwap = () => {
        setFlightData(prev => ({ from: prev.to, to: prev.from }));
    };

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (tripType === 'Multi City') {
            params.append('journeyType', '3');
            multiCitySegments.forEach(seg => {
                params.append('from', seg.from.code);
                params.append('to', seg.to.code);
                if (seg.date) {
                    const [y, m, d] = seg.date.split('-');
                    params.append('date', `${d}${m}${y}`);
                }
            });
        } else {
            params.append('from', flightData.from.code);
            params.append('to', flightData.to.code);
            params.append('journeyType', tripType === 'One Way' ? '1' : '2');

            if (dates.departure) {
                const [y, m, d] = dates.departure.split('-');
                params.append('date', `${d}${m}${y}`);
            }
            if (tripType === 'Round Trip' && dates.return) {
                const [y, m, d] = dates.return.split('-');
                params.append('returnDate', `${d}${m}${y}`);
            }
        }

        params.append('adults', travellers.adults.toString());
        params.append('children', travellers.children.toString());
        params.append('infants', travellers.infants.toString());

        const classMap: any = { 'Economy': 'e', 'Premium Economy': 'pe', 'Business': 'b', 'First Class': 'f' };
        params.append('class', classMap[travelClass] || 'e');

        router.push(`/search?${params.toString()}`);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'Select Date';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const toggleDropdown = (name: string) => {
        setOpenDropdown(prev => prev === name ? null : name);
    };

    return (
        <div className="relative" onClick={() => setOpenDropdown(null)}>
            {/* Top Row: Trip Type, Travellers, Class */}
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-8 mb-4 md:mb-8 text-xs md:text-sm font-bold text-slate-600 relative z-20">
                {/* Trip Type */}
                <div className="relative">
                    <div onClick={(e) => { e.stopPropagation(); toggleDropdown('tripType'); }}
                        className="flex items-center space-x-1 bg-slate-100/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors select-none">
                        <span>{tripType}</span>
                        <ChevronDown size={14} />
                    </div>
                    {openDropdown === 'tripType' && (
                        <div className="absolute top-full left-0 mt-2 z-50 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                            {['One Way', 'Round Trip', 'Multi City'].map(type => (
                                <div key={type}
                                    onClick={() => {
                                        setTripType(type);
                                        if (type === 'Round Trip' && !dates.return) {
                                            // Set return date to next day
                                            const d = new Date(dates.departure);
                                            d.setDate(d.getDate() + 1);
                                            setDates(prev => ({ ...prev, return: d.toISOString().split('T')[0] }));
                                        }
                                    }}
                                    className={`px-4 py-2 hover:bg-slate-50 cursor-pointer ${tripType === type ? 'bg-slate-50 font-black' : ''}`}>
                                    {type}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Travellers */}
                <div className="relative">
                    <div onClick={(e) => { e.stopPropagation(); toggleDropdown('travellers'); }}
                        className="flex items-center space-x-1 bg-slate-100/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors select-none">
                        <span>{travellers.adults + travellers.children + travellers.infants} Passengers</span>
                        <ChevronDown size={14} />
                    </div>
                    {openDropdown === 'travellers' && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-4" onClick={e => e.stopPropagation()}>
                            {['adults', 'children', 'infants'].map((type) => (
                                <div key={type} className="flex items-center justify-between mb-4 last:mb-0">
                                    <div>
                                        <div className="font-bold text-slate-800 capitalize">{type}</div>
                                        <div className="text-xs text-slate-500">
                                            {type === 'adults' ? '12+ yrs' : type === 'children' ? '2-12 yrs' : '0-2 yrs'}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button onClick={() => setTravellers(p => ({ ...p, [type as keyof typeof travellers]: Math.max(type === 'adults' ? 1 : 0, p[type as keyof typeof travellers] - 1) }))}
                                            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-lg">-</button>
                                        <span className="font-bold w-4 text-center">{travellers[type as keyof typeof travellers]}</span>
                                        <button onClick={() => setTravellers(p => ({ ...p, [type as keyof typeof travellers]: p[type as keyof typeof travellers] + 1 }))}
                                            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-lg">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Class */}
                <div className="relative">
                    <div onClick={(e) => { e.stopPropagation(); toggleDropdown('class'); }}
                        className="flex items-center space-x-1 bg-slate-100/50 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors select-none">
                        <span>{travelClass}</span>
                        <ChevronDown size={14} />
                    </div>
                    {openDropdown === 'class' && (
                        <div className="absolute top-full right-0 mt-2 z-50 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                            {['Economy', 'Premium Economy', 'Business', 'First Class'].map(cls => (
                                <div key={cls} onClick={() => setTravelClass(cls)}
                                    className={`px-4 py-2 hover:bg-slate-50 cursor-pointer ${travelClass === cls ? 'bg-slate-50 font-black' : ''}`}>
                                    {cls}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Inputs */}
            {tripType !== 'Multi City' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6 items-center">
                    {/* Origin & Dest */}
                    <div className="lg:col-span-7 flex flex-col md:flex-row items-center gap-2 relative">
                        {/* From */}
                        <div onClick={() => setActiveSearchField('from')}
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-center cursor-pointer hover:bg-white hover:shadow-md hover:border-slate-300 min-h-[70px]">
                            <div className="flex items-center space-x-1 text-slate-400 mb-0.5">
                                <MapPin size={12} />
                                <span className="text-xs font-bold uppercase tracking-wider">From</span>
                            </div>
                            <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate">{flightData.from.city}</div>
                            <div className="text-xs font-semibold text-slate-500 truncate">{flightData.from.code}, {flightData.from.country}</div>
                        </div>

                        {/* Swap */}
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
                            <button onClick={(e) => { e.stopPropagation(); handleSwap(); }}
                                className="bg-white border text-slate-400 hover:text-black hover:shadow-md p-2 rounded-full shadow-sm">
                                <ArrowRightLeft size={16} />
                            </button>
                        </div>
                        {/* Mobile Swap - Positioned differently or just allow re-selection */}

                        {/* To */}
                        <div onClick={() => setActiveSearchField('to')}
                            className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-center cursor-pointer hover:bg-white hover:shadow-md hover:border-slate-300 min-h-[70px]">
                            <div className="flex items-center space-x-1 text-slate-400 mb-0.5">
                                <MapPin size={12} />
                                <span className="text-xs font-bold uppercase tracking-wider">To</span>
                            </div>
                            <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate">{flightData.to.city}</div>
                            <div className="text-xs font-semibold text-slate-500 truncate">{flightData.to.code}, {flightData.to.country}</div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="lg:col-span-5 flex flex-row items-center gap-2 md:gap-4 h-full">
                        <div onClick={() => setActiveDateField('departure')}
                            className="flex-1 w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-center cursor-pointer hover:bg-white hover:shadow-md hover:border-slate-300 min-h-[70px]">
                            <div className="flex items-center space-x-1 text-slate-400 mb-0.5">
                                <Calendar size={12} />
                                <span className="text-xs font-bold uppercase tracking-wider">Departure</span>
                            </div>
                            <div className={`text-xl md:text-2xl font-black ${dates.departure ? 'text-slate-900' : 'text-slate-300'}`}>
                                {formatDate(dates.departure)}
                            </div>
                        </div>

                        {tripType !== 'One Way' && (
                            <div onClick={() => setActiveDateField('return')}
                                className="flex-1 w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-center cursor-pointer hover:bg-white hover:shadow-md hover:border-slate-300 min-h-[70px]">
                                <div className="flex items-center space-x-1 text-slate-400 mb-0.5">
                                    <Calendar size={12} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Return</span>
                                </div>
                                <div className={`text-xl md:text-2xl font-black ${dates.return ? 'text-slate-900' : 'text-slate-300'}`}>
                                    {formatDate(dates.return)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Multi City Logic (Simplified for brevity but functional) */}
                    {multiCitySegments.map((seg, idx) => (
                        <div key={seg.id} className="grid grid-cols-12 gap-2 bg-slate-50 p-2 rounded-lg items-center">
                            <div className="col-span-4" onClick={() => setActiveSearchField(`from-${idx}`)}>
                                <div className="text-[10px] text-slate-500 font-bold">From</div>
                                <div className="font-bold text-sm">{seg.from.code}</div>
                            </div>
                            <div className="col-span-1 text-center text-slate-400">→</div>
                            <div className="col-span-4" onClick={() => setActiveSearchField(`to-${idx}`)}>
                                <div className="text-[10px] text-slate-500 font-bold">To</div>
                                <div className="font-bold text-sm">{seg.to.code}</div>
                            </div>
                            <div className="col-span-3" onClick={() => setActiveDateField(`date-${idx}`)}>
                                <div className="text-[10px] text-slate-500 font-bold">Date</div>
                                <div className="font-bold text-sm">{formatDate(seg.date).split(',')[0]}</div>
                            </div>
                        </div>
                    ))}
                    {multiCitySegments.length < 5 && (
                        <button onClick={() => setMultiCitySegments(prev => [...prev, { id: Date.now(), from: prev[prev.length - 1].to, to: airports[0], date: '' }])}
                            className="text-sm font-bold text-blue-600 flex items-center space-x-1">
                            <Plus size={14} /> <span>Add Flight</span>
                        </button>
                    )}
                </div>
            )}

            {/* Search Button */}
            <div className="mt-6 flex justify-end">
                <button onClick={handleSearch}
                    className="w-full md:w-auto bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center space-x-2">
                    <span>Search Flights</span>
                    <ArrowRight size={18} />
                </button>
            </div>

            {/* MODALS */}
            <AirportSearchModal
                isOpen={!!activeSearchField}
                onClose={() => setActiveSearchField(null)}
                onSelect={handleAirportSelect}
                activeField={activeSearchField?.startsWith('to') ? 'to' : 'from'}
                airports={airports}
            />

            <DatePickerModal
                isOpen={!!activeDateField}
                onClose={() => setActiveDateField(null)}
                onSelect={handleDateSelect}
                title={activeDateField === 'return' ? 'Select Return Date' : 'Select Departure Date'}
                selectedDate={activeDateField === 'return' && dates.return ? new Date(dates.return) : dates.departure ? new Date(dates.departure) : undefined}
                minDate={activeDateField === 'return' && dates.departure ? new Date(dates.departure) : undefined}
            />
        </div>
    );
};

export default FlightSearch;
