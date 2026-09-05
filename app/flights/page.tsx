import type { Metadata } from "next";
import Link from "next/link";
import { AIRPORT_MAP } from "@/app/lib/airports";
import { isRouteIndexable, TIER_1_HUBS } from "@/app/lib/routeValidator";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Plane } from "lucide-react";

export const metadata: Metadata = {
    title: "All Flight Routes in India & International",
    description:
        "Browse all popular flight routes from India. Compare fares on domestic routes like Delhi to Mumbai and international routes like Delhi to Dubai. Book cheap air tickets with Paymm.",
    alternates: {
        canonical: "https://www.paymm.in/flights",
    },
    openGraph: {
        title: "All Flight Routes | Paymm",
        description:
            "Browse all popular domestic and international flight routes. Compare airline fares and book cheap tickets.",
        url: "https://www.paymm.in/flights",
        type: "website",
        siteName: "Paymm",
    },
};

const citySlug = (city: string) => city.toLowerCase().replace(/\s+/g, "-");

export default function FlightsHubPage() {
    const airportKeys = Object.keys(AIRPORT_MAP);
    const domesticAirports = airportKeys.slice(0, 32);
    const internationalAirports = airportKeys.slice(32);

    // Group indexable routes by origin city
    const routeGroups: { origin: string; routes: { name: string; slug: string }[] }[] = [];

    domesticAirports.forEach((from) => {
        const routes: { name: string; slug: string }[] = [];
        const fromCity = AIRPORT_MAP[from].city;

        domesticAirports.forEach((to) => {
            if (from !== to && isRouteIndexable(from, to)) {
                const toCity = AIRPORT_MAP[to].city;
                routes.push({
                    name: `${fromCity} to ${toCity}`,
                    slug: `${citySlug(fromCity)}-to-${citySlug(toCity)}`,
                });
            }
        });
        internationalAirports.forEach((to) => {
            if (isRouteIndexable(from, to)) {
                const toCity = AIRPORT_MAP[to].city;
                routes.push({
                    name: `${fromCity} to ${toCity}`,
                    slug: `${citySlug(fromCity)}-to-${citySlug(toCity)}`,
                });
            }
        });

        if (routes.length > 0) {
            routeGroups.push({ origin: fromCity, routes });
        }
    });

    // International origins into India
    const intlGroups: { origin: string; routes: { name: string; slug: string }[] }[] = [];
    internationalAirports.forEach((from) => {
        const routes: { name: string; slug: string }[] = [];
        const fromCity = AIRPORT_MAP[from].city;
        domesticAirports.forEach((to) => {
            if (isRouteIndexable(from, to)) {
                const toCity = AIRPORT_MAP[to].city;
                routes.push({
                    name: `${fromCity} to ${toCity}`,
                    slug: `${citySlug(fromCity)}-to-${citySlug(toCity)}`,
                });
            }
        });
        if (routes.length > 0) {
            intlGroups.push({ origin: fromCity, routes });
        }
    });

    const totalRoutes =
        routeGroups.reduce((n, g) => n + g.routes.length, 0) +
        intlGroups.reduce((n, g) => n + g.routes.length, 0);

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": "https://www.paymm.in/flights",
                url: "https://www.paymm.in/flights",
                name: "All Flight Routes in India & International | Paymm",
                description:
                    "Directory of all popular domestic and international flight routes bookable on Paymm.",
                publisher: {
                    "@type": "Organization",
                    name: "Paymm",
                    logo: {
                        "@type": "ImageObject",
                        url: "https://www.paymm.in/paymm.png",
                    },
                },
            },
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: "https://www.paymm.in",
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Flights",
                        item: "https://www.paymm.in/flights",
                    },
                ],
            },
        ],
    };

    return (
        <main className="min-h-screen w-full bg-slate-50 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <header className="pt-32 pb-14 px-4 bg-slate-900">
                <div className="max-w-7xl mx-auto text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                        Popular Flight Routes from India
                    </h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Explore {totalRoutes}+ popular domestic and international flight
                        routes. Compare fares across airlines, check flight duration and
                        schedules, and book cheap air tickets on every route.
                    </p>
                </div>
            </header>

            <section className="max-w-7xl mx-auto px-4 py-12 space-y-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Plane size={22} className="text-blue-600" /> Domestic &amp;
                        Outbound Routes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {routeGroups.map((group) => (
                            <nav
                                key={group.origin}
                                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                            >
                                <h3 className="font-bold text-slate-900 text-sm mb-3 pb-2 border-b border-slate-50">
                                    Flights from {group.origin}
                                    {TIER_1_HUBS.has(
                                        Object.keys(AIRPORT_MAP).find(
                                            (k) => AIRPORT_MAP[k].city === group.origin
                                        ) || ""
                                    ) && (
                                        <span className="ml-2 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold uppercase">
                                            Hub
                                        </span>
                                    )}
                                </h3>
                                <ul className="space-y-1.5">
                                    {group.routes.map((r) => (
                                        <li key={r.slug}>
                                            <Link
                                                href={`/flights/${r.slug}`}
                                                className="text-xs text-slate-600 hover:text-blue-700 hover:underline"
                                            >
                                                {r.name} flights
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}
                    </div>
                </div>

                {intlGroups.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Plane size={22} className="text-emerald-600" /> International
                            Routes to India
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {intlGroups.map((group) => (
                                <nav
                                    key={group.origin}
                                    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                                >
                                    <h3 className="font-bold text-slate-900 text-sm mb-3 pb-2 border-b border-slate-50">
                                        Flights from {group.origin}
                                    </h3>
                                    <ul className="space-y-1.5">
                                        {group.routes.map((r) => (
                                            <li key={r.slug}>
                                                <Link
                                                    href={`/flights/${r.slug}`}
                                                    className="text-xs text-slate-600 hover:text-blue-700 hover:underline"
                                                >
                                                    {r.name} flights
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            ))}
                        </div>
                    </div>
                )}

                <section className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">
                        How to Book Cheap Flights on Any Route
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-sm">
                        Every route page above includes live fare comparison across major
                        airlines like IndiGo, Air India, Air India Express, Akasa Air and SpiceJet,
                        along with flight duration, distance, airport guides, best time to
                        book, and month-by-month fare trends. For maximum savings, book
                        domestic flights around 3 weeks in advance and international
                        flights 6-8 weeks in advance. Read our full guide on{" "}
                        <Link
                            href="/how-to-book-cheap-flights"
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            how to book cheap flights
                        </Link>{" "}
                        or explore our <Link href="/blog" className="text-blue-600 hover:underline font-semibold">travel blog</Link> for destination guides.
                    </p>
                </section>
            </section>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <Footer />
            </div>
        </main>
    );
}
