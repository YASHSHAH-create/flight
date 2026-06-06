import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { MoveRight } from 'lucide-react';
import AnimatedSection from "./components/AnimatedSection";
import JsonLd from "./components/JsonLd";
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


export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-slate-50 font-sans selection:bg-black selection:text-white">
      <JsonLd />

      {/* Sticky Navbar (Common across all sections) - Navbar handles its own scroll state */}
      <Navbar />

      {/* Frame 1: Hero Section */}
      <section className="relative w-full flex flex-col overflow-x-hidden md:overflow-visible bg-gradient-to-b from-blue-50/40 via-slate-50 to-white">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float-slow {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-20px, 15px) scale(1.08); }
          }
          @keyframes float-reverse {
            0%, 100% { transform: translate(0, 0) scale(1.05); }
            50% { transform: translate(20px, -15px) scale(0.92); }
          }
        `}} />

        {/* Subtle design grid texture (dots) */}
        <div 
          className="absolute inset-0 opacity-60 pointer-events-none z-0" 
          style={{ 
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
        
        {/* Soft visual glow */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-100/40 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Animated Background decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none z-0"
             style={{ animation: 'float-slow 12s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/15 rounded-full blur-3xl pointer-events-none z-0"
             style={{ animation: 'float-reverse 15s ease-in-out infinite' }} />

        <div className="relative z-10 flex-1 flex flex-col justify-start pt-32 md:pt-40 pb-24 items-center px-4 md:px-[6vw] max-w-7xl mx-auto w-full h-full gap-4 md:gap-8 pointer-events-none md:pointer-events-auto">
          <div className="max-w-[90vw] md:max-w-3xl pointer-events-auto flex flex-col items-center text-center">

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

          <div className="relative overflow-hidden py-16 px-8 bg-slate-900 text-white mx-[4vw] md:mx-16 rounded-[2rem] shadow-xl flex flex-col items-center text-center w-full max-w-7xl">
            <div className="relative z-10 max-w-2xl flex flex-col items-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">Ready to start your journey?</h2>
              <p className="mb-8 text-slate-400 max-w-md">Join millions of travelers booking cheap flights with Paymm.</p>
              <Link href="/search">
                <button className="bg-white text-black px-10 py-4 rounded-full font-bold text-sm hover:bg-slate-200 transition-all shadow-lg active:scale-95">
                  Get Started
                </button>
              </Link>
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
      
      {/* Visible SEO Content Section for AdSense Compliance */}
      <section className="w-full bg-slate-50 py-16 px-4 md:px-[6vw] border-t border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8 text-slate-600">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Book Cheap Flights & Air Tickets Online with Paymm</h2>
            <p className="leading-relaxed text-sm md:text-base">
              Welcome to Paymm, your ultimate travel companion for booking the most affordable flights across India and the globe. 
              We understand that finding the right flight at the best price can be a daunting task. That's why we have built a platform 
              that seamlessly aggregates fares from all major airlines, ensuring you get the most competitive rates available. 
              Whether you are planning a quick business trip, a family vacation, or a spontaneous weekend getaway, Paymm provides a 
              hassle-free booking experience with transparent pricing and no hidden fees.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Why Choose Paymm for Your Flight Bookings?</h3>
            <p className="leading-relaxed text-sm md:text-base mb-4">
              With thousands of travel portals out there, what makes Paymm stand out? It's our unwavering commitment to customer satisfaction 
              and value. We offer exclusive discounts, instant booking confirmations, and a highly intuitive search interface. 
              Our advanced algorithms compare prices across domestic carriers like Indigo, Air India, Vistara, SpiceJet, and Akasa Air, 
              as well as leading international airlines. By choosing Paymm, you ensure that you are always getting the best deal on your air travel.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
              <li><strong>Real-Time Fare Comparison:</strong> We check hundreds of routes instantly to find you the lowest fares.</li>
              <li><strong>Secure Payments:</strong> Your transactions are protected with industry-leading encryption and security protocols.</li>
              <li><strong>24/7 Customer Support:</strong> Our dedicated team is always ready to assist you with modifications, cancellations, and queries.</li>
              <li><strong>Exclusive Offers:</strong> Enjoy seasonal sales, festive discounts, and special bank offers only available on Paymm.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Popular Domestic & International Flight Routes</h3>
            <p className="leading-relaxed text-sm md:text-base">
              Explore India and the world with ease. Some of our most popular domestic routes include flights from New Delhi to Mumbai, 
              Bangalore to Hyderabad, Chennai to Kolkata, and Pune to Delhi. If you are looking to travel abroad, check out our amazing 
              deals on flights to Dubai, London, New York, Singapore, and Bangkok. No matter your destination, Paymm ensures your 
              journey begins on a high note. We are constantly updating our network to provide you with more options, better connectivity, 
              and greater flexibility. Start searching today and discover how easy travel booking can be!
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
