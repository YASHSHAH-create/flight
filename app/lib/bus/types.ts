/**
 * Shared types for the bus booking flow (website).
 * Everything the browser sees is normalised on the server (app/lib/bus/server.ts)
 * from the Embark v9 payloads returned by the bus server.
 */

export interface BusCity {
    code: number;
    name: string;
    state?: string;
}

export interface BusPoint {
    id: string;
    name: string;
    time: string;      // "HH:mm"
    address?: string;
    landmark?: string;
    location?: string;
    contact?: string;
}

export interface CancellationPolicy {
    from: string;   // hours before departure (window start)
    to: string;     // hours before departure (window end)
    charge: string; // e.g. "10%" or "₹100"
}

export interface BusSummary {
    resultIndex: string;
    srdvIndex: string;
    operator: string;
    busType: string;
    departure: string;   // ISO local "2026-09-27T22:10:00"
    arrival: string;
    duration: number;    // minutes
    nextDay: boolean;
    seatsLeft: number;
    maxSeats: number;
    fare: number;        // lowest published fare, rupees
    fareMax: number;
    ac: boolean;
    seater: boolean;
    sleeper: boolean;
    idProofRequired: boolean;
    mTicket: boolean;
    liveTracking: boolean;
    amenities: string[];
    boardingCount: number;
    droppingCount: number;
    firstBoarding?: { name: string; time: string };
    lastDropping?: { name: string; time: string };
    cancellationPolicies: CancellationPolicy[];
    partialCancellation: boolean;
}

export interface BusSearchResult {
    traceId: string;
    date: string;
    from: BusCity;
    to: BusCity;
    count: number;
    buses: BusSummary[];
}

export interface Seat {
    name: string;
    row: number;        // Embark RowNo — transverse index, 0 = driver-side window
    col: number;        // Embark ColumnNo — position along the bus length, 0 = front
    upper: boolean;
    available: boolean;
    ladies: boolean;
    males: boolean;
    fare: number;        // what the customer pays (published fare, whole rupees)
    supplierFare: number; // Embark SeatFare — sent back in the Block request
    baseFare: number;
    tax: number;
    type: 'Seater' | 'Sleeper';
    width: number;
    length: number;
}

export interface SeatLayout {
    traceId: string;
    resultIndex: string;
    srdvIndex: string;
    paxIdRequired: boolean;
    availableSeats: number;
    lower: Seat[];
    upper: Seat[];
}

export interface BusPoints {
    boarding: BusPoint[];
    dropping: BusPoint[];
}

export type Gender = 1 | 2;

export interface PassengerInput {
    title: 'Mr' | 'Mrs' | 'Ms';
    firstName: string;
    lastName: string;
    age: number;
    gender: Gender;
    seatName: string;
}

export interface CheckoutRequest {
    traceId: string;
    resultIndex: string;
    srdvIndex: string;
    date: string;
    from: BusCity;
    to: BusCity;
    bus: { operator: string; busType: string; departure: string; arrival: string };
    boardingPointId: string;
    droppingPointId: string;
    passengers: PassengerInput[];
    contact: { email: string; phone: string };
    idProof?: { type: 'Aadhaar' | 'PAN' | 'Passport' | 'Voter ID' | 'Driving Licence'; number: string };
    payMethod: 'GATEWAY' | 'WALLET';
}

export interface CheckoutResponse {
    success: true;
    bookingId: string;
    txnid: string;
    amount: number;
    payMethod: 'GATEWAY' | 'WALLET';
    redirectUrl?: string;   // gateway hosted page (GATEWAY only)
    bookingStatus?: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface SessionUser {
    userId: string;
    email: string;
    name: string;
    phone?: string;
}

/** What the browser keeps between steps (sessionStorage) */
export interface BusDraft {
    traceId: string;
    date: string;
    from: BusCity;
    to: BusCity;
    bus: BusSummary;
    seats: Seat[];
    boarding?: BusPoint;
    dropping?: BusPoint;
    paxIdRequired: boolean;
    createdAt: number;
}

export interface BookingView {
    ref: string;
    paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'UNKNOWN';
    bookingStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'PAYMENT_FAILED' | 'UNKNOWN';
    message?: string;
    refunded?: boolean;
    ticket?: {
        pnr: string;
        ticketNo: string;
        embarkBookingId: string;
        operator: string;
        busType: string;
        from: string;
        to: string;
        date: string;
        departure: string;
        arrival: string;
        boardingPoint: string;
        droppingPoint: string;
        passengers: { name: string; age?: number | string; gender?: string; seat?: string }[];
        amount: number;
        contact?: { email?: string; phone?: string };
        cancelled?: boolean;
        cancellation?: { refundAmount?: number; cancellationCharge?: number; cancelledAt?: string };
    };
}
