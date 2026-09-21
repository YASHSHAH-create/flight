/**
 * Single source of truth for company identity (NAP = Name, Address, Phone).
 * Every page, footer, schema block and llms.txt must read from here so the
 * facts never contradict each other (Google + AI engines cross-check these).
 *
 * Address, directors and GSTIN are copied verbatim from Form GST REG-06
 * (registration certificate dated 14/10/2025). Do not change them unless the
 * GST registration itself changes.
 */
export const COMPANY = {
    brand: "Paymm",
    legalName: "PAYMM ADVISORY PRIVATE LIMITED",
    gstin: "10AAMCP7167L1Z1",
    url: "https://www.paymm.in",
    logo: "https://www.paymm.in/paymm.png",
    ogImage: "https://www.paymm.in/og-image.jpg",
    email: "support@paymm.in",
    phoneDisplay: "+91 93433 00271",
    phoneE164: "+91-9343300271",
    phoneTel: "+919343300271",
    founded: "2025",
    gstRegisteredOn: "2025-10-14",
    /** Site owner / lead author. Not a registered director (see directors below). */
    founder: {
        name: "Yash Shah",
        role: "Team Leader",
        slug: "yash-shah",
        linkedin: "https://www.linkedin.com/company/paymm/",
    },
    /** Directors as listed in Annexure B of the GST registration certificate. */
    directors: [
        { name: "Akash Kashyap", role: "Director" },
        { name: "Niki Kumari", role: "Director" },
    ],
    address: {
        streetAddress: "2nd Floor, Ranjan Galaxy, Main Road Karbigahiya, Near Nutan Apartment, New Karbigahiya",
        addressLocality: "Patna",
        addressRegion: "Bihar",
        postalCode: "800020",
        addressCountry: "IN",
    },
    /** Approximate map centre for the registered office (Karbigahiya, Patna). */
    geo: { latitude: 25.6023, longitude: 85.1516 },
    // ONE consistent support statement, used everywhere.
    support: {
        phoneHours: "Mon–Sat, 9:00 AM – 6:00 PM IST",
        emailHours: "Email support is monitored 7 days a week; we reply within 24 hours.",
        summary: "Phone support Mon–Sat, 9 AM – 6 PM IST · Email support 7 days a week",
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "09:00",
            closes: "18:00",
        },
    },
    social: {
        instagram: "https://www.instagram.com/paymm_bookings/",
        linkedin: "https://www.linkedin.com/company/paymm/",
        x: "https://x.com/paymm_in",
        xHandle: "@paymm_in",
        playStore: "https://play.google.com/store/apps/details?id=in.paymm.app",
        appStore: "https://apps.apple.com/app/id6780256299",
    },
} as const;

/** Human-readable address line built only from the fields that are filled. */
export function formatAddress(): string {
    const a = COMPANY.address;
    return [a.streetAddress, a.addressLocality, a.addressRegion, a.postalCode]
        .filter(Boolean)
        .join(", ") + ", India";
}

/** schema.org PostalAddress with empty fields omitted. */
export function postalAddressLd() {
    const a = COMPANY.address;
    const out: Record<string, string> = { "@type": "PostalAddress" };
    if (a.streetAddress) out.streetAddress = a.streetAddress;
    if (a.addressLocality) out.addressLocality = a.addressLocality;
    out.addressRegion = a.addressRegion;
    if (a.postalCode) out.postalCode = a.postalCode;
    out.addressCountry = a.addressCountry;
    return out;
}

export const SAME_AS = [
    COMPANY.social.instagram,
    COMPANY.social.linkedin,
    COMPANY.social.x,
    COMPANY.social.playStore,
    COMPANY.social.appStore,
];

/**
 * Sitewide Organization entity. Emitted once in the root layout; other pages
 * reference it by @id instead of repeating it (avoids duplicate entities).
 */
export const ORG_ID = `${COMPANY.url}/#organization`;

export function organizationLd() {
    return {
        "@type": ["Organization", "TravelAgency"],
        "@id": ORG_ID,
        name: COMPANY.brand,
        legalName: COMPANY.legalName,
        alternateName: "PayMM",
        taxID: COMPANY.gstin,
        vatID: COMPANY.gstin,
        url: COMPANY.url,
        logo: { "@type": "ImageObject", url: COMPANY.logo, width: 512, height: 512 },
        image: COMPANY.ogImage,
        description:
            "Paymm is an Indian online travel agency for comparing and booking cheap domestic and international flight tickets, hotels and bus tickets.",
        foundingDate: COMPANY.founded,
        employee: [
            {
                "@type": "Person",
                "@id": `${COMPANY.url}/author/${COMPANY.founder.slug}#person`,
                name: COMPANY.founder.name,
                jobTitle: COMPANY.founder.role,
                url: `${COMPANY.url}/author/${COMPANY.founder.slug}`,
            },
            ...COMPANY.directors.map(d => ({ "@type": "Person", name: d.name, jobTitle: d.role })),
        ],
        geo: { "@type": "GeoCoordinates", latitude: COMPANY.geo.latitude, longitude: COMPANY.geo.longitude },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.legalName + ", Ranjan Galaxy, Karbigahiya, Patna 800020")}`,
        telephone: COMPANY.phoneE164,
        email: COMPANY.email,
        address: postalAddressLd(),
        areaServed: "IN",
        currenciesAccepted: "INR",
        priceRange: "₹₹",
        openingHoursSpecification: COMPANY.support.openingHoursSpecification,
        contactPoint: [
            {
                "@type": "ContactPoint",
                telephone: COMPANY.phoneE164,
                email: COMPANY.email,
                contactType: "customer service",
                areaServed: "IN",
                availableLanguage: ["English", "Hindi"],
                hoursAvailable: COMPANY.support.openingHoursSpecification,
            },
        ],
        sameAs: SAME_AS,
    };
}

/** Bump whenever site-wide content meaningfully changes (used by sitemaps). */
export const SITE_LAST_UPDATED = "2026-09-21T00:00:00.000Z";
export const SITE_LAST_UPDATED_HUMAN = "21 September 2026";

/**
 * Flight pricing rules of the Paymm app (rn app: utils/flight-details/calculateTotal.ts).
 * Quoted on the comparison page and in llms.txt — change them here AND in
 * public/llms.txt whenever the app's fare rules change, so the site never
 * advertises a number the checkout does not honour.
 */
export const PAYMM_FLIGHT_PRICING = {
    convenienceFeePerPassenger: 150,
    instantDiscountPerBooking: 200,
} as const;
