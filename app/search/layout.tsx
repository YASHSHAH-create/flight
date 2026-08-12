import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Search Flights | Paymm",
    description: "Search and compare live flight fares across airlines. Find the cheapest air tickets for your travel dates with Paymm.",
    alternates: {
        canonical: "https://paymm.in/search",
    },
    robots: {
        index: false,
        follow: true,
    },
};

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
