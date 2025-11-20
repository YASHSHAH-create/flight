"use client";
import Link from "next/link";
import { useState } from "react";

export default function ContactUs() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        alert("Thank you for contacting us! We will get back to you soon.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="contact-page">
            {/* Header */}
            <header className="contact-header">
                <div className="contact-header-content">
                    <Link href="/" className="back-btn">
                        <i className="fas fa-arrow-left"></i>
                    </Link>
                    <h1>Contact Us</h1>
                </div>
            </header>

            {/* Content */}
            <div className="contact-content">
                <div className="contact-intro">
                    <h2>Get in Touch</h2>
                    <p>We're here to help! Reach out to us for any queries, support, or feedback.</p>
                </div>

                <div className="contact-container">
                    {/* Contact Info Cards */}
                    <div className="contact-info-grid">
                        {/* Company Card */}
                        <div className="info-card company-card">
                            <div className="card-icon">
                                <i className="fas fa-building"></i>
                            </div>
                            <h3>Paymm Advisory Pvt Ltd</h3>
                            <p className="gst-text">GST: 10AAMCP7167L1Z1</p>
                        </div>

                        {/* Head Office */}
                        <div className="info-card">
                            <div className="card-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <h3>Head Office</h3>
                            <p>L NO-A1, Sinjini Apt, Kali Park, Bhatenda,<br />Kolkata, West Bengal - 700136<br />India</p>
                        </div>

                        {/* Branch Office */}
                        <div className="info-card">
                            <div className="card-icon">
                                <i className="fas fa-building"></i>
                            </div>
                            <h3>Branch Office</h3>
                            <p>Ranjan Galaxy, New Vigrahpur,<br />Gate No. 2, Near Nutan Apartment,<br />Mithapur Old Bus Stand Opposite,<br />Patna, Bihar - 800020<br />India</p>
                        </div>

                        {/* Phone */}
                        <div className="info-card">
                            <div className="card-icon">
                                <i className="fas fa-phone"></i>
                            </div>
                            <h3>Phone</h3>
                            <p>
                                <a href="tel:+919876543210">+91-98765-43210</a><br />
                                <a href="tel:+919876543211">+91-98765-43211</a>
                            </p>
                            <span className="availability">Mon - Sun: 9:00 AM - 9:00 PM</span>
                        </div>

                        {/* Email */}
                        <div className="info-card">
                            <div className="card-icon">
                                <i className="fas fa-envelope"></i>
                            </div>
                            <h3>Email</h3>
                            <p>
                                <a href="mailto:support@paymm.com">support@paymm.com</a><br />
                                <a href="mailto:info@paymm.com">info@paymm.com</a>
                            </p>
                            <span className="availability">We reply within 24 hours</span>
                        </div>

                        {/* Support */}
                        <div className="info-card">
                            <div className="card-icon">
                                <i className="fas fa-headset"></i>
                            </div>
                            <h3>Customer Support</h3>
                            <p><a href="mailto:refunds@paymm.com">refunds@paymm.com</a></p>
                            <span className="availability">24/7 Support Available</span>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <div className="form-header">
                            <h2>Send Us a Message</h2>
                            <p>Fill out the form below and we'll get back to you as soon as possible</p>
                        </div>

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">
                                        <i className="fas fa-user"></i> Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">
                                        <i className="fas fa-envelope"></i> Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">
                                        <i className="fas fa-phone"></i> Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91-XXXXX-XXXXX"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">
                                        <i className="fas fa-tag"></i> Subject *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="booking">Booking Inquiry</option>
                                        <option value="cancellation">Cancellation/Refund</option>
                                        <option value="support">Technical Support</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">
                                    <i className="fas fa-comment-dots"></i> Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    placeholder="Tell us how we can help you..."
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-btn">
                                <i className="fas fa-paper-plane"></i> Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .contact-page {
          min-height: 100vh;
          background: #f8fafc;
        }

        .contact-header {
          background: linear-gradient(135deg, #0066FF 0%, #4D94FF 100%);
          padding: 2rem 0;
          color: white;
          box-shadow: 0 4px 20px rgba(0, 102, 255, 0.2);
        }

        .contact-header-content {
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

        .contact-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .contact-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        .contact-intro {
          text-align: center;
          margin-bottom: 3rem;
        }

        .contact-intro h2 {
          color: #1e293b;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .contact-intro p {
          color: #64748b;
          font-size: 1.1rem;
        }

        .contact-container {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .info-card {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s, box-shadow 0.3s;
          border: 1px solid #f1f5f9;
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 40px rgba(0, 102, 255, 0.1);
        }

        .company-card {
          background: linear-gradient(135deg, #0066FF 0%, #4D94FF 100%);
          color: white;
        }

        .card-icon {
          width: 60px;
          height: 60px;
          background: rgba(0, 102, 255, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          color: #0066FF;
        }

        .company-card .card-icon {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .info-card h3 {
          color: #1e293b;
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
        }

        .company-card h3 {
          color: white;
          font-size: 1.5rem;
        }

        .info-card p {
          color: #64748b;
          line-height: 1.8;
          margin: 0;
        }

        .company-card p {
          color: rgba(255, 255, 255, 0.9);
        }

        .info-card a {
          color: #0066FF;
          text-decoration: none;
          transition: color 0.3s;
        }

        .info-card a:hover {
          color: #0056b3;
          text-decoration: underline;
        }

        .company-card a {
          color: white;
        }

        .gst-text {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .availability {
          display: block;
          margin-top: 0.8rem;
          font-size: 0.85rem;
          color: #64748b;
          font-style: italic;
        }

        .contact-form-section {
          background: white;
          padding: 3rem;
          border-radius: 24px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-header h2 {
          color: #1e293b;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          color: #64748b;
          font-size: 1rem;
        }

        .contact-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-group label i {
          color: #0066FF;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.9rem 1.2rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          font-family: 'Poppins', sans-serif;
          transition: border-color 0.3s, box-shadow 0.3s;
          color: #1e293b;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0066FF;
          box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #0066FF 0%, #4D94FF 100%);
          color: white;
          border: none;
          padding: 1.2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 10px 30px rgba(0, 102, 255, 0.3);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.4);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .contact-header h1 {
            font-size: 1.5rem;
          }

          .contact-intro h2 {
            font-size: 2rem;
          }

          .contact-info-grid {
            grid-template-columns: 1fr;
          }

          .contact-form-section {
            padding: 2rem 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}
