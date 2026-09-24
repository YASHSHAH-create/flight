import { NextResponse } from 'next/server';
import { SITE_LAST_UPDATED } from '@/app/lib/company';

export async function GET() {
    const baseUrl = 'https://www.paymm.in';

    const sitemaps = [
        'f-static',
        'bus-routes',
        'cf-misc',
        'cf-a2b-dom',
        'cf-a2b-int-out',
        'cf-a2b-int-in'
    ];


    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(name => `  <sitemap>
    <loc>${baseUrl}/sitemap/${name}/index.xml</loc>
    <lastmod>${SITE_LAST_UPDATED}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
