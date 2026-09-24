import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Your Bus Ticket',
    robots: { index: false, follow: false },
};

export default function BusBookingLayout({ children }: { children: React.ReactNode }) {
    return children;
}
