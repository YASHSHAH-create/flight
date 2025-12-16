import { Metadata } from "next";
import { AIRPORT_MAP } from "@/app/lib/airports";
import Navbar from "@/app/components/Navbar";
import dynamic from 'next/dynamic';
import Footer from "@/app/components/Footer";
import SEOContentBlock from "@/app/components/SEOContentBlock";

const SearchWidget = dynamic(() => import('@/app/components/SearchWidget'), { ssr: true });

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

            <SEOContentBlock origin={originName} destination={destName} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <Footer />
            </div>
        </div>
    );
}
