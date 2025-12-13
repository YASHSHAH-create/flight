import React from 'react';

const RefundPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 py-20 px-4 md:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="border-b border-slate-800 pb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent mb-4">
                        Refund & Cancellation Policy
                    </h1>
                    <p className="text-slate-400">
                        Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">1. Cancellations</h2>
                    <p>
                        You may cancel your booking through our Platform or by contacting our customer support. Cancellation policies vary depending on the airline, hotel, or service provider and the specific fare rules associated with your booking.
                    </p>
                    <p>
                        Please review the fare rules and cancellation policy displayed at the time of booking before proceeding.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">2. Refunds</h2>
                    <p>
                        Refunds will be processed as per the policy of the respective service provider (e.g., airline).
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-300 ml-4">
                        <li>If the airline/provider cancels the flight/service, you may be entitled to a full refund.</li>
                        <li>If you cancel voluntarily, the refund amount will be calculated after deducting the applicable cancellation charges levied by the airline/provider and PayMM's service fees.</li>
                        <li>Convenience fees paid at the time of booking are generally non-refundable.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">3. Processing Time</h2>
                    <p>
                        Once the refund is approved by the service provider, it will be processed to your original payment method. This usually takes 5-7 business days, but in some cases, it may take longer depending on your bank's processing timelines.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold text-white">4. Contact for Refunds</h2>
                    <p>
                        For any refund-related queries, please contact us with your booking reference number (PNR/Booking ID).
                    </p>
                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
                        <p><span className="font-semibold text-white">Email:</span> support@paymm.in</p>
                        <p><span className="font-semibold text-white">Phone:</span> +91 9343300271</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default RefundPage;
