/**
 * Single source of truth for company identity (NAP = Name, Address, Phone).
 * Every page, footer, schema block and llms.txt must read from here so the
 * facts never contradict each other (Google + AI engines cross-check these).
 *
 * TODO (owner): fill streetAddress / addressLocality / postalCode with the
 * registered office exactly as it appears on the GST certificate.
 * GSTIN 10AAMCP7167L1Z1 -> state code 10 = Bihar. Do NOT put a different
 * state here unless the GST registration itself changes.
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
    founder: {
        name: "Yash Shah",
        role: "Founder & Director",
        slug: "yash-shah",
        linkedin: "https://www.linkedin.com/company/paymm/",
    },
    address: {
        streetAddress: "",          // e.g. "Flat 2B, Ganga Apartments, Boring Road"
        addressLocality: "",        // e.g. "Patna"
        addressRegion: "Bihar",
        postalCode: "",             // e.g. "800001"
        addressCountry: "IN",
    },
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
        founder: {
            "@type": "Person",
            "@id": `${COMPANY.url}/author/${COMPANY.founder.slug}#person`,
            name: COMPANY.founder.name,
            jobTitle: COMPANY.founder.role,
            url: `${COMPANY.url}/author/${COMPANY.founder.slug}`,
        },
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
export const SITE_LAST_UPDATED = "2026-09-06T00:00:00.000Z";
export const SITE_LAST_UPDATED_HUMAN = "6 September 2026";
