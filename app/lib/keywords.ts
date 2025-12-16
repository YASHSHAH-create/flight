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
    "modify flight booking", "web checkin", "flight baggage allowance", "extra baggage cost", "flight travel insurance"
];

// Helper to generate even more if needed
const cities = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Pune", "Goa", "Jaipur"];
cities.forEach(origin => {
    cities.forEach(dest => {
        if (origin !== dest) {
            SITE_KEYWORDS.push(`${origin} to ${dest} flight booking`);
            SITE_KEYWORDS.push(`cheap flights from ${origin} to ${dest}`);
            SITE_KEYWORDS.push(`${origin} to ${dest} air ticket price`);
        }
    });
});

export const DEFAULT_SEO = {
    title: "Paymm - Book Cheap Flights & Air Tickets Online",
    description: "Find and book the cheapest flights with Paymm. Compare airline prices, get exclusive deals on air tickets for Indigo, Air India, Vistara & more. Best flight booking site in India.",
    siteUrl: "https://paymm.in",
    twitterHandle: "@paymm_in", // Assuming
};
