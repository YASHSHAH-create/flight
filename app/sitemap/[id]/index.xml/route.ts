import { NextResponse } from 'next/server';
import { AIRPORT_MAP } from '@/app/lib/airports';
import { BLOG_POSTS } from '@/app/lib/blog-data';
import { isRouteIndexable } from '@/app/lib/routeValidator';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const baseUrl = 'https://paymm.in';

    interface SitemapUrl {
        url: string;
        lastModified: string;
        changeFrequency: string;
        priority: number;
    }

    let urls: SitemapUrl[] = [];

    const airportKeys = Object.keys(AIRPORT_MAP);
    const domesticAirports = airportKeys.slice(0, 32);
    const internationalAirports = airportKeys.slice(32);

    switch (id) {
        case 'f-static':
            const staticRoutes = [
                '', '/about', '/contact', '/privacy',
                '/refund', '/terms', '/blog', '/packages', '/schedule', '/how-to-book-cheap-flights'
            ];
            urls = staticRoutes.map(route => ({
                url: `${baseUrl}${route}`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1.0 : 0.8
            }));
            break;

        case 'cf-misc': // Blogs
            urls = BLOG_POSTS.map(post => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
                changeFrequency: 'weekly',
                priority: 0.7
            }));
            break;

        case 'cf-a2b-dom':
            domesticAirports.forEach(from => {
                domesticAirports.forEach(to => {
                    if (from !== to && isRouteIndexable(from, to)) {
                        const fromCity = AIRPORT_MAP[from].city.toLowerCase().replace(/\s+/g, '-');
                        const toCity = AIRPORT_MAP[to].city.toLowerCase().replace(/\s+/g, '-');
                        urls.push({
                            url: `${baseUrl}/flights/${fromCity}-to-${toCity}`,
                            lastModified: new Date().toISOString(),
                            changeFrequency: 'daily',
                            priority: 0.9
                        });
                    }
                });
            });
            break;

        case 'cf-a2b-int-out':
            domesticAirports.forEach(from => {
                internationalAirports.forEach(to => {
                    if (isRouteIndexable(from, to)) {
                        const fromCity = AIRPORT_MAP[from].city.toLowerCase().replace(/\s+/g, '-');
                        const toCity = AIRPORT_MAP[to].city.toLowerCase().replace(/\s+/g, '-');
                        urls.push({
                            url: `${baseUrl}/flights/${fromCity}-to-${toCity}`,
                            lastModified: new Date().toISOString(),
                            changeFrequency: 'daily',
                            priority: 0.8
                        });
                    }
                });
            });
            break;

        case 'cf-a2b-int-in':
            internationalAirports.forEach(from => {
                domesticAirports.forEach(to => {
                    if (isRouteIndexable(from, to)) {
                        const fromCity = AIRPORT_MAP[from].city.toLowerCase().replace(/\s+/g, '-');
                        const toCity = AIRPORT_MAP[to].city.toLowerCase().replace(/\s+/g, '-');
                        urls.push({
                            url: `${baseUrl}/flights/${fromCity}-to-${toCity}`,
                            lastModified: new Date().toISOString(),
                            changeFrequency: 'daily',
                            priority: 0.8
                        });
                    }
                });
            });
            break;

        default:
            break;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastModified}</lastmod>
    <changefreq>${u.changeFrequency}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
