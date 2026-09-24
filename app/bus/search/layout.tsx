import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Search Bus Tickets',
    description: 'Compare live bus fares, seat availability and operators for your route and date on Paymm.',
    robots: { index: false, follow: true },
};

export default function BusSearchLayout({ children }: { children: React.ReactNode }) {
    return children;
}
