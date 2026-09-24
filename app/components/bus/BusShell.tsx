import React from 'react';
import Navbar from '../Navbar';

/** Page frame for the bus flow: fixed navbar + lavender canvas. */
const BusShell = ({ children, wide }: { children: React.ReactNode; wide?: boolean }) => (
    <div className="min-h-screen bg-lav font-sans">
        <Navbar />
        <main className={`${wide ? 'max-w-7xl' : 'max-w-5xl'} mx-auto px-4 md:px-6 pt-28 md:pt-32 pb-24`}>{children}</main>
    </div>
);

export default BusShell;
