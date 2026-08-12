import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Bookings | Paymm",
    description: "View and manage your flight bookings with Paymm.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function BookingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
