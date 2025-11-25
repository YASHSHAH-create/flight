
export const searchFlights = async (params) => {
    // Default to tomorrow if no date provided
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 1);
    const searchDate = params.date ? new Date(params.date) : defaultDate;
    const formattedDate = searchDate.toISOString().split('T')[0] + 'T00:00:00';

    const queryParams = new URLSearchParams({
        AdultCount: params.adults || 1,
        ChildCount: params.children || 0,
        InfantCount: params.infants || 0,
        DirectFlight: params.directFlight || false,
        OneStopFlight: params.oneStopFlight || false,
        JourneyType: params.journeyType || 1, // 1 = One Way
        'Segments[0][Origin]': params.from,
        'Segments[0][Destination]': params.to,
        'Segments[0][FlightCabinClass]': params.cabinClass || 1, // 1 = Economy
        'Segments[0][PreferredDepartureTime]': formattedDate
    });

    try {
        const response = await fetch(`http://localhost:3001/api/search?${queryParams}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data; // Ensure this matches the new API response structure
    } catch (error) {
        console.error("Error fetching flights:", error);
        throw error;
    }
};
