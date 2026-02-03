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
  async rewrites() {
    const API_URL = 'https://api.paymm.in';
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`, // Proxy to Backend
      },
      {
        source: '/auth/:path*',
        destination: `${API_URL}/auth/:path*`, // Proxy to Backend Auth
      },
      {
        source: '/flights/search',
        destination: `${API_URL}/search`, // Proxy specifically to /search
      },
      {
        source: '/flights/fare-quote',
        destination: `${API_URL}/flights/fare-quote`,
      },
      {
        source: '/flights/fare-rule',
        destination: `${API_URL}/flights/fare-rule`,
      },
      {
        source: '/flights/book',
        destination: `${API_URL}/flights/book`,
      },
      {
        source: '/flights/ticket',
        destination: `${API_URL}/flights/ticket`,
      },
      {
        source: '/flights/ssr',
        destination: `${API_URL}/flights/ssr`,
      },
    ];
  },
};

export default nextConfig;
