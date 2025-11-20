
export const searchFlights = async (params) => {
    const queryParams = new URLSearchParams({
        from: params.from,
        to: params.to,
        date: params.date,
        adults: params.adults || 1,
        children: params.children || 0,
        infants: params.infants || 0,
        directFlight: params.directFlight || false,
        oneStopFlight: params.oneStopFlight || false,
        journeyType: params.journeyType || 1 // Default to One Way
    });

    try {
        const response = await fetch(`http://localhost:3001/flights/search?${queryParams}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching flights:", error);
        throw error;
    }
};
