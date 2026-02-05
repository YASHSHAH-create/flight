import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { MoveRight } from 'lucide-react';
import AnimatedSection from "./components/AnimatedSection";
import JsonLd from "./components/JsonLd";
import SEOHiddenContent from "./components/SEOHiddenContent";
import dynamic from 'next/dynamic';

const SearchWidget = dynamic(() => import('./components/search-widget'), {
  ssr: true,
  loading: () => <div className="h-[400px] w-full bg-white/50 animate-pulse rounded-[24px]" />
});
const FeaturedProducts = dynamic(() => import('./components/FeaturedProducts'));
const Testimonials = dynamic(() => import('./components/Testimonials'));
const PopularRoutes = dynamic(() => import('./components/PopularRoutes'));
const LatestBlogPosts = dynamic(() => import('./components/LatestBlogPosts'));
const FAQSection = dynamic(() => import('./components/FAQSection'));
const BottomNav = dynamic(() => import('./components/ClientBottomNav'));
const LottieAnimation = dynamic(() => import('./components/LottieAnimation'));


export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-slate-50 font-sans selection:bg-black selection:text-white">
      <JsonLd />

      {/* Sticky Navbar (Common across all sections) - Navbar handles its own scroll state */}
      <Navbar />

      {/* Frame 1: Hero Section */}
      <section className="relative min-h-[100svh] w-full flex flex-col overflow-x-hidden md:overflow-visible bg-gradient-to-b from-blue-50 via-slate-50 to-white">
        {/* Background Image - Fixed & Stable (Desktop Only) */}
        <div className="hidden md:block fixed inset-0 z-0 h-[120vh] w-full pointer-events-none">
          <Image
            src="/background.jpg"
            alt="Background"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={90}
          />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-start pt-32 md:justify-start md:pt-44 pb-32 items-center px-4 md:px-[6vw] max-w-7xl mx-auto w-full h-full gap-4 md:gap-8 pointer-events-none md:pointer-events-auto">
          <div className="max-w-[90vw] md:max-w-3xl animate-subtle-up pointer-events-auto flex flex-col items-center text-center">

            <div className="mb-4 block">
              <Link href="/packages">
                <button className="group flex items-center gap-2 px-6 py-2 bg-white/70 backdrop-blur-md hover:bg-white text-slate-900 rounded-full font-semibold shadow-sm transition-all border border-white/40 hover:-translate-y-0.5 active:translate-y-0">
                  <span>Explore Now</span>
                  <span className="bg-black text-white rounded-full p-1 transition-transform group-hover:translate-x-1">
                    <MoveRight size={14} strokeWidth={3} />
                  </span>
                </button>
              </Link>
            </div>

            <h1 className="text-[clamp(1.75rem,8vw,3.5rem)] leading-[1.1] tracking-tight drop-shadow-sm font-bold text-slate-900">
              <span className="relative inline-block">
                Book Cheap Flights & Air Tickets from India
              </span>
            </h1>

          </div>

          <div className="w-full pointer-events-auto">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* Frame 2: Content Section */}
      <section className="relative z-10 w-full bg-white flex flex-col justify-center py-20 px-0 md:px-0">
        <AnimatedSection>
          <FeaturedProducts />
          <PopularRoutes />
          <Testimonials />
          <LatestBlogPosts />
          <FAQSection />

          <div className="relative overflow-hidden py-[5vh] px-[6vw] bg-slate-900 text-white mx-[4vw] md:mx-16 rounded-[clamp(1.5rem,3vw,2rem)] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            <div className="relative z-10 flex-1 flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold mb-[1.5vh] leading-tight">Ready to start your journey?</h2>
              <p className="mb-[3vh] text-slate-400 text-[clamp(0.875rem,1.2vw,1.1rem)] max-w-md">Join millions of travelers booking cheap flights with Paymm.</p>
              <Link href="/search">
                <button className="bg-white text-black px-[8vw] md:px-10 py-[1.5vh] md:py-4 rounded-full font-bold text-[clamp(0.875rem,1.2vw,1rem)] hover:bg-slate-200 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-white/10">
                  Get Started
                </button>
              </Link>
            </div>

            <div className="relative z-10 w-full max-w-[250px] md:max-w-[350px]">
              <LottieAnimation
                url="https://lottie.host/5a07284b-0402-4545-9118-d67280780287/1B0q8X7J5j.json"
                className="w-full h-auto drop-shadow-2xl"
              />
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-purple-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
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
