import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import { AUTHORS, authorLd, authorUrl, resolveAuthor } from '@/app/lib/authors';
import { getAllPosts } from '@/app/services/blogService';
import { COMPANY, ORG_ID } from '@/app/lib/company';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return Object.keys(AUTHORS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const author = AUTHORS[slug];
    if (!author) return { title: 'Author not found', robots: 'noindex, follow' };
    return {
        title: `${author.name} – ${author.type === 'Person' ? author.role : 'Authors'}`,
        description: author.bio.slice(0, 155),
        alternates: { canonical: authorUrl(author) },
        openGraph: { title: author.name, description: author.bio, url: authorUrl(author), type: 'profile' },
    };
}

export default async function AuthorPage({ params }: Props) {
    const { slug } = await params;
    const author = AUTHORS[slug];
    if (!author) notFound();

    const posts = (await getAllPosts()).filter(p => resolveAuthor(p.author).slug === author.slug);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'ProfilePage',
                '@id': `${authorUrl(author)}#webpage`,
                url: authorUrl(author),
                name: author.name,
                mainEntity: authorLd(author),
                publisher: { '@id': ORG_ID },
                isPartOf: { '@id': `${COMPANY.url}/#website` },
            },
            {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: COMPANY.url },
                    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${COMPANY.url}/blog` },
                    { '@type': 'ListItem', position: 3, name: author.name, item: authorUrl(author) },
                ],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <main className="pt-28 pb-20 max-w-5xl mx-auto px-4 md:px-8">
                <header className="flex flex-col md:flex-row gap-6 items-start border-b border-slate-100 pb-10 mb-10">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-black text-blue-700 shrink-0">
                        {author.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-blue-600 font-bold mb-2">{author.type === 'Person' ? 'Author' : 'Editorial desk'}</p>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">{author.name}</h1>
                        <p className="text-slate-500 font-medium mb-4">{author.role}</p>
                        <p className="text-slate-600 leading-relaxed max-w-2xl">{author.bio}</p>
                        <div className="flex gap-4 mt-4 text-sm">
                            {author.sameAs.map(u => (
                                <a key={u} href={u} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {u.includes('linkedin') ? 'LinkedIn' : u.includes('x.com') ? 'X' : u.includes('/about') ? 'About Paymm' : u}
                                </a>
                            ))}
                        </div>
                    </div>
                </header>

                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Articles by {author.name} ({posts.length})</h2>
                    {posts.length === 0 ? (
                        <p className="text-slate-500">No articles yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map(post => (
                                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:shadow-lg transition-all">
                                    <div className="relative aspect-[16/10] bg-slate-200">
                                        <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                                    </div>
                                    <div className="p-5">
                                        <span className="text-xs font-semibold text-blue-600">{post.category}</span>
                                        <h3 className="font-bold text-slate-900 mt-1 group-hover:text-blue-600 line-clamp-2">{post.title}</h3>
                                        <p className="text-xs text-slate-400 mt-2">{new Date(post.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })} · {post.readTime}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
