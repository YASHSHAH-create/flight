import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = 'https://paymm.in';

    const sitemaps = [
        'cf-a2b-freq',
        'cf-a2b-dom',
        'cf-a2b-int-out',
        'cf-a2b-int-in',
        'cf-a2b-int-int',
        'c-to-c',
        'f-a2b-by-airline',
        'f-airline',
        'f-airline-status',
        'f-static',
        't-train',
        't-station',
        't-static',
        't-train-running-status',
        't-train-seat-availability',
        'tp-a2b-freq-train',
        'tp-a2b-other-train',
        'o-static',
        'offers',
        'plan',
        'f-to-d',
        'fs-code',
        'cf-misc',
        'cf-search',
        'hotels-in-city',
        'hotels-detail',
        'airport-arrival-departure-status',
        'a2b-flight-status',
        'long-tail-flights'
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(name => `  <sitemap>
    <loc>${baseUrl}/sitemap/${name}/index.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
