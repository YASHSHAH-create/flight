import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // For Google profile images
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  // Security headers (applied to every route). CSP is intentionally not
  // enforced here yet: GTM/AdSense/Vercel Analytics inject inline scripts and
  // a strict policy would need per-script nonces first.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), payment=(self), usb=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        // Booking API: never cache, never embed.
        source: '/api/(bus|bus-auth)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/blogs',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/blogs/:path*',
        destination: '/blog/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const BASE_URL = 'https://api.paymm.in';
    const FLIGHT_API_URL = 'https://api.paymm.in/flight';
  
    return [
      {
        // Legacy flight-site proxy. The bus flow's own route handlers live under
        // /api/bus and /api/bus-auth and must never be forwarded upstream.
        source: '/api/:path((?!bus/|bus-auth/|bus$|bus-auth$).*)',
        destination: `${FLIGHT_API_URL}/api/:path`, // Proxy to Backend
      },
      {
        source: '/auth/:path*',
        destination: `${FLIGHT_API_URL}/auth/:path*`, // Proxy to Backend Auth
      },
      {
        source: '/flights/search',
        destination: `${FLIGHT_API_URL}/search`, // Proxy specifically to /flight/search
      },
      {
        source: '/flights/fare-quote',
        destination: `${FLIGHT_API_URL}/flights/fare-quote`,
      },
      {
        source: '/flights/fare-rule',
        destination: `${FLIGHT_API_URL}/flights/fare-rule`,
      },
      {
        source: '/flights/book',
        destination: `${FLIGHT_API_URL}/flights/book`,
      },
      {
        source: '/flights/ticket',
        destination: `${FLIGHT_API_URL}/flights/ticket`,
      },
      {
        source: '/flights/ssr',
        destination: `${FLIGHT_API_URL}/flights/ssr`,
      },
    ];
  },
};

export default nextConfig;
