"use client";
import Link from "next/link";

export default function TermsConditions() {
    return (
        <div className="policy-page">
            {/* Header */}
            <header className="policy-header">
                <div className="policy-header-content">
                    <Link href="/" className="back-btn">
                        <i className="fas fa-arrow-left"></i>
                    </Link>
                    <h1>Terms & Conditions of Use</h1>
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

                    {/* Terms Content */}
                    <section className="policy-section">
                        <h2>1. Introduction</h2>
                        <p>Welcome to Paymm Advisory Pvt Ltd. By accessing our website and using our services, you agree to be bound by these Terms and Conditions. Please read them carefully before making any bookings.</p>
                    </section>

                    <section className="policy-section">
                        <h2>2. Booking Services</h2>
                        <p>We provide flight booking services as an intermediary between you and the airlines. All bookings are subject to the terms and conditions of the respective airlines.</p>
                        <ul>
                            <li>All fares are subject to availability and may change without prior notice.</li>
                            <li>Bookings are confirmed only after full payment is received.</li>
                            <li>E-tickets will be issued and sent to your registered email address.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>3. User Responsibilities</h2>
                        <p>As a user of our services, you agree to:</p>
                        <ul>
                            <li>Provide accurate and complete information during booking.</li>
                            <li>Ensure you have valid travel documents (passport, visa, etc.).</li>
                            <li>Comply with all airline rules and regulations.</li>
                            <li>Verify flight timings and status before departure.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>4. Payments and Fees</h2>
                        <p>We accept various payment methods including credit/debit cards and net banking.</p>
                        <ul>
                            <li>All prices include applicable taxes unless stated otherwise.</li>
                            <li>We may charge a service fee for our booking services.</li>
                            <li>Convenience fees are non-refundable.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>5. Cancellations and Refunds</h2>
                        <p>Cancellations and refunds are governed by the airline's policy and our Refund Policy.</p>
                        <ul>
                            <li>Cancellation requests must be made through our support channels.</li>
                            <li>Refunds will be processed to the original mode of payment.</li>
                            <li>Airline cancellation charges and our service fees apply.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>6. Limitation of Liability</h2>
                        <p>Paymm Advisory Pvt Ltd is not liable for:</p>
                        <ul>
                            <li>Flight delays, cancellations, or schedule changes by airlines.</li>
                            <li>Loss of baggage or personal belongings.</li>
                            <li>Force majeure events beyond our control.</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>7. Intellectual Property</h2>
                        <p>All content on this website, including text, graphics, logos, and software, is the property of Paymm Advisory Pvt Ltd and is protected by copyright laws.</p>
                    </section>

                    <section className="policy-section">
                        <h2>8. Governing Law</h2>
                        <p>These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Kolkata, West Bengal.</p>
                    </section>

                    <section className="policy-section">
                        <h2>9. Contact Us</h2>
                        <p>If you have any questions about these Terms and Conditions, please contact us:</p>
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
