
import { Heart, Tag, Plane } from 'lucide-react';
import { motion } from 'framer-motion';

const products = [
    {
        id: 1,
        title: "New York",
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2671&auto=format&fit=crop",
        price: "$120",
        rating: "4.9"
    },
    {
        id: 2,
        title: "Paris",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673&auto=format&fit=crop",
        price: "$240",
        rating: "5.0"
    },
    {
        id: 3,
        title: "Cape Town",
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2671&auto=format&fit=crop",
        price: "$900",
        rating: "4.8"
    },
    {
        id: 4,
        title: "Cape Town",
        image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2671&auto=format&fit=crop",
        price: "$900",
        rating: "4.8"
    }
];

const FeaturedProducts = () => {
    return (
        <section className="py-2 px-2 md:px-16 w-full">
            <h2 className="text-xl font-bold mb-4 text-slate-900">Featured Destinations</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        className="relative group cursor-pointer overflow-hidden rounded-[clamp(1.5rem,2vw,2rem)] bg-white p-[clamp(0.5rem,1vw,0.75rem)] shadow-xl h-[clamp(240px,28vh,360px)] transition-shadow hover:shadow-2xl"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{
                            duration: 0.6,
                            delay: index * 0.2,
                            ease: "easeOut"
                        }}
                        whileHover={{
                            y: -5,
                            scale: 1.02,
                            transition: { duration: 0.2 }
                        }}
                    >

                        {/* Image Container */}
                        <div className="absolute top-2 left-2 right-2 h-[clamp(224px,26vh,344px)] overflow-hidden rounded-[clamp(1.2rem,1.8vw,1.6rem)] transition-all duration-500 ease-in-out group-hover:h-[clamp(120px,15vh,160px)] group-hover:shadow-none">
                            {/* Background Image */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={product.image}
                                alt={product.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-0"></div>

                            {/* Top Right Heart Icon */}
                            <div className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-4">
                                <Heart size={14} />
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="absolute bottom-2 left-2 right-2 p-4 transition-all duration-500 ease-in-out group-hover:translate-y-0">
                            {/* Title & Subtitle */}
                            <div className="mb-[1vh] transition-all duration-300 group-hover:mb-[0.5vh] group-hover:-translate-y-[0.5vh]">
                                <h3 className="text-[clamp(1.25rem,1.8vw,1.8rem)] font-bold text-white mb-0.5 transition-colors duration-300 group-hover:text-slate-900">{product.title}</h3>
                                <p className="text-white/70 text-[clamp(0.75rem,0.9vw,0.875rem)] transition-colors duration-300 group-hover:text-slate-500">Premium economy</p>
                            </div>

                            {/* Price & Airport */}
                            <div className="flex items-center space-x-[clamp(0.5rem,1vw,1rem)] mb-[1.5vh] text-white text-[clamp(0.75rem,0.9vw,0.875rem)] font-medium transition-colors duration-300 group-hover:text-slate-900 group-hover:mb-[1vh] group-hover:-translate-y-[0.25vh]">
                                <div className="flex items-center space-x-1">
                                    <Tag size={12} className="rotate-90 text-white/80 group-hover:text-slate-400" />
                                    <span className="font-bold">from {product.price}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Plane size={12} className="text-white/80 group-hover:text-slate-400" />
                                    <span className="font-bold">SFO</span>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-2">
                                <button className="flex-1 bg-white text-black py-2.5 rounded-full font-bold text-xs hover:bg-slate-100 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white group-hover:hover:bg-black group-hover:shadow-lg">
                                    Search flight
                                </button>

                                {/* Heart Button revealed on hover */}
                                <button className="h-[34px] w-[34px] hidden group-hover:flex items-center justify-center rounded-full border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500 transition-all font-bold animate-subtle-pop">
                                    <Heart size={16} />
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
