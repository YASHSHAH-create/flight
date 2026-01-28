"use client";

import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS } from '../lib/blog-data';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const LatestBlogPosts = () => {
    // Get latest 3 posts
    const latestPosts = BLOG_POSTS.slice(0, 3);

    return (
        <section className="py-20 px-4 md:px-8 lg:px-16 w-full max-w-[1920px] mx-auto bg-slate-50">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <span className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2 block">Travel Inspiration</span>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                        Latest from our Blog
                    </h2>
                </div>
                <Link href="/blog" className="group flex items-center gap-2 text-slate-900 font-bold text-lg hover:text-blue-600 transition-colors">
                    View All Articles
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {latestPosts.map((post, index) => (
                    <motion.div
                        key={post.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <Image
                                src={post.imageUrl || '/blog-placeholder.jpg'}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                {post.category}
                            </div>
                        </div>

                        <div className="p-8 flex flex-col flex-1">
                            <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(post.date).toLocaleDateString('en-US', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {post.readTime}
                                </span>
                            </div>

                            <Link href={`/blog/${post.slug}`}>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                            </Link>

                            <p className="text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                                {post.excerpt}
                            </p>

                            <div className="mt-auto">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="inline-flex items-center gap-2 text-slate-900 font-bold hover:gap-3 transition-all"
                                >
                                    Read Article <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default LatestBlogPosts;
