import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/app/services/blogService';
import { BlogPost } from '@/app/lib/blog-data';
import { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import ViewCounter from '@/app/components/ViewCounter';
import { ArrowLeft, Calendar, Clock, Share2, ArrowRight, User } from 'lucide-react';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug;
    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | Paymm Blog`,
        description: post.excerpt,
        keywords: post.keywords,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            images: [
                {
                    url: post.imageUrl,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.imageUrl],
        },
    };
}

export async function generateStaticParams() {
    const posts = await getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: Props) {
    const slug = (await params).slug;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const posts = await getAllPosts();

    // Find related posts (same category, excluding current)
    const relatedPosts = posts
        .filter(p => p.category === post.category && p.slug !== post.slug)
        .slice(0, 3);

    // If not enough related posts, fill with others
    if (relatedPosts.length < 3) {
        const others = posts
            .filter(p => p.slug !== post.slug && !relatedPosts.includes(p))
            .slice(0, 3 - relatedPosts.length);
        relatedPosts.push(...others);
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BlogPosting',
                headline: post.title,
                image: [post.imageUrl],
                datePublished: post.date,
                dateModified: post.date,
                author: [{
                    '@type': 'Person',
                    name: post.author,
                }],
                publisher: {
                    '@type': 'Organization',
                    name: 'Paymm',
                    logo: {
                        '@type': 'ImageObject',
                        url: 'https://paymm.in/logo.png',
                    },
                },
                description: post.excerpt,
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': `https://paymm.in/blog/${post.slug}`,
                }
            },
            {
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
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: post.title,
                        item: `https://paymm.in/blog/${post.slug}`
                    }
                ]
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-slate-900 selection:text-white">
            <Navbar />

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="pt-28 pb-20">
                <article className="max-w-4xl mx-auto px-4 md:px-8">

                    <div className="mb-8">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium mb-8 group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back to all posts</span>
                        </Link>

                        <div className="flex items-center gap-4 text-sm font-semibold text-blue-600 mb-6">
                            <span className="bg-blue-50 px-3 py-1 rounded-full">{post.category}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-8">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-slate-500 border-b border-slate-100 pb-8 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold border border-slate-200">
                                    <User size={20} className="text-slate-600" />
                                </div>
                                <div>
                                    <span className="block font-semibold text-slate-900 text-sm leading-none">{post.author}</span>
                                    <span className="text-xs text-slate-500">Travel Writer</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar size={16} />
                                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock size={16} />
                                <span>{post.readTime}</span>
                            </div>
                            <ViewCounter slug={slug} initialViews={post.views} />
                        </div>
                    </div>

                    <div className="relative aspect-[16/9] w-full mb-12 rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div
                        className="prose prose-lg md:prose-xl prose-slate max-w-none 
                prose-headings:font-bold prose-headings:text-slate-900 
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-2xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Author Bio Box - E-E-A-T */}
                    <div className="mt-16 bg-slate-50 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <User size={40} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">About {post.author}</h3>
                            <p className="text-slate-600">
                                {post.author} is a passionate traveler and content creator for Paymm. With a love for exploring hidden gems and sharing practical travel tips, they help you plan the perfect trip.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Share this article</h3>
                        <div className="flex gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 font-semibold transition-colors">
                                <Share2 size={18} />
                                Share
                            </button>
                            {/* Add real share buttons here later */}
                        </div>
                    </div>

                </article>

                {/* Related Posts Section */}
                {relatedPosts.length > 0 && (
                    <section className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
                        <h2 className="text-3xl font-bold text-slate-900 mb-10">Read Next</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map((relatedPost) => (
                                <Link key={relatedPost.slug} href={`/blog/${relatedPost.slug}`} className="group cursor-pointer">
                                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-md bg-gray-100">
                                        <Image
                                            src={relatedPost.imageUrl}
                                            alt={relatedPost.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2">
                                        <span className="bg-blue-50 px-2 py-0.5 rounded-md">{relatedPost.category}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                        {relatedPost.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-2">
                                        {relatedPost.excerpt}
                                    </p>
                                    <div className="flex items-center gap-1 text-blue-600 font-semibold text-sm mt-3 group-hover:gap-2 transition-all">
                                        Read Article <ArrowRight size={16} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>


        </div>
    );
}
