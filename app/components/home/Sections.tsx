import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Headphones, Coins, ShieldCheck, Wallet, Smartphone } from 'lucide-react';
import { FaGooglePlay, FaApple } from 'react-icons/fa6';
import { COMPANY, PAYMM_FLIGHT_PRICING } from '@/app/lib/company';
import { BLOG_POSTS } from '@/app/lib/blog-data';
import { FOOTER_ROUTES, routeSlug } from '@/app/lib/routeValidator';
import { FEATURED_ROUTE_SLUGS, resolveRouteSlug } from '@/app/lib/bus/routes';

/* ───────────────────────── Services bento ───────────────────────── */

const TILES = {
    flights: { emoji: '✈️', tint: 'from-[#EFEAFB] to-[#DCD2F7]' },
    hotels: { emoji: '🏨', tint: 'from-[#FFE9E3] to-[#FFD1C2]' },
    buses: { emoji: '🚌', tint: 'from-[#E0F5F1] to-[#BFE8DD]' },
    recharge: { emoji: '📱', tint: 'from-[#FFF4D6] to-[#FFE39E]' },
    bills: { emoji: '🧾', tint: 'from-[#E3F0FF] to-[#C7DEFF]' },
    wallet: { emoji: '👛', tint: 'from-[#E3F7EF] to-[#BFEBD8]' },
    coins: { emoji: '🪙', tint: 'from-[#FFF4D6] to-[#FFD54F]' },
};

const Icon3D = ({ k, size = 42 }: { k: keyof typeof TILES; size?: number }) => (
    <span className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${TILES[k].tint} shadow-[inset_0_-3px_0_rgba(0,0,0,0.06),0_1px_2px_rgba(30,25,48,0.06)]`} style={{ width: size, height: size, fontSize: size * 0.5 }} aria-hidden>
        {TILES[k].emoji}
    </span>
);

export const ServicesBento = () => (
    <section className="max-w-[1100px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <p className="eyebrow mb-2">Everything you book</p>
        <h2 className="font-display text-2xl md:text-4xl font-extrabold text-ink tracking-[-0.02em] mb-6">One app for the whole trip</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[minmax(120px,auto)]">
            <Link href="/flights" className="col-span-2 row-span-2 relative rounded-[20px] overflow-hidden border border-hair group min-h-[260px]">
                <Image src="/background.jpg" alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 550px" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1930]/85 via-[#1E1930]/30 to-[#4F2BD0]/20" />
                <span className="absolute top-4 left-4 pill-soft bg-gold-soft text-gold">MOST BOOKED</span>
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <Icon3D k="flights" />
                    <h3 className="font-display text-2xl font-extrabold mt-3">Flights</h3>
                    <p className="text-sm text-white/80">Every airline side by side · flat ₹{PAYMM_FLIGHT_PRICING.instantDiscountPerBooking} instant discount</p>
                    <span className="inline-flex items-center gap-1 text-sm font-bold mt-2 text-gold-bright">Search flights <ArrowRight size={14} /></span>
                </div>
            </Link>
            <Link href="/hotels/search" className="col-span-2 card p-5 flex items-center gap-4 hover:border-brand/40 hover:-translate-y-0.5 transition-all">
                <Icon3D k="hotels" />
                <div className="flex-1 min-w-0"><h3 className="font-extrabold text-ink">Hotels</h3><p className="text-sm text-ink-2">Lakhs of stays across India with pay-at-checkout rates</p></div>
                <ArrowRight size={18} className="text-ink-3" />
            </Link>
            <Link href="/bus" className="col-span-2 card p-5 flex items-center gap-4 hover:border-brand/40 hover:-translate-y-0.5 transition-all">
                <Icon3D k="buses" />
                <div className="flex-1 min-w-0"><h3 className="font-extrabold text-ink">Buses</h3><p className="text-sm text-ink-2">Live seat maps · no convenience fee · instant m-ticket</p></div>
                <ArrowRight size={18} className="text-ink-3" />
            </Link>
            {([['recharge', 'Recharge', 'Prepaid, postpaid & DTH'], ['bills', 'Bill Pay', 'Electricity, gas, FASTag'], ['wallet', 'Wallet', 'Instant refunds'], ['coins', 'PayMM Coins', 'Earn on every booking']] as [keyof typeof TILES, string, string][]).map(([k, t, d]) => (
                <Link key={k} href="/downloads" className="card p-4 flex flex-col gap-2 hover:border-brand/40 hover:-translate-y-0.5 transition-all">
                    <Icon3D k={k} size={36} />
                    <div><h3 className="font-extrabold text-ink text-sm">{t}</h3><p className="text-xs text-ink-2">{d}</p></div>
                </Link>
            ))}
        </div>
    </section>
);

/* ───────────────────────── Popular destinations & routes ───────────────────────── */

const DESTINATIONS = [
    { name: 'Goa', code: 'GOI', from: 'DEL', seed: 'goa-beach', sub: 'Beaches & nightlife' },
    { name: 'Manali', code: 'IXC', from: 'DEL', seed: 'himachal-mountain', sub: 'Himalayan hills' },
    { name: 'Jaipur', code: 'JAI', from: 'BOM', seed: 'jaipur-palace', sub: 'Pink City heritage' },
    { name: 'Kochi', code: 'COK', from: 'DEL', seed: 'kerala-backwater', sub: 'Kerala backwaters' },
];

export const PopularSection = () => {
    const busRoutes = FEATURED_ROUTE_SLUGS.slice(0, 8).map(resolveRouteSlug).filter((r): r is NonNullable<typeof r> => !!r);
    return (
        <section className="bg-white border-y border-hair">
            <div className="max-w-[1100px] mx-auto px-4 md:px-6 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                    <p className="eyebrow mb-2">Trending destinations</p>
                    <h2 className="font-display text-2xl md:text-3xl font-extrabold text-ink tracking-[-0.02em] mb-5">Where India is going this season</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {DESTINATIONS.map((d) => (
                            <Link key={d.name} href={`/flights/${routeSlug(d.from, d.code)}`} className="relative aspect-[4/5] rounded-2xl overflow-hidden group border border-hair">
                                <Image src={`https://picsum.photos/seed/${d.seed}/480/600`} alt={`${d.name}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 260px" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1E1930]/80 via-transparent to-[#7C5CE6]/10" />
                                <div className="absolute bottom-0 p-4 text-white"><h3 className="font-extrabold text-lg">{d.name}</h3><p className="text-xs text-white/80">{d.sub}</p></div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="space-y-8">
                    <div>
                        <p className="eyebrow mb-2">Popular flight routes</p>
                        <ul className="card divide-y divide-hair">
                            {FOOTER_ROUTES.slice(0, 6).map((r) => (
                                <li key={r.slug}>
                                    <Link href={`/flights/${r.slug}`} className="flex items-center justify-between px-4 py-3 hover:bg-lav transition-colors">
                                        <span className="font-bold text-ink text-sm">{r.name}</span>
                                        <span className="text-sm font-bold text-brand inline-flex items-center gap-1">Book <ArrowRight size={14} /></span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="eyebrow mb-2">Popular bus routes</p>
                        <div className="flex flex-wrap gap-2">
                            {busRoutes.map((r) => <Link key={r.slug} href={`/bus/${r.slug}`} className="btn-outline text-xs py-2">{r.from.name} → {r.to.name}</Link>)}
                            <Link href="/bus" className="btn-ghost text-xs py-2">All bus routes →</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ───────────────────────── Why Paymm + stats ───────────────────────── */

export const WhyPaymm = () => (
    <section className="max-w-[1100px] mx-auto px-4 md:px-6 py-12 md:py-16">
        <p className="eyebrow mb-2">Why Paymm</p>
        <h2 className="font-display text-2xl md:text-4xl font-extrabold text-ink tracking-[-0.02em] mb-6">Calm booking, honest pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
                { icon: ShieldCheck, t: 'Live fares, no markup games', d: 'Airline and operator inventory in real time. Bus tickets carry zero convenience fee.' },
                { icon: Wallet, t: 'Instant refund to wallet', d: 'Cancel or fail a booking and wallet payments come back the same minute.' },
                { icon: Coins, t: 'PayMM Coins on every booking', d: 'Earn coins on flights, buses and recharges; spend them on your next trip.' },
                { icon: Headphones, t: 'Real support', d: `Phone ${COMPANY.support.phoneHours}, email 7 days a week, WhatsApp ticket delivery.` },
            ].map((f) => (
                <div key={f.t} className="card p-5">
                    <span className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center mb-3"><f.icon size={20} /></span>
                    <h3 className="font-extrabold text-ink mb-1">{f.t}</h3>
                    <p className="text-sm text-ink-2">{f.d}</p>
                </div>
            ))}
        </div>
        <dl className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            {[['All major airlines', 'domestic & international'], ['Lakhs of hotels', 'across India & abroad'], ['1,000s of buses daily', 'with live seat maps'], ['₹0', 'convenience fee on buses']].map(([v, l]) => (
                <div key={v} className="rounded-2xl bg-brand-soft/60 p-4"><dt className="font-display text-xl md:text-2xl font-extrabold text-brand">{v}</dt><dd className="text-xs text-ink-2 mt-0.5">{l}</dd></div>
            ))}
        </dl>
    </section>
);

/* ───────────────────────── App download band ───────────────────────── */

export const AppBand = () => (
    <section className="max-w-[1100px] mx-auto px-4 md:px-6 py-6">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-brand to-brand-deep text-white p-7 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
            <div className="relative">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/70 mb-2">Paymm app</p>
                <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.02em] leading-tight">Everything travel, in your pocket.</h2>
                <p className="text-white/80 mt-3 max-w-md">Flights, hotels, buses, recharges and bills with wallet, instant refunds and <span className="text-gold-bright font-bold">PayMM Coins</span> on every booking.</p>
                <div className="flex flex-wrap gap-2 mt-5">
                    <a href={COMPANY.social.playStore} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-brand rounded-full px-5 py-3 font-bold hover:bg-brand-soft transition-colors"><FaGooglePlay /> Google Play</a>
                    <a href={COMPANY.social.appStore} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white rounded-full px-5 py-3 font-bold hover:bg-white/20 transition-colors"><FaApple /> App Store</a>
                </div>
                <p className="text-xs text-white/60 mt-4 flex items-center gap-1.5"><Smartphone size={14} /> Same account as the website — your bookings and wallet sync automatically.</p>
            </div>
            <div className="relative flex justify-center md:justify-end gap-4">
                {[0, 1].map((i) => (
                    <div key={i} className={`w-40 md:w-48 aspect-[9/19] rounded-[28px] bg-night border-[6px] border-[#2A2536] shadow-2xl overflow-hidden ${i === 1 ? 'hidden sm:block translate-y-8' : ''}`}>
                        <div className="p-3 space-y-2">
                            <div className="h-6 rounded-full bg-white/10 w-2/3" />
                            <div className="grid grid-cols-2 gap-2">
                                {['✈️', '🏨', '🚌', '📱'].map((e) => <div key={e} className="h-16 rounded-2xl bg-night-surface flex items-center justify-center text-2xl">{e}</div>)}
                            </div>
                            <div className="h-20 rounded-2xl bg-gradient-to-br from-brand to-brand-deep p-3 text-[10px] font-bold text-white/90">PayMM Coins<br /><span className="text-gold-bright text-lg">₹{i ? '640' : '1,250'}</span></div>
                            <div className="h-10 rounded-xl bg-night-surface" /><div className="h-10 rounded-xl bg-night-surface" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

/* ───────────────────────── Blog ───────────────────────── */

export const BlogRow = () => {
    const posts = BLOG_POSTS.slice(0, 3);
    return (
        <section className="max-w-[1100px] mx-auto px-4 md:px-6 py-12 md:py-16">
            <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                    <p className="eyebrow mb-2">Travel guides</p>
                    <h2 className="font-display text-2xl md:text-4xl font-extrabold text-ink tracking-[-0.02em]">From the blog</h2>
                </div>
                <Link href="/blog" className="btn-ghost text-sm">View all articles <ArrowRight size={14} /></Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {posts.map((p) => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className="card overflow-hidden group hover:-translate-y-0.5 hover:border-brand/40 transition-all">
                        <div className="relative aspect-video">
                            <Image src={p.imageUrl || '/og-image.jpg'} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 360px" />
                            <span className="absolute top-3 left-3 pill-soft bg-white/90 text-brand">{p.category}</span>
                        </div>
                        <div className="p-4">
                            <h3 className="font-extrabold text-ink leading-snug line-clamp-2">{p.title}</h3>
                            <p className="text-xs text-ink-2 mt-2 flex items-center gap-2"><Clock size={12} /> {p.readTime} · {p.author}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
