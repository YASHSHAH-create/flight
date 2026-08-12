import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Complete Your Booking | Paymm",
    description: "Complete your flight booking securely with Paymm.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function BookLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
