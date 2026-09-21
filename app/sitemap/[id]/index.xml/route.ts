import { NextResponse } from 'next/server';
import { AIRPORT_MAP } from '@/app/lib/airports';
import { BLOG_POSTS } from '@/app/lib/blog-data';
import { getIndexableRoutes } from '@/app/lib/routeValidator';
import { SITE_LAST_UPDATED } from '@/app/lib/company';
import { AUTHORS } from '@/app/lib/authors';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const baseUrl = 'https://www.paymm.in';

    // lastmod comes from company.ts (SITE_LAST_UPDATED); bump it there when
    // page content meaningfully changes. Never use new Date() here.

    interface SitemapUrl {
        url: string;
        lastModified: string;
        changeFrequency: string;
        priority: number;
    }

    let urls: SitemapUrl[] = [];

    const airportKeys = Object.keys(AIRPORT_MAP);
    const domesticAirports = airportKeys.slice(0, 32);

    switch (id) {
        case 'f-static':
            const staticRoutes = [
                '', '/about', '/contact', '/privacy',
                '/refund', '/terms', '/blog', '/packages', '/schedule', '/how-to-book-cheap-flights',
                '/flights', '/downloads', '/cheapest-flight-booking-apps-india',
                ...Object.keys(AUTHORS).map(a => `/author/${a}`)
            ];
            urls = staticRoutes.map(route => ({
                url: `${baseUrl}${route}`,
                lastModified: SITE_LAST_UPDATED,
                changeFrequency: 'weekly',
                priority: route === '' ? 1.0 : 0.8
            }));
            break;

        case 'cf-misc': // Blogs
            urls = BLOG_POSTS.map(post => ({
                url: `${baseUrl}/blog/${post.slug}`,
                lastModified: post.date ? new Date(post.date).toISOString() : SITE_LAST_UPDATED,
                changeFrequency: 'weekly',
                priority: 0.7
            }));
            break;

        case 'cf-a2b-dom':
        case 'cf-a2b-int-out':
        case 'cf-a2b-int-in': {
            const isDom = (code: string) => domesticAirports.includes(code);
            urls = getIndexableRoutes()
                .filter(r => {
                    if (id === 'cf-a2b-dom') return isDom(r.origin) && isDom(r.dest);
                    if (id === 'cf-a2b-int-out') return isDom(r.origin) && !isDom(r.dest);
                    return !isDom(r.origin) && isDom(r.dest);
                })
                .map(r => ({
                    url: `${baseUrl}/flights/${r.slug}`,
                    lastModified: SITE_LAST_UPDATED,
                    changeFrequency: 'weekly',
                    priority: id === 'cf-a2b-dom' ? 0.9 : 0.8
                }));
            break;
        }

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
