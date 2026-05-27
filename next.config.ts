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
        source: '/api/:path*',
        destination: `${FLIGHT_API_URL}/api/:path*`, // Proxy to Backend
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
