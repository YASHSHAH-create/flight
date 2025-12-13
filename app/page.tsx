"use client";
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-slate-50 font-sans selection:bg-black selection:text-white">

      {/* Sticky Navbar (Common across all sections) */}
      <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/70 backdrop-blur-md shadow-sm md:shadow-none border-b md:border-none border-white/20 py-0' : 'bg-transparent py-2'}`}>
        <Navbar />
      </div>

      {/* Frame 1: Hero Section */}
      <section className="relative h-screen w-full flex flex-col overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/background.jpg"
            alt="Background"
            fill
            className="object-cover object-center animate-subtle-zoom"
            priority
          />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-[4vw] md:px-[6vw] max-w-7xl mx-auto w-full h-full gap-8 md:gap-12 pointer-events-none md:pointer-events-auto [@media(max-height:800px)]:gap-2 [@media(max-height:800px)]:justify-center">
          <div className="max-w-[90vw] md:max-w-3xl animate-subtle-up pointer-events-auto flex flex-col items-center text-center">

            <div className="mb-6 block [@media(max-height:800px)]:mb-4">
              <button className="group flex items-center gap-2 px-6 py-2 bg-white/70 backdrop-blur-md hover:bg-white text-slate-900 rounded-full font-semibold shadow-sm transition-all border border-white/40 hover:-translate-y-0.5 active:translate-y-0">
                <span>Explore Now</span>
                <span className="bg-black text-white rounded-full p-1 transition-transform group-hover:translate-x-1">
                  <MoveRight size={14} strokeWidth={3} />
                </span>
              </button>
            </div>

            <h1 className="text-[clamp(2.5rem,6vw,5.5rem)] [@media(max-height:800px)]:text-[clamp(2rem,5vw,4.5rem)] font-bold text-slate-900 leading-[1.1] tracking-tight drop-shadow-sm">
              <span className="relative inline-block">
                Flying to?
              </span>
            </h1>

          </div>

          <div className="w-full pointer-events-auto transform transition-transform origin-top [@media(max-height:800px)]:scale-90 [@media(max-height:800px)]:-mt-2">
            <SearchWidget />
          </div>
        </div>
      </section>

      {/* Frame 2: Content Section */}
      <section className="relative w-full bg-white flex flex-col justify-center py-20 px-0 md:px-0 overflow-hidden">
        <motion.div
          className="flex flex-col justify-evenly max-w-7xl mx-auto w-full gap-20"
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.1 }}
        >
          <FeaturedProducts />
          <Testimonials />

          <div className="py-[3vh] px-[4vw] text-center bg-slate-900 text-white mx-[4vw] md:mx-16 rounded-[clamp(1.5rem,3vw,2rem)] shadow-2xl">
            <h2 className="text-[clamp(1.25rem,2.5vw,2rem)] font-bold mb-[1vh]">Ready to paymm?</h2>
            <p className="mb-[2vh] text-slate-400 text-[clamp(0.875rem,1.2vw,1rem)]">Join millions of travelers today.</p>
            <button className="bg-white text-black px-[6vw] md:px-8 py-[1.5vh] md:py-3 rounded-full font-bold text-[clamp(0.875rem,1.2vw,1rem)] hover:bg-slate-200 transition-colors transform hover:scale-105 active:scale-95">Get Started</button>
          </div>
        </motion.div>
      </section>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

    </div>
  );
}

