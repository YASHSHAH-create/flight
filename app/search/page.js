import { Suspense } from 'react';
import SearchClient from './SearchClient';

export const metadata = {
    title: 'Flight Search Results | Nestia',
    description: 'Find the best flights for your journey.',
};

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchClient />
        </Suspense>
    );
}
