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
    ],
  },
  async rewrites() {
    const API_URL = 'https://api.paymm.in';
    return [
      {
        source: '/api/proxy/flights/:path*',
        destination: `${API_URL}/flights/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${API_URL}/api/:path*`, // Proxy to Backend
      },
      {
        source: '/auth/:path*',
        destination: `${API_URL}/auth/:path*`, // Proxy to Backend Auth
      },
      {
        source: '/flights/:path*',
        destination: `${API_URL}/flights/:path*`, // Proxy to Backend Flights
      },
    ];
  },
};

export default nextConfig;
