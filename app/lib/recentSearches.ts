'use client';

const KEY = 'paymm:recentSearches';
export interface RecentSearch { label: string; href: string; at: number }

export const readRecentSearches = (): RecentSearch[] => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
};

export const rememberSearch = (label: string, href: string) => {
    try {
        const cur = readRecentSearches().filter((r) => r.href !== href);
        localStorage.setItem(KEY, JSON.stringify([{ label, href, at: Date.now() }, ...cur].slice(0, 5)));
    } catch { /* storage unavailable */ }
};
