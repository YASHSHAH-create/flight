'use client';
/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */

import type { BusDraft } from './types';

/** Browser helpers: same-origin JSON calls + the per-tab booking draft. */

export class ApiError extends Error {
    status: number;
    field?: string;
    constructor(message: string, status: number, field?: string) { super(message); this.status = status; this.field = field; }
}

export async function api<T = any>(path: string, init?: { method?: 'GET' | 'POST'; body?: unknown; signal?: AbortSignal }): Promise<T> {
    const res = await fetch(path, {
        method: init?.method || (init?.body ? 'POST' : 'GET'),
        headers: init?.body ? { 'Content-Type': 'application/json' } : undefined,
        body: init?.body ? JSON.stringify(init.body) : undefined,
        credentials: 'same-origin',
        signal: init?.signal,
    });
    let data: any = null;
    try { data = await res.json(); } catch { data = null; }
    if (!res.ok) throw new ApiError((data && data.message) || `Request failed (${res.status})`, res.status, data?.field);
    return data as T;
}

const DRAFT_KEY = 'paymm:bus:draft:v1';
const DRAFT_TTL = 25 * 60 * 1000; // supplier TraceIds are short-lived

export const draftStore = {
    load(): BusDraft | null {
        try {
            const raw = sessionStorage.getItem(DRAFT_KEY);
            if (!raw) return null;
            const d = JSON.parse(raw) as BusDraft;
            if (!d || !d.traceId || Date.now() - (d.createdAt || 0) > DRAFT_TTL) { sessionStorage.removeItem(DRAFT_KEY); return null; }
            return d;
        } catch { return null; }
    },
    save(d: BusDraft) {
        try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ ...d, createdAt: d.createdAt || Date.now() })); } catch { /* private mode */ }
    },
    update(patch: Partial<BusDraft>) {
        const cur = this.load();
        if (!cur) return null;
        const next = { ...cur, ...patch };
        this.save(next);
        return next;
    },
    clear() { try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ } },
};

export const fmtINR = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export const fmtTime = (iso: string) => {
    const m = /T(\d{2}):(\d{2})/.exec(iso || '');
    if (m) return `${m[1]}:${m[2]}`;
    const t = /^(\d{2}):(\d{2})/.exec(iso || '');
    return t ? `${t[1]}:${t[2]}` : '--:--';
};

export const fmtDuration = (mins: number) => {
    if (!mins || mins <= 0) return '';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
};

export const fmtDate = (ymd: string, opts: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' }) => {
    if (!ymd) return '';
    const [y, m, d] = ymd.split('-').map(Number);
    if (!y || !m || !d) return ymd;
    return new Date(y, m - 1, d).toLocaleDateString('en-IN', opts);
};

export const addDays = (ymd: string, n: number) => {
    const [y, m, d] = ymd.split('-').map(Number);
    const dt = new Date(y, m - 1, d + n);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
};

export const todayYmd = () => {
    const dt = new Date();
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
};
