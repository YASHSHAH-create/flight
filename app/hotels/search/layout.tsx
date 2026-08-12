import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Search Hotels | Paymm",
    description: "Search and compare hotel prices across India. Find the best hotel deals for your stay with Paymm.",
    alternates: {
        canonical: "https://paymm.in/hotels/search",
    },
    robots: {
        index: false,
        follow: true,
    },
};

export default function HotelSearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
