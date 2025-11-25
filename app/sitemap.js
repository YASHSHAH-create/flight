export default async function sitemap() {
    const baseUrl = 'https://paymm.in';

    // 1. Top Global Hubs for International Routes (Generating ~2500 routes)
    // Permutations of these 50 cities = 50 * 49 = 2450 routes
    const globalHubs = [
        'london', 'new-york', 'dubai', 'paris', 'singapore', 'hong-kong', 'tokyo', 'bangkok',
        'los-angeles', 'sydney', 'frankfurt', 'amsterdam', 'istanbul', 'doha', 'seoul',
        'kuala-lumpur', 'madrid', 'rome', 'barcelona', 'munich', 'toronto', 'vancouver',
        'san-francisco', 'chicago', 'miami', 'melbourne', 'auckland', 'beijing', 'shanghai',
        'guangzhou', 'taipei', 'manila', 'jakarta', 'bali', 'ho-chi-minh-city', 'hanoi',
        'milan', 'zurich', 'vienna', 'lisbon', 'moscow', 'sao-paulo', 'johannesburg',
        'cairo', 'riyadh', 'jeddah', 'abu-dhabi', 'kuwait', 'muscat', 'bahrain'
    ];

    const internationalRoutes = [];
    globalHubs.forEach(fromCity => {
        globalHubs.forEach(toCity => {
            if (fromCity !== toCity) {
                internationalRoutes.push(`${fromCity}-to-${toCity}`);
            }
        });
    });

    // 2. Comprehensive List of Indian Airports (~90 airports)
    // Permutations of 90 cities = 90 * 89 = ~8010 routes
    const indianCities = [
        // Metros
        'delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad',
        // Tier 1/2
        'ahmedabad', 'pune', 'goa', 'kochi', 'jaipur', 'lucknow', 'guwahati',
        'thiruvananthapuram', 'bhubaneswar', 'indore', 'chandigarh', 'patna',
        'visakhapatnam', 'nagpur', 'varanasi', 'srinagar', 'amritsar', 'coimbatore',
        'mangalore', 'ranchi', 'raipur', 'surat', 'vadodara', 'bagdogra',
        // Tier 3 / Regional
        'port-blair', 'tiruchirappalli', 'madurai', 'vijayawada', 'tirupati',
        'udaipur', 'jodhpur', 'dehradun', 'jammu', 'leh', 'imphal', 'agartala',
        'dimapur', 'aizawl', 'shillong', 'silchar', 'dibrugarh', 'jorhat', 'tezpur',
        'lakhimpur', 'gaya', 'darbhanga', 'rajkot', 'bhavnagar', 'jamnagar', 'bhuj',
        'kandla', 'porbandar', 'diu', 'nashik', 'shirdi', 'aurangabad', 'kolhapur',
        'belgaum', 'hubli', 'mysore', 'hampi', 'kannur', 'kozhikode', 'bhopal',
        'gwalior', 'jabalpur', 'khajuraho', 'shillong', 'pakyong', 'jaisalmer',
        'bikaner', 'kishangarh', 'gorakhpur', 'agra', 'kanpur', 'prayagraj',
        'bareilly', 'pantnagar', 'dharamshala', 'kullu', 'shimla'
    ];

    const domesticRoutes = [];
    indianCities.forEach(fromCity => {
        indianCities.forEach(toCity => {
            if (fromCity !== toCity) {
                domesticRoutes.push(`${fromCity}-to-${toCity}`);
            }
        });
    });

    // Combine all routes
    const allRoutes = [...internationalRoutes, ...domesticRoutes];

    const flightRoutes = allRoutes.map((route) => ({
        url: `${baseUrl}/flights/${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/about-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/refund-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms-conditions`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/booking-policy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...flightRoutes,
    ];
}
