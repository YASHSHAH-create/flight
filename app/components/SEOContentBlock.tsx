import React from 'react';

interface SEOContentBlockProps {
    origin: string;
    destination: string;
}

const SEOContentBlock: React.FC<SEOContentBlockProps> = ({ origin, destination }) => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-8 text-slate-700">
            <section className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About Flights from {origin} to {destination}</h2>
                <p className="mb-4">
                    Looking for the best flights from {origin} to {destination}? You've come to the right place.
                    Whether you're traveling for business or leisure, we offer a wide range of flight options to suit your schedule and budget.
                    Our platform compares prices across major airlines to ensure you get the best deal available.
                </p>
                <p>
                    The distance between {origin} and {destination} is covered by several direct and connecting flights daily.
                    Early booking is recommended to secure the cheapest fares. Explore our flight schedule to find the most convenient departure times.
                </p>
            </section>

            <section className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Baggage Policies for {origin} to {destination} Flights</h2>
                <p className="mb-4">
                    Baggage allowances can vary significantly between airlines. Generally, Economy class passengers are allowed 15kg to 25kg of check-in baggage
                    and 7kg of cabin baggage on domestic flights, while international limits may vary.
                </p>
                <p>
                    Be sure to check the specific baggage policy for your selected airline before packing.
                    Excess baggage charges can be steep, so pre-booking extra weight is often cheaper if you plan to carry more.
                </p>
            </section>

            <section className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Travel Tips for {destination}</h2>
                <p>
                    When visiting {destination}, make sure to check local weather conditions and pack accordingly.
                    It's also a good idea to familiarize yourself with local transport options and potential visa requirements if traveling internationally.
                </p>
            </section>
        </div>
    );
};

export default SEOContentBlock;
