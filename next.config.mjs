/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Enable remote patterns for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        port: '',
        pathname: '/api/portraits/**',
      },
    ],
    // Image optimization formats - Next.js will automatically serve WebP/AVIF
    formats: ['image/avif', 'image/webp'],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Image qualities
    qualities: [75, 80],
    // Enable image optimization in production
    unoptimized: false,
  },
};

export default nextConfig;
