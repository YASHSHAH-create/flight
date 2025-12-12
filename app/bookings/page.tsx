'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Booking } from '@/types/api';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import { motion } from 'framer-motion';

export default function MyBookingsPage() {
    const { user, loading: authLoading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authLoading && user) {
            fetchBookings();
        }
    }, [user, authLoading]);

    const fetchBookings = async () => {
        // Try to find a valid ID from the user object
        // The API specifically asks for 'googleId', so we prioritize that field or 'id'
        const userId = user?.googleId || user?.id || user?.sub || user?._id || user?.userId;

        if (!user || !userId) {
            console.warn("User loaded but no ID found:", user);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/user/bookings?googleId=${userId}`);
            if (!res.ok) throw new Error('Failed to fetch bookings');
            const data = await res.json();
            // Ensure data is array
            if (Array.isArray(data)) {
                setBookings(data);
            } else {
                setBookings([]);
            }
        } catch (err) {
            console.error(err);
            setError('Could not load bookings.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">My Bookings</h1>
                    <p className="text-gray-600 mb-6">Please log in to view your upcoming and past trips.</p>
                    <Link href="/auth/google" className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Sign In with Google
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-slate-200">
            {/* Sticky Navbar */}
            <div className={`fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-white/20`}>
                <Navbar />
            </div>

            <div className="pt-28 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-slate-900 mb-2">My Bookings</h1>
                    <p className="text-slate-500 mb-8 text-lg">Manage your upcoming flights and view past trips.</p>
                </motion.div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm animate-pulse h-64 border border-slate-100"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-red-600 bg-red-50 p-6 rounded-2xl border border-red-100 font-medium">{error}</div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-slate-100">
                        <div className="text-6xl mb-6">✈️</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No bookings found</h3>
                        <p className="text-slate-500 mb-8 text-lg max-w-md mx-auto">Looks like you haven't booked any flights with us yet. Start your journey today!</p>
                        <Link href="/" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-transform hover:scale-105">
                            Book a Flight
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking) => (
                            <BookingCard key={booking._id} booking={booking} />
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile Bottom Nav */}
            <BottomNav />
        </div>
    );
}

function BookingCard({ booking }: { booking: Booking }) {
    // Attempt to extract data safely
    const itinerary = booking.responseJson?.Response?.Response?.FlightItinerary;
    // According to DB dump, Segments is an array inside FlightItinerary
    const segments = itinerary?.Segments || [];
    const segment = Array.isArray(segments) && segments.length > 0 ? segments[0] : null;

    // Fallback values if data is missing or structure is different
    const airlineName = segment?.Airline?.AirlineName || booking.flightDetails?.AirlineName || 'Unknown Airline';
    const flightNumber = segment?.Airline?.FlightNumber || '';
    const originCode = segment?.Origin?.Airport?.AirportCode || 'ORG';
    const originCity = segment?.Origin?.Airport?.CityName || 'Origin';
    const destCode = segment?.Destination?.Airport?.AirportCode || 'DES';
    const destCity = segment?.Destination?.Airport?.CityName || 'Destination';

    const depTime = segment?.Origin?.DepTime;
    const arrTime = segment?.Destination?.ArrTime;

    const formattedDate = depTime
        ? new Date(depTime).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
        : new Date(booking.createdAt).toLocaleDateString();

    const formattedDepTime = depTime
        ? new Date(depTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '--:--';

    const formattedArrTime = arrTime
        ? new Date(arrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '--:--';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 transition hover:shadow-xl hover:border-slate-200 group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100%] -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm">
                        <span className="text-2xl">✈️</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{airlineName}</h3>
                        <p className="text-xs text-gray-500">{flightNumber}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-800'
                        }`}>
                        {booking.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-center mb-6">
                <div className="text-left">
                    <p className="text-3xl font-bold text-gray-900">{originCode}</p>
                    <p className="text-sm text-gray-500 font-medium">{originCity}</p>
                    <p className="text-lg font-semibold text-gray-800 mt-1">{formattedDepTime}</p>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <p className="text-xs text-gray-400 mb-2">{formattedDate}</p>
                    <div className="w-full h-px bg-gray-200 relative flex items-center justify-center">
                        <div className="text-gray-300 transform rotate-90">✈</div>
                    </div>
                    {/* Duration could actally be calculated or retrieved */}
                    {segment?.Duration && <p className="text-xs text-gray-400 mt-2">{Math.floor(segment.Duration / 60)}h {segment.Duration % 60}m</p>}
                </div>

                <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">{destCode}</p>
                    <p className="text-sm text-gray-500 font-medium">{destCity}</p>
                    <p className="text-lg font-semibold text-gray-800 mt-1">{formattedArrTime}</p>
                </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
                <div>
                    <p className="text-xs text-gray-400">PNR</p>
                    <p className="font-mono font-medium text-gray-700">{booking.pnr}</p>
                </div>
                {/* Price Display Logic */}
                <div className="text-right">
                    <p className="text-xs text-gray-400">Total Amount</p>
                    <p className="font-bold text-gray-900">
                        {(() => {
                            // Try booking.amount first
                            let finalPrice = booking.amount;

                            // If not valid, try itinerary fare
                            if (!finalPrice && itinerary?.Fare) {
                                finalPrice = itinerary.Fare.PublishedFare || itinerary.Fare.OfferedFare;
                            }

                            // If still 0 or missing, show placeholder or 'Paid' if status confirmed?
                            // Actually, let's just show what we have formatting it.
                            if (finalPrice) {
                                return `₹${finalPrice.toLocaleString()}`;
                            }
                            return 'N/A';
                        })()}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
