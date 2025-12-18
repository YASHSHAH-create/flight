'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    MapPin,
    Star,
    Wifi,
    Coffee,
    Utensils,
    Car,
    Tv,
    Waves,
    Filter,
    ChevronDown,
    Heart,
    Share2,
    ArrowRight,
    SlidersHorizontal,
    X,
    Check,
    Zap,
    ShieldCheck,
    List
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import BottomNav from '../../components/BottomNav';

// --- Types & Mock Data ---

interface Hotel {
    id: string;
    name: string;
    location: string;
    distance: string;
    coordinates: { lat: number; lng: number };
    rating: number;
    ratingText: string;
    reviews: number;
    stars: number;
    price: number;
    originalPrice: number;
    images: string[];
    amenities: string[];
    tags: string[];
    deal?: string;
}

const MOCK_HOTELS: Hotel[] = [
    {
        id: '1',
        name: "The Oberoi Udaivilas",
        location: "Lake Pichola, Udaipur",
        distance: "2.5 km from city center",
        coordinates: { lat: 24.5764, lng: 73.6835 },
        rating: 4.9,
        ratingText: "Exceptional",
        reviews: 3240,
        stars: 5,
        price: 32000,
        originalPrice: 45000,
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2025&auto=format&fit=crop"
        ],
        amenities: ["wifi", "pool", "spa", "restaurant", "lake_view"],
        tags: ["Luxury", "Honeymoon Special"],
        deal: "Early Bird Deal"
    },
    {
        id: '2',
        name: "Taj Lake Palace",
        location: "Lake Pichola, Udaipur",
        distance: "In the middle of Lake Pichola",
        coordinates: { lat: 24.5756, lng: 73.6811 },
        rating: 4.8,
        ratingText: "Superb",
        reviews: 2150,
        stars: 5,
        price: 48500,
        originalPrice: 60000,
        images: [
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop"
        ],
        amenities: ["wifi", "pool", "boat", "dining"],
        tags: ["Heritage", "Iconic"]
    },
    {
        id: '3',
        name: "Raffles Udaipur",
        location: "Udaisagar Lake, Udaipur",
        distance: "12 km from city center",
        coordinates: { lat: 24.55, lng: 73.7 },
        rating: 4.7,
        ratingText: "Fabulous",
        reviews: 890,
        stars: 5,
        price: 28000,
        originalPrice: 35000,
        images: [
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
        ],
        amenities: ["wifi", "spa", "bar", "gym"],
        tags: ["Modern", "Island Oasis"]
    },
    {
        id: '4',
        name: "Trident Udaipur",
        location: "Haridasji Ki Magri, Udaipur",
        distance: "3.2 km from city center",
        coordinates: { lat: 24.57, lng: 73.68 },
        rating: 4.5,
        ratingText: "Very Good",
        reviews: 1560,
        stars: 4,
        price: 12500,
        originalPrice: 18000,
        images: [
            "https://images.unsplash.com/photo-1571896349842-6e5c48dc52e3?q=80&w=2070&auto=format&fit=crop"
        ],
        amenities: ["wifi", "pool", "parking", "restaurant"],
        tags: ["Family Friendly", "Garden"]
    },
    {
        id: '5',
        name: "Aurika, Udaipur - Lemon Tree",
        location: "Kala Rohi, Udaipur",
        distance: "5 km from city center",
        coordinates: { lat: 24.58, lng: 73.66 },
        rating: 4.6,
        ratingText: "Excellent",
        reviews: 1200,
        stars: 4,
        price: 15000,
        originalPrice: 22000,
        images: [
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=2070&auto=format&fit=crop"
        ],
        amenities: ["wifi", "pool", "spa", "view"],
        tags: ["Hilltop", "Scenic Views"]
    },
    {
        id: '6',
        name: "The Leela Palace",
        location: "Lake Pichola, Udaipur",
        distance: "2.8 km from city center",
        coordinates: { lat: 24.58, lng: 73.69 },
        rating: 4.9,
        ratingText: "Exceptional",
        reviews: 1800,
        stars: 5,
        price: 52000,
        originalPrice: 65000,
        images: [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974&auto=format&fit=crop"
        ],
        amenities: ["wifi", "pool", "spa", "lake_view", "butler"],
        tags: ["Ultimate Luxury", "Palace"]
    }
];

// --- Sub-Components ---

const AmenityBadge = ({ name }: { name: string }) => {
    const config: Record<string, { icon: React.ReactNode, label: string }> = {
        wifi: { icon: <Wifi size={12} />, label: "Free Wifi" },
        pool: { icon: <Waves size={12} />, label: "Pool" },
        spa: { icon: <Zap size={12} />, label: "Spa" },
        restaurant: { icon: <Utensils size={12} />, label: "Restaurant" },
        dining: { icon: <Utensils size={12} />, label: "Dining" },
        parking: { icon: <Car size={12} />, label: "Parking" },
        bar: { icon: <Coffee size={12} />, label: "Bar" },
        gym: { icon: <ShieldCheck size={12} />, label: "Gym" },
        lake_view: { icon: <Waves size={12} />, label: "Lake View" },
        boat: { icon: <Waves size={12} />, label: "Boat Ride" },
        butler: { icon: <UserStar size={12} />, label: "Butler" },
        view: { icon: <MapPin size={12} />, label: "View" }
    };

    const item = config[name] || { icon: <Check size={12} />, label: name };

    return (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-[11px] font-medium border border-slate-100">
            {item.icon}
            <span className="capitalize">{item.label}</span>
        </div>
    );
};

// Helper for missing icon
const UserStar = ({ size }: { size: number }) => <Star size={size} />;

const HotelCard = ({ hotel }: { hotel: Hotel }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="group bg-white rounded-[1.5rem] md:rounded-[2rem] p-3 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-slate-100 transition-all duration-300 flex flex-col md:flex-row gap-4 md:gap-6 mb-4 md:mb-6"
        >
            {/* Visuals - Mobile: Full Width, Desktop: Left Side */}
            <div className="relative w-full md:w-[40%] h-[240px] md:h-auto md:min-h-[18rem] rounded-[1.25rem] md:rounded-[1.5rem] overflow-hidden shrink-0">
                <img
                    src={hotel.images[currentImageIndex]}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 md:opacity-60"></div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 md:top-4 md:left-4 flex gap-2 overflow-x-auto no-scrollbar max-w-[80%]">
                    {hotel.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="backdrop-blur-md bg-white/30 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-sm whitespace-nowrap">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Favorite Button */}
                <button
                    onClick={(e) => { e.preventDefault(); setIsLiked(!isLiked); }}
                    className="absolute top-3 right-3 md:top-4 md:right-4 p-2 md:p-2.5 bg-black/20 md:bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white text-white hover:text-red-500 transition-all active:scale-95"
                >
                    <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                </button>

                {/* Navigation Dots (If multiple images) */}
                {hotel.images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {hotel.images.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Details Section */}
            <div className="flex-1 flex flex-col justify-between py-1 md:py-2 pr-0 md:pr-2">
                <div>
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2 md:gap-0">
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                {[...Array(hotel.stars)].map((_, i) => (
                                    <Star key={i} size={12} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <h3 className="text-lg md:text-2xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors cursor-pointer">
                                {hotel.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1.5 md:mt-2 text-slate-500 text-xs md:text-sm flex-wrap">
                                <MapPin size={12} className="text-blue-500 md:w-3.5 md:h-3.5" />
                                <span className="font-medium text-slate-700">{hotel.location}</span>
                                <span className="hidden md:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="text-slate-400">{hotel.distance}</span>
                            </div>
                        </div>

                        {/* Rating Box - Re-positioned for mobile */}
                        <div className="flex items-center md:block gap-2 md:gap-0 mt-1 md:mt-0 md:text-right shrink-0">
                            <div className="inline-flex items-center justify-center bg-blue-600 text-white font-bold text-xs md:text-sm px-2 py-1 md:py-1.5 rounded-lg shadow-sm shadow-blue-200">
                                {hotel.rating}
                            </div>
                            <div className="flex flex-col md:items-end ml-2 md:ml-0">
                                <div className="text-[10px] font-bold text-slate-500 mt-0 md:mt-1 uppercase tracking-wide">{hotel.ratingText}</div>
                                <div className="text-[10px] text-slate-400">{hotel.reviews} reviews</div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-slate-100 my-3 md:my-4"></div>

                    {/* Amenities Grid */}
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-0">
                        {hotel.amenities.slice(0, 5).map(am => (
                            <AmenityBadge key={am} name={am} />
                        ))}
                        {hotel.amenities.length > 5 && (
                            <span className="text-[10px] md:text-xs text-slate-400 font-medium flex items-center px-1">+{hotel.amenities.length - 5} more</span>
                        )}
                    </div>
                </div>

                {/* Pricing & Footer */}
                <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-slate-100/50 gap-3 md:gap-0">
                    <div className="flex items-center justify-between md:block">
                        <div className="md:mb-1.5">
                            {hotel.deal && (
                                <span className="inline-block bg-green-100 text-green-700 text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 md:px-2 rounded-md">
                                    {hotel.deal}
                                </span>
                            )}
                        </div>
                        <div className="text-right md:text-left">
                            <div className="flex items-baseline gap-1.5 md:gap-2 justify-end md:justify-start">
                                <span className="text-xl md:text-3xl font-black text-slate-900 line-clamp-1">₹{hotel.price.toLocaleString()}</span>
                                <span className="text-xs md:text-sm text-slate-400 line-through decoration-slate-300">₹{hotel.originalPrice.toLocaleString()}</span>
                            </div>
                            <div className="text-[10px] md:text-xs text-slate-500 font-medium">
                                + ₹{Math.round(hotel.price * 0.12).toLocaleString()} taxes/fees
                            </div>
                        </div>
                    </div>

                    <button className="w-full md:w-auto bg-slate-900 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200">
                        View Availability
                        <ArrowRight size={16} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const FilterSection = ({ title, defaultOpen = true, children }: { title: string, defaultOpen?: boolean, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-slate-100 py-5 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full mb-3 group"
            >
                <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{title}</h4>
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

const Checkbox = ({ label, count }: { label: string, count?: number }) => (
    <label className="flex items-center justify-between cursor-pointer group py-0.5">
        <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-[4px] border-2 border-slate-200 group-hover:border-blue-500 flex items-center justify-center transition-all bg-white relative">
                <Check size={10} className="text-blue-500 opacity-0 group-hover:opacity-20 active:opacity-100" />
                {/* Note: In a real app, this would check state */}
            </div>
            <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
        </div>
        {count && <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">{count}</span>}
    </label>
);

const MapView = ({ hotels, onClose }: { hotels: Hotel[], onClose: () => void }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-[#e5e3df] overflow-hidden flex flex-col">
            {/* Map Header / Controls */}
            <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start pointer-events-none">
                <button
                    onClick={onClose}
                    className="pointer-events-auto bg-white p-3 rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                    <ArrowRight className="rotate-180 text-slate-900" />
                </button>
            </div>

            {/* Simulated Map Area */}
            <div className="flex-1 w-full h-full relative overflow-auto touch-pan-x touch-pan-y scroll-smooth">
                <div className="min-w-[150vw] min-h-[150vh] relative">
                    <img
                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop"
                        alt="Map Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply grayscale-[0.2]"
                    />

                    {/* Fake Pins positioned randomly for demo (since we don't have real map projection) */}
                    {hotels.map((hotel, i) => (
                        <motion.div
                            key={hotel.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="absolute group"
                            style={{
                                top: `${30 + (i * 12) + Math.sin(i) * 10}%`,
                                left: `${20 + (i * 15) + Math.cos(i) * 10}%`,
                            }}
                        >
                            <div className="relative flex flex-col items-center">
                                <div className="bg-white text-slate-900 font-bold text-xs px-3 py-1.5 rounded-full shadow-md border border-slate-200 group-hover:scale-110 group-hover:bg-slate-900 group-hover:text-white transition-all cursor-pointer whitespace-nowrap z-10">
                                    ₹{hotel.price.toLocaleString()}
                                </div>
                                <div className="w-0.5 h-3 bg-slate-400 group-hover:bg-slate-900 transition-colors"></div>
                                <div className="w-2 h-2 bg-slate-900 rounded-full"></div>

                                {/* Hover Card */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-white rounded-xl shadow-xl p-2 hidden group-hover:block z-20 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200">
                                    <img src={hotel.images[0]} className="w-full h-24 object-cover rounded-lg mb-2" />
                                    <div className="font-bold text-xs text-slate-900">{hotel.name}</div>
                                    <div className="text-[10px] text-slate-500">{hotel.rating} ⭐ ({hotel.reviews})</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Floating List Button */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                <button
                    onClick={onClose}
                    className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                >
                    <List size={18} />
                    <span>Show List</span>
                </button>
            </div>
        </div>
    );
};

// --- Main Page Component ---

export default function HotelSearchPage() {
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [showMap, setShowMap] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans selection:bg-blue-100 selection:text-blue-900">

            {/* Search Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm transition-all duration-300">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between">
                    {/* Back & Search Context */}
                    <div className="flex items-center gap-4 md:gap-6 flex-1">
                        <Link href="/" className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full transition-colors border border-transparent hover:border-slate-200 group">
                            <ArrowRight className="w-5 h-5 rotate-180 text-slate-500 group-hover:text-slate-900 transition-colors" />
                        </Link>

                        {/* Search Pill - Mimics the search bar but compact */}
                        <div className="hidden md:flex items-center bg-slate-100 hover:bg-slate-200/70 transition-colors border border-slate-200 rounded-full px-1.5 py-1.5 cursor-pointer">
                            <div className="px-5 border-r border-slate-300/50">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</div>
                                <div className="text-sm font-bold text-slate-900">Udaipur, India</div>
                            </div>
                            <div className="px-5 border-r border-slate-300/50">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dates</div>
                                <div className="text-sm font-bold text-slate-900">14 - 16 Feb</div>
                            </div>
                            <div className="px-5 mr-2">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guests</div>
                                <div className="text-sm font-bold text-slate-900">2 Guests</div>
                            </div>
                            <button className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                                <ArrowRight size={16} />
                            </button>
                        </div>

                        {/* Mobile Simple Context */}
                        <div className="md:hidden">
                            <h1 className="text-base font-bold text-slate-900">Udaipur</h1>
                            <p className="text-xs text-slate-500 font-medium">14 - 16 Feb • 2 Guests</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-full text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">
                            <Share2 size={16} />
                            <span>Share</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full font-bold text-sm shadow-lg shadow-slate-900/10 hover:bg-black transition-colors">
                            <span>Sign In</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8 lg:py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar - Desktop Sticky */}
                    <aside className="hidden lg:block w-[280px] shrink-0">
                        <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto space-y-6 pb-4 pr-2 custom-scrollbar" data-lenis-prevent>

                            {/* Map Card */}
                            <div
                                onClick={() => setShowMap(true)}
                                className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm group cursor-pointer overflow-hidden relative h-32"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop"
                                    className="w-full h-full object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity"
                                    alt="Map view"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button
                                        className="bg-white text-slate-900 font-bold text-xs px-4 py-2 rounded-full shadow-lg border border-slate-100 flex items-center gap-2 transform group-hover:scale-105 transition-transform"
                                    >
                                        <MapPin size={12} className="text-blue-500" />
                                        Show on Map
                                    </button>
                                </div>
                            </div>

                            {/* Filters Container */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-2">
                                    <h3 className="font-bold text-lg text-slate-900">Filters</h3>
                                    <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide">Reset</button>
                                </div>

                                <FilterSection title="Budget (per night)">
                                    <div className="px-2 py-4">
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full relative">
                                            <div className="absolute left-[20%] right-[30%] top-0 bottom-0 bg-blue-500 rounded-full"></div>
                                            <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow cursor-pointer hover:scale-110 transition-transform"></div>
                                            <div className="absolute right-[30%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow cursor-pointer hover:scale-110 transition-transform"></div>
                                        </div>
                                        <div className="flex justify-between mt-4">
                                            <div className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
                                                <div className="text-slate-400 text-[10px]">Min</div>
                                                <div className="font-bold text-slate-900">₹8k</div>
                                            </div>
                                            <div className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
                                                <div className="text-slate-400 text-[10px]">Max</div>
                                                <div className="font-bold text-slate-900">₹45k</div>
                                            </div>
                                        </div>
                                    </div>
                                </FilterSection>

                                <FilterSection title="Popular Filters">
                                    <Checkbox label="Breakfast Included" count={12} />
                                    <Checkbox label="Free Cancellation" count={8} />
                                    <Checkbox label="Lake View" count={5} />
                                    <Checkbox label="5 Star Properties" count={15} />
                                </FilterSection>

                                <FilterSection title="Amenities">
                                    <Checkbox label="Swimming Pool" />
                                    <Checkbox label="Spa" />
                                    <Checkbox label="Gym" />
                                    <Checkbox label="Bathtub" />
                                </FilterSection>

                                <FilterSection title="Property Type">
                                    <Checkbox label="Hotel" />
                                    <Checkbox label="Resort" />
                                    <Checkbox label="Homestay" />
                                    <Checkbox label="Heritage" />
                                </FilterSection>
                            </div>
                        </div>
                    </aside>

                    {/* Results Feed */}
                    <div className="flex-1 min-w-0">
                        {/* Sort & Count Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Recommended for you</h2>
                                <p className="text-slate-500 text-sm mt-0.5">{MOCK_HOTELS.length} properties found</p>
                            </div>

                            {/* Desktop Sort */}
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-500">Sort by:</span>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-800 hover:border-slate-300 transition-colors">
                                        Recommended
                                        <ChevronDown size={14} className="text-slate-400" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* HOTEL LIST */}
                        <div className="space-y-6">
                            {MOCK_HOTELS.map((hotel) => (
                                <HotelCard key={hotel.id} hotel={hotel} />
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="mt-12 flex flex-col items-center gap-4">
                            <p className="text-slate-400 text-sm font-medium">Showing {MOCK_HOTELS.length} of 42 properties</p>
                            <button className="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-full font-bold hover:bg-slate-50 transition-colors shadow-sm w-full md:w-auto">
                                Show More Results
                            </button>
                        </div>
                    </div>
                </div>
            </main>



            {/* MOBILE FILTER MODAL (Simple implementation) */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobileFilters(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] z-[70] max-h-[85vh] overflow-y-auto lg:hidden"
                        >
                            <div className="sticky top-0 bg-white z-10 p-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-bold text-lg text-slate-900">Filters</h3>
                                <button onClick={() => setShowMobileFilters(false)} className="p-2 bg-slate-100 rounded-full">
                                    <X size={20} className="text-slate-600" />
                                </button>
                            </div>
                            <div className="p-6 pb-24 space-y-8">
                                <FilterSection title="Price Range" defaultOpen={true}>
                                    {/* Same price slider content as desktop */}
                                    <div className="bg-slate-100 h-24 rounded-xl flex items-center justify-center text-slate-400 text-sm">
                                        Price Slider Component
                                    </div>
                                </FilterSection>
                                <FilterSection title="Amenities">
                                    <div className="space-y-4">
                                        <Checkbox label="Swimming Pool" />
                                        <Checkbox label="Wifi" />
                                        <Checkbox label="Breakfast" />
                                    </div>
                                </FilterSection>
                            </div>
                            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex gap-4">
                                <button className="flex-1 py-3.5 font-bold text-slate-600">Reset</button>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="flex-[2] py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20"
                                >
                                    Show 42 Hotels
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* MAP VIEW OVERLAY */}
            <AnimatePresence>
                {showMap && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100]"
                    >
                        <MapView hotels={MOCK_HOTELS} onClose={() => setShowMap(false)} />
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNav
                onFilterClick={() => setShowMobileFilters(true)}
                onMapClick={() => setShowMap(true)}
            />
        </div>
    );
}
