import { Metadata } from "next";
import { AIRPORT_MAP } from "@/app/lib/airports";
import Navbar from "@/app/components/Navbar";
import SearchWidget from "@/app/components/SearchWidget";
import Footer from "@/app/components/Footer";

type Props = {
    params: Promise<{ slug: string }>;
};

const slugToCityMap: Record<string, string> = {};
const cityToCodeMap: Record<string, string> = {};

Object.entries(AIRPORT_MAP).forEach(([code, data]) => {
    const slug = data.city.toLowerCase().replace(/\s+/g, "-");
    slugToCityMap[slug] = data.city;
    cityToCodeMap[slug] = code;
});

function parseSlug(slug: string) {
    const parts = slug.split("-to-");
    if (parts.length !== 2) return null;

    const originSlug = parts[0];
    const destSlug = parts[1];

    const originCode = cityToCodeMap[originSlug];
    const destCode = cityToCodeMap[destSlug];

    if (!originCode || !destCode) return null;

    return { originCode, destCode, originName: AIRPORT_MAP[originCode].city, destName: AIRPORT_MAP[destCode].city };
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { slug } = await params;
    const data = parseSlug(slug);

    if (!data) {
        return {
            title: "Flight Search | Paymm",
            description: "Book cheap flights on Paymm.",
        };
    }

    const { originName, destName } = data;

    return {
        title: `Cheap Flights from ${originName} to ${destName} | Paymm`,
        description: `Book the cheapest flights from ${originName} to ${destName} on Paymm. Compare prices, check schedules, and get exclusive deals on air tickets.`,
        alternates: {
            canonical: `https://paymm.in/flights/${slug}`
        },
        openGraph: {
            title: `Cheap Flights from ${originName} to ${destName}`,
            description: `Compare and book best flight tickets from ${originName} to ${destName}.`,
        }
    };
}

export default async function FlightRoutePage({ params }: Props) {
    const { slug } = await params;
    const data = parseSlug(slug);

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Navbar />
                <h1 className="text-2xl font-bold mt-20">Route not found</h1>
                <p className="mt-4">We could not find the flight route you are looking for.</p>
            </div>
        );
    }

    const { originCode, destCode, originName, destName } = data;

    const today = new Date();
    // Default to tomorrow for booking
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const d = tomorrow.getDate().toString().padStart(2, '0');
    const m = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const y = tomorrow.getFullYear();
    const dateParam = `${d}${m}${y}`;

    const initialState = {
        fromCode: originCode,
        toCode: destCode,
        date: dateParam,
        journeyType: '1'
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans">
            <Navbar />
            <div className="relative pt-32 pb-20 px-4 w-full bg-slate-900 flex flex-col items-center">
                <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center gap-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-white text-center leading-tight">
                        Flights from {originName} to {destName}
                    </h1>
                    <div className="w-full">
                        <SearchWidget initialState={initialState} />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8 text-slate-700">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">About the Route</h2>
                        <p className="leading-relaxed">
                            Looking for cheap flights from {originName} ({originCode}) to {destName} ({destCode})?
                            You are at the right place. Paymm offers the best deals on air tickets for this route.
                            Whether you are traveling for business or leisure, find the most convenient flight schedules and lowest fares here.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">FAQs for {originName} to {destName} Flights</h2>
                        <div className="space-y-4">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-lg mb-2">How to get the cheapest flight from {originName} to {destName}?</h3>
                                <p className="text-sm">To get the best price, it is recommended to book your tickets at least 2-3 weeks in advance. Weekday flights are often cheaper than weekend flights.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-lg mb-2">Which airlines fly from {originName} to {destName}?</h3>
                                <p className="text-sm">Major airlines like Indigo, Air India, Vistara, and others operate flights on this route. Use the search widget above to check availability.</p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                        <h3 className="font-bold text-xl mb-4 text-slate-900">Why Book with Paymm?</h3>
                        <ul className="space-y-3 text-sm text-slate-600">
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> No Hidden Charges
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Secure Payments
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> 24/7 Customer Support
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Best Price Guarantee
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="text-center pb-10 text-xs text-slate-400">
                <p>Prices are subject to change. Check real-time fares on the search result page.</p>
            </div>
        </div>
    );
}
