import React from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';

export const metadata = {
    title: 'Flight Schedule | Paymm',
    description: 'Check flight schedules and availability for all major airlines.',
};

export default function SchedulePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar />
            </div>

            <main className="pt-32 pb-20 px-4 md:px-16 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
                        Flight Schedule
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Search real-time flight availability across 500+ airlines.
                    </p>
                </div>

                {/* Interactive-looking placeholder for schedule search */}
                <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-4xl mx-auto text-center">
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-3xl">
                            ✈️
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Check Availability</h2>
                        <p className="text-slate-500 max-w-md">
                            To view the most up-to-date flight schedules, use our main search engine which connects directly to airline global distribution systems.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-4">
                            <Link href="/" className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                Search Flights
                            </Link>
                            <Link href="/contact" className="bg-slate-100 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>

                {/* SEO Content Block */}
                <div className="mt-20 prose prose-slate mx-auto text-center">
                    <h3>Why check flight schedules on PayMM?</h3>
                    <p>
                        We provide real-time updates on flight status, delays, and cancellations. Ensure a smooth journey by checking your flight schedule before you leave for the airport.
                    </p>
                </div>
            </main>
        </div>
    );
}
