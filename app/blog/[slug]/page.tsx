import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/app/services/blogService';
import { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import ViewCounter from '@/app/components/ViewCounter';
import { ArrowLeft, Calendar, Clock, Share2, ArrowRight, User, Plane } from 'lucide-react';
import { resolveAuthor, authorLd, AUTHORS } from '@/app/lib/authors';
import { ORG_ID } from '@/app/lib/company';
import { getIndexableRoutes } from '@/app/lib/routeValidator';
import { AIRPORT_MAP } from '@/app/lib/airports';

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
        title: post.title,
        description: post.excerpt,
        keywords: post.keywords,
        alternates: {
            canonical: `https://www.paymm.in/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            url: `https://www.paymm.in/blog/${post.slug}`,
            publishedTime: post.date,
            modifiedTime: post.date,
            authors: [`https://www.paymm.in/author/${resolveAuthor(post.author).slug}`],
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
    const author = resolveAuthor(post.author);
    const reviewer = AUTHORS['yash-shah'];

    // Routes to link from this article: any indexed route whose destination
    // city is mentioned in the title/keywords (e.g. "Goa" -> Mumbai to Goa).
    const haystack = `${post.title} ${post.excerpt} ${(post.keywords || []).join(' ')}`.toLowerCase();
    const mentionedCodes = Object.keys(AIRPORT_MAP).filter(code => {
        const city = AIRPORT_MAP[code].city.toLowerCase();
        return city.length > 3 && haystack.includes(city);
    });
    const linkedRoutes = getIndexableRoutes()
        .filter(r => mentionedCodes.includes(r.dest))
        .slice(0, 6);

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

    const graph: Record<string, unknown>[] = [
        {
            '@type': 'BlogPosting',
            headline: post.title,
            image: [post.imageUrl],
            datePublished: post.date,
            dateModified: post.date,
            author: [authorLd(author)],
            reviewedBy: authorLd(reviewer),
            publisher: { '@id': ORG_ID },
            isPartOf: { '@id': 'https://www.paymm.in/#website' },
            inLanguage: 'en-IN',
            description: post.excerpt,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://www.paymm.in/blog/${post.slug}`,
            }
        },
        {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://www.paymm.in'
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Blog',
                    item: 'https://www.paymm.in/blog'
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: post.title,
                    item: `https://www.paymm.in/blog/${post.slug}`
                }
            ]
        }
    ];

    if (post.slug === 'cheap-international-flights-from-india-guide') {
        graph.push({
            '@type': 'HowTo',
            name: 'How to Find Cheap International Flights from India',
            description: 'Step-by-step guide to finding and booking cheap international flights from India using smart booking hacks.',
            step: [
                {
                    '@type': 'HowToStep',
                    name: 'Book in Advance, But Not Too Early',
                    text: 'The sweet spot for international flights is usually 3-4 months before departure. Booking too early can sometimes be as expensive as booking last minute.',
                    url: 'https://www.paymm.in/blog/cheap-international-flights-from-india-guide#step1'
                },
                {
                    '@type': 'HowToStep',
                    name: 'Use Flight Comparison Tools',
                    text: 'Use platforms like Paymm to compare prices across multiple airlines instantly. Always check for hidden costs and baggage fees before booking.',
                    url: 'https://www.paymm.in/blog/cheap-international-flights-from-india-guide#step2'
                },
                {
                    '@type': 'HowToStep',
                    name: 'Be Flexible with Dates',
                    text: 'Flying mid-week (typically Tuesday or Wednesday) is often significantly cheaper than flying on weekends. Use a flexible date search calendar.',
                    url: 'https://www.paymm.in/blog/cheap-international-flights-from-india-guide#step3'
                }
            ]
        });
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': graph
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
                                    <Link href={`/author/${author.slug}`} className="block font-semibold text-slate-900 text-sm leading-none hover:text-blue-600">{author.name}</Link>
                                    <span className="text-xs text-slate-500">{author.role} · Reviewed by <Link href={`/author/${reviewer.slug}`} className="hover:text-blue-600 underline">{reviewer.name}</Link></span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar size={16} />
                                <span>Updated {new Date(post.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
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

                    {/* Book flights for destinations mentioned in this article */}
                    {linkedRoutes.length > 0 && (
                        <nav aria-label="Related flight routes" className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2"><Plane size={18} className="text-blue-600" /> Book flights for this trip</h3>
                            <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                                {linkedRoutes.map(r => (
                                    <li key={r.slug}>
                                        <Link href={`/flights/${r.slug}`} className="text-blue-700 hover:underline">Cheap flights from {r.name.replace(' to ', ' to ')}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}

                    {/* Author Bio Box - E-E-A-T */}
                    <div className="mt-16 bg-slate-50 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                            <User size={40} className="text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">
                                <Link href={`/author/${author.slug}`} className="hover:text-blue-600">About {author.name}</Link>
                            </h3>
                            <p className="text-xs text-slate-500 mb-3">{author.role}</p>
                            <p className="text-slate-600">{author.bio}</p>
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
