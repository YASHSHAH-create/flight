import { Metadata } from "next";
import { AIRPORT_MAP } from "@/app/lib/airports";
import Navbar from "@/app/components/Navbar";
import dynamic from 'next/dynamic';
import Footer from "@/app/components/Footer";
import SEOContentBlock from "@/app/components/SEOContentBlock";

const SearchWidget = dynamic(() => import('@/app/components/search-widget'), { ssr: true });

type Props = {
    params: Promise<{ slug: string }>;
};

const slugToCityMap: Record<string, string> = {};
const cityToCodeMap: Record<string, string> = {};

Object.entries(AIRPORT_MAP).forEach(([code, data]) => {
    const slug = data.city.toLowerCase().replace(/\s+/g, "-");
    slugToCityMap[slug] = data.city;
    cityToCodeMap[slug] = code;

    // Add common aliases for robust routing and to match popular routes links
    if (slug === "new-delhi") {
        cityToCodeMap["delhi"] = code;
    }
    if (slug === "bengaluru") {
        cityToCodeMap["bangalore"] = code;
    }
    if (slug === "cochin") {
        cityToCodeMap["kochi"] = code;
    }
    if (slug === "kochi") {
        cityToCodeMap["cochin"] = code;
    }
    if (slug === "thiruvananthapuram") {
        cityToCodeMap["trivandrum"] = code;
    }
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
        title: `Book Flights from ${originName} to ${destName} | Paymm`,
        description: `Book the cheapest flights from ${originName} to ${destName} on Paymm. Compare prices, check schedules, and get exclusive deals on air tickets.`,
        alternates: {
            canonical: `https://paymm.in/flights/${slug}`
        },
        openGraph: {
            title: `Book Flights from ${originName} to ${destName}`,
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

    // JSON-LD for Breadcrumb and FAQ
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
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
                    "name": `Flights from ${originName} to ${destName}`,
                    "item": `https://paymm.in/flights/${slug}`
                }]
            },
            {
                "@type": "FAQPage",
                "mainEntity": [{
                    "@type": "Question",
                    "name": `How long is the flight from ${originName} to ${destName}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": `The flight duration from ${originName} to ${destName} varies depending on the airline and whether it is a direct or connecting flight. Direct flights are usually faster.`
                    }
                }, {
                    "@type": "Question",
                    "name": `What is the cheapest month to fly to ${destName}?`,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Flight prices fluctuate. It is generally recommended to book in advance and avoid peak travel seasons for the best rates."
                    }
                }]
            }
        ]
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            <div className="relative pt-32 pb-20 px-4 w-full bg-slate-900 flex flex-col items-center">
                <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center gap-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-white text-center leading-tight">
                        Book Flights from {originName} to {destName}
                    </h1>
                    <div className="w-full">
                        <SearchWidget initialState={initialState} />
                    </div>
                </div>
            </div>

            {/* Visual Fare Guide and Route Details */}
            <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Flights from {originName} to {destName} Fare Guide</h2>
                        <p className="text-slate-500 text-sm">Typical pricing for this route over the coming months. Plan ahead to secure the lowest rates.</p>
                    </div>
                    
                    {/* Fare Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                                    <th className="pb-3">Month</th>
                                    <th className="pb-3">Average Fare</th>
                                    <th className="pb-3">Demand</th>
                                    <th className="pb-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4">June 2026</td>
                                    <td className="py-4">₹4,250</td>
                                    <td className="py-4 text-orange-500">High Demand</td>
                                    <td className="py-4"><span className="text-blue-600 hover:underline cursor-pointer">View Deals</span></td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4">July 2026</td>
                                    <td className="py-4 text-emerald-600">₹3,800</td>
                                    <td className="py-4 text-emerald-600">Low Demand</td>
                                    <td className="py-4"><span className="text-blue-600 hover:underline cursor-pointer">View Deals</span></td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4">August 2026</td>
                                    <td className="py-4 text-emerald-600">₹3,500</td>
                                    <td className="py-4 text-emerald-600">Low Demand</td>
                                    <td className="py-4"><span className="text-blue-600 hover:underline cursor-pointer">View Deals</span></td>
                                </tr>
                                <tr className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4">September 2026</td>
                                    <td className="py-4">₹4,100</td>
                                    <td className="py-4 text-slate-500">Medium Demand</td>
                                    <td className="py-4"><span className="text-blue-600 hover:underline cursor-pointer">View Deals</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Route Details Card */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                        <div className="bg-slate-50 p-4 rounded-2xl">
                            <span className="block text-xs text-slate-400 font-semibold uppercase">Flight Duration</span>
                            <span className="block text-lg font-bold text-slate-800 mt-1">~2h 15m</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                            <span className="block text-xs text-slate-400 font-semibold uppercase">Daily Flights</span>
                            <span className="block text-lg font-bold text-slate-800 mt-1">45+ Direct</span>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl col-span-2 md:col-span-1">
                            <span className="block text-xs text-slate-400 font-semibold uppercase">Major Airlines</span>
                            <span className="block text-sm font-bold text-slate-800 mt-1">IndiGo, Air India, Vistara</span>
                        </div>
                    </div>
                </div>

                {/* FAQ Column (Visual Accordion equivalent / inline reader) */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold text-slate-900">Route Q&A</h3>
                    <div className="space-y-4">
                        <div className="border-b border-slate-50 pb-4">
                            <h4 className="font-bold text-slate-800 mb-2">How long is the flight from {originName} to {destName}?</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                The flight duration from {originName} to {destName} is typically around 2 hours and 15 minutes for direct flights. Connecting flights may take longer depending on layover times.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-2">What is the cheapest month to fly to {destName}?</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                August is usually the cheapest month to fly from {originName} to {destName} due to low monsoon travel demand. Prices tend to rise during major holidays and peak seasons.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <SEOContentBlock origin={originName} destination={destName} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <Footer />
            </div>
        </div>
    );
}
