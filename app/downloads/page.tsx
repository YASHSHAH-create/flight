import React from "react";
import Navbar from "@/app/components/Navbar";
import { Metadata } from "next";
import { 
  Smartphone, 
  CheckCircle2, 
  QrCode, 
  ArrowRight, 
  ShieldCheck, 
  Ticket, 
  BellRing, 
  Sparkles,
  Plane,
  Star
} from "lucide-react";

export const metadata: Metadata = {
  title: "Download Paymm Mobile App | Cheap Flight Booking App",
  description:
    "Download the Paymm App for Android and iOS. Book cheap flight tickets, compare airline fares, and get exclusive mobile-only deals and real-time status alerts.",
  alternates: {
    canonical: "https://paymm.in/downloads",
  },
};

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Navbar with fixed positioning */}
      <Navbar />

      <main className="pt-28 md:pt-36 pb-24 overflow-hidden relative">
        {/* Ambient Decorative Background Glows */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute top-1/2 right-1/10 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none z-0" 
          style={{ 
            backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', 
            backgroundSize: '32px 32px' 
          }} 
        />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {/* Hero Section */}
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-24">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              {/* Promo Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-semibold hover:bg-blue-500/20 transition-all duration-300">
                <Sparkles size={14} className="animate-pulse" />
                <span>New Version 2.2.3 is Live</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none text-white">
                Flight Bookings.<br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Smarter & Faster.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Compare domestic and international flights, track schedules, and unlock exclusive discounts. Experience the best flight deals right in your pocket.
              </p>

              {/* Download Buttons / Badge Row */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                
                {/* Apple App Store Button */}
                <a
                  href="https://apps.apple.com/app/id6780256299"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-black hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/40 group"
                >
                  <svg className="w-6 h-6 text-white transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.97 1.12.09 2.27-.58 2.98-1.41z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase leading-none">Download on the</p>
                    <p className="text-base text-white font-bold leading-tight mt-0.5">App Store</p>
                  </div>
                </a>

                {/* Google Play Store Button */}
                <a
                  href="https://play.google.com/store/apps/details?id=in.paymm.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-black hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-white px-6 py-3 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-black/40 group"
                >
                  <svg className="w-6 h-6 text-white transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 5.27v13.46c0 .82.68 1.43 1.46 1.18l12.86-7.37a1.32 1.32 0 0 0 0-2.31L4.46 4.09C3.68 3.84 3 4.45 3 5.27z" fill="#00E5FF"/>
                    <path d="M17.32 10.23 4.46 2.85A1.32 1.32 0 0 0 3 4.09v1.18l12.86 7.36c.64.36 1.46-.09 1.46-.82 0-.25-.13-.48-.32-.61z" fill="#4CAF50"/>
                    <path d="M3 17.55v1.18c0 .82.68 1.43 1.46 1.18l12.86-7.37c.19-.13.32-.36.32-.61 0-.73-.82-1.18-1.46-.82L3.02 17.55z" fill="#FFC107"/>
                    <path d="M15.86 12.63 3 5.27v13.46l12.86-7.37a1.32 1.32 0 0 0 0-2.31c.01.01 0 0 0 0z" fill="#FF3D00"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase leading-none">GET IT ON</p>
                    <p className="text-base text-white font-bold leading-tight mt-0.5">Google Play</p>
                  </div>
                </a>

              </div>

              {/* Scan to Download Card */}
              <div className="hidden sm:flex items-center gap-6 p-5 bg-slate-900/60 backdrop-blur-md rounded-3xl border border-slate-800/80 max-w-md mx-auto lg:mx-0">
                <div className="p-3 bg-white rounded-2xl shadow-inner flex items-center justify-center shrink-0">
                  {/* Styled QR Code using inline SVG */}
                  <svg className="w-24 h-24 text-slate-900" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="white" />
                    {/* Corner Position Detection Pattern (Top Left) */}
                    <rect x="5" y="5" width="25" height="25" fill="black" />
                    <rect x="9" y="9" width="17" height="17" fill="white" />
                    <rect x="13" y="13" width="9" height="9" fill="black" />
                    
                    {/* Corner Position Detection Pattern (Top Right) */}
                    <rect x="70" y="5" width="25" height="25" fill="black" />
                    <rect x="74" y="9" width="17" height="17" fill="white" />
                    <rect x="78" y="13" width="9" height="9" fill="black" />
                    
                    {/* Corner Position Detection Pattern (Bottom Left) */}
                    <rect x="5" y="70" width="25" height="25" fill="black" />
                    <rect x="9" y="74" width="17" height="17" fill="white" />
                    <rect x="13" y="78" width="9" height="9" fill="black" />
                    
                    {/* Small Alignment Pattern */}
                    <rect x="70" y="70" width="9" height="9" fill="black" />
                    <rect x="72" y="72" width="5" height="5" fill="white" />
                    <rect x="74" y="74" width="1" height="1" fill="black" />
                    
                    {/* Generated QR Code Data Dots (representative grid) */}
                    <rect x="35" y="5" width="4" height="4" fill="black" /><rect x="43" y="5" width="8" height="4" fill="black" /><rect x="55" y="5" width="4" height="8" fill="black" /><rect x="63" y="9" width="4" height="4" fill="black" />
                    <rect x="35" y="13" width="8" height="4" fill="black" /><rect x="47" y="13" width="4" height="8" fill="black" /><rect x="59" y="17" width="8" height="4" fill="black" />
                    <rect x="39" y="21" width="4" height="4" fill="black" /><rect x="51" y="21" width="4" height="4" fill="black" /><rect x="63" y="21" width="4" height="8" fill="black" />
                    <rect x="5" y="35" width="4" height="8" fill="black" /><rect x="13" y="39" width="8" height="4" fill="black" /><rect x="25" y="35" width="4" height="4" fill="black" /><rect x="33" y="35" width="12" height="4" fill="black" /><rect x="49" y="35" width="4" height="4" fill="black" /><rect x="57" y="35" width="8" height="8" fill="black" /><rect x="69" y="35" width="4" height="4" fill="black" /><rect x="77" y="35" width="4" height="8" fill="black" /><rect x="85" y="35" width="8" height="4" fill="black" />
                    <rect x="9" y="47" width="4" height="4" fill="black" /><rect x="21" y="47" width="8" height="4" fill="black" /><rect x="33" y="43" width="4" height="8" fill="black" /><rect x="41" y="47" width="8" height="4" fill="black" /><rect x="53" y="47" width="4" height="4" fill="black" /><rect x="65" y="43" width="8" height="8" fill="black" /><rect x="81" y="47" width="4" height="4" fill="black" /><rect x="89" y="43" width="4" height="8" fill="black" />
                    <rect x="5" y="55" width="8" height="4" fill="black" /><rect x="17" y="59" width="4" height="4" fill="black" /><rect x="25" y="55" width="4" height="8" fill="black" /><rect x="37" y="59" width="8" height="4" fill="black" /><rect x="49" y="55" width="4" height="4" fill="black" /><rect x="57" y="59" width="4" height="8" fill="black" /><rect x="69" y="55" width="8" height="4" fill="black" /><rect x="81" y="55" width="4" height="4" fill="black" /><rect x="89" y="59" width="8" height="4" fill="black" />
                    <rect x="35" y="70" width="4" height="8" fill="black" /><rect x="43" y="70" width="8" height="4" fill="black" /><rect x="55" y="70" width="4" height="4" fill="black" /><rect x="63" y="74" width="4" height="4" fill="black" /><rect x="83" y="70" width="4" height="8" fill="black" /><rect x="91" y="74" width="4" height="4" fill="black" />
                    <rect x="39" y="82" width="8" height="4" fill="black" /><rect x="51" y="78" width="4" height="8" fill="black" /><rect x="59" y="82" width="8" height="4" fill="black" /><rect x="87" y="82" width="8" height="4" fill="black" />
                    <rect x="35" y="91" width="4" height="4" fill="black" /><rect x="47" y="91" width="4" height="4" fill="black" /><rect x="55" y="89" width="4" height="8" fill="black" /><rect x="63" y="91" width="4" height="4" fill="black" /><rect x="71" y="91" width="8" height="4" fill="black" /><rect x="83" y="89" width="4" height="8" fill="black" /><rect x="91" y="91" width="4" height="4" fill="black" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-white text-sm">Scan QR code to install</p>
                  <p className="text-xs text-slate-400 leading-normal">
                    Point your phone camera at the QR code to quickly open the app on your App Store or Google Play Store.
                  </p>
                </div>
              </div>

            </div>

            {/* Right Phone Mockup Column */}
            <div className="lg:col-span-5 flex justify-center relative select-none">
              
              {/* Decorative radial lighting behind phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/20 rounded-full blur-[80px] z-0 pointer-events-none" />

              {/* Phone Container */}
              <div className="relative w-[300px] h-[600px] rounded-[50px] border-[10px] border-slate-800 bg-slate-900 shadow-2xl shadow-indigo-900/30 overflow-hidden ring-4 ring-slate-800/40 z-10 transition-all duration-500 hover:scale-[1.02]">
                
                {/* Speaker Grill & Camera Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
                  <div className="w-12 h-1 bg-slate-900 rounded-full" />
                  <div className="w-3.5 h-3.5 bg-slate-900 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-blue-900/50 rounded-full" />
                  </div>
                </div>

                {/* Phone Screen Mockup Content */}
                <div className="w-full h-full bg-[#0a0f1d] flex flex-col justify-between pt-8 pb-4 px-4 font-sans text-xs">
                  
                  {/* App Header Status Bar */}
                  <div className="flex justify-between items-center text-slate-400 font-semibold px-1 py-1">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <span className="w-3.5 h-2 border border-slate-400 rounded-sm inline-block relative pr-0.5">
                        <span className="w-2.5 h-1 bg-slate-400 absolute top-0.5 left-0.5" />
                      </span>
                    </div>
                  </div>

                  {/* App Logo & Brand Header */}
                  <div className="flex items-center justify-between mt-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className="relative w-7 h-7 rounded-lg overflow-hidden bg-white ring-1 ring-white/10 flex items-center justify-center">
                        {/* Inline simplified logo */}
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md flex items-center justify-center">
                          <Plane size={11} className="text-white transform -rotate-45" />
                        </div>
                      </div>
                      <span className="text-sm font-black tracking-tight text-white">Paymm</span>
                    </div>
                    <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-bold">24/7 Support</span>
                  </div>

                  {/* Dynamic Mockup Card (Flight search details) */}
                  <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-3.5 mt-4 space-y-3 shadow-xl shadow-black/30">
                    
                    {/* Destination Selection */}
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div>
                        <p className="text-[9px] text-slate-500 font-semibold uppercase">From</p>
                        <p className="text-sm font-bold text-white">DEL</p>
                        <p className="text-[9px] text-slate-400 truncate w-20">New Delhi</p>
                      </div>
                      <div className="w-7 h-7 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 border border-blue-500/25">
                        ✈
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-500 font-semibold uppercase">To</p>
                        <p className="text-sm font-bold text-white">BOM</p>
                        <p className="text-[9px] text-slate-400 truncate w-20">Mumbai</p>
                      </div>
                    </div>

                    {/* Flight Details & Dates */}
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <p className="text-[9px] text-slate-500 font-semibold uppercase">Departure</p>
                        <p className="font-bold text-slate-300">28 Jun, Sun</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 font-semibold uppercase">Travelers</p>
                        <p className="font-bold text-slate-300">1 Adult, Economy</p>
                      </div>
                    </div>

                    {/* App Special Promo Tag */}
                    <div className="bg-indigo-600/15 border border-indigo-500/20 p-2 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Ticket size={12} className="text-indigo-400" />
                        <span className="text-[9px] text-indigo-300 font-bold">App Code: PAYMMAPP</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold">-40% OFF</span>
                    </div>

                    {/* CTA Search Button */}
                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-blue-900/30 hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5">
                      <span>Search Flights</span>
                      <ArrowRight size={12} />
                    </button>

                  </div>

                  {/* Flight Selection Card (Quick preview of result) */}
                  <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-3 space-y-2 mt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-[7px] text-white font-bold font-sans">AI</div>
                        <span className="text-[9px] font-bold text-slate-300">Air India • AI-802</span>
                      </div>
                      <span className="text-xs font-black text-white">₹5,142</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-slate-400">
                      <span>08:00 - 10:15</span>
                      <span>2h 15m (Non-stop)</span>
                    </div>
                  </div>

                  {/* Social Proof Star Review inside App */}
                  <div className="bg-slate-900/20 border border-slate-800/40 rounded-xl p-2 mt-auto text-center flex items-center justify-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={8} fill="currentColor" />
                      ))}
                    </div>
                    <span className="text-[8px] text-slate-400 font-medium">4.8 Rating on Play Store</span>
                  </div>

                  {/* Phone Navigation Bar */}
                  <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto mt-2" />

                </div>

              </div>

            </div>

          </div>

          {/* Features Grid */}
          <div className="border-t border-slate-800/60 pt-20 mb-20">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Why book on the <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Paymm App?</span>
              </h2>
              <p className="text-slate-400">
                Unlock a suite of features designed to make travel booking simple, secure, and stress-free.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1 */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 p-6 rounded-3xl hover:bg-slate-900/70 hover:border-slate-700/80 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/25 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Ticket size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">App-Exclusive Offers</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Get discounts of up to 40% on flights using the coupon code <span className="text-blue-400 font-bold">PAYMMAPP</span> on your first booking.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 p-6 rounded-3xl hover:bg-slate-900/70 hover:border-slate-700/80 transition-all duration-300 group">
                <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/25 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">100% Secure Payments</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Make fast payments with UPI, Net Banking, and Credit Cards via a fully encrypted, PCIDSS-compliant gateway.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 p-6 rounded-3xl hover:bg-slate-900/70 hover:border-slate-700/80 transition-all duration-300 group">
                <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BellRing size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Instant Notifications</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Stay updated with real-time push alerts regarding flight schedules, terminal information, and price updates.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/60 p-6 rounded-3xl hover:bg-slate-900/70 hover:border-slate-700/80 transition-all duration-300 group">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone size={22} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Offline Itineraries</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Access your boarding passes and travel schedules directly within the app, even in low network zones.
                </p>
              </div>

            </div>
          </div>

          {/* Social Proof Statistics */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-slate-800/80 rounded-[2.5rem] p-10 md:p-12 text-center relative overflow-hidden">
            
            {/* Soft decorative background circles */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[70px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[70px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
              
              <div className="space-y-1">
                <h4 className="text-3xl md:text-4xl font-black text-white">100K+</h4>
                <p className="text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">App Downloads</p>
              </div>

              <div className="space-y-1">
                <h4 className="text-3xl md:text-4xl font-black text-white">4.8★</h4>
                <p className="text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">Play Store Rating</p>
              </div>

              <div className="space-y-1">
                <h4 className="text-3xl md:text-4xl font-black text-white">50K+</h4>
                <p className="text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">Happy Travelers</p>
              </div>

              <div className="space-y-1">
                <h4 className="text-3xl md:text-4xl font-black text-white">24/7</h4>
                <p className="text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">Customer Support</p>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
