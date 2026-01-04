
import Link from 'next/link';
import Image from 'next/image';
import { BLOG_POSTS } from '@/app/lib/blog-data';
import { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
    title: 'Travel Blog | Paymm - Tips, Guides & Destinations',
    description: 'Explore expert travel tips, destination guides, and the latest trends in tourism with the Paymm Travel Blog. Plan your next adventure today.',
    openGraph: {
        title: 'Travel Blog | Paymm',
        description: 'Read our latest stories on travel destinations, flight hacks, and holiday planning.',
        url: 'https://paymm.in/blog',
        type: 'website',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Paymm Travel Blog',
            },
        ],
    },
};

export default function BlogListingPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://paymm.in'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://paymm.in/blog'
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-slate-900 selection:text-white">
            <Navbar />

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                <header className="mb-16 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-4 tracking-wide">
                        Wanderlust Chronicles
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                        The Paymm Travel Blog
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Inspiration, guides, and stories to fuel your next journey. Discover the world with us.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {BLOG_POSTS.map((post) => (
                        <article key={post.slug} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 transform hover:-translate-y-1">
                            <Link href={`/blog/${post.slug}`} className="relative h-64 overflow-hidden">
                                <div className="absolute inset-0 bg-slate-200 animate-pulse group-hover:animate-none transition-all" />
                                <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </Link>

                            <div className="flex-1 p-6 md:p-8 flex flex-col">
                                <div className="flex items-center gap-3 text-sm text-slate-500 mb-4 font-medium">
                                    <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{post.category}</span>
                                    <span>•</span>
                                    <span>{post.readTime}</span>
                                </div>

                                <h2 className="text-2xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h2>

                                <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6">
                                    <div className="text-sm font-semibold text-slate-900">
                                        {post.author}
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
