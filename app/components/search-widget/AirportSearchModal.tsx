import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, MapPin, Plane } from 'lucide-react';

interface Airport {
    code: string;
    city: string;
    airport: string;
    country: string;
}

interface AirportSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (airport: Airport) => void;
    activeField: string;
    airports: Airport[];
}

const AirportSearchModal = ({ isOpen, onClose, onSelect, activeField, airports }: AirportSearchModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) setSearchQuery('');
    }, [isOpen]);

    if (!mounted) return null;

    const filteredAirports = airports.filter(airport =>
        airport.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airport.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        airport.airport.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-end md:justify-center bg-slate-900/60 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 cursor-pointer"
                        aria-hidden="true"
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white w-full h-[100dvh] md:h-[600px] md:w-[600px] max-w-none md:max-w-2xl md:rounded-2xl rounded-none shadow-2xl relative z-10 md:mx-auto md:my-auto flex flex-col overflow-hidden"
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Select ${activeField === 'from' ? 'Origin' : 'Destination'}`}
                    >
                        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors md:hidden"
                                aria-label="Close"
                            >
                                <ArrowRight className="rotate-180" size={24} />
                            </button>
                            <h3 className="text-lg font-bold text-slate-800 flex-1">
                                Select {activeField === 'from' ? 'Origin' : 'Destination'}
                            </h3>
                            <button
                                onClick={onClose}
                                className="hidden md:flex p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
                                aria-label="Close"
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
                                        onClick={() => onSelect(airport)}
                                        className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && onSelect(airport)}
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
    );
};

export default AirportSearchModal;
