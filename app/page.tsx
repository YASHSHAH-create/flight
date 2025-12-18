import Image from "next/image";
import Navbar from "./components/Navbar";
import { MoveRight } from 'lucide-react';
import AnimatedSection from "./components/AnimatedSection";
import JsonLd from "./components/JsonLd";
import SEOHiddenContent from "./components/SEOHiddenContent";
import dynamic from 'next/dynamic';

const SearchWidget = dynamic(() => import('./components/SearchWidget'), {
  ssr: true,
  loading: () => <div className="h-[400px] w-full bg-white/50 animate-pulse rounded-[24px]" />
});
const FeaturedProducts = dynamic(() => import('./components/FeaturedProducts'));
const Testimonials = dynamic(() => import('./components/Testimonials'));
const BottomNav = dynamic(() => import('./components/ClientBottomNav'));


export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-slate-50 font-sans selection:bg-black selection:text-white">
      <JsonLd />

      {/* Sticky Navbar (Common across all sections) - Navbar handles its own scroll state */}
      <Navbar />

      {/* Frame 1: Hero Section */}
      <section className="relative min-h-screen w-full flex flex-col overflow-x-hidden md:overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/background.jpg"
            alt="Background"
            fill
            className="object-cover object-center animate-subtle-zoom"
            priority
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-start pt-24 pb-32 md:pb-0 md:justify-center items-center px-4 md:px-[6vw] max-w-7xl mx-auto w-full h-full gap-4 md:gap-12 pointer-events-none md:pointer-events-auto">
          <div className="max-w-[90vw] md:max-w-3xl animate-subtle-up pointer-events-auto flex flex-col items-center text-center">

            <div className="mb-4 block [@media(max-height:800px)]:mb-2">
              <button className="group flex items-center gap-2 px-6 py-2 bg-white/70 backdrop-blur-md hover:bg-white text-slate-900 rounded-full font-semibold shadow-sm transition-all border border-white/40 hover:-translate-y-0.5 active:translate-y-0">
                <span>Explore Now</span>
                <span className="bg-black text-white rounded-full p-1 transition-transform group-hover:translate-x-1">
                  <MoveRight size={14} strokeWidth={3} />
                </span>
              </button>
            </div>

            <h1 className="text-[clamp(1.75rem,8vw,3.5rem)] leading-[1.1] tracking-tight drop-shadow-sm font-bold text-slate-900">
              <span className="relative inline-block">
                Book Cheap Flights & Air Tickets from India
              </span>
            </h1>

          </div>

          <div className="w-full pointer-events-auto transform transition-transform origin-top [@media(max-height:800px)]:scale-90 [@media(max-height:800px)]:-mt-2">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* Frame 2: Content Section */}
      <section className="relative w-full bg-white flex flex-col justify-center py-20 px-0 md:px-0">
        <AnimatedSection>
          <FeaturedProducts />
          <Testimonials />

          <div className="py-[3vh] px-[4vw] text-center bg-slate-900 text-white mx-[4vw] md:mx-16 rounded-[clamp(1.5rem,3vw,2rem)] shadow-2xl">
            <h2 className="text-[clamp(1.25rem,2.5vw,2rem)] font-bold mb-[1vh]">Ready to paymm?</h2>
            <p className="mb-[2vh] text-slate-400 text-[clamp(0.875rem,1.2vw,1rem)]">Join millions of travelers today.</p>
            <button className="bg-white text-black px-[6vw] md:px-8 py-[1.5vh] md:py-3 rounded-full font-bold text-[clamp(0.875rem,1.2vw,1rem)] hover:bg-slate-200 transition-colors transform hover:scale-105 active:scale-95">Get Started</button>
          </div>
        </AnimatedSection>
      </section>

      {/* Spacer for Mobile Bottom Nav */}
      <div className="h-40 md:hidden"></div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
      <SEOHiddenContent />
    </div>
  );
}
