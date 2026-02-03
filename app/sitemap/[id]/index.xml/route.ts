import { NextResponse } from 'next/server';
import { AIRPORT_MAP } from '@/app/lib/airports';
import { BLOG_POSTS } from '@/app/lib/blog-data';

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

    // Function to create a simple mock entry
    const addMockEntry = (path: string, priority = 0.6) => {
        urls.push({
            url: `${baseUrl}${path}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly',
            priority
        });
    };

    switch (id) {
        case 'f-static':
            const staticRoutes = [
                '', '/about', '/book', '/bookings', '/contact', '/privacy',
                '/refund', '/search', '/terms', '/blog', '/packages', '/schedule', '/profile'
            ];
            urls = staticRoutes.map(route => ({
                url: `${baseUrl}${route}`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'weekly',
                priority: 0.8
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
                    if (from !== to) {
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
                    const fromCity = AIRPORT_MAP[from].city.toLowerCase().replace(/\s+/g, '-');
                    const toCity = AIRPORT_MAP[to].city.toLowerCase().replace(/\s+/g, '-');
                    urls.push({
                        url: `${baseUrl}/flights/${fromCity}-to-${toCity}`,
                        lastModified: new Date().toISOString(),
                        changeFrequency: 'daily',
                        priority: 0.8
                    });
                });
            });
            break;

        case 'cf-a2b-int-in':
            internationalAirports.forEach(from => {
                domesticAirports.forEach(to => {
                    const fromCity = AIRPORT_MAP[from].city.toLowerCase().replace(/\s+/g, '-');
                    const toCity = AIRPORT_MAP[to].city.toLowerCase().replace(/\s+/g, '-');
                    urls.push({
                        url: `${baseUrl}/flights/${fromCity}-to-${toCity}`,
                        lastModified: new Date().toISOString(),
                        changeFrequency: 'daily',
                        priority: 0.8
                    });
                });
            });
            break;

        case 'cf-a2b-int-int':
            internationalAirports.forEach(from => {
                internationalAirports.forEach(to => {
                    if (from !== to) {
                        const fromCity = AIRPORT_MAP[from].city.toLowerCase().replace(/\s+/g, '-');
                        const toCity = AIRPORT_MAP[to].city.toLowerCase().replace(/\s+/g, '-');
                        urls.push({
                            url: `${baseUrl}/flights/${fromCity}-to-${toCity}`,
                            lastModified: new Date().toISOString(),
                            changeFrequency: 'daily',
                            priority: 0.6
                        });
                    }
                });
            });
            break;

        case 'cf-a2b-freq':
            // Top frequent routes (Mock subset)
            domesticAirports.slice(0, 5).forEach(from => {
                domesticAirports.slice(5, 10).forEach(to => {
                    const fromCity = AIRPORT_MAP[from].city.toLowerCase().replace(/\s+/g, '-');
                    const toCity = AIRPORT_MAP[to].city.toLowerCase().replace(/\s+/g, '-');
                    addMockEntry(`/flights/popular/${fromCity}-to-${toCity}`, 0.9);
                });
            });
            break;

        case 'c-to-c':
            // General city to city connections
            addMockEntry('/routes/delhi-mumbai');
            addMockEntry('/routes/bangalore-chennai');
            break;

        case 'f-a2b-by-airline':
            // Flights by airline
            ['indigo', 'air-india', 'vistara', 'spicejet'].forEach(airline => {
                addMockEntry(`/flights/${airline}/delhi-to-mumbai`);
            });
            break;

        case 'f-airline':
            ['indigo', 'air-india', 'vistara', 'spicejet', 'akasa'].forEach(airline => {
                addMockEntry(`/airlines/${airline}`, 0.8);
            });
            break;

        case 'f-airline-status':
            ['indigo', 'air-india', 'vistara'].forEach(airline => {
                addMockEntry(`/flight-status/${airline}`, 0.7);
            });
            break;

        case 't-train':
            // Dummy trains
            [12301, 12302, 12951, 12952, 22435, 22436].forEach(train => {
                addMockEntry(`/trains/train-${train}`, 0.8);
            });
            break;

        case 't-station':
            ['NDLS', 'BCT', 'HWH', 'MAS', 'SBC'].forEach(stn => {
                addMockEntry(`/trains/station/${stn}`, 0.8);
            });
            break;

        case 't-static':
            ['pnr-status', 'train-running-status', 'seat-availability', 'train-between-stations'].forEach(page => {
                addMockEntry(`/trains/${page}`, 0.9);
            });
            break;

        case 't-train-running-status':
            addMockEntry('/trains/running-status/12301');
            addMockEntry('/trains/running-status/12951');
            break;

        case 't-train-seat-availability':
            addMockEntry('/trains/seat-availability/12301');
            break;

        case 'tp-a2b-freq-train':
            addMockEntry('/trains/routes/new-delhi-to-mumbai');
            addMockEntry('/trains/routes/bangalore-to-mysore');
            break;

        case 'tp-a2b-other-train':
            addMockEntry('/trains/routes/local-routes');
            break;

        case 'o-static':
            ['about-us', 'contact-us', 'careers', 'press'].forEach(p => addMockEntry(`/${p}`));
            break;

        case 'offers':
            ['flight-offers', 'train-offers', 'hotel-offers', 'bank-offers'].forEach(o => addMockEntry(`/offers/${o}`));
            break;

        case 'plan':
            ['weekend-getaways', 'honeymoon-destinations', 'religious-places'].forEach(p => addMockEntry(`/plan/${p}`));
            break;

        case 'f-to-d':
            domesticAirports.slice(0, 10).forEach(to => {
                const toCity = AIRPORT_MAP[to].city.toLowerCase().replace(/\s+/g, '-');
                addMockEntry(`/flights/to-${toCity}`);
            });
            break;

        case 'fs-code':
            addMockEntry('/flight-status/code/6E-202');
            break;

        case 'cf-search':
            addMockEntry('/search/flights');
            addMockEntry('/search/trains');
            addMockEntry('/search/hotels');
            break;

        case 'hotels-in-city':
            domesticAirports.slice(0, 20).forEach(code => {
                const city = AIRPORT_MAP[code].city.toLowerCase().replace(/\s+/g, '-');
                addMockEntry(`/hotels/in-${city}`, 0.8);
            });
            break;

        case 'hotels-detail':
            addMockEntry('/hotels/detail/taj-mahal-palace-mumbai');
            addMockEntry('/hotels/detail/the-leela-palace-new-delhi');
            break;

        case 'airport-arrival-departure-status':
            domesticAirports.slice(0, 10).forEach(code => {
                addMockEntry(`/airport-status/${code}`, 0.7);
            });
            break;

        case 'a2b-flight-status':
            addMockEntry('/flight-status/del-bom');
            break;

        case 'long-tail-flights':
            addMockEntry('/flights/cheap-flights-under-2000');
            addMockEntry('/flights/last-minute-flights');
            break;

        default:
            // Fallback for any missed ID
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
