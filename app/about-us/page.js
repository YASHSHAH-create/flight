"use client";
import Link from "next/link";

export default function AboutUs() {
    return (
        <div className="about-page">
            {/* Header */}
            <header className="about-header">
                <div className="about-header-content">
                    <Link href="/" className="back-btn">
                        <i className="fas fa-arrow-left"></i>
                    </Link>
                    <h1>About Us</h1>
                </div>
            </header>

            {/* Content */}
            <div className="about-content">
                {/* Hero Section */}
                <div className="about-hero">
                    <h2>Welcome to Paymm Advisory Pvt Ltd</h2>
                    <p className="tagline">Your Trusted Partner for Seamless Travel Experiences</p>
                </div>

                {/* Main Content */}
                <div className="about-container">
                    {/* Company Overview */}
                    <section className="about-section">
                        <div className="section-icon">
                            <i className="fas fa-plane-departure"></i>
                        </div>
                        <h2>Who We Are</h2>
                        <p>Paymm Advisory Pvt Ltd is a leading travel solutions provider committed to making your travel dreams a reality. With years of expertise in the travel industry, we specialize in providing seamless flight booking services, ensuring that every journey begins with confidence and convenience.</p>
                        <p>Our platform combines cutting-edge technology with personalized customer service to offer you the best travel booking experience. Whether you're planning a business trip, a family vacation, or a solo adventure, we're here to make it happen.</p>
                    </section>

                    {/* Mission & Vision */}
                    <div className="mv-grid">
                        <div className="mv-card mission-card">
                            <div className="mv-icon">
                                <i className="fas fa-bullseye"></i>
                            </div>
                            <h3>Our Mission</h3>
                            <p>To provide exceptional travel solutions that combine affordability, convenience, and reliability. We strive to make every booking experience smooth and every journey memorable.</p>
                        </div>

                        <div className="mv-card vision-card">
                            <div className="mv-icon">
                                <i className="fas fa-eye"></i>
                            </div>
                            <h3>Our Vision</h3>
                            <p>To become India's most trusted and innovative travel platform, empowering travelers with the tools and services they need to explore the world with confidence.</p>
                        </div>
                    </div>

                    {/* What We Offer */}
                    <section className="about-section">
                        <div className="section-icon">
                            <i className="fas fa-gift"></i>
                        </div>
                        <h2>What We Offer</h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-search"></i>
                                </div>
                                <h4>Smart Search</h4>
                                <p>Advanced search tools to find the best flights at the best prices</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <h4>Secure Booking</h4>
                                <p>100% secure payment gateway for safe transactions</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-headset"></i>
                                </div>
                                <h4>24/7 Support</h4>
                                <p>Round-the-clock customer support for all your queries</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-tags"></i>
                                </div>
                                <h4>Best Deals</h4>
                                <p>Exclusive offers and discounts on domestic and international flights</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-mobile-alt"></i>
                                </div>
                                <h4>Mobile Friendly</h4>
                                <p>Book on-the-go with our responsive mobile platform</p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <i className="fas fa-undo"></i>
                                </div>
                                <h4>Easy Refunds</h4>
                                <p>Hassle-free cancellation and refund process</p>
                            </div>
                        </div>
                    </section>

                    {/* Why Choose Us */}
                    <section className="about-section highlight-section">
                        <div className="section-icon">
                            <i className="fas fa-star"></i>
                        </div>
                        <h2>Why Choose Paymm Advisory?</h2>
                        <ul className="benefits-list">
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span><strong>Competitive Pricing:</strong> We partner with major airlines to bring you the most competitive fares in the market</span>
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span><strong>User-Friendly Platform:</strong> Our intuitive interface makes booking flights quick and easy</span>
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span><strong>Transparency:</strong> No hidden charges - what you see is what you pay</span>
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span><strong>Verified & Licensed:</strong> Government registered company with GST compliance</span>
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span><strong>Customer-Centric:</strong> Your satisfaction is our top priority</span>
                            </li>
                        </ul>
                    </section>

                    {/* Company Information */}
                    <section className="about-section company-info-section">
                        <div className="section-icon">
                            <i className="fas fa-building"></i>
                        </div>
                        <h2>Company Information</h2>

                        <div className="company-details">
                            <div className="detail-card">
                                <h3><i className="fas fa-briefcase"></i> Company Name</h3>
                                <p>Paymm Advisory Pvt Ltd</p>
                            </div>

                            <div className="detail-card">
                                <h3><i className="fas fa-file-invoice"></i> GST Number</h3>
                                <p className="gst-number">10AAMCP7167L1Z1</p>
                            </div>
                        </div>

                        <div className="offices-grid">
                            <div className="office-card head-office">
                                <div className="office-badge">Head Office</div>
                                <div className="office-icon">
                                    <i className="fas fa-map-marker-alt"></i>
                                </div>
                                <h4>Kolkata, West Bengal</h4>
                                <p>L NO-A1, Sinjini Apt,<br />Kali Park, Bhatenda,<br />Kolkata, West Bengal - 700136<br />India</p>
                                <div className="office-contact">
                                    <a href="mailto:kolkata@paymm.com">
                                        <i className="fas fa-envelope"></i> kolkata@paymm.com
                                    </a>
                                </div>
                            </div>

                            <div className="office-card branch-office">
                                <div className="office-badge">Branch Office</div>
                                <div className="office-icon">
                                    <i className="fas fa-building"></i>
                                </div>
                                <h4>Patna, Bihar</h4>
                                <p>Ranjan Galaxy, New Vigrahpur,<br />Gate No. 2, Near Nutan Apartment,<br />Mithapur Old Bus Stand Opposite,<br />Patna, Bihar - 800020<br />India</p>
                                <div className="office-contact">
                                    <a href="mailto:patna@paymm.com">
                                        <i className="fas fa-envelope"></i> patna@paymm.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Our Commitment */}
                    <section className="about-section commitment-section">
                        <div className="commitment-content">
                            <i className="fas fa-heart commitment-icon"></i>
                            <h2>Our Commitment to You</h2>
                            <p>At Paymm Advisory Pvt Ltd, we believe that travel is more than just reaching a destination—it's about the journey, the experiences, and the memories you create along the way. We are committed to being your reliable travel partner, ensuring that every booking is handled with care, every query is answered promptly, and every journey starts on the right note.</p>
                            <p className="final-message">Thank you for choosing Paymm Advisory. Let's explore the world together!</p>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <div className="cta-section">
                        <h3>Ready to Start Your Journey?</h3>
                        <div className="cta-buttons">
                            <Link href="/" className="cta-btn primary">
                                <i className="fas fa-plane"></i> Book a Flight
                            </Link>
                            <Link href="/contact-us" className="cta-btn secondary">
                                <i className="fas fa-envelope"></i> Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .about-page {
          min-height: 100vh;
          background: #f8fafc;
        }

        .about-header {
          background: linear-gradient(135deg, #0066FF 0%, #4D94FF 100%);
          padding: 2rem 0;
          color: white;
          box-shadow: 0 4px 20px rgba(0, 102, 255, 0.2);
        }

        .about-header-content {
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

        .about-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .about-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .about-hero {
          text-align: center;
          margin-bottom: 3rem;
        }

        .about-hero h2 {
          color: #1e293b;
          font-size: 2.8rem;
          font-weight: 700;
          margin-bottom: 0.8rem;
        }

        .tagline {
          color: #0066FF;
          font-size: 1.3rem;
          font-weight: 500;
        }

        .about-container {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .about-section {
          background: white;
          padding: 3rem;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
        }

        .section-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #0066FF 0%, #4D94FF 100%);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-size: 2rem;
          color: white;
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
        }

        .about-section h2 {
          color: #1e293b;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }

        .about-section p {
          color: #64748b;
          line-height: 1.8;
          font-size: 1.05rem;
          margin-bottom: 1rem;
        }

        .mv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .mv-card {
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
        }

        .mission-card {
          background: linear-gradient(135deg, #fff9e6 0%, #ffe6cc 100%);
          border-left: 5px solid #ffa500;
        }

        .vision-card {
          background: linear-gradient(135deg, #e6f0ff 0%, #cce0ff 100%);
          border-left: 5px solid #0066FF;
        }

        .mv-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
        }

        .mission-card .mv-icon {
          background: #ffa500;
          color: white;
        }

        .vision-card .mv-icon {
          background: #0066FF;
          color: white;
        }

        .mv-card h3 {
          color: #1e293b;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .mv-card p {
          color: #64748b;
          line-height: 1.8;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .feature-card {
          background: #f8fafc;
          padding: 1.8rem;
          border-radius: 16px;
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
          border: 2px solid #e2e8f0;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.15);
          border-color: #0066FF;
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0066FF 0%, #4D94FF 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.5rem;
          color: white;
        }

        .feature-card h4 {
          color: #1e293b;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .feature-card p {
          color: #64748b;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0;
        }

        .highlight-section {
          background: linear-gradient(135deg, #f8fafc 0%, #e6f0ff 100%);
          border: 2px solid #0066FF;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 2rem 0 0 0;
        }

        .benefits-list li {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.2rem;
          color: #64748b;
          font-size: 1.05rem;
          line-height: 1.8;
        }

        .benefits-list i {
          color: #0066FF;
          font-size: 1.3rem;
          margin-top: 0.2rem;
          flex-shrink: 0;
        }

        .benefits-list strong {
          color: #1e293b;
        }

        .company-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .detail-card {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 16px;
          border: 2px solid #e2e8f0;
        }

        .detail-card h3 {
          color: #1e293b;
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-card h3 i {
          color: #0066FF;
        }

        .detail-card p {
          color: #64748b;
          font-size: 1.1rem;
          margin: 0;
        }

        .gst-number {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          color: #1e293b;
        }

        .offices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .office-card {
          padding: 2rem;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .head-office {
          background: linear-gradient(135deg, #0066FF 0%, #4D94FF 100%);
          color: white;
        }

        .branch-office {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
        }

        .office-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
        }

        .office-icon {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
        }

        .office-card h4 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .office-card p {
          line-height: 1.8;
          margin-bottom: 1.5rem;
          opacity: 0.95;
        }

        .office-contact a {
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: opacity 0.3s;
        }

        .office-contact a:hover {
          opacity: 0.8;
        }

        .commitment-section {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          text-align: center;
        }

        .commitment-icon {
          font-size: 4rem;
          color: #ff6b6b;
          margin-bottom: 1.5rem;
          animation: heartbeat 2s infinite;
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .commitment-content h2 {
          color: white;
          margin-bottom: 1.5rem;
        }

        .commitment-content p {
          color: rgba(255, 255, 255, 0.9);
        }

        .final-message {
          font-size: 1.2rem;
          font-weight: 600;
          color: white;
          margin-top: 1.5rem;
        }

        .cta-section {
          background: linear-gradient(135deg, #f8fafc 0%, #e6f0ff 100%);
          padding: 3rem;
          border-radius: 24px;
          text-align: center;
          border: 2px solid #0066FF;
        }

        .cta-section h3 {
          color: #1e293b;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-btn {
          padding: 1.2rem 2.5rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .cta-btn.primary {
          background: linear-gradient(135deg, #0066FF 0%, #4D94FF 100%);
          color: white;
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
        }

        .cta-btn.secondary {
          background: white;
          color: #0066FF;
          border: 2px solid #0066FF;
        }

        .cta-btn:hover {
          transform: translateY(-3px);
        }

        .cta-btn.primary:hover {
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.4);
        }

        .cta-btn.secondary:hover {
          background: #f8fafc;
        }

        @media (max-width: 768px) {
          .about-header h1 {
            font-size: 1.5rem;
          }

          .about-hero h2 {
            font-size: 2rem;
          }

          .tagline {
            font-size: 1.1rem;
          }

          .about-section {
            padding: 2rem 1.5rem;
          }

          .about-section h2 {
            font-size: 1.6rem;
          }

          .mv-grid,
          .features-grid {
            grid-template-columns: 1fr;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .cta-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
        </div>
    );
}
