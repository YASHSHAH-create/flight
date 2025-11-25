"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [from, setFrom] = useState("BLR");
  const [to, setTo] = useState("DEL");
  const [date, setDate] = useState("2025-11-25");
  const [travelers, setTravelers] = useState(1);

  const handleSearch = () => {
    const queryParams = new URLSearchParams({
      date,
      adults: travelers,
    }).toString();
    // Redirect to SEO-friendly route
    router.push(`/flights/${from.toLowerCase()}-to-${to.toLowerCase()}?${queryParams}`);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="header-left">
          <div className="header-icon">
            <i className="fas fa-crosshairs"></i>
          </div>
          <h1 className="header-title">Where are you flying to?</h1>
        </div>
        <div className="header-right">
          <div className="header-bell">
            <i className="far fa-bell"></i>
          </div>
          <div className="header-profile">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" />
          </div>
        </div>
      </div>

      {/* Mobile Search Container */}
      <div className="mobile-search-container">
        {/* Tabs */}
        <div className="mobile-search-tabs">
          <button className="mobile-tab active">One way</button>
          <button className="mobile-tab">Round Trip</button>
          <button className="mobile-tab">Multicity</button>
        </div>

        {/* Route Stack */}
        <div className="mobile-route-container">
          {/* From */}
          <div className="mobile-input-row">
            <div className="route-icon">
              <i className="fas fa-plane-departure"></i>
            </div>
            <div className="route-details">
              <span className="route-label">From</span>
              <div className="route-value">
                London, UK
                <span className="route-code">LHR</span>
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <button className="mobile-swap-btn">
            <i className="fas fa-exchange-alt"></i>
          </button>

          {/* To */}
          <div className="mobile-input-row">
            <div className="route-icon">
              <i className="fas fa-plane-arrival"></i>
            </div>
            <div className="route-details">
              <span className="route-label">To</span>
              <div className="route-value">
                Lagos, Nigeria
                <span className="route-code">LOS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date & Travelers Grid */}
        <div className="mobile-grid-row">
          {/* Date */}
          <div className="mobile-card-input">
            <span className="input-label-small">
              <i className="far fa-calendar-alt"></i> Departure
            </span>
            <span className="input-value-large">Sat, 14 Aug</span>
          </div>

          {/* Travelers */}
          <div className="mobile-card-input">
            <span className="input-label-small">
              <i className="far fa-user"></i> Travelers
            </span>
            <span className="input-value-large">2 Adult</span>
          </div>
        </div>

        {/* Button */}
        <button className="mobile-search-btn">
          <i className="fas fa-search"></i> Search Flights
        </button>
      </div>

      <header className="desktop-header">
        <div className="logo">
          <Image
            src="/IMG_8591.png"
            alt="Paymm Logo"
            width={150}
            height={50}
            style={{ objectFit: 'contain', maxHeight: '50px', width: 'auto' }}
            priority
          />
        </div>
        <nav>
          <ul>
            <li>
              <a href="#">Hotel</a>
            </li>
            <li>
              <a href="#">Flight</a>
            </li>
            <li>
              <a href="#">Shop</a>
            </li>
            <li>
              <a href="#">Holiday</a>
            </li>
            <li>
              <a href="#">
                Others <i className="fas fa-chevron-down" style={{ fontSize: "0.8rem" }}></i>
              </a>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <button className="currency-btn">
            <i className="fas fa-globe"></i> USD
          </button>
          <button className="btn-signin">
            <i className="fas fa-user-circle"></i> Sign in
          </button>
        </div>
      </header>

      <section className="hero">
        <h1>Welcome To Paymm !</h1>
        <p>Find Flights, Hotels, Visa & Holidays</p>
        {/* Using a div with background image to simulate the plane for now */}
        <div className="plane-img"></div>
      </section>

      <div className="search-container">
        <div className="search-card">
          <div className="search-header">
            <div className="search-tabs">
              <div className="search-tab">
                <i className="fas fa-hotel"></i> Hotels
              </div>
              <div className="search-tab active">
                <i className="fas fa-plane"></i> Flights
              </div>
            </div>
          </div>

          <div className="trip-type">
            <label className="radio-group">
              <div className="custom-radio selected">
                <div className="radio-dot"></div>
              </div>
              <span>One Way</span>
            </label>
            <label className="radio-group">
              <div className="custom-radio"></div>
              <span>Round Way</span>
            </label>
            <label className="radio-group">
              <div className="custom-radio"></div>
              <span>Multi City</span>
            </label>
          </div>

          <div className="search-inputs-row">
            {/* From */}
            <div className="input-group">
              <div className="input-icon">
                <i className="fas fa-plane-departure"></i>
              </div>
              <div className="input-content">
                <span className="input-label">From</span>
                <input
                  type="text"
                  className="input-value"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  style={{ border: 'none', background: 'transparent', width: '100%', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
                />
                <div className="input-sub">Origin Airport</div>
              </div>
              <div className="swap-btn">
                <i className="fas fa-exchange-alt"></i>
              </div>
            </div>

            {/* To */}
            <div className="input-group">
              <div className="input-icon">
                <i className="fas fa-plane-arrival"></i>
              </div>
              <div className="input-content">
                <span className="input-label">To</span>
                <input
                  type="text"
                  className="input-value"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  style={{ border: 'none', background: 'transparent', width: '100%', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
                />
                <div className="input-sub">Destination Airport</div>
              </div>
            </div>

            {/* Dates */}
            <div className="input-group">
              <div className="input-icon">
                <i className="far fa-calendar-alt"></i>
              </div>
              <div className="input-content">
                <span className="input-label">Dates</span>
                <input
                  type="date"
                  className="input-value"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{ border: 'none', background: 'transparent', width: '100%', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
                />
                <div className="input-sub">Departure Date</div>
              </div>
            </div>

            {/* Travelers */}
            <div className="input-group">
              <div className="input-icon">
                <i className="fas fa-user-friends"></i>
              </div>
              <div className="input-content">
                <span className="input-label">Travelers</span>
                <input
                  type="number"
                  className="input-value"
                  value={travelers}
                  min="1"
                  onChange={(e) => setTravelers(parseInt(e.target.value))}
                  style={{ border: 'none', background: 'transparent', width: '100%', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
                />
                <div className="input-sub">Travelers</div>
              </div>
            </div>

            {/* Search Button */}
            <button className="btn-search-large" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </div>

      <section className="destinations">
        <div className="section-header">
          <div className="badge">
            <i className="fas fa-check-circle"></i> Popular Destinations
          </div>
          <h2>
            Popular Destinations
            <br />
            To Explore
          </h2>
        </div>

        <div className="destinations-grid">
          {/* Card 1 */}
          <div className="dest-card">
            <img
              src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop"
              alt="Paris"
              className="dest-img"
            />
            <div className="dest-info">
              <div className="dest-title">Romance in the City of Lights</div>
              <div className="dest-meta">
                <div className="dest-location">
                  <i className="fas fa-map-marker-alt"></i> Paris, France
                </div>
                <div className="dest-rating">
                  <i className="fas fa-star"></i> 5.0
                </div>
              </div>
              <div className="dest-price">$2999</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="dest-card">
            <img
              src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop"
              alt="Santorini"
              className="dest-img"
            />
            <div className="dest-info">
              <div className="dest-title">Sunset Dreams by the Sea</div>
              <div className="dest-meta">
                <div className="dest-location">
                  <i className="fas fa-map-marker-alt"></i> Santorini, Greece
                </div>
                <div className="dest-rating">
                  <i className="fas fa-star"></i> 5.0
                </div>
              </div>
              <div className="dest-price">$3999</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="dest-card">
            <img
              src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop"
              alt="Tokyo"
              className="dest-img"
            />
            <div className="dest-info">
              <div className="dest-title">The Future Meets Tradition</div>
              <div className="dest-meta">
                <div className="dest-location">
                  <i className="fas fa-map-marker-alt"></i> Tokyo, Japan
                </div>
                <div className="dest-rating">
                  <i className="fas fa-star"></i> 5.0
                </div>
              </div>
              <div className="dest-price">$2599</div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="dest-card">
            <img
              src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2070&auto=format&fit=crop"
              alt="Swiss Alps"
              className="dest-img"
            />
            <div className="dest-info">
              <div className="dest-title">Adventure in the Mountains</div>
              <div className="dest-meta">
                <div className="dest-location">
                  <i className="fas fa-map-marker-alt"></i> Swiss Alps, Switzerland
                </div>
                <div className="dest-rating">
                  <i className="fas fa-star"></i> 5.0
                </div>
              </div>
              <div className="dest-price">$2999</div>
            </div>
          </div>
        </div>

        <div className="slider-controls">
          <button className="control-btn">
            <i className="fas fa-arrow-left"></i>
          </button>
          <button className="control-btn">
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">Paymm</h3>
            <p className="footer-desc">Your trusted partner for seamless travel experiences. Discover flights, hotels, and holiday packages at the best prices.</p>
            <div className="footer-social">
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/about-us"><i className="fas fa-chevron-right"></i> About Us</a></li>
              <li><a href="/contact-us"><i className="fas fa-chevron-right"></i> Contact Us</a></li>
              <li><a href="#"><i className="fas fa-chevron-right"></i> Careers</a></li>
              <li><a href="#"><i className="fas fa-chevron-right"></i> Blog</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Policies</h4>
            <ul className="footer-links">
              <li><a href="/privacy-policy"><i className="fas fa-chevron-right"></i> Privacy Policy</a></li>
              <li><a href="/refund-policy"><i className="fas fa-chevron-right"></i> Refund Policy</a></li>
              <li><a href="/terms-conditions"><i className="fas fa-chevron-right"></i> Terms & Conditions</a></li>
              <li><a href="/booking-policy"><i className="fas fa-chevron-right"></i> Booking Policy</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <ul className="footer-contact">
              <li><i className="fas fa-building"></i> Paymm Advisory Pvt Ltd</li>
              <li><i className="fas fa-map-marker-alt"></i> Kolkata, West Bengal</li>
              <li><i className="fas fa-phone"></i> +91-98765-43210</li>
              <li><i className="fas fa-envelope"></i> support@paymm.com</li>
              <li className="gst-info"><i className="fas fa-file-invoice"></i> GST: 10AAMCP7167L1Z1</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Paymm Advisory Pvt Ltd. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="/privacy-policy">Privacy</a>
            <span>•</span>
            <a href="/refund-policy">Refund</a>
            <span>•</span>
            <a href="/contact-us">Contact</a>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <a href="#" className="nav-item active">
          <i className="fas fa-home"></i>
          <span>Home</span>
        </a>
        <a href="#" className="nav-item">
          <i className="fas fa-globe"></i>
          <span>Explore</span>
        </a>
        <a href="#" className="nav-item">
          <i className="fas fa-plane"></i>
          <span>Trips</span>
        </a>
        <a href="#" className="nav-item">
          <i className="far fa-user"></i>
          <span>Profile</span>
        </a>
      </nav>
    </>
  );
}
