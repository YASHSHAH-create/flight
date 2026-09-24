import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My Bus Bookings',
    robots: { index: false, follow: false },
};

export default function MyBusBookingsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
