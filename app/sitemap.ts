import { MetadataRoute } from 'next';
import { AIRPORT_MAP } from './lib/airports';
import { BLOG_POSTS } from './lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://paymm.in';

    // Static pages
    const routes = [
        '',
        '/about',
        '/book',
        '/bookings',
        '/contact',
        '/privacy',
        '/refund',
        '/search',
        '/terms',
        '/blog',
        '/packages',
        '/schedule',
        '/profile',
    ];

    const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Dynamic Blog Posts
    const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    // Dynamic Search URLs (SEO Friendly)
    const dynamicEntries: MetadataRoute.Sitemap = [];

    // High Priority: Metro to Metro
    const majorMetros = ["DEL", "BOM", "BLR", "HYD", "MAA", "CCU"];
    const popularAirports = Object.keys(AIRPORT_MAP); // All keys

    // To keep sitemap size reasonable (under 50k), we filter.
    // We have ~50 airports. 50*50 = 2500 entries. This is safe.

    popularAirports.forEach(fromCode => {
        popularAirports.forEach(toCode => {
            if (fromCode !== toCode) {
                const fromCity = AIRPORT_MAP[fromCode].city.toLowerCase().replace(/\s+/g, '-');
                const toCity = AIRPORT_MAP[toCode].city.toLowerCase().replace(/\s+/g, '-');

                // Construct clean URL: /flights/bangalore-to-dubai
                const cleanUrl = `${baseUrl}/flights/${fromCity}-to-${toCity}`;

                // Priority logic
                let priority = 0.5;
                if (majorMetros.includes(fromCode) && majorMetros.includes(toCode)) priority = 0.9;
                else if (majorMetros.includes(fromCode) || majorMetros.includes(toCode)) priority = 0.7;

                dynamicEntries.push({
                    url: cleanUrl,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: priority,
                });
            }
        });
    });

    return [...staticEntries, ...blogEntries, ...dynamicEntries];
}
