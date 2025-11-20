"use client";
import Link from "next/link";

export default function RefundPolicy() {
    return (
        <div className="policy-page">
            {/* Header */}
            <header className="policy-header">
                <div className="policy-header-content">
                    <Link href="/" className="back-btn">
                        <i className="fas fa-arrow-left"></i>
                    </Link>
                    <h1>Refund & Cancellation Policy</h1>
                </div>
            </header>

            {/* Content */}
            <div className="policy-content">
                <div className="policy-container">
                    {/* Company Info Card */}
                    <div className="info-card">
                        <h2>Paymm Advisory Pvt Ltd</h2>
                        <div className="info-section">
                            <h3><i className="fas fa-building"></i> Head Office</h3>
                            <p>L NO-A1, Sinjini Apt, Kali Park, Bhatenda,<br />Kolkata, West Bengal - 700136, India</p>
                        </div>
                        <div className="info-section">
                            <h3><i className="fas fa-map-marker-alt"></i> Branch Office</h3>
                            <p>Ranjan Galaxy, New Vigrahpur, Gate No. 2,<br />Near Nutan Apartment, Mithapur Old Bus Stand Opposite,<br />Patna, Bihar - 800020, India</p>
                        </div>
                        <div className="info-section">
                            <h3><i className="fas fa-file-invoice"></i> GST Number</h3>
                            <p className="gst-number">10AAMCP7167L1Z1</p>
                        </div>
                    </div>

                    {/* Refund Policy Content */}
                    <section className="policy-section">
                        <h2>1. Overview</h2>
                        <p>This Refund and Cancellation Policy outlines the terms and conditions for canceling flight bookings and requesting refunds through Paymm Advisory Pvt Ltd. Please read this policy carefully before making any booking.</p>
                    </section>

                    <section className="policy-section">
                        <h2>2. Cancellation Guidelines</h2>
                        <div className="highlight-box">
                            <h3><i className="fas fa-info-circle"></i> Important Notice</h3>
                            <p>Cancellation and refund policies vary by airline and fare type. The terms mentioned here are general guidelines. Specific airline policies will apply to your booking.</p>
                        </div>
                    </section>

                    <section className="policy-section">
                        <h2>3. Cancellation Timeframes</h2>
                        <h3>3.1 Domestic Flights</h3>
                        <ul>
                            <li><strong>More than 7 days before departure:</strong> Full refund minus airline cancellation charges and service fees</li>
                            <li><strong>4-7 days before departure:</strong> Partial refund as per airline policy</li>
                            <li><strong>Within 72 hours of departure:</strong> Minimal refund, subject to airline's cancellation policy</li>
                            <li><strong>No-show:</strong> No refund applicable</li>
                        </ul>

                        <h3>3.2 International Flights</h3>
                        <ul>
                            <li><strong>More than 15 days before departure:</strong> Full refund minus airline cancellation charges and service fees</li>
                            <li><strong>7-15 days before departure:</strong> Partial refund as per airline policy</li>
                            <li><strong>Within 7 days of departure:</strong> Minimal or no refund, subject to airline policy</li>
                            <li><strong>No-show:</strong> No refund applicable</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>4. Service Fees</h2>
                        <p>Paymm Advisory Pvt Ltd charges the following service fees for cancellations:</p>
                        <ul>
                            <li>Domestic Flights: ₹500 per passenger</li>
                            <li>International Flights: ₹1000 per passenger</li>
                            <li>Convenience fees are non-refundable</li>
                            <li>Payment gateway charges are non-refundable</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>5. Refund Process</h2>
                        <h3>5.1 How to Request a Refund</h3>
                        <ul>
                            <li>Log in to your account on our platform</li>
                            <li>Navigate to 'My Bookings' section</li>
                            <li>Select the booking you wish to cancel</li>
                            <li>Click on 'Cancel Booking' and follow the instructions</li>
                            <li>Alternatively, contact our customer support team</li>
                        </ul>

                        <h3>5.2 Refund Timeline</h3>
                        <ul>
                            <li><strong>Credit/Debit Cards:</strong> 7-14 business days</li>
                            <li><strong>Net Banking:</strong> 7-14 business days</li>
                            <li><strong>UPI/Wallets:</strong> 5-7 business days</li>
                            <li><strong>Note:</strong> Actual credit to your account may take additional time depending on your bank</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>6. Special Circumstances</h2>
                        <h3>6.1 Flight Cancellation by Airline</h3>
                        <p>If the airline cancels your flight, you are entitled to:</p>
                        <ul>
                            <li>Full refund including all service fees</li>
                            <li>Alternative flight booking at no extra cost</li>
                            <li>Credit note for future bookings (if opted)</li>
                        </ul>

                        <h3>6.2 Medical Emergency</h3>
                        <p>In case of medical emergencies, special consideration may be given:</p>
                        <ul>
                            <li>Valid medical certificate required</li>
                            <li>Subject to airline approval</li>
                            <li>Reduced cancellation charges may apply</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>7. Non-Refundable Bookings</h2>
                        <p>Some fare types are non-refundable. These include:</p>
                        <ul>
                            <li>Promotional and discounted fares</li>
                            <li>Special offer bookings</li>
                            <li>Group bookings (subject to terms)</li>
                            <li>Award tickets</li>
                        </ul>
                        <p><strong>Note:</strong> Non-refundable tickets may still be eligible for date/route changes, subject to airline policy and applicable charges.</p>
                    </section>

                    <section className="policy-section">
                        <h2>8. Partial Cancellations</h2>
                        <p>For multi-passenger bookings:</p>
                        <ul>
                            <li>Partial cancellation is allowed</li>
                            <li>Cancellation charges apply per passenger</li>
                            <li>Remaining passengers can continue with the booking</li>
                            <li>Fare difference may apply if applicable</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>9. Date Change</h2>
                        <p>If you wish to change your travel dates instead of canceling:</p>
                        <ul>
                            <li>Date change is subject to airline policy and seat availability</li>
                            <li>Fare difference will apply if applicable</li>
                            <li>Date change fee: ₹500 for domestic, ₹1000 for international (plus airline charges)</li>
                            <li>Some fare types do not allow date changes</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>10. Travel Insurance</h2>
                        <p>We strongly recommend purchasing travel insurance for added protection:</p>
                        <ul>
                            <li>Coverage for trip cancellations</li>
                            <li>Medical emergencies during travel</li>
                            <li>Lost baggage and personal belongings</li>
                            <li>Flight delays and missed connections</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>11. Contact for Cancellation Support</h2>
                        <p>For assistance with cancellations and refunds:</p>
                        <ul>
                            <li><i className="fas fa-envelope"></i> Email: refunds@paymm.com</li>
                            <li><i className="fas fa-phone"></i> Customer Care: +91-XXXXXXXXXX (24/7)</li>
                            <li><i className="fas fa-clock"></i> Support Hours: Monday to Sunday, 9:00 AM - 9:00 PM</li>
                            <li><i className="fas fa-map-marker-alt"></i> Head Office: L NO-A1, Sinjini Apt, Kali Park, Bhatenda, Kolkata, West Bengal - 700136, India</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>12. Important Terms</h2>
                        <ul>
                            <li>All cancellation requests must be made before scheduled departure time</li>
                            <li>Refund amount is subject to airline approval</li>
                            <li>Processing time starts after airline confirmation</li>
                            <li>Paymm Advisory Pvt Ltd acts as an intermediary and follows airline policies</li>
                            <li>GST on service fees is non-refundable</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>13. Policy Updates</h2>
                        <p>This Refund and Cancellation Policy is subject to change. We will notify you of any updates by posting the revised policy on our website. Continued use of our services after changes constitutes acceptance of the updated policy.</p>
                    </section>

                    <div className="last-updated">
                        <p><strong>Last Updated:</strong> November 2025</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .policy-page {
          min-height: 100vh;
          background: #f8fafc;
        }

        .policy-header {
          background: linear-gradient(135deg, #0066FF 0%, #4D94FF 100%);
          padding: 2rem 0;
          color: white;
          box-shadow: 0 4px 20px rgba(0, 102, 255, 0.2);
        }

        .policy-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .back-btn {
          width: 45px;
          height: 45px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          backdrop-filter: blur(10px);
          transition: all 0.3s;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-3px);
        }

        .policy-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .policy-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .policy-container {
          background: white;
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
        }

        .info-card {
          background: linear-gradient(135deg, #f8fafc 0%, #e6f0ff 100%);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 3rem;
          border: 1px solid #e2e8f0;
        }

        .info-card h2 {
          color: #0066FF;
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }

        .info-section {
          margin-bottom: 1.5rem;
        }

        .info-section:last-child {
          margin-bottom: 0;
        }

        .info-section h3 {
          color: #1e293b;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-section h3 i {
          color: #0066FF;
          font-size: 0.9rem;
        }

        .info-section p {
          color: #64748b;
          line-height: 1.6;
          margin: 0;
          padding-left: 1.7rem;
        }

        .gst-number {
          font-weight: 600;
          color: #1e293b;
          font-family: 'Courier New', monospace;
        }

        .policy-section {
          margin-bottom: 2.5rem;
        }

        .policy-section h2 {
          color: #1e293b;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .policy-section h3 {
          color: #1e293b;
          font-size: 1.2rem;
          margin: 1.5rem 0 0.8rem 0;
          font-weight: 600;
        }

        .policy-section p {
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .policy-section ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .policy-section li {
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 0.5rem;
        }

        .policy-section li i {
          color: #0066FF;
          margin-right: 0.5rem;
          width: 20px;
        }

        .policy-section li strong {
          color: #1e293b;
        }

        .highlight-box {
          background: linear-gradient(135deg, #fff3cd 0%, #fff9e6 100%);
          border-left: 4px solid #ffc107;
          padding: 1.5rem;
          border-radius: 12px;
          margin: 1rem 0;
        }

        .highlight-box h3 {
          color: #856404;
          font-size: 1.1rem;
          margin: 0 0 0.8rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .highlight-box h3 i {
          color: #ffc107;
        }

        .highlight-box p {
          color: #856404;
          margin: 0;
        }

        .last-updated {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 2px solid #f1f5f9;
          text-align: center;
        }

        .last-updated p {
          color: #64748b;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .policy-header h1 {
            font-size: 1.5rem;
          }

          .policy-container {
            padding: 2rem 1.5rem;
          }

          .info-card {
            padding: 1.5rem;
          }

          .info-card h2 {
            font-size: 1.5rem;
          }

          .policy-section h2 {
            font-size: 1.3rem;
          }

          .policy-section h3 {
            font-size: 1.1rem;
          }
        }
      `}</style>
        </div>
    );
}
