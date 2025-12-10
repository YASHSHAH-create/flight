export interface SearchResponse {
    Response: {
        ResponseStatus: number;
        Error: {
            ErrorCode: number;
            ErrorMessage: string;
        };
        Results: FlightResult[][];
        TraceId: string;
    }
}

export interface FlightResult {
    ResultIndex: string;
    IsLCC: boolean;
    IsRefundable: boolean;
    AirlineRemark: string;
    Fare: Fare;
    Segments: Segment[][];
}

export interface Fare {
    Currency: string;
    BaseFare: number;
    Tax: number;
    PublishedFare: number;
    OfferedFare: number;
    Discount: number;
}

export interface Segment {
    Baggage: string;
    CabinBaggage: string;
    Airline: {
        AirlineCode: string;
        AirlineName: string;
        FlightNumber: string;
    };
    Origin: {
        Airport: AirportInfo;
        DepTime: string;
    };
    Destination: {
        Airport: AirportInfo;
        ArrTime: string;
    };
    Duration: number; // in minutes
    StopOver: boolean;
    NoOfSeatAvailable: number;
    Craft: string;
}

export interface AirportInfo {
    AirportCode: string;
    AirportName: string;
    CityName: string;
    Terminal: string;
}

// Fare Quote Types
export interface FareQuoteResponse {
    success: boolean;
    data: {
        Error: { ErrorCode: number; ErrorMessage: string };
        IsPriceChanged: boolean;
        Results: {
            ResultIndex: string;
            IsLCC: boolean;
            IsRefundable: boolean;
            Fare: Fare;
            FareBreakdown: FareBreakdown[];
            Segments: Segment[][];
            MiniFareRules: MiniFareRule[][];
        };
        ResponseStatus: number;
        TraceId: string;
    };
}

export interface FareBreakdown {
    Currency: string;
    PassengerType: number;
    PassengerCount: number;
    BaseFare: number;
    Tax: number;
}

export interface MiniFareRule {
    JourneyPoints: string;
    Type: string;
    From: string;
    To: string;
    Unit: string;
    Details: string;
}

// Fare Rule Types
export interface FareRuleResponse {
    success: boolean;
    data: {
        Error: { ErrorCode: number; ErrorMessage: string };
        FareRules: FareRule[];
    };
}

export interface FareRule {
    Airline: string;
    Origin: string;
    Destination: string;
    FareBasisCode: string;
    FareRuleDetail: string;
    FareInclusions: string[];
}

// SSR (Special Service Request) Types
export interface SSRResponse {
    success: boolean;
    data: {
        ResponseStatus: number;
        Error: { ErrorCode: number; ErrorMessage: string };
        TraceId: string;
        Baggage: Baggage[][];
        MealDynamic: Meal[][];
        SeatDynamic: SeatDynamic[];
    };
}

export interface Baggage {
    WayType: number;
    Code: string;
    Description: number;
    Weight: number;
    Currency: string;
    Price: number;
    Origin: string;
    Destination: string;
}

export interface Meal {
    WayType: number;
    Code: string;
    Description: number;
    AirlineDescription: string;
    Quantity: number;
    Currency: string;
    Price: number;
    Origin: string;
    Destination: string;
}

export interface SeatDynamic {
    SegmentSeat: {
        RowSeats: {
            Seats: Seat[];
        }[];
    }[];
}

export interface Seat {
    AirlineCode: string;
    FlightNumber: string;
    CraftType: string;
    Origin: string;
    Destination: string;
    AvailablityType: number;
    Description: number;
    Code: string;
    RowNo: string;
    SeatNo: string;
    SeatType: number;
    SeatWayType: number;
    Compartment: number;
    Deck: number;
    Currency: string;
    Price: number;
    SeatTypeEnum?: string;
    AvailabilityTypeEnum?: string;
}

// Booking & Ticketing Types

export interface Passenger {
    Title: string;
    FirstName: string;
    LastName: string;
    PaxType: number; // 1: Adult, 2: Child, 3: Infant
    DateOfBirth: string; // YYYY-MM-DDTHH:mm:ss
    Gender: number; // 1: Male, 2: Female
    PassportNo?: string;
    PassportExpiry?: string;
    AddressLine1: string;
    AddressLine2?: string;
    Fare?: any; // From Quote
    City: string;
    CountryCode: string;
    CountryName?: string;
    ContactNo?: string;
    Email?: string;
    IsLeadPax: boolean;
    FFAirlineCode?: string | null;
    FFNumber?: string | null;
    GSTCompanyAddress?: string;
    GSTCompanyContactNumber?: string;
    GSTCompanyName?: string;
    GSTNumber?: string;
    GSTCompanyEmail?: string;
    Baggage?: any[]; // From SSR
    MealDynamic?: any[]; // From SSR
    SeatDynamic?: any[]; // From SSR
    SpecialServices?: any[]; // From SSR
}

export interface BookRequest {
    ResultIndex: string;
    Passengers: Passenger[];
    EndUserIp: string;
    TokenId: string; // usually managed by backend session but user provided example has it
    TraceId: string;
}

export interface BookResponse {
    Response: {
        Error: { ErrorCode: number; ErrorMessage: string };
        ResponseStatus: number;
        TraceId: string;
        Response: {
            PNR: string;
            BookingId: number;
            Status: number;
            FlightItinerary: {
                IsLCC: boolean;
                PNR: string;
                BookingId: number;
                Passenger: any[];
            };
        };
    };
}

export interface TicketRequest {
    ResultIndex: string;
    TraceId: string;
    EndUserIp: string;
    TokenId?: string;
    PNR?: string;
    BookingId?: number;
    Passengers?: Passenger[]; // Required for LCC
    PreferredCurrency?: string | null;
    AgentReferenceNo?: string;
}

export interface TicketResponse {
    Response: {
        Error: { ErrorCode: number; ErrorMessage: string };
        ResponseStatus: number;
        TraceId: string;
        Response: {
            PNR: string;
            BookingId: number;
            Status: number;
            FlightItinerary: TicketFlightItinerary;
        };
    };
}

export interface TicketFlightItinerary {
    IsLCC: boolean;
    PNR: string;
    BookingId: number;
    Invoice?: any[];
    Passenger: Passenger[];
    Segments: any[]; // Using any[] to accommodate flat structure in Ticket Response if it differs slightly or just to be safe, but preferably Segment[]
    Fare: Fare;
    Status: number;
    Origin: string;
    Destination: string;
    Source: number;
    AirlineCode: string;
    AirlineRemark?: string;
}

export interface Booking {
    _id: string;
    userId: string;
    bookingId: string;
    pnr: string;
    status: string;
    amount?: number;
    flightDetails?: any;
    responseJson?: any;
    createdAt: string;
}
