import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
    title: "How to Book Cheap Flights - A Complete Guide | Paymm",
    description: "Learn the best tips and tricks on how to book cheap flights, including finding the cheapest days to fly and utilizing flight comparison tools effectively.",
    alternates: {
        canonical: "https://paymm.in/how-to-book-cheap-flights",
    }
};

export default function HowToBookCheapFlights() {
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to Book Cheap Flights Online",
        "description": "A step-by-step guide to finding and booking the cheapest flight tickets available.",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Be Flexible with Your Travel Dates",
                "text": "The price of flights varies significantly depending on the day of the week, time of year, and upcoming holidays. Flying on weekdays (especially Tuesdays and Wednesdays) is generally cheaper than weekends."
            },
            {
                "@type": "HowToStep",
                "name": "Use a Flight Comparison Tool",
                "text": "Use an aggregator like Paymm to compare prices across multiple airlines simultaneously instead of checking individual airline websites one by one."
            },
            {
                "@type": "HowToStep",
                "name": "Book in Advance (But Not Too Early)",
                "text": "For domestic flights, booking 1-3 months in advance usually yields the best prices. For international flights, aim for 2-8 months before your departure date."
            },
            {
                "@type": "HowToStep",
                "name": "Check Baggage Allowances",
                "text": "Budget airlines may seem cheaper initially, but they often charge extra for carry-on and checked baggage. Always compare the total price including your luggage needs."
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />
            
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-24 md:py-32">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
                />

                <article className="prose prose-slate lg:prose-lg max-w-none">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">
                        How to Book Cheap Flights: The Ultimate Guide
                    </h1>
                    
                    <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                        Finding cheap flight tickets doesn't have to be a stressful experience. With a little flexibility and the right tools, you can save a significant amount of money on your next trip. Here is our comprehensive guide to getting the best airfare deals.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">1. What is the cheapest day to fly?</h2>
                    <p className="text-slate-700 mb-6">
                        While there is no hard and fast rule, Tuesdays and Wednesdays are statistically the cheapest days to fly. Weekends (Friday through Sunday) are typically the most expensive due to high demand from both business and leisure travelers returning home. If you have flexible travel dates, always use a fare calendar to identify the cheapest days in a given month.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">2. How far in advance should I book my flight?</h2>
                    <p className="text-slate-700 mb-6">
                        The "sweet spot" for booking domestic flights is generally between 3 to 6 weeks before your departure. If you are flying internationally, it is highly recommended to book your tickets 2 to 6 months in advance. Booking last minute is almost always more expensive, except in rare cases where airlines are trying to fill empty seats a day before departure.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">3. Why should I use a flight aggregator?</h2>
                    <p className="text-slate-700 mb-6">
                        Flight aggregators like Paymm search hundreds of airlines and travel agencies simultaneously to show you all available options in one place. This saves you from having to visit individual airline websites, ensuring that you never miss out on a flash sale or a cheaper routing option via a budget carrier.
                    </p>

                    <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">4. Watch out for hidden baggage fees</h2>
                    <p className="text-slate-700 mb-6">
                        When comparing flight prices, the lowest fare isn't always the cheapest overall. Many low-cost carriers offer heavily discounted base fares but charge exorbitant fees for checked bags, seat selection, and even meals. Always calculate the total cost of your trip—including baggage—before making your final booking.
                    </p>

                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 mt-12">
                        <h3 className="text-xl font-bold text-blue-900 mb-3">Ready to find your next deal?</h3>
                        <p className="text-blue-800 mb-6">
                            Start searching on Paymm today and compare fares from top airlines to book your dream vacation for less.
                        </p>
                        <a href="/search" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
                            Search Flights Now
                        </a>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
