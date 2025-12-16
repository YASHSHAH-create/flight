import { redirect } from "next/navigation";
import { Metadata } from "next";
import { AIRPORT_MAP } from "@/app/lib/airports";

type Props = {
    params: Promise<{ slug: string }>;
};

// Helper to reverse map slugs to codes
// Example slug: "flights-from-new-delhi-to-mumbai"
// We need to parse this.
// Strategy: "flights-from-{origin}-to-{destination}"
// normalize city names to slugs: "New Delhi" -> "new-delhi"

const slugToCityMap: Record<string, string> = {};
const cityToCodeMap: Record<string, string> = {};

Object.entries(AIRPORT_MAP).forEach(([code, data]) => {
    const slug = data.city.toLowerCase().replace(/\s+/g, "-");
    slugToCityMap[slug] = data.city;
    cityToCodeMap[slug] = code;
});

function parseSlug(slug: string) {
    // Expected format: "flights-from-city-a-to-city-b"
    // or simple: "city-a-to-city-b" (Cleaner)

    // Let's assume the user wants "flights-from-X-to-Y" for max SEO or "X-to-Y-flights"
    // The user prompt example: "/flights/bangalore-to-dubai" -> "bangalore-to-dubai"

    const parts = slug.split("-to-");
    if (parts.length !== 2) return null;

    const originSlug = parts[0]; // "bangalore"
    const destSlug = parts[1];   // "dubai"

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
        redirect("/search");
    }

    const { originCode, destCode } = data;

    // Calculate today's date for a valid search
    const today = new Date();
    const d = today.getDate().toString().padStart(2, '0');
    const m = (today.getMonth() + 1).toString().padStart(2, '0');
    const y = today.getFullYear();
    const dateParam = `${d}${m}${y}`;

    // Redirect to the actual search page
    redirect(`/search?from=${originCode}&to=${destCode}&date=${dateParam}&adults=1&children=0&infants=0&class=e&journeyType=1`);
}
