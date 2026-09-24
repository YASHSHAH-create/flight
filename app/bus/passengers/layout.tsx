import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Passenger Details & Payment',
    robots: { index: false, follow: false },
};

export default function BusPassengersLayout({ children }: { children: React.ReactNode }) {
    return children;
}
