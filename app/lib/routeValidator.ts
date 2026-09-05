import { AIRPORT_MAP } from './airports';
import { DETAILED_PROFILE_CODES } from './routeContentGenerator';

// 10 Tier 1 Hubs in India (used for labelling on the /flights hub page)
export const TIER_1_HUBS = new Set([
    'DEL', 'BOM', 'BLR', 'HYD', 'MAA', 'CCU', 'PNQ', 'GOI', 'JAI', 'AMD'
]);

/**
 * Curated list of routes that are allowed into Google's index.
 *
 * Why an allowlist: Search Console showed ~1,950 route URLs "Crawled –
 * currently not indexed" because hundreds of near-identical template pages
 * were open to indexing. Google (and AdSense's "low value content" review)
 * treat that as thin/scaled content. Only routes with real search demand
 * are indexed now; every other valid route still renders, but as
 * noindex,follow so it passes link equity without diluting the index.
 *
 * Each entry is an unordered pair; both directions are indexable.
 * Both endpoints MUST also have a hand-written city profile
 * (routeContentGenerator.CITY_PROFILES) or the pair is ignored.
 */
const PRIORITY_PAIRS: [string, string][] = [
    // Metro trunk routes (highest volume in India)
    ['DEL', 'BOM'], ['DEL', 'BLR'], ['DEL', 'HYD'], ['DEL', 'MAA'], ['DEL', 'CCU'],
    ['BOM', 'BLR'], ['BOM', 'HYD'], ['BOM', 'MAA'], ['BOM', 'CCU'],
    ['BLR', 'HYD'], ['BLR', 'MAA'], ['BLR', 'CCU'], ['HYD', 'MAA'], ['HYD', 'CCU'], ['MAA', 'CCU'],
    // Leisure + secondary hubs
    ['DEL', 'GOI'], ['BOM', 'GOI'], ['BLR', 'GOI'], ['HYD', 'GOI'], ['PNQ', 'GOI'], ['AMD', 'GOI'],
    ['DEL', 'PNQ'], ['BLR', 'PNQ'], ['HYD', 'PNQ'],
    ['DEL', 'AMD'], ['BOM', 'AMD'], ['BLR', 'AMD'],
    ['DEL', 'JAI'], ['BOM', 'JAI'], ['BLR', 'JAI'],
    ['DEL', 'SXR'], ['BOM', 'SXR'],
    ['DEL', 'COK'], ['BOM', 'COK'], ['BLR', 'COK'], ['MAA', 'COK'],
    ['BOM', 'TRV'], ['BLR', 'TRV'],
    ['DEL', 'JDH'],
    // Routes with measured Search Console demand (Sep 2026)
    ['BOM', 'NAG'], ['PNQ', 'NAG'], ['DEL', 'NAG'],
    ['BOM', 'IDR'], ['PNQ', 'IDR'], ['DEL', 'IDR'],
    ['HYD', 'BDQ'], ['DEL', 'BDQ'],
    ['BOM', 'PAT'], ['DEL', 'PAT'], ['BLR', 'PAT'], ['CCU', 'PAT'],
    ['MAA', 'VNS'], ['DEL', 'VNS'], ['BOM', 'VNS'], ['HYD', 'VNS'],
    ['DEL', 'GAU'], ['CCU', 'GAU'], ['BOM', 'GAU'],
    ['DEL', 'LKO'], ['BOM', 'LKO'], ['BLR', 'LKO'],
    ['MAA', 'IXZ'], ['CCU', 'IXZ'], ['DEL', 'IXZ'],
    // International (top outbound demand from India)
    ['DEL', 'DXB'], ['BOM', 'DXB'], ['BLR', 'DXB'], ['COK', 'DXB'], ['HYD', 'DXB'],
    ['DEL', 'SIN'], ['BOM', 'SIN'], ['BLR', 'SIN'], ['MAA', 'SIN'],
    ['DEL', 'BKK'], ['BOM', 'BKK'], ['BLR', 'BKK'], ['CCU', 'BKK'],
    ['DEL', 'LHR'], ['BOM', 'LHR'],
    ['DEL', 'JFK'], ['BOM', 'JFK'],
    ['BOM', 'MLE'], ['BLR', 'MLE'], ['COK', 'MLE'], ['DEL', 'MLE'],
    ['DEL', 'DPS'], ['DEL', 'HKT'], ['BOM', 'HKT'],
];

const pairKey = (a: string, b: string) => (a < b ? `${a}-${b}` : `${b}-${a}`);
const PRIORITY_KEYS = new Set(PRIORITY_PAIRS.map(([a, b]) => pairKey(a, b)));

/**
 * Validates if the origin and destination codes are valid and different.
 */
export function isRouteValid(originCode: string, destCode: string): boolean {
    if (!originCode || !destCode || originCode === destCode) {
        return false;
    }
    return originCode in AIRPORT_MAP && destCode in AIRPORT_MAP;
}

/**
 * Determines if a route is indexable / SEO-worthy.
 * A route is indexed only when it is on the curated priority list AND both
 * endpoints have a hand-written city profile. Everything else renders as
 * noindex,follow.
 */
export function isRouteIndexable(originCode: string, destCode: string): boolean {
    if (!isRouteValid(originCode, destCode)) {
        return false;
    }
    if (!DETAILED_PROFILE_CODES.has(originCode) || !DETAILED_PROFILE_CODES.has(destCode)) {
        return false;
    }
    return PRIORITY_KEYS.has(pairKey(originCode, destCode));
}

export const citySlug = (city: string) => city.toLowerCase().replace(/\s+/g, '-');

export function routeSlug(originCode: string, destCode: string): string {
    return `${citySlug(AIRPORT_MAP[originCode].city)}-to-${citySlug(AIRPORT_MAP[destCode].city)}`;
}

/** Every indexable route, in priority order (used by sitemaps & hub page). */
export function getIndexableRoutes(): { origin: string; dest: string; slug: string; name: string }[] {
    const out: { origin: string; dest: string; slug: string; name: string }[] = [];
    for (const [a, b] of PRIORITY_PAIRS) {
        for (const [o, d] of [[a, b], [b, a]] as [string, string][]) {
            if (isRouteIndexable(o, d)) {
                out.push({
                    origin: o,
                    dest: d,
                    slug: routeSlug(o, d),
                    name: `${AIRPORT_MAP[o].city} to ${AIRPORT_MAP[d].city}`,
                });
            }
        }
    }
    return out;
}

/** Top routes linked from the sitewide footer so no priority page is an orphan. */
export const FOOTER_ROUTES: { slug: string; name: string }[] = [
    ['DEL', 'BOM'], ['BOM', 'DEL'], ['DEL', 'BLR'], ['BOM', 'BLR'], ['DEL', 'HYD'],
    ['BOM', 'GOI'], ['DEL', 'GOI'], ['BOM', 'NAG'], ['PNQ', 'IDR'], ['PAT', 'BOM'],
    ['MAA', 'VNS'], ['LKO', 'BOM'], ['DEL', 'GAU'], ['DEL', 'DXB'], ['BOM', 'DXB'],
    ['DEL', 'SIN'], ['DEL', 'BKK'], ['DEL', 'LHR'],
].map(([o, d]) => ({ slug: routeSlug(o, d), name: `${AIRPORT_MAP[o].city} to ${AIRPORT_MAP[d].city}` }));
