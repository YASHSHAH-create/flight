
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
   

      <main className="pt-12 md:pt-36 pb-24 overflow-hidden relative">
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
