import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = 'https://www.paymm.in';

    const sitemaps = [
        'f-static',
        'cf-misc',
        'cf-a2b-dom',
        'cf-a2b-int-out',
        'cf-a2b-int-in'
    ];

    // Keep lastmod stable between deploys — bump when content meaningfully changes.
    const SITE_LAST_UPDATED = '2026-08-13T00:00:00.000Z';

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
