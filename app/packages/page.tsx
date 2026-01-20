import React from 'react';
import FeaturedProducts from '../components/FeaturedProducts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
    title: 'Holiday Packages | Paymm',
    description: 'Explore the best holiday packages and flight deals to top destinations.',
};

export default function PackagesPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar with fixed positioning compensation */}
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar />
            </div>

            <main className="pt-24 pb-20">
                <header className="px-4 md:px-16 py-12 text-center max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Curated Holiday <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Packages</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Discover our hand-picked selection of destinations with exclusive deals on flights and hotels.
                    </p>
                </header>

                {/* Reuse FeaturedProducts as a list of packages */}
                <FeaturedProducts />

                {/* Additional Content to satisfy "sufficient content" */}
                <section className="px-4 md:px-16 py-12 max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Custom Packages?</h2>
                            <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                                Looking for something specific? We specialize in creating custom travel itineraries tailored to your preferences and budget. From honeymoon specials to family adventures.
                            </p>
                            <a href="/contact" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-transform hover:scale-105">
                                Contact Our Experts
                            </a>
                        </div>
                        <div className="h-64 bg-slate-100 rounded-2xl flex items-center justify-center">
                            <span className="text-slate-400 font-medium">Custom Package Illustration</span>
                        </div>
                    </div>
                </section>
            </main>

            {/* Since footer is in layout, we might not need it here explicitly if layout wraps children, 
          but usually layout wraps everything. Let's check layout again. 
          Layout wraps children then Footer. So we don't need Footer here.
      */}
        </div>
    );
}
