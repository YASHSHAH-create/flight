import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, BlogPost } from '@/app/lib/blog-data';
import { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

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
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: Props) {
    const slug = (await params).slug;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
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
                url: 'https://paymm.in/logo.png', // Ensure this exists or use a valid URL
            },
        },
        description: post.excerpt,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://paymm.in/blog/${post.slug}`,
        }
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
                        <Link href="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium mb-8">
                            <ArrowLeft size={18} />
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
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold border border-slate-200">
                                    {post.author[0]}
                                </div>
                                <span className="font-semibold text-slate-900">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={18} />
                                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} />
                                <span>{post.readTime}</span>
                            </div>
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

                    <div className="mt-16 pt-8 border-t border-slate-200">
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
            </main>

           
        </div>
    );
}
