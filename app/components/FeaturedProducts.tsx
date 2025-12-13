
import { Heart, Tag, Plane, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const products = [
    {
        id: 1,
        title: "New York",
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2671&auto=format&fit=crop",
        price: "$120",
        rating: "4.9",
        code: "JFK"
    },
    {
        id: 2,
        title: "Paris",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673&auto=format&fit=crop",
        price: "$240",
        rating: "5.0",
        code: "CDG"
    },
    {
        id: 3,
        title: "Cape Town",
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2671&auto=format&fit=crop",
        price: "$900",
        rating: "4.8",
        code: "CPT"
    },
    {
        id: 4,
        title: "Tokyo",
        image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=2671&auto=format&fit=crop",
        price: "$450",
        rating: "4.8",
        code: "HND"
    }
];

const FeaturedProducts = () => {
    return (
        <section className="py-8 px-4 md:px-8 lg:px-16 w-full max-w-[1920px] mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900">Featured Destinations</h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 w-full">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        className="group relative flex flex-col w-full h-auto aspect-[3/4] rounded-3xl bg-white p-3 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            duration: 0.5,
                            delay: index * 0.1,
                            ease: "easeOut"
                        }}
                    >
                        {/* Image Container - Grows nicely, shrinks on hover to reveal buttons more clearly if needed */}
                        <div className="relative w-full h-full rounded-2xl overflow-hidden transition-all duration-500 ease-in-out group-hover:h-[65%] shrink-0">
                            {/* Background Image */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={product.image}
                                alt={product.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Gradient Overlay - Always visible for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/60"></div>

                            {/* Top Right Heart Icon */}
                            <div className="absolute top-3 right-3 z-10">
                                <button className="h-8 w-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all duration-300 hover:bg-white hover:text-red-500">
                                    <Heart size={14} />
                                </button>
                            </div>

                            {/* Text Content - Positioned absolutely bottom initially */}
                            <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end transition-all duration-500 group-hover:opacity-0 translate-y-0 group-hover:translate-y-4">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-1 break-words">{product.title}</h3>
                                <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm font-medium">
                                    <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-xs border border-white/20">Premium Economy</span>
                                    <div className="flex items-center gap-1">
                                        <Tag size={12} className="rotate-90" />
                                        <span>from {product.price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hover Content - Revealed below image on hover (or technically sits there and image shrinks to show it) 
                            Actually, simpler approach: Flex layout.
                            Image takes flex-1. On hover, it flex-shrink? 
                            Let's use the 'reveal' strategy consistent with zoom-proof layout.
                        */}
                        <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end h-[35%] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                            <div className="mb-2">
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 break-words leading-tight">{product.title}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 text-sm font-medium">
                                    <div className="flex items-center gap-1">
                                        <Tag size={14} className="rotate-90 text-slate-400" />
                                        <span className="font-bold text-slate-900">{product.price}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Plane size={14} className="text-slate-400" />
                                        <span className="font-bold uppercase tracking-wider">{product.code}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full mt-auto">
                                <button className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
                                    <Search size={16} />
                                    <span>Search Flight</span>
                                </button>
                                <button className="h-11 w-11 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-all">
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
