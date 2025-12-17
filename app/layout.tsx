import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { SITE_KEYWORDS } from "@/app/lib/keywords";
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://paymm.in"),
  icons: {
    icon: "/favicon.ico",
  },
  title: {
    default: "Paymm - Book Cheap Flights & Air Tickets Online",
    template: "%s | Paymm",
  },
  description:
    "Find and book the cheapest flights with Paymm. Compare airline prices, get exclusive deals on air tickets, and enjoy a seamless flight booking experience. Best flight booking offers in India.",
  keywords: SITE_KEYWORDS,
  applicationName: "Paymm",
  authors: [{ name: "Paymm Team", url: "https://paymm.in" }],
  creator: "Paymm",
  publisher: "Paymm",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://paymm.in",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://paymm.in",
    siteName: "Paymm",
    title: "Paymm - Book Cheap Flights & Air Tickets Online",
    description:
      "Find and book the cheapest flights with Paymm. Compare airline prices, get exclusive deals on air tickets.",
    images: [
      {
        url: "/og-image.jpg", // Ensure this exists or fallback
        width: 1200,
        height: 630,
        alt: "Paymm Flight Booking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paymm - Book Cheap Flights & Air Tickets Online",
    description:
      "Find and book the cheapest flights with Paymm. Compare airline prices, get exclusive deals on air tickets.",
    creator: "@paymm_in",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "f08c47fec0942fa0", // Adds the verification code from ads.txt if needed as meta, or typically separate console verification
  },
  other: {
    "google-adsense-account": "ca-pub-5030260303252769",
  },
};

import SmoothScrolling from "./components/SmoothScrolling";
import { AuthProvider } from "@/context/AuthContext";
import Footer from "./components/Footer";


import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-33PDDT6135"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-33PDDT6135');
          `}
        </Script>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5030260303252769"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <SmoothScrolling />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
