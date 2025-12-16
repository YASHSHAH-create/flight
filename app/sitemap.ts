import { MetadataRoute } from 'next';

const POPULAR_AIRPORTS = [
    // Major Indian Metros
    "DEL", "BOM", "BLR", "HYD", "MAA", "CCU", "AMD", "PNQ",

    // Popular Indian Tourist & Regional
    "GOI", "JAI", "SXR", "COK", "TRV", "IXC", "ATQ", "LKO", "VNS", "PAT", "BBI", "GAU", "IXB", "UDR", "JDH", "IXZ", "BDQ", "NAG", "IDR", "CJB", "IXE", "VTZ", "BHO", "RPR",

    // Famous International
    "DXB", "SIN", "BKK", "LHR", "JFK", "CDG", "HND", "HKG", "KUL", "IST", "DOH", "AUH", "AMS", "FRA", "MUC", "ZRH", "YYZ", "SFO", "MEL", "SYD", "MLE", "DPS", "HKT"
];

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
    ];

    const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Dynamic Search URLs (Programmatic SEO)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const d = tomorrow.getDate().toString().padStart(2, '0');
    const m = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const y = tomorrow.getFullYear();
    const validDateParam = `${d}${m}${y}`; // DDMMYYYY

    const dynamicEntries: MetadataRoute.Sitemap = [];

    // Generate routes only for High-value combinations to keep sitemap size reasonable but effective
    // We will prioritize: 
    // 1. Metros <-> Metros
    // 2. Metros <-> Tourist
    // 3. Metros <-> International

    const majorMetros = ["DEL", "BOM", "BLR", "HYD", "MAA", "CCU"];

    POPULAR_AIRPORTS.forEach(from => {
        POPULAR_AIRPORTS.forEach(to => {
            if (from !== to) {
                // Logic to filter "make sense" routes if list is too huge. 
                // For now, given the list size (~50), 50*50 = 2500, which is fine for Next.js sitemap.

                const searchUrl = `${baseUrl}/search?from=${from}&to=${to}&date=${validDateParam}&adults=1&children=0&infants=0&class=e&journeyType=1`;

                // Priority logic
                let priority = 0.5;
                if (majorMetros.includes(from) && majorMetros.includes(to)) priority = 0.9;
                else if (majorMetros.includes(from) || majorMetros.includes(to)) priority = 0.7;

                dynamicEntries.push({
                    url: searchUrl,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: priority,
                });
            }
        });
    });

    return [...staticEntries, ...dynamicEntries];
}
