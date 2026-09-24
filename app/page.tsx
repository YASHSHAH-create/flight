import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Headphones, Wallet, Users } from "lucide-react";
import Navbar from "./components/Navbar";
import JsonLd from "./components/JsonLd";
import SearchCard from "./components/home/SearchCard";
import { ServicesBento, PopularSection, WhyPaymm, AppBand, BlogRow } from "./components/home/Sections";
import { Offers, HomeTestimonials, HomeFAQ, WhatsAppStrip } from "./components/home/Interactive";
import { COMPANY } from "@/app/lib/company";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.paymm.in" },
};

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-lav font-sans">
      <JsonLd />
      <Navbar />

      {/* Hero + search module */}
      <section className="relative overflow-hidden pt-28 md:pt-36 pb-10 md:pb-16">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(55% 45% at 50% 0%, rgba(124,92,230,0.18) 0%, rgba(248,247,252,0) 70%)' }} />
        {/* Floating photo cards (desktop only, purely decorative) */}
        <div className="hidden xl:block absolute right-[4%] top-40 w-44 h-56 rounded-2xl overflow-hidden rotate-6 border border-hair shadow-[0_20px_50px_rgba(79,43,208,0.15)] pointer-events-none" aria-hidden>
          <img src="https://picsum.photos/seed/goa-beach/352/448" alt="" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-brand/10" />
        </div>
        <div className="hidden xl:block absolute right-[12%] top-72 w-36 h-44 rounded-2xl overflow-hidden -rotate-6 border border-hair shadow-[0_20px_50px_rgba(79,43,208,0.15)] pointer-events-none" aria-hidden>
          <img src="https://picsum.photos/seed/himachal-mountain/288/352" alt="" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-brand/10" />
        </div>

        <div className="relative max-w-[1100px] mx-auto px-4 md:px-6 text-center">
          <p className="eyebrow mb-3">India’s all-in-one travel &amp; payments app</p>
          <h1 className="font-display text-[clamp(2rem,6.5vw,3.5rem)] font-extrabold text-ink tracking-[-0.02em] leading-[1.05] max-w-3xl mx-auto">
            Fly, stay, ride &amp; recharge — one app, zero hassle.
          </h1>
          <p className="text-ink-2 text-base md:text-lg mt-4 max-w-2xl mx-auto">Lowest live fares, instant refunds to wallet, and PayMM Coins on every booking.</p>
          <ul className="mt-4 mb-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs md:text-sm font-semibold text-ink-2">
            <li className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-ok" /> Secure UPI · card · wallet payments</li>
            <li className="flex items-center gap-1.5"><Headphones size={15} className="text-brand" /> Support {COMPANY.support.phoneHours}</li>
            <li className="flex items-center gap-1.5"><Wallet size={15} className="text-gold" /> Instant wallet refunds</li>
            <li className="flex items-center gap-1.5"><Users size={15} className="text-accent" /> GST invoices for business travel</li>
          </ul>
          <SearchCard />
        </div>
      </section>

      <ServicesBento />
      <Offers />
      <PopularSection />
      <WhyPaymm />
      <AppBand />
      <HomeTestimonials />
      <HomeFAQ />
      <BlogRow />
      <WhatsAppStrip />

      {/* Visible SEO content (AdSense compliance) */}
      <section className="w-full bg-white py-14 px-4 md:px-6 border-t border-hair">
        <div className="max-w-[1100px] mx-auto space-y-6 text-ink-2 text-sm md:text-base leading-relaxed">
          <h2 className="font-display text-2xl font-extrabold text-ink tracking-tight">Book flights, hotels and bus tickets online with Paymm</h2>
          <p>
            Paymm is an Indian travel and payments app that puts flights, hotels, bus tickets, mobile recharges and bill payments behind one login and one wallet.
            Flight fares come straight from airline systems and are shown side by side, with a flat instant discount on every domestic booking. Bus tickets use live
            seat maps from thousands of daily departures and carry no convenience fee. Hotel stays cover lakhs of properties across India and abroad.
          </p>
          <h3 className="font-extrabold text-ink text-lg">Why travellers choose Paymm</h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Live, transparent pricing:</strong> the fare you see on the seat map or flight card is the fare you pay, with taxes included.</li>
            <li><strong>Secure payments:</strong> UPI, cards, net banking and Paymm wallet through a PCI-DSS compliant gateway; Paymm never stores card details.</li>
            <li><strong>Human support:</strong> phone support {COMPANY.support.phoneHours} and email support seven days a week for changes, cancellations and invoices.</li>
            <li><strong>Rewards:</strong> PayMM Coins on every completed booking and recharge, plus refer-and-earn for you and your friends.</li>
          </ul>
          <h3 className="font-extrabold text-ink text-lg">Popular routes</h3>
          <p>
            Popular flight routes include <Link href="/flights/del-to-bom" className="text-brand underline">Delhi to Mumbai</Link>, <Link href="/flights/blr-to-del" className="text-brand underline">Bangalore to Delhi</Link> and <Link href="/flights/del-to-goi" className="text-brand underline">Delhi to Goa</Link>;
            popular bus routes include <Link href="/bus/delhi-to-manali" className="text-brand underline">Delhi to Manali</Link>, <Link href="/bus/mumbai-to-goa" className="text-brand underline">Mumbai to Goa</Link> and <Link href="/bus/bangalore-to-chennai" className="text-brand underline">Bangalore to Chennai</Link>.
            Browse <Link href="/flights" className="text-brand underline">all flight routes</Link> or <Link href="/bus" className="text-brand underline">all bus routes</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
