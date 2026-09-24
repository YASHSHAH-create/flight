import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaLinkedin, FaXTwitter, FaGooglePlay, FaApple } from 'react-icons/fa6';
import { COMPANY, formatAddress } from '@/app/lib/company';
import { FOOTER_ROUTES } from '@/app/lib/routeValidator';
import { FEATURED_ROUTE_SLUGS, resolveRouteSlug } from '@/app/lib/bus/routes';

const COLS = [
    {
        title: 'Products',
        links: [
            { name: 'Flights', href: '/flights' }, { name: 'Hotels', href: '/hotels/search' }, { name: 'Buses', href: '/bus' },
            { name: 'Recharge', href: '/downloads' }, { name: 'Bill Pay', href: '/downloads' }, { name: 'Wallet & PayMM Coins', href: '/downloads' },
            { name: 'Holiday Packages', href: '/packages' },
        ],
    },
    {
        title: 'Company',
        links: [
            { name: 'About', href: '/about' }, { name: 'Blog', href: '/blog' }, { name: 'Contact', href: '/contact' },
            { name: 'How to book cheap flights', href: '/how-to-book-cheap-flights' }, { name: 'Cheapest flight booking apps', href: '/cheapest-flight-booking-apps-india' },
            { name: 'Flight schedule', href: '/schedule' },
        ],
    },
    {
        title: 'Support',
        links: [
            { name: 'Help centre', href: '/contact' }, { name: 'Refund policy', href: '/refund' }, { name: 'Cancellation', href: '/refund' },
            { name: 'Privacy', href: '/privacy' }, { name: 'Terms', href: '/terms' }, { name: 'Delete account', href: '/delete-account' },
        ],
    },
];

const Footer = () => {
    const busRoutes = FEATURED_ROUTE_SLUGS.map(resolveRouteSlug).filter((r): r is NonNullable<typeof r> => !!r).slice(0, 12);
    return (
        <footer className="bg-night text-[#C9C4D6] pt-16 pb-8 mt-10">
            <div className="max-w-[1280px] mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
                    <div className="col-span-2 lg:col-span-2 space-y-5">
                        <Link href="/" className="flex items-center gap-2.5 select-none">
                            <span className="relative w-9 h-9 rounded-xl overflow-hidden bg-white"><Image src="/paymm.png" alt="Paymm" fill className="object-cover" /></span>
                            <span className="font-display text-2xl font-extrabold tracking-[-0.03em] text-white">Paymm</span>
                        </Link>
                        <p className="text-sm leading-relaxed max-w-sm">Flights, hotels, buses, recharges and bill payments in one app — with wallet, PayMM Coins and real people on support ({COMPANY.support.phoneHours}).</p>
                        <div className="flex gap-2">
                            <a href={COMPANY.social.playStore} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-night-surface border border-white/10 px-3.5 py-2.5 text-sm font-bold text-white hover:border-night-accent transition-colors"><FaGooglePlay /> Google Play</a>
                            <a href={COMPANY.social.appStore} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-night-surface border border-white/10 px-3.5 py-2.5 text-sm font-bold text-white hover:border-night-accent transition-colors"><FaApple /> App Store</a>
                        </div>
                        <div className="text-xs space-y-1">
                            <p className="text-[#8E88A3] uppercase tracking-wider font-semibold">{COMPANY.legalName}</p>
                            <p className="font-mono">GSTIN {COMPANY.gstin}</p>
                            <p>{formatAddress()}</p>
                            <p><a href={`mailto:${COMPANY.email}`} className="hover:text-white">{COMPANY.email}</a> · <a href={`tel:${COMPANY.phoneTel}`} className="hover:text-white">{COMPANY.phoneDisplay}</a></p>
                        </div>
                    </div>
                    {COLS.map((c) => (
                        <div key={c.title}>
                            <h3 className="text-white font-bold mb-4">{c.title}</h3>
                            <ul className="space-y-2.5 text-sm">
                                {c.links.map((l) => <li key={l.name + l.href}><Link href={l.href} className="hover:text-night-accent transition-colors">{l.name}</Link></li>)}
                            </ul>
                        </div>
                    ))}
                </div>

                <nav aria-label="Popular routes" className="border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div>
                        <p className="uppercase tracking-wider text-[#8E88A3] font-semibold mb-3">Popular flight routes</p>
                        <ul className="flex flex-wrap gap-x-4 gap-y-2">
                            {FOOTER_ROUTES.map((r) => <li key={r.slug}><Link href={`/flights/${r.slug}`} className="hover:text-night-accent transition-colors">{r.name} flights</Link></li>)}
                            <li><Link href="/flights" className="text-night-accent hover:underline">All routes →</Link></li>
                        </ul>
                    </div>
                    <div>
                        <p className="uppercase tracking-wider text-[#8E88A3] font-semibold mb-3">Popular bus routes</p>
                        <ul className="flex flex-wrap gap-x-4 gap-y-2">
                            {busRoutes.map((r) => <li key={r.slug}><Link href={`/bus/${r.slug}`} className="hover:text-night-accent transition-colors">{r.from.name} to {r.to.name} bus</Link></li>)}
                            <li><Link href="/bus" className="text-night-accent hover:underline">All bus routes →</Link></li>
                        </ul>
                    </div>
                </nav>

                <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                    <p>© {new Date().getFullYear()} {COMPANY.legalName}. Made in India 🇮🇳</p>
                    <div className="flex items-center gap-3 font-bold tracking-wide text-[#8E88A3]">
                        <span>UPI</span><span>VISA</span><span>Mastercard</span><span>RuPay</span><span>PhonePe</span><span>PayU</span>
                    </div>
                    <div className="flex items-center gap-2">
                        {[
                            { icon: FaInstagram, url: COMPANY.social.instagram, label: 'Instagram' },
                            { icon: FaLinkedin, url: COMPANY.social.linkedin, label: 'LinkedIn' },
                            { icon: FaXTwitter, url: COMPANY.social.x, label: 'X' },
                        ].map((s) => (
                            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={`Paymm on ${s.label}`} className="w-9 h-9 rounded-lg bg-night-surface border border-white/10 flex items-center justify-center hover:text-white hover:border-night-accent transition-colors"><s.icon /></a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
