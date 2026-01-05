export const SITE_KEYWORDS = [
    // Brand
    "Paymm", "paymm.in", "Paymm flights", "Paymm booking",

    // High Volume General
    "flight booking", "cheap flights", "book flight tickets", "online flight booking", "air tickets",
    "cheapest flight tickets", "airline tickets", "flight ticket booking", "domestic flights", "international flights",
    "cheap air tickets", "flight offers", "flight deals", "last minute flights", "budget flights",

    // Action Oriented
    "book flights online", "buy air tickets", "reserve flights", "flight ticket offers", "book plane tickets",
    "check flight prices", "compare flight prices", "flight schedule", "flight status", "pnr status",

    // Specific Low Cost/Deals
    "low cost airlines", "budget airlines", "discount flights", "promo code for flights", "cashback on flights",
    "student discount flights", "defence quota flights", "senior citizen flight offers", "corporate flight booking",

    // Indian Domestic Destinations (Permutations)
    "flights to Delhi", "flights to Mumbai", "flights to Bangalore", "flights to Goa", "flights to Pune",
    "flights to Kolkata", "flights to Hyderabad", "flights to Chennai", "flights to Ahmedabad", "flights to Jaipur",
    "Delhi to Mumbai flights", "Mumbai to Delhi flights", "Bangalore to Delhi flights", "Delhi to Bangalore flights",
    "Mumbai to Goa flights", "Delhi to Goa flights", "Bangalore to Goa flights", "Chennai to Delhi flights",
    "Hyderabad to Delhi flights", "Kolkata to Delhi flights", "Patna to Delhi flights", "Lucknow to Delhi flights",

    // International Destinations from India
    "flights to Dubai", "flights to Singapore", "flights to Bangkok", "flights to London", "flights to New York",
    "flights to Canada", "flights to Toronto", "flights to Bali", "flights to Thailand", "flights to Maldives",
    "Delhi to Dubai flights", "Mumbai to Dubai flights", "India to USA flights", "India to UK flights",

    // Airlines (India)
    "Indigo flight booking", "Air India booking", "Vistara flight booking", "SpiceJet booking", "Akasa Air booking",
    "Air India Express booking", "Indigo offers", "Air India offers",

    // Long Tail / Queries
    "how to book cheap flights", "best flight booking site", "cheapest airfare within India", "flight ticket price",
    "today flight price", "tomorrow flight price", "weekend flight deals", "business class flights", "economy class flights",
    "premium economy flights", "direct flights", "non-stop flights", "connecting flights",

    // Regional/Hindi variations (Hinglish)
    "sasta flight ticket", "flight ticket offers today", "hawai jahaz ticket", "plane ki ticket",

    // Detailed Variations
    "flight ticket booking mobile app", "instant flight booking", "refundable flights", "free cancellation flights",
    "modify flight booking", "web checkin", "flight baggage allowance", "extra baggage cost", "flight travel insurance",

    // Misspellings, Typos & Hinglish Variations
    "Paym", "Pymm", "Payam", "Pay mm", "Paymm app", "Paymm web", "Paym flight",
    "flite booking", "fligth booking", "filght booking", "flyt booking", "flt booking",
    "cheep flights", "cheap flts", "sasti flight", "sasta ticket", "kam price flight",
    "tikets", "tikits", "tickts", "tkt", "tkts", "air tikit", "air tkt",
    "boking", "buking", "bukning", "bookin",
    "airoplane ticket", "aroplane ticket", "plane ka ticket", "flight ka ticket",
    "flight ki ticket", "hawai jahaz ki ticket", "ticket price kya hai",
    "Delhi to Mumbai flt", "Mumbai to Delhi flt", "Goa flt",

    // Festivals & Occasion (High Traffic)
    "Diwali flight offers", "Holi flight booking", "Eid travel deals", "Christmas flight tickets",
    "New Year flight offers", "Summer vacation flights", "Winter holiday flights", "Honeymoon flight packages",
    "Durga Puja flights", "Chhath Puja flights",

    // Urgency & 'Tatkal' Style Queries
    "urgent flight booking", "tatkal flight ticket", "emergency air ticket", "same day flight booking",
    "immediate flight booking", "next day flight ticket", "aaj ki flight", "kal ki flight"
];

// Helper to generate even more if needed
// Dynamic Generation with Variations
export const cityVariations: Record<string, string[]> = {
    "Delhi": ["Dilli", "Dehli", "New Delhi", "Dlhi"],
    "Mumbai": ["Bombay", "Mumbi", "Mumbahi"],
    "Bangalore": ["Bengaluru", "Bangalor", "Banglore", "Blr"],
    "Hyderabad": ["Hydrabad", "Hyderbad", "Hyd"],
    "Chennai": ["Madras", "Chenai", "Chenn"],
    "Kolkata": ["Calcutta", "Kolkatta", "Kolkta"],
    "Ahmedabad": ["Ahemdabad", "Ahmdabad", "Amdavad"],
    "Pune": ["Poona", "Puna"],
    "Goa": ["Gowa"],
    "Jaipur": ["Jaypur", "Japur"]
};

export const baseCities = Object.keys(cityVariations);
const connectorWords = ["to", "se"]; // English 'to', Hindi 'se'
const ticketWords = ["flight", "flt", "ticket", "tkt", "ki ticket", "ka ticket"];

baseCities.forEach(origin => {
    baseCities.forEach(dest => {
        if (origin !== dest) {
            // Standard correct spelling
            SITE_KEYWORDS.push(`${origin} to ${dest} flight booking`);
            SITE_KEYWORDS.push(`cheap flights from ${origin} to ${dest}`);
            SITE_KEYWORDS.push(`${origin} to ${dest} air ticket price`);

            // Generate Misspelled/Hinglish Variations (Sampling to avoid array explosion, but here we can be generous)
            const originReview = [origin, ...cityVariations[origin]];
            const destReview = [dest, ...cityVariations[dest]];

            originReview.forEach(o => {
                destReview.forEach(d => {
                    // Don't duplicate the main correct one immediately above
                    if (o === origin && d === dest) return;

                    // 1. Basic "City to City" with typos
                    SITE_KEYWORDS.push(`${o} to ${d} flight`);

                    // 2. Hinglish "City se City"
                    SITE_KEYWORDS.push(`${o} se ${d} flight`);

                    // 3. Short forms / Typos
                    SITE_KEYWORDS.push(`${o} to ${d} flt`);
                    SITE_KEYWORDS.push(`${o} to ${d} tkt`);

                    // 4. Colloquial
                    SITE_KEYWORDS.push(`${o} se ${d} ki ticket`);
                    SITE_KEYWORDS.push(`${o} to ${d} cheap price`);
                });
            });
        }
    });
});

// International Routes (India Metros -> Major International Hubs)
const indianMetros = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Kolkata"];
const internationalHubs = ["Dubai", "Bangkok", "Singapore", "London", "Toronto", "New York", "Bali", "Maldives"];

indianMetros.forEach(origin => {
    internationalHubs.forEach(dest => {
        // Forward
        SITE_KEYWORDS.push(`${origin} to ${dest} flight`);
        SITE_KEYWORDS.push(`${origin} to ${dest} cheap tickets`);

        // Reverse (NRIs coming back)
        SITE_KEYWORDS.push(`${dest} to ${origin} flight`);
        SITE_KEYWORDS.push(`flights from ${dest} to ${origin}`);
    });
});


export const DEFAULT_SEO = {
    title: "Paymm - Book Cheap Flights & Air Tickets Online",
    description: "Find and book the cheapest flights with Paymm. Compare airline prices, get exclusive deals on air tickets for Indigo, Air India, Vistara & more. Best flight booking site in India.",
    siteUrl: "https://paymm.in",
    twitterHandle: "@paymm_in", // Assuming
};
