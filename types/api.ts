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
