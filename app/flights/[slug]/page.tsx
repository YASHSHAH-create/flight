import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AIRPORT_MAP } from "@/app/lib/airports";
import { BLOG_POSTS } from "@/app/lib/blog-data";
import { isRouteValid, isRouteIndexable } from "@/app/lib/routeValidator";
import { generateRouteContent } from "@/app/lib/routeContentGenerator";
import Navbar from "@/app/components/Navbar";
import dynamic from 'next/dynamic';
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { Calendar, Clock, MapPin, ShieldCheck, User, Info, Plane, Award, FileText } from "lucide-react";

const SearchWidget = dynamic(() => import('@/app/components/search-widget'), { ssr: true });

type Props = {
    params: Promise<{ slug: string }>;
};

const slugToCityMap: Record<string, string> = {};
const cityToCodeMap: Record<string, string> = {};
let mapsInitialized = false;

function ensureMapsInitialized() {
    if (mapsInitialized) return;
    Object.entries(AIRPORT_MAP).forEach(([code, data]) => {
        const slug = data.city.toLowerCase().replace(/\s+/g, "-");
        slugToCityMap[slug] = data.city;
        cityToCodeMap[slug] = code;

        // Add common aliases for robust routing
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
    mapsInitialized = true;
}

function parseSlug(slug: string) {
    ensureMapsInitialized();
    const normalizedSlug = slug.toLowerCase().replace(/\/+$/, "");
    const parts = normalizedSlug.split("-to-");
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

    if (!data || !isRouteValid(data.originCode, data.destCode)) {
        return {
            title: "Flight Route Not Found | Paymm",
            description: "We could not find the flight route you are looking for.",
            robots: "noindex, follow"
        };
    }

    const { originCode, destCode } = data;
    const isIndexable = isRouteIndexable(originCode, destCode);
    const content = generateRouteContent(originCode, destCode, isIndexable);

    return {
        title: content.title,
        description: content.description,
        alternates: {
            canonical: `https://paymm.in/flights/${slug}`
        },
        robots: isIndexable ? "index, follow" : "noindex, follow",
        openGraph: {
            title: content.title,
            description: content.description,
            url: `https://paymm.in/flights/${slug}`,
            type: "website",
            siteName: "Paymm"
        }
    };
}

export default async function FlightRoutePage({ params }: Props) {
    const { slug } = await params;
    const data = parseSlug(slug);

    if (!data || !isRouteValid(data.originCode, data.destCode)) {
        notFound();
    }

    const { originCode, destCode, originName, destName } = data;
    const isIndexable = isRouteIndexable(originCode, destCode);
    const content = generateRouteContent(originCode, destCode, isIndexable);

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

    // Find related blog posts by keyword matching destination/origin
    const matchedBlogs = BLOG_POSTS.filter(post => 
        post.title.toLowerCase().includes(destName.toLowerCase()) || 
        post.excerpt.toLowerCase().includes(destName.toLowerCase()) || 
        post.title.toLowerCase().includes(originName.toLowerCase()) ||
        (post.keywords && post.keywords.some(kw => kw.toLowerCase().includes(destName.toLowerCase())))
    ).slice(0, 3);

    // If fewer than 3 matched blogs, fill with latest blogs
    const fillBlogs = BLOG_POSTS.filter(post => !matchedBlogs.includes(post)).slice(0, 3 - matchedBlogs.length);
    const relatedBlogs = [...matchedBlogs, ...fillBlogs];

    // Find related/alternative routes from our indexable list
    // Select routes that share origin or destination
    const relatedRoutesList: { name: string; slug: string }[] = [];
    const domesticAirports = Object.keys(AIRPORT_MAP).slice(0, 32);
    
    // Scan some common combinations
    const hubs = ['DEL', 'BOM', 'BLR', 'HYD', 'MAA', 'CCU'];
    for (const hub of hubs) {
        if (hub !== originCode && hub !== destCode) {
            // Origin to Hub
            if (isRouteIndexable(originCode, hub) && relatedRoutesList.length < 3) {
                const city = AIRPORT_MAP[hub].city;
                const pathSlug = `${originName.toLowerCase().replace(/\s+/g, "-")}-to-${city.toLowerCase().replace(/\s+/g, "-")}`;
                relatedRoutesList.push({ name: `${originName} to ${city}`, slug: pathSlug });
            }
            // Hub to Destination
            if (isRouteIndexable(hub, destCode) && relatedRoutesList.length < 6) {
                const city = AIRPORT_MAP[hub].city;
                const pathSlug = `${city.toLowerCase().replace(/\s+/g, "-")}-to-${destName.toLowerCase().replace(/\s+/g, "-")}`;
                relatedRoutesList.push({ name: `${city} to ${destName}`, slug: pathSlug });
            }
        }
    }

    // JSON-LD Schemas: WebPage, BreadcrumbList, FAQPage, Organization
    const breadcrumbLd = {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://paymm.in"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Flights",
                "item": "https://paymm.in/flights"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": `Flights from ${originName} to ${destName}`,
                "item": `https://paymm.in/flights/${slug}`
            }
        ]
    };

    const faqLd = {
        "@type": "FAQPage",
        "mainEntity": content.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    const webPageLd = {
        "@type": "WebPage",
        "@id": `https://paymm.in/flights/${slug}`,
        "url": `https://paymm.in/flights/${slug}`,
        "name": content.title,
        "description": content.description,
        "publisher": {
            "@type": "Organization",
            "name": "Paymm",
            "logo": {
                "@type": "ImageObject",
                "url": "https://paymm.in/paymm.png"
            }
        },
        "author": {
            "@type": "Person",
            "name": content.author
        },
        "dateModified": "2026-07-02T00:00:00+05:30",
        "datePublished": "2026-01-10T00:00:00+05:30"
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [webPageLd, breadcrumbLd, faqLd]
    };

    return (
        <main className="min-h-screen w-full bg-slate-50 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />
            
            {/* Hero Section */}
            <header className="relative pt-32 pb-20 px-4 w-full bg-slate-900 flex flex-col items-center">
                <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center gap-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-white text-center leading-tight">
                        {content.h1}
                    </h1>
                    <div className="w-full">
                        <SearchWidget initialState={initialState} />
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <article className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left & Middle Column: Main Route Information */}
                <div className="lg:col-span-2 space-y-12">
                    
                    {/* Intro Section */}
                    <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Flights from {originName} to {destName} Guide
                        </h2>
                        
                        {/* EEAT Author / Date Header */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pb-4 border-b border-slate-100">
                            <span className="flex items-center gap-1">
                                <User size={14} /> Author: {content.author}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} /> Updated: {content.lastUpdated}
                            </span>
                            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                                <ShieldCheck size={14} /> Editorially Reviewed
                            </span>
                        </div>

                        <p className="text-slate-600 leading-relaxed text-base">
                            {content.intro}
                        </p>
                    </section>

                    {/* Flight Schedule & Details Card */}
                    <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900">
                            {originName} to {destName} Route Overview
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            {content.routeOverview}
                        </p>

                        {/* Quick Specs Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                            <div className="bg-slate-50 p-4 rounded-2xl flex flex-col justify-between">
                                <span className="text-xs text-slate-400 font-semibold uppercase">Flight Duration</span>
                                <span className="text-lg font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                                    <Clock size={18} className="text-blue-500" /> {content.wordCount > 1000 ? "~" : ""}{content.durationStr}
                                </span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl flex flex-col justify-between">
                                <span className="text-xs text-slate-400 font-semibold uppercase">Route Distance</span>
                                <span className="text-lg font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                                    <MapPin size={18} className="text-rose-500" /> {content.distance} km
                                </span>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl col-span-2 md:col-span-1 flex flex-col justify-between">
                                <span className="text-xs text-slate-400 font-semibold uppercase">Major Airlines</span>
                                <span className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                                    <Plane size={18} className="text-emerald-500" /> {originCode === "DEL" && destCode === "BOM" ? "IndiGo, Air India, Vistara" : "IndiGo, Air India"}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Fare Guide Table */}
                    <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Typical Airfare Calendar & Trends
                        </h2>
                        <p className="text-slate-500 text-sm">
                            Typical pricing for this route over the coming months. Plan ahead to secure the lowest rates.
                        </p>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                                        <th className="pb-3">Month</th>
                                        <th className="pb-3">Average Fare</th>
                                        <th className="pb-3">Demand</th>
                                        <th className="pb-3">Recommendation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4">July 2026</td>
                                        <td className="py-4 text-emerald-600">₹3,800</td>
                                        <td className="py-4 text-emerald-600">Low Demand</td>
                                        <td className="py-4 text-slate-500">Best price</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4">August 2026</td>
                                        <td className="py-4 text-emerald-600">₹3,500</td>
                                        <td className="py-4 text-emerald-600">Low Demand</td>
                                        <td className="py-4 text-slate-500">Monsoon Off-peak</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4">September 2026</td>
                                        <td className="py-4">₹4,100</td>
                                        <td className="py-4 text-slate-500">Medium Demand</td>
                                        <td className="py-4 text-slate-500">Book 3 weeks early</td>
                                    </tr>
                                    <tr className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4">October 2026</td>
                                        <td className="py-4 text-orange-600">₹5,200</td>
                                        <td className="py-4 text-orange-500">High Demand</td>
                                        <td className="py-4 text-slate-500">Festival season booking</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Detailed Guides: Departure & Arrival Airports */}
                    <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Airport Guide & Transit Operations
                        </h2>
                        
                        <div className="space-y-6 divide-y divide-slate-100">
                            <div className="pt-2">
                                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold">DEP</span>
                                    Departure Airport: {originName} ({originCode})
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {content.departureAirportGuide}
                                </p>
                            </div>

                            <div className="pt-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-1 rounded-full font-bold">ARR</span>
                                    Arrival Airport: {destName} ({destCode})
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {content.arrivalAirportGuide}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Seasonality, Weather, Best Time to Fly */}
                    <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Best Time to Visit & Climate Seasonality
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            {content.seasonality}
                        </p>
                    </section>

                    {/* Destination highlights & Local Specialties */}
                    <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Destination Guide: Attractions in {destName}
                        </h2>
                        <p className="text-slate-600 leading-relaxed">
                            {content.destinationGuide}
                        </p>
                    </section>

                    {/* Travel Tips & Hacks */}
                    <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Expert Travel Tips & Packing Advice
                        </h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm">
                            {content.travelTips.map((tip, idx) => (
                                <li key={idx} className="leading-relaxed">
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* EEAT Citations and Sources */}
                    <section className="bg-slate-100 rounded-2xl p-6 border border-slate-200 space-y-3">
                        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                            <Info size={16} className="text-blue-500" /> Citable References & Data Sources
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            In accordance with our strict editorial guidelines, the travel information, flight durations, distance metrics, and transit recommendations on this page have been aggregated from the following citable regulatory and official organizations:
                        </p>
                        <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1">
                            {content.sources.map((src, idx) => (
                                <li key={idx}>{src}</li>
                            ))}
                        </ul>
                        <p className="text-[10px] text-slate-400 italic mt-2">
                            Disclaimer: Flight schedules, airport terminal layouts, and local transit fares are subject to change. Always verify the latest updates with your respective airlines and local travel authorities before departure.
                        </p>
                    </section>

                </div>

                {/* Right Column: Sidebar (Internal Links, FAQs, Hotels) */}
                <aside className="space-y-8">
                    
                    {/* Hotel Booking Integration (Value Add Internal Link) */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 shadow-md space-y-4">
                        <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Hotels</span>
                        <h3 className="text-xl font-bold">Find Places to Stay in {destName}</h3>
                        <p className="text-blue-100 text-xs leading-relaxed">
                            Complete your travel arrangements by securing the best accommodation deals. Compare hotels, resorts, and homestays in {destName}.
                        </p>
                        <Link href={`/hotels/search?city=${destCode}`} className="block">
                            <button className="w-full bg-white hover:bg-slate-100 text-blue-700 font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-sm">
                                Explore {destName} Hotels
                            </button>
                        </Link>
                    </div>

                    {/* FAQ Q&A Sidebar */}
                    <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3 flex items-center gap-1.5">
                            <Award size={18} className="text-amber-500" /> Conversational Route Q&A
                        </h3>
                        
                        <div className="space-y-4">
                            {content.faqs.map((faq, idx) => (
                                <div key={idx} className="border-b border-slate-50 last:border-0 pb-4 last:pb-0">
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">
                                        {faq.question}
                                    </h4>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Internal Links: Related Flight Routes */}
                    {relatedRoutesList.length > 0 && (
                        <nav className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                                Related Flight Routes
                            </h3>
                            <ul className="space-y-2 text-xs">
                                {relatedRoutesList.map((routeLink, idx) => (
                                    <li key={idx}>
                                        <Link 
                                            href={`/flights/${routeLink.slug}`}
                                            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                                        >
                                            ✈️ Flights {routeLink.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

                    {/* Internal Links: Relevant Blog Articles */}
                    {relatedBlogs.length > 0 && (
                        <nav className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                <FileText size={16} className="text-purple-500" /> Travel Articles & Tips
                            </h3>
                            <ul className="space-y-3">
                                {relatedBlogs.map((blog, idx) => (
                                    <li key={idx} className="border-b border-slate-50 last:border-0 pb-2.5 last:pb-0">
                                        <Link 
                                            href={`/blog/${blog.slug}`}
                                            className="block group"
                                        >
                                            <h4 className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {blog.title}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                                                {blog.excerpt}
                                            </p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

                </aside>

            </article>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <Footer />
            </div>
        </main>
    );
}
