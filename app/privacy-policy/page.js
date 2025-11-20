"use client";
import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="policy-page">
            {/* Header */}
            <header className="policy-header">
                <div className="policy-header-content">
                    <Link href="/" className="back-btn">
                        <i className="fas fa-arrow-left"></i>
                    </Link>
                    <h1>Privacy Policy</h1>
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

                    {/* Privacy Policy Content */}
                    <section className="policy-section">
                        <h2>1. Introduction</h2>
                        <p>Welcome to Paymm Advisory Pvt Ltd. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our flight booking services.</p>
                    </section>

                    <section className="policy-section">
                        <h2>2. Information We Collect</h2>
                        <p>We collect information that you provide directly to us, including:</p>
                        <ul>
                            <li>Personal identification information (Name, email address, phone number)</li>
                            <li>Payment information and billing address</li>
                            <li>Travel preferences and booking history</li>
                            <li>Passport and visa information when required</li>
                            <li>Device information and usage data</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>3. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Process your flight bookings and reservations</li>
                            <li>Send booking confirmations and updates</li>
                            <li>Provide customer support and respond to inquiries</li>
                            <li>Improve our services and user experience</li>
                            <li>Send promotional offers and travel deals (with your consent)</li>
                            <li>Comply with legal obligations and prevent fraud</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>4. Information Sharing</h2>
                        <p>We may share your information with:</p>
                        <ul>
                            <li>Airlines, hotels, and other travel service providers</li>
                            <li>Payment processors for secure transactions</li>
                            <li>Government authorities when legally required</li>
                            <li>Service providers who assist in our operations</li>
                        </ul>
                        <p>We do not sell your personal information to third parties.</p>
                    </section>

                    <section className="policy-section">
                        <h2>5. Data Security</h2>
                        <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.</p>
                    </section>

                    <section className="policy-section">
                        <h2>6. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access and receive a copy of your personal data</li>
                            <li>Correct inaccurate or incomplete information</li>
                            <li>Request deletion of your personal information</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Withdraw consent at any time</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>7. Cookies and Tracking</h2>
                        <p>We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. You can control cookie settings through your browser.</p>
                    </section>

                    <section className="policy-section">
                        <h2>8. Children's Privacy</h2>
                        <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children.</p>
                    </section>

                    <section className="policy-section">
                        <h2>9. Changes to Privacy Policy</h2>
                        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
                    </section>

                    <section className="policy-section">
                        <h2>10. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us:</p>
                        <ul>
                            <li><i className="fas fa-envelope"></i> Email: support@paymm.com</li>
                            <li><i className="fas fa-phone"></i> Phone: +91-XXXXXXXXXX</li>
                            <li><i className="fas fa-map-marker-alt"></i> Address: L NO-A1, Sinjini Apt, Kali Park, Bhatenda, Kolkata, West Bengal - 700136, India</li>
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
