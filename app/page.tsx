"use client";
import { useState, useRef, useEffect } from "react";

import Image from "next/image";
import Navbar from "./components/Navbar";
import SearchWidget from "./components/SearchWidget";
import FeaturedProducts from "./components/FeaturedProducts";
import Testimonials from "./components/Testimonials";
import BottomNav from "./components/BottomNav";
import { MoveRight } from 'lucide-react';
import { motion } from "framer-motion";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setIsScrolled(scrollContainerRef.current.scrollTop > 10);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div ref={scrollContainerRef} className="relative h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-slate-50 font-sans selection:bg-black selection:text-white">

      {/* Sticky Navbar (Common across all sections) */}
      <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/70 backdrop-blur-md shadow-sm md:shadow-none border-b md:border-none border-white/20 py-0' : 'bg-transparent py-2'}`}>
        <Navbar />
      </div>

      {/* Frame 1: Hero Section */}
      <section className="relative h-screen w-full snap-start flex flex-col overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/unnamed (1).jpg"
            alt="Background"
            fill
            className="object-cover animate-subtle-zoom"
            priority
          />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-4 md:px-16 pt-20 max-w-7xl mx-auto w-full h-full justify-center gap-6 md:justify-evenly md:gap-0 pointer-events-none md:pointer-events-auto">
          <div className="max-w-3xl animate-subtle-right pointer-events-auto">
            <h1 className="text-3xl md:text-7xl font-medium text-slate-900 leading-tight tracking-tight drop-shadow-sm">
              Hey Buddy! where are you <br />
              <span className="font-extrabold relative inline-block">
                Flying
              </span> to?
            </h1>

            <div className="mt-8 hidden md:block">
              <button className="group flex items-center space-x-3 text-lg font-bold text-slate-900 hover:opacity-70 transition-opacity">
                <span>Explore Now</span>
                <span className="bg-black text-white rounded-full p-2 transition-transform group-hover:translate-x-2 shadow-lg">
                  <MoveRight size={18} strokeWidth={3} />
                </span>
              </button>
            </div>
          </div>

          <div className="w-full pointer-events-auto">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* Frame 2: Content Section (All in one view) */}
      <section className="relative min-h-screen md:h-screen w-full snap-start bg-white flex flex-col justify-center py-10 md:py-20 px-0 md:px-0 overflow-hidden">
        <motion.div
          className="h-auto md:h-full flex flex-col justify-evenly max-w-7xl mx-auto w-full pt-4 pb-10 md:pb-0"
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <FeaturedProducts />
          <Testimonials />

          <div className="py-6 px-8 text-center bg-slate-900 text-white mx-4 md:mx-16 rounded-3xl shadow-2xl">
            <h2 className="text-xl md:text-2xl font-bold mb-2">Ready to paymm?</h2>
            <p className="mb-4 text-slate-400 text-sm">Join millions of travelers today.</p>
            <button className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-slate-200 transition-colors transform hover:scale-105 active:scale-95">Get Started</button>
          </div>
        </motion.div>
      </section>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

    </div>
  );
}

