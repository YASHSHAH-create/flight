import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/app/components/Navbar';
import { FOOTER_ROUTES } from '@/app/lib/routeValidator';

export const metadata: Metadata = {
    title: 'Page Not Found',
    robots: { index: false, follow: true },
};

/**
 * Real 404 (Next.js sends HTTP 404 for this component). Gives Google a
 * clear not-found signal instead of a "soft 404" and gives visitors useful
 * next steps instead of a dead end.
 */
export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />
            <main className="pt-36 pb-24 px-4 max-w-3xl mx-auto text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-blue-600 mb-3">404</p>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">This page doesn&apos;t exist</h1>
                <p className="text-slate-600 mb-10">
                    The link may be outdated or the route you typed isn&apos;t one we sell. Try a search, or jump to a popular route below.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    <Link href="/" className="px-5 py-3 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-black">Search flights</Link>
                    <Link href="/flights" className="px-5 py-3 rounded-full bg-white border border-slate-200 text-slate-800 font-semibold text-sm hover:bg-slate-100">All routes</Link>
                    <Link href="/blog" className="px-5 py-3 rounded-full bg-white border border-slate-200 text-slate-800 font-semibold text-sm hover:bg-slate-100">Travel blog</Link>
                    <Link href="/contact" className="px-5 py-3 rounded-full bg-white border border-slate-200 text-slate-800 font-semibold text-sm hover:bg-slate-100">Contact support</Link>
                </div>
                <nav aria-label="Popular routes" className="text-left bg-white rounded-2xl border border-slate-100 p-6">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Popular flight routes</h2>
                    <ul className="grid sm:grid-cols-2 gap-2 text-sm">
                        {FOOTER_ROUTES.map(r => (
                            <li key={r.slug}><Link href={`/flights/${r.slug}`} className="text-blue-700 hover:underline">{r.name} flights</Link></li>
                        ))}
                    </ul>
                </nav>
            </main>
        </div>
    );
}
