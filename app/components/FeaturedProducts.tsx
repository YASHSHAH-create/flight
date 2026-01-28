"use client";

import { Heart, Tag, Plane, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const products = [
    {
        id: 1,
        title: "New York",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2671&auto=format&fit=crop",
        price: "Check Price",
        rating: "4.9",
        code: "JFK"
    },
    {
        id: 2,
        title: "Paris",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673&auto=format&fit=crop",
        price: "Check Price",
        rating: "5.0",
        code: "CDG"
    },
    {
        id: 3,
        title: "Cape Town",
        image: "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?q=80&w=2671&auto=format&fit=crop",
        price: "Check Price",
        rating: "4.8",
        code: "CPT"
    },
    {
        id: 4,
        title: "Tokyo",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2671&auto=format&fit=crop",
        price: "Check Price",
        rating: "4.8",
        code: "HND"
    }
];

const FeaturedProducts = () => {
    return (
        <section className="py-8 px-4 md:px-8 lg:px-16 w-full max-w-[1920px] mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900">Featured Destinations</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        className="group relative flex flex-col w-full rounded-2xl md:rounded-3xl bg-white p-3 md:p-3 shadow-sm md:shadow-xl hover:shadow-md md:hover:shadow-2xl transition-all duration-300 overflow-hidden md:aspect-[3/4]"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: "easeOut"
                        }}
                    >
                        {/* Image Container */}
                        <div className="relative w-full h-64 md:h-full rounded-xl md:rounded-2xl overflow-hidden transition-all duration-500 ease-in-out md:group-hover:h-[65%] shrink-0">
                            {/* Background Image */}
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />

                            {/* Gradient Overlay - Desktop Only for readability of overlay text */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 md:group-hover:from-black/60 hidden md:block"></div>

                            {/* Top Right Heart Icon */}
                            <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
                                <button className="h-8 w-8 md:h-8 md:w-8 flex items-center justify-center rounded-full bg-black/20 md:bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all duration-300 hover:bg-white hover:text-red-500">
                                    <Heart size={16} className="md:w-4 md:h-4 w-4 h-4" />
                                </button>
                            </div>

                            {/* Desktop Overlay Text - Hidden on Mobile, Hidden on Hover on Desktop */}
                            <div className="absolute bottom-0 left-0 w-full p-3 md:p-4 flex-col justify-end transition-all duration-500 md:group-hover:opacity-0 translate-y-0 md:group-hover:translate-y-4 hidden md:flex">
                                <h3 className="text-lg md:text-2xl font-bold text-white mb-1 break-words leading-none">{product.title}</h3>
                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-white/90 text-sm font-medium">
                                    <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] md:text-xs border border-white/20 w-fit">Premium Economy</span>
                                    <div className="flex items-center gap-1">
                                        <Tag size={12} className="rotate-90" />
                                        <span className="text-[10px] md:text-sm">from {product.price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section - Visible Below Image on Mobile, Sliding Up on Desktop */}
                        <div className="relative md:absolute md:bottom-0 md:left-0 w-full p-2 pt-4 md:p-4 flex flex-col justify-end md:h-[35%] opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 md:translate-y-4 md:group-hover:translate-y-0">
                            <div className="mb-3 md:mb-2">
                                {/* Title visible here on mobile, and on hover on desktop */}
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 break-words leading-tight">{product.title}</h3>
                                    <div className="flex md:hidden items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                                        <span className="text-xs font-bold text-slate-900">{product.rating}</span>
                                        <Heart size={10} className="fill-red-500 text-red-500" />
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-600 text-sm font-medium mt-1">
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md md:bg-transparent md:p-0">
                                        <Tag size={14} className="rotate-90 text-slate-400" />
                                        <span className="font-bold text-slate-900">{product.price}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 md:gap-1">
                                        <Plane size={14} className="text-slate-400" />
                                        <span className="font-bold uppercase tracking-wider text-xs md:text-sm">{product.code}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full mt-auto">
                                <button className="flex-1 bg-black text-white py-2.5 md:py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                    <Search size={16} />
                                    <span>Search Flight</span>
                                </button>
                                <button className="h-10 w-10 md:h-11 md:w-11 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all hidden md:flex">
                                    <Heart size={20} />
                                </button>
                            </div>
                        </div>

                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedProducts;
