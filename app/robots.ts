import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/bookings/'], // Disallow private paths
        },
        sitemap: 'https://paymm.in/sitemap.xml',
    };
}
