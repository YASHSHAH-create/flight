import { searchFlights } from '../../../utils/api';
import SchemaMarkup from '../../../components/SchemaMarkup';
import Link from 'next/link';

// Helper to parse route string "blr-to-del" -> { from: "BLR", to: "DEL" }
const parseRoute = (route) => {
    const parts = route.split('-to-');
    if (parts.length !== 2) return null;
    return {
        from: parts[0].toUpperCase(),
        to: parts[1].toUpperCase()
    };
};

export async function generateMetadata({ params }) {
    const { route } = await params;
    const parsed = parseRoute(route);

    if (!parsed) {
        return {
            title: 'Flight Not Found',
            description: 'The requested flight route could not be found.'
        };
    }

    const { from, to } = parsed;
    return {
        title: `${from} to ${to} Flights`, // Simple title as requested
        description: `Book cheap flights from ${from} to ${to}. Real-time prices and availability on Paymm.in.`,
        keywords: [`flights from ${from} to ${to}`, `cheap flights ${from} to ${to}`, `${from} to ${to} flight price`],
        openGraph: {
            title: `${from} to ${to} Flights`,
            description: `Find the best flight deals from ${from} to ${to}.`,
            type: 'website',
        }
    };
}

export default async function FlightRoutePage({ params, searchParams }) {
    const { route } = await params;
    const query = await searchParams; // Access query parameters (date, adults, etc.)
    const parsed = parseRoute(route);

    if (!parsed) {
        return (
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold text-red-500">Invalid Route</h1>
                <p>Please check the URL and try again. Format should be /flights/origin-to-destination</p>
                <Link href="/" className="text-blue-500 hover:underline">Go Home</Link>
            </div>
        );
    }

    const { from, to } = parsed;

    // Use date from query params or default to tomorrow
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const defaultDate = today.toISOString().split('T')[0];
    const searchDate = query.date || defaultDate;
    const adults = query.adults || 1;

    // Fetch flight data
    let flights = [];
    let error = null;
    try {
        const result = await searchFlights({
            from,
            to,
            date: searchDate,
            adults: adults,
            cabinClass: 1,
            journeyType: 1
        });
        flights = result?.Response?.Results?.[0] || result || [];
        if (!Array.isArray(flights)) flights = [];
    } catch (err) {
        console.error("Failed to fetch flights", err);
        error = "Could not load real-time flight data.";
    }

    // Schema Markup
    const flightSchema = {
        "@context": "https://schema.org",
        "@type": "Flight",
        "departureAirport": { "@type": "Airport", "iataCode": from },
        "arrivalAirport": { "@type": "Airport", "iataCode": to },
        "offers": {
            "@type": "AggregateOffer",
            "lowPrice": flights.length > 0 ? Math.min(...flights.map(f => f.Fare?.PublishedFare || 0)) : "Check Price",
            "priceCurrency": "INR"
        }
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://paymm.in"
        }, {
            "@type": "ListItem",
            "position": 2,
            "name": "Flights",
            "item": "https://paymm.in/flights"
        }, {
            "@type": "ListItem",
            "position": 3,
            "name": `${from} to ${to}`,
            "item": `https://paymm.in/flights/${route}`
        }]
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <SchemaMarkup schema={flightSchema} />
            <SchemaMarkup schema={breadcrumbSchema} />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-10 shadow-lg">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                {from} <i className="fas fa-arrow-right text-sm opacity-70"></i> {to}
                            </h1>
                            <p className="text-blue-100 text-sm mt-1">
                                {new Date(searchDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {adults} Traveler(s)
                            </p>
                        </div>
                        <Link href="/" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm transition backdrop-blur-sm">
                            <i className="fas fa-search mr-2"></i> Modify Search
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6 max-w-5xl">

                {/* Flight Results */}
                <div className="space-y-4">
                    {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">{error}</div>}

                    {flights.length === 0 && !error ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="text-gray-300 mb-4 text-5xl"><i className="fas fa-plane-slash"></i></div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No flights found</h3>
                            <p className="text-gray-500 mb-6">We couldn't find any flights for this date. Try changing your search.</p>
                            <Link href="/" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg">
                                Search Again
                            </Link>
                        </div>
                    ) : (
                        flights.map((flight, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100 overflow-hidden group">
                                <div className="p-5 flex flex-col md:flex-row justify-between items-center gap-6">

                                    {/* Airline Info */}
                                    <div className="flex items-center gap-4 w-full md:w-1/4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 text-xl">
                                            <i className="fas fa-plane"></i>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{flight.AirlineCode || 'Airline'}</div>
                                            <div className="text-xs text-gray-500">{flight.AirlineCode} {flight.FlightNumber}</div>
                                        </div>
                                    </div>

                                    {/* Flight Times */}
                                    <div className="flex items-center justify-center gap-6 flex-1 w-full md:w-auto">
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-gray-800">{new Date(flight.Origin?.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div className="text-xs text-gray-500 font-medium">{from}</div>
                                        </div>
                                        <div className="flex flex-col items-center w-24">
                                            <div className="text-xs text-gray-400 mb-1">{Math.floor(flight.Duration / 60)}h {flight.Duration % 60}m</div>
                                            <div className="w-full h-[2px] bg-gray-200 relative">
                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-300 text-xs">
                                                    <i className="fas fa-plane"></i>
                                                </div>
                                            </div>
                                            <div className="text-xs text-green-600 mt-1 font-medium">{flight.Stop === 0 ? 'Non-stop' : `${flight.Stop} Stop`}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-gray-800">{new Date(flight.Destination?.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div className="text-xs text-gray-500 font-medium">{to}</div>
                                        </div>
                                    </div>

                                    {/* Price & Action */}
                                    <div className="flex flex-col items-end gap-2 w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 mt-4 md:mt-0">
                                        <div className="text-2xl font-bold text-gray-900">₹{flight.Fare?.PublishedFare?.toLocaleString('en-IN')}</div>
                                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-sm hover:shadow-md w-full md:w-auto">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* SEO Content Section */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-bold mb-4">Why Book {from} to {to} with Paymm?</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li><i className="fas fa-check text-green-500 mr-2"></i>Lowest Price Guarantee</li>
                            <li><i className="fas fa-check text-green-500 mr-2"></i>24/7 Customer Support</li>
                            <li><i className="fas fa-check text-green-500 mr-2"></i>Instant Refunds</li>
                            <li><i className="fas fa-check text-green-500 mr-2"></i>Exclusive Bank Offers</li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-bold mb-4">Flight Information</h3>
                        <div className="space-y-2 text-gray-600">
                            <div className="flex justify-between">
                                <span>Average Flight Time:</span>
                                <span className="font-medium">2h 15m</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Distance:</span>
                                <span className="font-medium">1500 km</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Cheapest Month:</span>
                                <span className="font-medium">September</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQs */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                <span>What is the cheapest price for {from} to {to} flight?</span>
                                <span className="transition group-open:rotate-180">
                                    <i className="fas fa-chevron-down"></i>
                                </span>
                            </summary>
                            <div className="text-gray-600 mt-3 group-open:animate-fadeIn">
                                The cheapest flight price from {from} to {to} starts from ₹3000. Prices may vary based on booking time and availability.
                            </div>
                        </details>
                        <div className="border-t border-gray-100"></div>
                        <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                <span>Which airlines fly from {from} to {to}?</span>
                                <span className="transition group-open:rotate-180">
                                    <i className="fas fa-chevron-down"></i>
                                </span>
                            </summary>
                            <div className="text-gray-600 mt-3 group-open:animate-fadeIn">
                                Major airlines like Indigo, Air India, Vistara, and Akasa Air operate daily flights on this route.
                            </div>
                        </details>
                    </div>
                </div>

            </div>
        </div>
    );
}
