/* eslint-disable @typescript-eslint/no-explicit-any -- supplier / payment-server payloads are untyped JSON; every field is normalised before use */
import type { BusCity, CheckoutRequest, PassengerInput } from './types';

/**
 * Hand-rolled validators for everything the browser sends to /api/bus/*.
 * Every field is whitelisted, typed, length-capped and pattern-checked before
 * it is forwarded anywhere; unknown keys are dropped.
 */

export class ValidationError extends Error {
    status = 400;
    field?: string;
    constructor(message: string, field?: string) {
        super(message);
        this.field = field;
    }
}

const NAME_RE = /^[A-Za-z][A-Za-z .'-]{0,39}$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[A-Za-z]{2,}$/;
const YMD_RE = /^\d{4}-\d{2}-\d{2}$/;
const ID_RE = /^[A-Z0-9]{4,20}$/;
const SEAT_RE = /^[A-Za-z0-9 _./-]{1,12}$/;
const INDEX_RE = /^[A-Za-z0-9_-]{1,64}$/;
const POINT_RE = /^[A-Za-z0-9_-]{1,32}$/;

export const s = (v: unknown, max = 200): string => (typeof v === 'string' ? v : v === undefined || v === null ? '' : String(v)).trim().slice(0, max);

export const todayYmdIST = (): string => {
    // Site-wide bus dates are IST calendar dates.
    const now = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    return now.toISOString().slice(0, 10);
};

export const validateDate = (v: unknown): string => {
    const d = s(v, 10);
    if (!YMD_RE.test(d)) throw new ValidationError('Please choose a valid travel date.', 'date');
    const today = todayYmdIST();
    if (d < today) throw new ValidationError('Travel date cannot be in the past.', 'date');
    const max = new Date(Date.now() + 120 * 86400000).toISOString().slice(0, 10);
    if (d > max) throw new ValidationError('Bookings open up to 120 days in advance.', 'date');
    return d;
};

export const validateCity = (v: any, field: string): BusCity => {
    const code = Number(v?.code);
    const name = s(v?.name, 80);
    if (!Number.isInteger(code) || code <= 0 || code > 10_000_000) throw new ValidationError('Please select a city from the list.', field);
    if (!name || !/^[A-Za-z0-9 ,.()'&/-]+$/.test(name)) throw new ValidationError('Please select a city from the list.', field);
    return { code, name, state: s(v?.state, 60) || undefined };
};

export const validateIndex = (v: unknown, field: string): string => {
    const x = s(v, 64);
    if (!INDEX_RE.test(x)) throw new ValidationError('This search has expired. Please search again.', field);
    return x;
};

export const validateTraceId = (v: unknown): string => {
    const x = s(v, 64);
    if (!/^[A-Za-z0-9_-]{1,64}$/.test(x)) throw new ValidationError('This search has expired. Please search again.', 'traceId');
    return x;
};

export const validatePoint = (v: unknown, field: string): string => {
    const x = s(v, 32);
    if (!POINT_RE.test(x)) throw new ValidationError(`Please choose a ${field === 'boardingPointId' ? 'boarding' : 'dropping'} point.`, field);
    return x;
};

export const validatePhone = (v: unknown): string => {
    const p = s(v, 15).replace(/[\s-]/g, '').replace(/^\+?91/, '');
    if (!PHONE_RE.test(p)) throw new ValidationError('Enter a valid 10-digit Indian mobile number.', 'phone');
    return p;
};

export const validateEmail = (v: unknown): string => {
    const e = s(v, 120).toLowerCase();
    if (!EMAIL_RE.test(e)) throw new ValidationError('Enter a valid email address.', 'email');
    return e;
};

export const validateOtp = (v: unknown): string => {
    const o = s(v, 8);
    if (!/^\d{4,8}$/.test(o)) throw new ValidationError('Enter the OTP you received.', 'otp');
    return o;
};

const validatePassenger = (v: any, i: number): PassengerInput => {
    const title = s(v?.title, 3);
    if (!['Mr', 'Mrs', 'Ms'].includes(title)) throw new ValidationError(`Select a title for passenger ${i + 1}.`, `passengers.${i}.title`);
    const firstName = s(v?.firstName, 40);
    const lastName = s(v?.lastName, 40);
    if (!NAME_RE.test(firstName)) throw new ValidationError(`Enter a valid first name for passenger ${i + 1}.`, `passengers.${i}.firstName`);
    if (!NAME_RE.test(lastName)) throw new ValidationError(`Enter a valid last name for passenger ${i + 1}.`, `passengers.${i}.lastName`);
    const age = Number(v?.age);
    if (!Number.isInteger(age) || age < 1 || age > 110) throw new ValidationError(`Enter a valid age for passenger ${i + 1}.`, `passengers.${i}.age`);
    const gender = Number(v?.gender) === 2 ? 2 : Number(v?.gender) === 1 ? 1 : 0;
    if (!gender) throw new ValidationError(`Select gender for passenger ${i + 1}.`, `passengers.${i}.gender`);
    const seatName = s(v?.seatName, 12);
    if (!SEAT_RE.test(seatName)) throw new ValidationError('Seat selection is invalid. Please reselect seats.', `passengers.${i}.seatName`);
    return { title: title as PassengerInput['title'], firstName, lastName, age, gender: gender as 1 | 2, seatName };
};

export const validateCheckout = (body: any): CheckoutRequest => {
    if (!body || typeof body !== 'object') throw new ValidationError('Invalid request.');
    const traceId = validateTraceId(body.traceId);
    const resultIndex = validateIndex(body.resultIndex, 'resultIndex');
    const srdvIndex = validateIndex(body.srdvIndex || body.resultIndex, 'srdvIndex');
    const date = validateDate(body.date);
    const from = validateCity(body.from, 'from');
    const to = validateCity(body.to, 'to');
    if (from.code === to.code) throw new ValidationError('Source and destination cannot be the same.', 'to');
    const boardingPointId = validatePoint(body.boardingPointId, 'boardingPointId');
    const droppingPointId = validatePoint(body.droppingPointId, 'droppingPointId');

    const rawPax = Array.isArray(body.passengers) ? body.passengers : [];
    if (rawPax.length < 1) throw new ValidationError('Add at least one passenger.', 'passengers');
    if (rawPax.length > 6) throw new ValidationError('You can book up to 6 seats in one booking.', 'passengers');
    const passengers: PassengerInput[] = rawPax.map((p: unknown, i: number) => validatePassenger(p, i));
    const seatSet = new Set(passengers.map((p) => p.seatName.toUpperCase()));
    if (seatSet.size !== passengers.length) throw new ValidationError('Each passenger needs a different seat.', 'passengers');

    const contact = { email: validateEmail(body.contact?.email), phone: validatePhone(body.contact?.phone) };

    let idProof: CheckoutRequest['idProof'];
    if (body.idProof && (s(body.idProof.number, 20) || s(body.idProof.type, 20))) {
        const type = s(body.idProof.type, 20);
        const allowed = ['Aadhaar', 'PAN', 'Passport', 'Voter ID', 'Driving Licence'];
        if (!allowed.includes(type)) throw new ValidationError('Choose a valid ID type.', 'idProof.type');
        const number = s(body.idProof.number, 20).toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (!ID_RE.test(number)) throw new ValidationError('Enter a valid ID number.', 'idProof.number');
        if (type === 'Aadhaar' && !/^\d{12}$/.test(number)) throw new ValidationError('Aadhaar must be 12 digits.', 'idProof.number');
        if (type === 'PAN' && !/^[A-Z]{5}\d{4}[A-Z]$/.test(number)) throw new ValidationError('Enter a valid PAN (e.g. ABCDE1234F).', 'idProof.number');
        idProof = { type: type as NonNullable<CheckoutRequest['idProof']>['type'], number };
    }

    const payMethod = s(body.payMethod, 10).toUpperCase() === 'WALLET' ? 'WALLET' : 'GATEWAY';

    const bus = {
        operator: s(body.bus?.operator, 80),
        busType: s(body.bus?.busType, 80),
        departure: s(body.bus?.departure, 25),
        arrival: s(body.bus?.arrival, 25),
    };

    return { traceId, resultIndex, srdvIndex, date, from, to, bus, boardingPointId, droppingPointId, passengers, contact, idProof, payMethod };
};
