import { COMPANY } from "./company";

export interface Author {
    slug: string;
    name: string;
    type: "Person" | "Organization";
    role: string;
    bio: string;
    sameAs: string[];
    /** Optional headshot in /public. Leave undefined until a real photo exists. */
    image?: string;
}

/**
 * Real, accountable authors only. Every blog post is attributed to one of
 * these. Pseudonymous names that previously existed in the data ("Beach Bum",
 * "Biker Boyz", ...) are mapped to the editorial team by resolveAuthor().
 */
export const AUTHORS: Record<string, Author> = {
    "yash-shah": {
        slug: "yash-shah",
        name: COMPANY.founder.name,
        type: "Person",
        role: COMPANY.founder.role + ", Paymm",
        bio:
            "Yash Shah is Team Leader at Paymm (PAYMM ADVISORY PRIVATE LIMITED), the company behind the Paymm flight, hotel and bus booking platform and app. He leads the product and operations team, works directly with airline and GDS partners on fare distribution, and writes about airfare pricing, booking strategy and the practical side of flying within India.",
        sameAs: [COMPANY.social.linkedin, COMPANY.social.x],
    },
    "paymm-editorial-team": {
        slug: "paymm-editorial-team",
        name: "Paymm Editorial Team",
        type: "Organization",
        role: "Travel research desk at Paymm",
        bio:
            "The Paymm Editorial Team researches and maintains our destination guides and flight route pages. Every article is fact-checked against airline schedules, airport operator websites and official tourism sources, and reviewed by Team Leader Yash Shah before publishing.",
        sameAs: [COMPANY.url + "/about", COMPANY.social.linkedin],
    },
};

export const DEFAULT_AUTHOR_SLUG = "paymm-editorial-team";

const NAME_TO_SLUG: Record<string, string> = Object.values(AUTHORS).reduce(
    (acc, a) => ({ ...acc, [a.name.toLowerCase()]: a.slug }),
    {} as Record<string, string>
);

/** Map any stored author string (including old pseudonyms) to a real author. */
export function resolveAuthor(name?: string | null): Author {
    const key = (name || "").trim().toLowerCase();
    const slug = NAME_TO_SLUG[key] || (key === "yash" || key === "yash shah" ? "yash-shah" : DEFAULT_AUTHOR_SLUG);
    return AUTHORS[slug];
}

export function authorUrl(a: Author) {
    return `${COMPANY.url}/author/${a.slug}`;
}

export function authorLd(a: Author) {
    return {
        "@type": a.type,
        "@id": `${authorUrl(a)}#${a.type === "Person" ? "person" : "org"}`,
        name: a.name,
        url: authorUrl(a),
        ...(a.type === "Person" ? { jobTitle: a.role } : {}),
        description: a.bio,
        sameAs: a.sameAs,
    };
}
