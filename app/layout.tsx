import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

import { SITE_KEYWORDS } from "@/app/lib/keywords";
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.paymm.in"),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/paymm.png", sizes: "192x192", type: "image/png" },
      { url: "/paymm.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/paymm.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  title: {
    default: "Paymm – Cheap Flight Tickets | Compare & Book Air Tickets Online",
    template: "%s | Paymm",
  },
  description:
    "Book cheap flight tickets with Paymm. Compare airline prices, find best deals on air tickets, and enjoy fast, secure flight booking online. Save up to 40% on flights.",
  keywords: SITE_KEYWORDS,
  applicationName: "Paymm",
  authors: [{ name: "Paymm", url: "https://www.paymm.in/about" }],
  creator: "Paymm",
  publisher: "Paymm",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.paymm.in",
    siteName: "Paymm",
    title: "Paymm – Cheap Flight Tickets | Compare & Book Air Tickets Online",
    description:
      "Book cheap flight tickets with Paymm. Compare airline prices, find best deals on air tickets, and enjoy fast, secure flight booking online.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Paymm Flight Booking - Compare and Book Cheap Flights",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@paymm_in",
    creator: "@paymm_in",
    title: "Paymm – Cheap Flight Tickets | Compare & Book Air Tickets Online",
    description:
      "Book cheap flight tickets with Paymm. Compare airline prices, find best deals on air tickets, and enjoy fast, secure flight booking online.",
    images: ["/og-image.jpg"],
  },
  // NOTE: Add your REAL Google Search Console verification token here.
  // The previous values were placeholders (fake), which do nothing.
  // verification: { google: "YOUR-GSC-VERIFICATION-TOKEN" },
  other: {
    "google-adsense-account": "ca-pub-5030260303252769",
  },
  category: "Travel",
};

import { AuthProvider } from "@/context/AuthContext";
import { SessionProvider } from "@/context/SessionContext";
import LoginModal from "./components/bus/LoginModal";
import Footer from "./components/Footer";
import Script from "next/script";
import AgentCapabilities from "./components/AgentCapabilities";
import { COMPANY, ORG_ID, organizationLd } from "@/app/lib/company";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Sitewide entity graph: Organization (single @id, referenced elsewhere) + WebSite.
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      organizationLd(),
      {
        "@type": "WebSite",
        "@id": `${COMPANY.url}/#website`,
        url: COMPANY.url,
        name: COMPANY.brand,
        publisher: { "@id": ORG_ID },
        inLanguage: "en-IN",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${COMPANY.url}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://pagead2.googlesyndication.com"
        />

        {/* AI Agent Discovery link tags */}
        <link rel="api-catalog" href="/.well-known/api-catalog" type="application/linkset+json" />
        <link rel="auth.md" href="/auth.md" type="text/markdown" />
        <link rel="agent-skills" href="/.well-known/agent-skills/index.json" type="application/json" />
        <link rel="oauth-protected-resource" href="/.well-known/oauth-protected-resource" type="application/json" />

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5030260303252769"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${jakarta.variable} font-sans antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NMRKWWWX"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>



        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-NMRKWWWX');
          `}
        </Script>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-33PDDT6135"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-33PDDT6135', {
              page_path: window.location.pathname,
              anonymize_ip: true
            });
          `}
        </Script>

        <AuthProvider>
          <SessionProvider>
          <LoginModal />
          {children}
          <AgentCapabilities />
                  </SessionProvider>
        </AuthProvider>
        <Footer />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}