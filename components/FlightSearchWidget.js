"use client";
import React, { useState, useRef } from 'react';
import './FlightSearchWidget.css';
import { useRouter } from 'next/navigation';
import AirportAutocomplete from './AirportAutocomplete';

const FlightSearchWidget = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('one-way');

    // Airport codes
    const [fromCode, setFromCode] = useState('DEL');
    const [toCode, setToCode] = useState('BLR');

    // Date refs for manual triggering
    const departureRef = useRef(null);
    const returnRef = useRef(null);

    const handleDateClick = (ref) => {
        if (ref.current) {
            try {
                if (typeof ref.current.showPicker === 'function') {
                    ref.current.showPicker();
                } else {
                    ref.current.focus();
                }
            } catch (error) {
                console.log('Error opening date picker:', error);
            }
        }
    };

    // Dates in ISO format (YYYY-MM-DD) for date input
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [departureDate, setDepartureDate] = useState(today.toISOString().split('T')[0]);
    const [returnDate, setReturnDate] = useState(tomorrow.toISOString().split('T')[0]);

    // Passenger counts
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [infants, setInfants] = useState(0);

    // Travel class
    const [travelClass, setTravelClass] = useState('e');

    // Dropdown state
    const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);

    const classOptions = {
        'e': 'Economy',
        'pe': 'Premium Economy',
        'b': 'Business',
        'pb': 'Premium Business',
        'f': 'First'
    };

    const handleSwap = () => {
        const temp = fromCode;
        setFromCode(toCode);
        setToCode(temp);
    };

    // Convert YYYY-MM-DD to DDMMYYYY format for API
    const formatDateForAPI = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}${month}${year}`;
    };

    // Format date for display
    const formatDateForDisplay = (isoDate) => {
        const date = new Date(isoDate);
        const day = date.getDate();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear().toString().slice(-2);
        return { day, month: `${month}'${year}` };
    };

    const handleSearch = () => {
        // Construct query parameters
        const queryParams = new URLSearchParams({
            from: fromCode.toUpperCase(),
            to: toCode.toUpperCase(),
            date: formatDateForAPI(departureDate),
            adults: adults.toString(),
            children: children.toString(),
            infants: infants.toString(),
            class: travelClass
        }).toString();

        router.push(`/search?${queryParams}`);
    };

    const depDateFormatted = formatDateForDisplay(departureDate);
    const retDateFormatted = formatDateForDisplay(returnDate);
    const totalPassengers = adults + children + infants;

    const incrementPassenger = (type) => {
        if (type === 'adults' && adults < 9) setAdults(adults + 1);
        if (type === 'children' && children < 9) setChildren(children + 1);
        if (type === 'infants' && infants < 9) setInfants(infants + 1);
    };

    const decrementPassenger = (type) => {
        if (type === 'adults' && adults > 1) setAdults(adults - 1);
        if (type === 'children' && children > 0) setChildren(children - 1);
        if (type === 'infants' && infants > 0) setInfants(infants - 1);
    };

    const [activeServiceTab, setActiveServiceTab] = useState('Flight');

    return (
        <div className="fs-widget-root">
            {/* Premium Header Section */}
            <div className="premium-header-section">
                <div className="ph-content-wrapper">
                    {/* Top Bar: Greeting + Profile */}
                    <div className="ph-top-bar">
                        <div className="ph-user-info">
                            <div className="ph-avatar">
                                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                            </div>
                            <div className="ph-greeting-text">
                                <span className="ph-hello">Hello, Traveler 👋</span>
                                <span className="ph-subtitle">Where to next?</span>
                            </div>
                        </div>
                        <div className="ph-actions">
                            <button className="ph-icon-btn">
                                <i className="far fa-bell"></i>
                                <span className="ph-badge">2</span>
                            </button>
                        </div>
                    </div>

                    {/* Service Tabs - Horizontal Scroll */}
                    <div className="ph-tabs-scroll-container">
                        <div className="ph-tabs">
                            {[
                                { id: 'Flight', icon: 'fas fa-plane' },
                                { id: 'Hotel', icon: 'fas fa-hotel' },
                                { id: 'Train', icon: 'fas fa-train' },
                                { id: 'Bus', icon: 'fas fa-bus' },
                                { id: 'Cabs', icon: 'fas fa-taxi' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    className={`ph-tab ${activeServiceTab === item.id ? 'active' : ''}`}
                                    onClick={() => setActiveServiceTab(item.id)}
                                >
                                    <i className={item.icon}></i>
                                    <span>{item.id}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Background & Wave */}
                <div className="ph-background-overlay"></div>
                <div className="ph-wave-divider">
                    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="wave-svg">
                        <path
                            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                            fill="#ffffff" // Matches widget background
                        ></path>
                    </svg>
                </div>
            </div>

            <div className="widget-wrapper">
                <div className="search-container-widget">
                    <div className="tabs-area">
                        <div className="tabs-bg-shape"></div>
                        <button
                            className={`tab-btn ${activeTab === 'one-way' ? 'active' : ''}`}
                            onClick={() => setActiveTab('one-way')}
                        >
                            One Way
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'round-trip' ? 'active' : ''}`}
                            onClick={() => setActiveTab('round-trip')}
                        >
                            Round Trip
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'multi-city' ? 'active' : ''}`}
                            onClick={() => setActiveTab('multi-city')}
                        >
                            Multi City
                        </button>
                    </div>

                    <div className="cities-container">
                        <div className="field-box f-city">
                            <AirportAutocomplete
                                value={fromCode}
                                onChange={setFromCode}
                                label="From"
                                icon="fas fa-plane-departure"
                                placeholder="Search departure airport..."
                            />
                        </div>

                        <div className="swap-circle" onClick={handleSwap}>
                            <i className="fas fa-exchange-alt"></i>
                        </div>

                        <div className="field-box f-city">
                            <AirportAutocomplete
                                value={toCode}
                                onChange={setToCode}
                                label="To"
                                icon="fas fa-plane-arrival"
                                placeholder="Search arrival airport..."
                            />
                        </div>
                    </div>


                    <div className="dates-container">
                        <div
                            className="field-box f-date"
                            onClick={() => handleDateClick(departureRef)}
                        >
                            <span className="label">Departure Date</span>
                            <span className="date-display">
                                <i className="far fa-calendar-alt"></i>
                                <span className="date-text">{depDateFormatted.day.toString().padStart(2, '0')}/{(new Date(departureDate).getMonth() + 1).toString().padStart(2, '0')}/{new Date(departureDate).getFullYear()}</span>
                            </span>
                            <span className="sub-info">{depDateFormatted.month}</span>
                            <input
                                ref={departureRef}
                                type="date"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="date-input-hidden"
                            />
                        </div>

                        <div
                            className={`field-box f-date return-date-field ${activeTab !== 'round-trip' ? 'hidden' : ''}`}
                            onClick={() => handleDateClick(returnRef)}
                        >
                            <span className="label">Return Date</span>
                            <span className="date-display">
                                <i className="far fa-calendar-alt"></i>
                                <span className="date-text">{retDateFormatted.day.toString().padStart(2, '0')}/{(new Date(returnDate).getMonth() + 1).toString().padStart(2, '0')}/{new Date(returnDate).getFullYear()}</span>
                            </span>
                            <span className="sub-info">{retDateFormatted.month}</span>
                            <input
                                ref={returnRef}
                                type="date"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                                min={departureDate}
                                className="date-input-hidden"
                            />
                        </div>
                    </div>

                    <div
                        className="field-box f-traveler clickable"
                        onClick={() => setShowTravelerDropdown(!showTravelerDropdown)}
                    >
                        <div className="label">Travelers & Class</div>
                        <div className="value">
                            <i className="fas fa-users"></i>
                            <span className="traveler-display">{totalPassengers} <span className="class-label">{classOptions[travelClass]}</span></span>
                        </div>
                        <div className="sub-info">{adults} Adult{adults > 1 ? 's' : ''}, {children} Child{children !== 1 ? 'ren' : ''}, {infants} Infant{infants !== 1 ? 's' : ''}</div>

                        {/* Dropdown */}
                        {showTravelerDropdown && (
                            <div className="traveler-dropdown" onClick={(e) => e.stopPropagation()}>
                                <div className="dropdown-row">
                                    <div className="passenger-info">
                                        <div className="passenger-type">Adults</div>
                                        <div className="passenger-desc">12+ years</div>
                                    </div>
                                    <div className="counter-controls">
                                        <button
                                            className="counter-btn"
                                            onClick={() => decrementPassenger('adults')}
                                            disabled={adults <= 1}
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <span className="counter-value">{adults}</span>
                                        <button
                                            className="counter-btn"
                                            onClick={() => incrementPassenger('adults')}
                                            disabled={adults >= 9}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="dropdown-row">
                                    <div className="passenger-info">
                                        <div className="passenger-type">Children</div>
                                        <div className="passenger-desc">2-12 years</div>
                                    </div>
                                    <div className="counter-controls">
                                        <button
                                            className="counter-btn"
                                            onClick={() => decrementPassenger('children')}
                                            disabled={children <= 0}
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <span className="counter-value">{children}</span>
                                        <button
                                            className="counter-btn"
                                            onClick={() => incrementPassenger('children')}
                                            disabled={children >= 9}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="dropdown-row">
                                    <div className="passenger-info">
                                        <div className="passenger-type">Infants</div>
                                        <div className="passenger-desc">Below 2 years</div>
                                    </div>
                                    <div className="counter-controls">
                                        <button
                                            className="counter-btn"
                                            onClick={() => decrementPassenger('infants')}
                                            disabled={infants <= 0}
                                        >
                                            <i className="fas fa-minus"></i>
                                        </button>
                                        <span className="counter-value">{infants}</span>
                                        <button
                                            className="counter-btn"
                                            onClick={() => incrementPassenger('infants')}
                                            disabled={infants >= 9}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="dropdown-divider"></div>

                                <div className="class-selection">
                                    <div className="class-label-dropdown">Travel Class</div>
                                    <div className="class-options">
                                        {Object.entries(classOptions).map(([key, label]) => (
                                            <button
                                                key={key}
                                                className={`class-option-btn ${travelClass === key ? 'active' : ''}`}
                                                onClick={() => setTravelClass(key)}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className="dropdown-done-btn"
                                    onClick={() => setShowTravelerDropdown(false)}
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="btn-wrapper">
                        <button className="search-btn" onClick={handleSearch}>
                            Search Flights <i className="fas fa-search"></i>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FlightSearchWidget;
