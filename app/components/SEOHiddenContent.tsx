import React from 'react';
import { AIRPORT_MAP } from '../lib/airports';

export default function SEOHiddenContent() {
    // Use all airports from our map (Indian + International)
    const allAirports = Object.keys(AIRPORT_MAP);
    const airlines = ["Indigo", "Air India", "Vistara", "SpiceJet", "Akasa Air", "Air Asia", "Emirates", "Lufthansa", "British Airways", "Singapore Airlines"];

    // Generate popular route links
    type Route = { from: string; to: string; slug: string; price: number };
    const routes: Route[] = [];

    // Create combinations
    allAirports.forEach(from => {
        allAirports.forEach(to => {
            if (from !== to) {
                // Simple logic to prioritize connections if needed, or just dump all
                // We will dump all but maybe limit to top 500 in the UI render to avoid DOM overload?
                // User asked for "sabka combination". 50*50 = 2500 nodes.
                // Rendering 2500 rows might be heavy. Let's render them but maybe optimized?
                // Or just let it be. 2500 hidden rows is substantial.

                const fromCity = AIRPORT_MAP[from].city;
                const toCity = AIRPORT_MAP[to].city;
                const slug = `${fromCity.toLowerCase().replace(/\s+/g, '-')}-to-${toCity.toLowerCase().replace(/\s+/g, '-')}`;
                const price = Math.floor(Math.random() * (15000 - 3000) + 3000); // Dummy price
                routes.push({ from: fromCity, to: toCity, slug, price });
            }
        });
    });

    return (
        <div style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: '0',
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: '0'
        }}>
            <h2>Cheap Flight Tickets Booking</h2>
            <p>Book the cheapest flights online with Paymm. Compare air ticket prices for all major airlines in India.</p>

            <h3>Popular Airlines</h3>
            <ul>
                {airlines.map(airline => (
                    <li key={airline}>
                        <a href="/search">{airline} Flight Booking</a>
                    </li>
                ))}
            </ul>

            <h3>Popular Flight Routes & Fares</h3>
            <table>
                <thead>
                    <tr>
                        <th>Route</th>
                        <th>Airline</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {routes.map((route, i) => (
                        <tr key={i}>
                            <td>
                                <a href={`/flights/${route.slug}`}>
                                    Flights from {route.from} to {route.to}
                                </a>
                            </td>
                            <td>{airlines[i % airlines.length]}</td>
                            <td>Starting from ₹{route.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Flight Booking Information</h3>
            <p>
                Paymm offers the best deals on domestic and international flights.
                Search for flights from New Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, and more.
                Get instant discounts, refundable fares, and 24/7 customer support.
            </p>
        </div>
    );
}
