/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import 'server-only';
import type {
    BusCity, BusPoint, BusPoints, BusSearchResult, BusSummary, CancellationPolicy, Seat, SeatLayout,
} from './types';

/**
 * Server-side gateway to the Paymm backend. The browser never talks to the bus
 * server or the payment server directly: every request goes through a Next.js
 * route handler in app/api/bus/*, which validates input, attaches the user's
 * JWT from the httpOnly session cookie, and normalises the supplier payloads.
 */

export const BUS_SERVER_URL = (process.env.BUS_SERVER_URL || 'https://api.paymm.in/bus/api/v1').replace(/\/$/, '');
export const PG_SERVER_URL = (process.env.PG_SERVER_URL || 'https://api.paymm.in/pg').replace(/\/$/, '');
export const FLIGHT_SERVER_URL = (process.env.FLIGHT_SERVER_URL || 'https://api.paymm.in/flight').replace(/\/$/, '');
export const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.paymm.in').replace(/\/$/, '');

export class UpstreamError extends Error {
    status: number;
    details?: unknown;
    constructor(message: string, status = 502, details?: unknown) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

interface FetchOpts {
    method?: 'GET' | 'POST';
    body?: unknown;
    token?: string | null;
    timeoutMs?: number;
    headers?: Record<string, string>;
    /** Next.js data cache — only for idempotent, non-personal reads */
    revalidate?: number;
}

const UA = 'PaymmWeb/1.0 (+https://www.paymm.in)';

async function call<T = any>(url: string, opts: FetchOpts = {}): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 45000);
    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'User-Agent': UA,
            ...(opts.headers || {}),
        };
        if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
        const res = await fetch(url, {
            method: opts.method || (opts.body ? 'POST' : 'GET'),
            headers,
            body: opts.body ? JSON.stringify(opts.body) : undefined,
            signal: controller.signal,
            ...(opts.revalidate !== undefined ? { next: { revalidate: opts.revalidate } } : { cache: 'no-store' as const }),
        });
        const text = await res.text();
        let data: any = null;
        try { data = text ? JSON.parse(text) : null; } catch { data = { raw: text.slice(0, 300) }; }
        if (!res.ok) {
            const msg = (data && (data.message || data.error)) || `Upstream error ${res.status}`;
            throw new UpstreamError(msg, res.status, data);
        }
        return data as T;
    } catch (err: any) {
        if (err instanceof UpstreamError) throw err;
        if (err?.name === 'AbortError') throw new UpstreamError('The booking service took too long to respond. Please try again.', 504);
        throw new UpstreamError(err?.message || 'Network error', 502);
    } finally {
        clearTimeout(timer);
    }
}

// ───────────────────────────────────────────── helpers

const num = (v: unknown): number => {
    const n = typeof v === 'string' ? parseFloat(v) : Number(v);
    return Number.isFinite(n) ? n : 0;
};
const bool = (v: unknown): boolean => v === true || v === 'true' || v === 1 || v === '1' || v === 'Yes' || v === 'yes';
const str = (v: unknown): string => (v === undefined || v === null ? '' : String(v)).trim();

const parsePolicies = (raw: any): CancellationPolicy[] => {
    if (!Array.isArray(raw)) return [];
    return raw.slice(0, 8).map((p: any) => ({
        from: str(p.TimeBeforeDept ?? p.FromTime ?? p.From ?? p.PolicyString ?? ''),
        to: str(p.ToTime ?? p.To ?? ''),
        charge: str(p.CancellationCharge ?? p.Charge ?? p.CancellationChargeType ?? ''),
    })).filter((p) => p.from || p.charge);
};

// ───────────────────────────────────────────── cities

export async function searchCities(q: string, limit = 12): Promise<BusCity[]> {
    const url = `${BUS_SERVER_URL}/cities?search=${encodeURIComponent(q)}&limit=${limit}`;
    const data = await call<any>(url, { revalidate: 3600, timeoutMs: 15000 });
    const rows: any[] = Array.isArray(data?.data) ? data.data : [];
    // Plain city names first (they read better and are what people search), then localities.
    const score = (c: any) => {
        const name = str(c.cityName);
        if (name.toLowerCase() === q.toLowerCase()) return 0;
        if (c.popular) return 1;
        if (!name.includes(',')) return 2;
        return 3;
    };
    return rows
        .map((c) => ({ code: Number(c.cityCode), name: str(c.cityName), state: str(c.state) }))
        .filter((c) => c.code > 0 && c.name)
        .sort((a, b) => score(rows.find((r) => Number(r.cityCode) === a.code)) - score(rows.find((r) => Number(r.cityCode) === b.code)) || a.name.length - b.name.length);
}

/**
 * Embark point times are "HH:mm" relative to the departure day; a pickup the
 * evening before an after-midnight departure comes through as a negative
 * offset such as "-1:-15" (= 22:45 the previous day). Normalise to a wall
 * clock time and flag the previous-day case for the UI.
 */
const normTime = (raw: unknown): { time: string; prevDay: boolean } => {
    const t = str(raw);
    const m = /^(-?\d{1,2}):(-?\d{1,2})/.exec(t);
    if (!m) return { time: t.slice(0, 5), prevDay: false };
    let mins = Number(m[1]) * 60 + Number(m[2]);
    const prevDay = mins < 0;
    mins = ((mins % 1440) + 1440) % 1440;
    return { time: `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`, prevDay };
};

// ───────────────────────────────────────────── search

const slimBus = (r: any): BusSummary | null => {
    const resultIndex = str(r.ResultIndex);
    if (!resultIndex) return null;
    const prices: any[] = Array.isArray(r.Price) ? r.Price : (r.Price ? [r.Price] : []);
    const published = prices.map((p) => num(p.PublishedFare)).filter((n) => n > 0);
    const fare = published.length ? Math.ceil(Math.min(...published)) : Math.ceil(num(r.DisplayFare));
    const fareMax = published.length ? Math.ceil(Math.max(...published)) : fare;
    const bps: any[] = Array.isArray(r.BoardingPoints) ? r.BoardingPoints : [];
    const dps: any[] = Array.isArray(r.DroppingPoints) ? r.DroppingPoints : [];
    const amenities = Array.isArray(r.Amenities) ? r.Amenities.map((a: any) => str(a?.Name || a)).filter(Boolean).slice(0, 12) : [];
    return {
        resultIndex,
        srdvIndex: str(r.SrdvIndex || r.ResultIndex),
        operator: str(r.TravelsName || r.TravelName || 'Bus Operator').replace(/\s+/g, ' '),
        busType: str(r.BusType),
        departure: str(r.DepartureTime),
        arrival: str(r.ArrivalTime),
        duration: Math.round(num(r.Duration)),
        nextDay: bool(r.IsArrivingNextDay),
        seatsLeft: Math.round(num(r.AvailableSeats)),
        maxSeats: Math.max(1, Math.min(6, Math.round(num(r.MaxSeatsPerTicket)) || 6)),
        fare,
        fareMax,
        ac: bool(r.IsAC) || /\bA\/?C\b/i.test(str(r.BusType)) && !/non[\s-]*a\/?c/i.test(str(r.BusType)),
        seater: bool(r.Seater) || /seater/i.test(str(r.BusType)),
        sleeper: bool(r.Sleeper) || /sleeper/i.test(str(r.BusType)),
        idProofRequired: bool(r.IdProofRequired),
        mTicket: bool(r.MTicketEnabled),
        liveTracking: bool(r.LiveTracking),
        amenities,
        boardingCount: bps.length,
        droppingCount: dps.length,
        firstBoarding: bps[0] ? { name: str(bps[0].Name || bps[0].Location), time: normTime(bps[0].Time).time } : undefined,
        lastDropping: dps.length ? { name: str(dps[dps.length - 1].Name || dps[dps.length - 1].Location), time: normTime(dps[dps.length - 1].Time).time } : undefined,
        cancellationPolicies: parsePolicies(r.CancellationPolicies || r.CancellationPolicy),
        partialCancellation: bool(r.PartialCancellationAllowed),
    };
};

export async function searchBuses(from: BusCity, to: BusCity, date: string): Promise<BusSearchResult> {
    const data = await call<any>(`${BUS_SERVER_URL}/bus/search`, {
        body: { FromCityCode: from.code, ToCityCode: to.code, DepartDate: date },
        timeoutMs: 60000,
    });
    if (data?.success === false) throw new UpstreamError(data.message || 'Search failed', 502, data);
    const traceId = str(data?.traceId ?? data?.data?.TraceId);
    const results: any[] = Array.isArray(data?.data?.Result) ? data.data.Result : [];
    const buses = results.map(slimBus).filter((b): b is BusSummary => !!b);
    buses.sort((a, b) => a.departure.localeCompare(b.departure));
    return { traceId, date, from, to, count: buses.length, buses };
}

// ───────────────────────────────────────────── seat layout

const toSeat = (node: any, upperCtx: boolean): Seat | null => {
    const name = str(node.SeatName ?? node.seatName);
    if (!name) return null;
    const price = node.Price || {};
    const published = num(price.PublishedFare) || num(node.SeatFare) || num(price.OfferedFare) || num(price.BaseFare);
    const supplierFare = num(node.SeatFare) || num(price.OfferedFare) || published;
    const type: Seat['type'] = /sleeper|berth/i.test(str(node.SeatType)) ? 'Sleeper' : 'Seater';
    const length = Math.max(1, Math.round(num(node.Length ?? node.Height ?? (type === 'Sleeper' ? 2 : 1))) || 1);
    return {
        name,
        row: Math.round(num(node.RowNo ?? node.Row ?? 0)),
        col: Math.round(num(node.ColumnNo ?? node.Column ?? 0)),
        upper: node.IsUpper !== undefined ? bool(node.IsUpper) : upperCtx,
        available: bool(node.SeatStatus),
        ladies: bool(node.IsLadiesSeat),
        males: bool(node.IsMalesSeat),
        fare: Math.ceil(published),
        supplierFare: Math.round(supplierFare * 100) / 100,
        baseFare: num(price.BaseFare),
        tax: num(price.Tax),
        type,
        width: Math.max(1, Math.round(num(node.Width)) || 1),
        length,
    };
};

const walkSeats = (node: any, upperCtx: boolean, out: Seat[], depth = 0) => {
    if (!node || depth > 6) return;
    if (Array.isArray(node)) { node.forEach((n) => walkSeats(n, upperCtx, out, depth + 1)); return; }
    if (typeof node !== 'object') return;
    if (node.SeatName !== undefined || (node.RowNo !== undefined && node.ColumnNo !== undefined)) {
        const s = toSeat(node, upperCtx);
        if (s) out.push(s);
        return;
    }
    Object.values(node).forEach((v) => walkSeats(v, upperCtx, out, depth + 1));
};

export async function getSeatLayout(traceId: string, resultIndex: string, srdvIndex: string): Promise<SeatLayout> {
    const data = await call<any>(`${BUS_SERVER_URL}/bus/seat-layout`, {
        body: { TraceId: traceId, ResultIndex: resultIndex, SrdvIndex: srdvIndex || resultIndex },
        timeoutMs: 45000,
    });
    if (data?.success === false) throw new UpstreamError(data.message || 'Seat layout unavailable', 502, data);
    const d = data?.data || {};
    const lower: Seat[] = [];
    const upper: Seat[] = [];
    walkSeats(d.Result, false, lower);
    walkSeats(d.ResultUpperSeat, true, upper);
    // Some operators flag upper berths inside Result itself
    const allLower = lower.filter((s) => !s.upper);
    const allUpper = [...upper, ...lower.filter((s) => s.upper)];
    const dedupe = (list: Seat[]) => {
        const seen = new Set<string>();
        return list.filter((s) => { const k = `${s.upper ? 'U' : 'L'}:${s.name}`; if (seen.has(k)) return false; seen.add(k); return true; });
    };
    return {
        traceId: str(d.TraceId || traceId),
        resultIndex: str(d.ResultIndex || resultIndex),
        srdvIndex: str(d.SrdvIndex || srdvIndex || resultIndex),
        paxIdRequired: bool(d.PaxIdRequired),
        availableSeats: Math.round(num(d.AvailableSeats)),
        lower: dedupe(allLower),
        upper: dedupe(allUpper),
    };
}

// ───────────────────────────────────────────── boarding / dropping points

const toPoint = (p: any, i: number): BusPoint => ({
    id: str(p.Id ?? p.CityPointIndex ?? p.MasterId ?? `P${i}`),
    name: str(p.Name || p.CityPointName || p.Location || 'Point'),
    time: normTime(p.Time || p.CityPointTime).time + (normTime(p.Time || p.CityPointTime).prevDay ? ' (prev. day)' : ''),
    address: str(p.Address) || undefined,
    landmark: str(p.Landmark) || undefined,
    location: str(p.Location) || undefined,
    contact: str(p.ContactNumber) || undefined,
});

export async function getBoardingPoints(traceId: string, resultIndex: string, srdvIndex: string): Promise<BusPoints> {
    const data = await call<any>(`${BUS_SERVER_URL}/bus/boarding-points`, {
        body: { TraceId: traceId, ResultIndex: resultIndex, SrdvIndex: srdvIndex || resultIndex },
        timeoutMs: 45000,
    });
    if (data?.success === false) throw new UpstreamError(data.message || 'Boarding points unavailable', 502, data);
    const d = data?.data || {};
    const bp: any[] = d.BoardingPoints || d.BoardingPointsDetails || d.data?.BoardingPointsDetails || [];
    const dp: any[] = d.DroppingPoints || d.DroppingPointsDetails || d.data?.DroppingPointsDetails || [];
    return {
        boarding: (Array.isArray(bp) ? bp : []).map(toPoint),
        dropping: (Array.isArray(dp) ? dp : []).map(toPoint),
    };
}

// ───────────────────────────────────────────── block (hold) seats

export interface EmbarkPassenger {
    LeadPassenger: boolean; Title: string; FirstName: string; LastName: string; Email: string;
    PhoneNo: string; Phoneno: string; Age: number; Gender: 1 | 2; SeatName: string; Fare: number;
    SeatType: string; IdType: string; IdNumber: string; Address: string;
}

export async function blockSeats(args: { traceId: string; resultIndex: string; srdvIndex: string; boardingPointId: string; droppingPointId: string; passengers: EmbarkPassenger[] }) {
    const data = await call<any>(`${BUS_SERVER_URL}/bus/block`, {
        body: {
            TraceId: args.traceId,
            ResultIndex: args.resultIndex,
            SrdvIndex: args.srdvIndex || args.resultIndex,
            BoardingPointId: args.boardingPointId,
            DroppingPointId: args.droppingPointId,
            Passenger: args.passengers,
            Passengers: args.passengers,
        },
        timeoutMs: 60000,
    });
    const blockRefId = str(data?.blockRefId || data?.BlockKey || data?.data?.BlockKey || data?.data?.BlockRefId);
    if (data?.success === false || !blockRefId) {
        const msg = data?.message || data?.data?.Error?.ErrorMessage || 'The operator could not hold these seats. Please pick different seats.';
        throw new UpstreamError(msg, 409, data);
    }
    const totalFare = num(data?.data?.TotalFare || data?.data?.Result?.TotalFare || data?.dbRecord?.totalFare);
    return { blockRefId, totalFare, raw: data };
}

// ───────────────────────────────────────────── payment server (pg)

export const pg = {
    sendLoginOtp: (phone: string, countryCode = '91') =>
        call<any>(`${PG_SERVER_URL}/api/auth/send-login-otp`, { body: { phone, countryCode }, timeoutMs: 20000 }),
    verifyLoginOtp: (phone: string, otp: string, countryCode = '91') =>
        call<any>(`${PG_SERVER_URL}/api/auth/verify-login-otp`, { body: { phone, otp, countryCode }, timeoutMs: 20000 }),
    googleLogin: (u: { googleId: string; email: string; name?: string; firstname?: string; lastname?: string }) =>
        call<any>(`${PG_SERVER_URL}/api/auth/google-login`, { body: u, timeoutMs: 20000 }),
    walletBalance: (token: string) =>
        call<any>(`${PG_SERVER_URL}/api/wallet/balance`, { token, timeoutMs: 15000 }),
    saveDraft: (token: string, draft: Record<string, unknown>) =>
        call<any>(`${PG_SERVER_URL}/book`, { token, body: draft, timeoutMs: 20000 }),
    createPayment: (token: string, body: Record<string, unknown>) =>
        call<any>(`${PG_SERVER_URL}/create-payment`, { token, body, timeoutMs: 30000 }),
    payWithWallet: (token: string, body: Record<string, unknown>) =>
        call<any>(`${PG_SERVER_URL}/api/wallet/pay-booking`, { token, body, timeoutMs: 90000 }),
    verifyPayment: (token: string, ref: string) =>
        call<any>(`${PG_SERVER_URL}/api/payment/verify/${encodeURIComponent(ref)}`, { token, timeoutMs: 40000 }),
    bookingStatus: (token: string, ref: string) =>
        call<any>(`${PG_SERVER_URL}/api/payment/booking-status/${encodeURIComponent(ref)}`, { token, timeoutMs: 20000 }),
    userBookings: (token: string, userId: string) =>
        call<any>(`${PG_SERVER_URL}/api/payment/user-bookings/${encodeURIComponent(userId)}`, { token, timeoutMs: 30000 }),
    cancelBus: (token: string, bookingId: string) =>
        call<any>(`${PG_SERVER_URL}/api/bus/cancel`, { token, body: { bookingId }, timeoutMs: 45000 }),
};

export const flightServer = {
    /** Passport session user (Google login on the site). Cookies are forwarded verbatim. */
    currentUser: async (cookieHeader: string) => {
        if (!cookieHeader) return null;
        try {
            const res = await fetch(`${FLIGHT_SERVER_URL}/api/auth/user`, {
                headers: { cookie: cookieHeader, Accept: 'application/json', 'User-Agent': UA },
                cache: 'no-store',
                signal: AbortSignal.timeout(10000),
            });
            if (!res.ok) return null;
            const u = await res.json();
            return u && (u.email || u.googleId) ? u : null;
        } catch { return null; }
    },
};
