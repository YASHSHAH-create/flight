"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FlightSearchWidget from "../components/FlightSearchWidget";

export default function Home() {
  const router = useRouter();


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
            <Image
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
              width={40}
              height={40}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Search Container - REMOVED and replaced by responsive FlightSearchWidget */}

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
        <Image
          src="/image.png"
          alt="Hero Background"
          fill
          priority
          quality={80}
          style={{ objectFit: 'cover', zIndex: -1 }}
        />
        <h1>Welcome To Paymm !</h1>
        <p>Find Flights, Hotels, Visa & Holidays</p>
        {/* Using a div with background image to simulate the plane for now */}
        <div className="plane-img"></div>
      </section>

      {/* New Wavy Flight Search Widget */}
      <div className="search-widget-container">
        <FlightSearchWidget />
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
            <Image
              src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop"
              alt="Paris"
              className="dest-img"
              width={400}
              height={300}
              style={{ objectFit: 'cover' }}
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
            <Image
              src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop"
              alt="Santorini"
              className="dest-img"
              width={400}
              height={300}
              style={{ objectFit: 'cover' }}
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
            <Image
              src="https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop"
              alt="Tokyo"
              className="dest-img"
              width={400}
              height={300}
              style={{ objectFit: 'cover' }}
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
            <Image
              src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=2070&auto=format&fit=crop"
              alt="Swiss Alps"
              className="dest-img"
              width={400}
              height={300}
              style={{ objectFit: 'cover' }}
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
