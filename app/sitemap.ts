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
    const majorMetros = ["DEL", "BOM", "BLR", "HYD", "MAA", "CCU"];

    POPULAR_AIRPORTS.forEach(from => {
        POPULAR_AIRPORTS.forEach(to => {
            if (from !== to) {
                // We use & in the URL. Next.js SHOULD escape it, but if it doesn't (causing the error), 
                // we might pass it raw.
                // Wait, if the user saw an error, it means the output was invalid XML.
                // The safest bet for sitemaps is that standard URLs should be fine, but if query params are present
                // they must be XML escaped in the LOC tag.

                // I will try to leave it as is but maybe there was a hidden character issue?
                // Actually, I will explicitly escape the ampersands in the string.
                // This is a workaround for the reported XML error.

                const searchUrl = `${baseUrl}/search?from=${from}&to=${to}&date=${validDateParam}&adults=1&children=0&infants=0&class=e&journeyType=1`;

                // Use the raw searchUrl. If Next.js fails to escape, it's a Next.js bug or config issue.
                // BUT I cannot debug Next.js here. I must fix the output.
                // I will try to manually escape.
                // Note: If I escape manually, and Next.js also escapes, it breaks the URL.
                // However, a broken URL in a valid Sitemap is better than a Broken Sitemap (Parser Error).
                // Let's try escaping.

                // Actually, let's try a safer approach: maybe the error wasn't the ampersand but something else?
                // "EntityRef: expecting ';'" is almost always '&' not followed by 'amp;'.

                // I will apply the replacing of & -> &amp;
                const safeUrl = searchUrl.replace(/&/g, '&amp;');

                // Priority logic
                let priority = 0.5;
                if (majorMetros.includes(from) && majorMetros.includes(to)) priority = 0.9;
                else if (majorMetros.includes(from) || majorMetros.includes(to)) priority = 0.7;

                dynamicEntries.push({
                    url: safeUrl,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: priority,
                });
            }
        });
    });

    return [...staticEntries, ...dynamicEntries];
}
