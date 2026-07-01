import { AIRPORT_MAP } from './airports';

// 10 Tier 1 Hubs in India
export const TIER_1_HUBS = new Set([
    'DEL', 'BOM', 'BLR', 'HYD', 'MAA', 'CCU', 'PNQ', 'GOI', 'JAI', 'AMD'
]);

// Top 10 Tier 2 cities in India for tourism and business
export const TOP_TIER_2 = new Set([
    'COK', 'SXR', 'LKO', 'JDH', 'IXZ', 'IXC', 'ATQ', 'TRV', 'VNS', 'PAT'
]);

// Top 8 International destinations from India
export const TOP_INTERNATIONAL = new Set([
    'DXB', 'SIN', 'BKK', 'LHR', 'JFK', 'MLE', 'DPS', 'HKT'
]);

// Top Indian hubs for international flights
export const TOP_INDIAN_INT_HUBS = new Set([
    'DEL', 'BOM', 'BLR'
]);

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
 * SEO-worthy routes:
 * 1. Domestic route where both cities are domestic, and at least one is a Tier 1 Hub.
 * 2. Domestic route between a Tier 1 Hub and a Top Tier 2 city.
 * 3. International route connecting a Top Indian Int Hub (DEL, BOM, BLR) and a Top International destination.
 */
export function isRouteIndexable(originCode: string, destCode: string): boolean {
    if (!isRouteValid(originCode, destCode)) {
        return false;
    }

    const domesticAirports = Object.keys(AIRPORT_MAP).slice(0, 32);
    const isOriginDomestic = domesticAirports.includes(originCode);
    const isDestDomestic = domesticAirports.includes(destCode);

    // 1. Both domestic
    if (isOriginDomestic && isDestDomestic) {
        // If at least one is a Tier 1 Hub
        if (TIER_1_HUBS.has(originCode) || TIER_1_HUBS.has(destCode)) {
            return true;
        }
        // If one is Tier 1 and other is Tier 2 (redundant because Tier 1 covers it, but good to be explicit)
        if ((TIER_1_HUBS.has(originCode) && TOP_TIER_2.has(destCode)) || 
            (TOP_TIER_2.has(originCode) && TIER_1_HUBS.has(destCode))) {
            return true;
        }
        return false;
    }

    // 2. International connection
    // Indian top hub to top international destination
    if (TOP_INDIAN_INT_HUBS.has(originCode) && TOP_INTERNATIONAL.has(destCode)) {
        return true;
    }
    // Top international destination to Indian top hub
    if (TOP_INTERNATIONAL.has(originCode) && TOP_INDIAN_INT_HUBS.has(destCode)) {
        return true;
    }

    return false;
}
