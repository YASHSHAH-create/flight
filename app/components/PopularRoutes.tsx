"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const routes = [
    {
        city: "Mumbai",
        image: "https://picsum.photos/seed/mumbai/200/200",
        destinations: ["Goa", "Delhi", "Bangalore", "Ahmedabad"]
    },
    {
        city: "Delhi",
        image: "https://picsum.photos/seed/delhi/200/200",
        destinations: ["Mumbai", "Goa", "Bangalore", "Pune"]
    },
    {
        city: "Kolkata",
        image: "https://picsum.photos/seed/kolkata/200/200",
        destinations: ["Mumbai", "Delhi", "Bangalore", "Bagdogra"]
    },
    {
        city: "Chennai",
        image: "https://picsum.photos/seed/chennai/200/200",
        destinations: ["Mumbai", "Delhi", "Madurai", "Coimbatore"]
    },
    {
        city: "Hyderabad",
        image: "https://picsum.photos/seed/hyderabad/200/200",
        destinations: ["Mumbai", "Goa", "Bangalore", "Delhi"]
    },
    {
        city: "Ahmedabad",
        image: "https://picsum.photos/seed/ahmedabad/200/200",
        destinations: ["Mumbai", "Delhi", "Bangalore", "Goa"]
    },
    {
        city: "Bangalore",
        image: "https://picsum.photos/seed/bangalore/200/200",
        destinations: ["Mumbai", "Delhi", "Goa", "Hyderabad"]
    },
    {
        city: "Pune",
        image: "https://picsum.photos/seed/pune/200/200",
        destinations: ["Goa", "Delhi", "Bangalore", "Nagpur"]
    },
    {
        city: "Goa",
        image: "https://picsum.photos/seed/goa/200/200",
        destinations: ["Mumbai", "Delhi", "Bangalore", "Hyderabad"]
    },
];

const PopularRoutes = () => {
    return (
        <section className="py-12 px-4 md:px-8 lg:px-16 w-full max-w-[1920px] mx-auto bg-white">
            <h2 className="text-2xl font-bold mb-8 text-slate-900">Popular Flight Routes</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routes.map((route, index) => (
                    <motion.div
                        key={route.city}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all bg-white group cursor-pointer"
                    >
                        {/* City Thumbnail */}
                        <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-lg">
                            <Image
                                src={route.image}
                                alt={`${route.city} Flights`}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="64px"
                            />
                        </div>

                        {/* Route Details */}
                        <div className="flex flex-col">
                            <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                                {route.city} Flights
                            </h3>
                            <div className="text-xs text-slate-500 flex flex-wrap gap-1 items-center mt-1">
                                <span className="text-slate-400">To:</span>
                                {route.destinations.map((dest, i) => (
                                    <React.Fragment key={dest}>
                                        <Link
                                            href={`/flights/${route.city.toLowerCase()}-to-${dest.toLowerCase()}`}
                                            className="hover:text-blue-500 hover:underline transition-colors"
                                        >
                                            {dest}
                                        </Link>
                                        {i < route.destinations.length - 1 && (
                                            <span className="text-slate-300">•</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default PopularRoutes;
