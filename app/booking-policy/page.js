"use client";
import Link from "next/link";

export default function BookingPolicy() {
    return (
        <div className="policy-page">
            {/* Header */}
            <header className="policy-header">
                <div className="policy-header-content">
                    <Link href="/" className="back-btn">
                        <i className="fas fa-arrow-left"></i>
                    </Link>
                    <h1>Booking Policy</h1>
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

                    {/* Policy Content */}
                    <section className="policy-section">
                        <h2>1. Booking Process</h2>
                        <p>Our booking process is designed to be simple and secure:</p>
                        <ul>
                            <li>Search for flights by entering your origin, destination, and travel dates.</li>
                            <li>Select your preferred flight from the available options.</li>
                            <li>Enter passenger details exactly as they appear on government-issued ID/Passport.</li>
                            <li>Review your booking summary and proceed to payment.</li>
                            <li>Once payment is confirmed, you will receive an e-ticket via email.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>2. Payment Policy</h2>
                        <p>We require full payment at the time of booking to secure your reservation.</p>
                        <ul>
                            <li>Prices are dynamic and subject to change until payment is completed.</li>
                            <li>We accept major credit/debit cards, net banking, and UPI.</li>
                            <li>In case of payment failure, please check your bank statement before retrying.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>3. Ticket Issuance</h2>
                        <p>E-tickets are typically issued immediately after payment confirmation.</p>
                        <ul>
                            <li>In some cases, issuance may take up to 4 hours.</li>
                            <li>If you do not receive your ticket within 4 hours, please contact support.</li>
                            <li>It is your responsibility to check the accuracy of the ticket details immediately upon receipt.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>4. Changes and Amendments</h2>
                        <p>Changes to bookings are subject to airline rules and availability.</p>
                        <ul>
                            <li>Name changes are generally not permitted by airlines.</li>
                            <li>Date or route changes may incur airline penalties and fare differences.</li>
                            <li>Service fees may apply for processing changes.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>5. Check-in and Boarding</h2>
                        <p>Passengers must comply with airline check-in deadlines.</p>
                        <ul>
                            <li>We recommend arriving at the airport at least 3 hours before international flights and 2 hours before domestic flights.</li>
                            <li>Web check-in is mandatory for many airlines.</li>
                            <li>Carry a valid photo ID and a printout/digital copy of your e-ticket.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>6. Baggage Policy</h2>
                        <p>Baggage allowances vary by airline and fare class.</p>
                        <ul>
                            <li>Please check your e-ticket for specific baggage allowance details.</li>
                            <li>Excess baggage charges are payable directly to the airline at the airport.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>7. Contact Us</h2>
                        <p>For any booking-related queries, please reach out to us:</p>
                        <ul>
                            <li><i className="fas fa-envelope"></i> Email: support@paymm.com</li>
                            <li><i className="fas fa-phone"></i> Phone: +91-98765-43210</li>
                        </ul>
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
        }
      `}</style>
        </div>
    );
}
