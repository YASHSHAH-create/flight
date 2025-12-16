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
        source: '/flights/:path*',
        destination: `${API_URL}/:path*`, // Proxy other flight requests to root endpoints
      },
    ];
  },
};

export default nextConfig;
