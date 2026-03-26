export interface OptimizedFlightPayload {
    airline: string;
    flightNumbers: string;
    departureTime: string;
    arrivalTime: string;
    segments: any[];
    price: {
        total: number;
        base: number;
        taxes: number;
        offeredFare: number;
    };
    durationOptions?: {
        isFastest?: boolean;
    };
    isLongLayover?: boolean;
    isConnectingFlight?: boolean;
    totalDuration?: string;
    stops?: number;
    stopCity?: string;
    layover?: string;
    route?: string;
    baggage?: {
        checkin: string;
        cabin: string;
    };
    originalResultIndex?: string;
}
