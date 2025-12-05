"use client";
import React, { useState, useRef, useEffect } from 'react';
import './AirportAutocomplete.css';

// Comprehensive airport data
const airports = [
    // Indian Airports
    { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International Airport', country: 'India' },
    { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International Airport', country: 'India' },
    { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International Airport', country: 'India' },
    { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport', country: 'India' },
    { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International Airport', country: 'India' },
    { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport', country: 'India' },
    { code: 'PNQ', city: 'Pune', name: 'Pune Airport', country: 'India' },
    { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International Airport', country: 'India' },
    { code: 'GOI', city: 'Goa', name: 'Goa International Airport', country: 'India' },
    { code: 'COK', city: 'Kochi', name: 'Cochin International Airport', country: 'India' },
    { code: 'TRV', city: 'Trivandrum', name: 'Trivandrum International Airport', country: 'India' },
    { code: 'JAI', city: 'Jaipur', name: 'Jaipur International Airport', country: 'India' },
    { code: 'GAU', city: 'Guwahati', name: 'Lokpriya Gopinath Bordoloi International Airport', country: 'India' },
    { code: 'IXC', city: 'Chandigarh', name: 'Chandigarh International Airport', country: 'India' },
    { code: 'LKO', city: 'Lucknow', name: 'Chaudhary Charan Singh International Airport', country: 'India' },
    { code: 'BBI', city: 'Bhubaneswar', name: 'Biju Patnaik International Airport', country: 'India' },
    { code: 'IXB', city: 'Bagdogra', name: 'Bagdogra Airport', country: 'India' },
    { code: 'VNS', city: 'Varanasi', name: 'Lal Bahadur Shastri Airport', country: 'India' },
    { code: 'PAT', city: 'Patna', name: 'Jay Prakash Narayan International Airport', country: 'India' },
    { code: 'IXR', city: 'Ranchi', name: 'Birsa Munda Airport', country: 'India' },
    { code: 'NAG', city: 'Nagpur', name: 'Dr. Babasaheb Ambedkar International Airport', country: 'India' },
    { code: 'SXR', city: 'Srinagar', name: 'Sheikh ul-Alam International Airport', country: 'India' },
    { code: 'IXJ', city: 'Jammu', name: 'Jammu Airport', country: 'India' },
    { code: 'ATQ', city: 'Amritsar', name: 'Sri Guru Ram Dass Jee International Airport', country: 'India' },
    { code: 'IXL', city: 'Leh', name: 'Kushok Bakula Rimpochee Airport', country: 'India' },
    { code: 'IDR', city: 'Indore', name: 'Devi Ahilya Bai Holkar Airport', country: 'India' },
    { code: 'RPR', city: 'Raipur', name: 'Swami Vivekananda Airport', country: 'India' },
    { code: 'VGA', city: 'Vijayawada', name: 'Vijayawada Airport', country: 'India' },
    { code: 'VTZ', city: 'Visakhapatnam', name: 'Visakhapatnam Airport', country: 'India' },
    { code: 'IXZ', city: 'Port Blair', name: 'Veer Savarkar International Airport', country: 'India' },
    { code: 'IXE', city: 'Mangalore', name: 'Mangalore International Airport', country: 'India' },
    { code: 'IXM', city: 'Madurai', name: 'Madurai Airport', country: 'India' },
    { code: 'TRZ', city: 'Tiruchirapalli', name: 'Tiruchirapalli International Airport', country: 'India' },
    { code: 'CJB', city: 'Coimbatore', name: 'Coimbatore International Airport', country: 'India' },

    // Major International Airports
    { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport', country: 'UAE' },
    { code: 'SIN', city: 'Singapore', name: 'Singapore Changi Airport', country: 'Singapore' },
    { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'UK' },
    { code: 'JFK', city: 'New York', name: 'John F. Kennedy International Airport', country: 'USA' },
    { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International Airport', country: 'USA' },
    { code: 'SFO', city: 'San Francisco', name: 'San Francisco International Airport', country: 'USA' },
    { code: 'ORD', city: 'Chicago', name: "O'Hare International Airport", country: 'USA' },
    { code: 'DFW', city: 'Dallas', name: 'Dallas/Fort Worth International Airport', country: 'USA' },
    { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport', country: 'Thailand' },
    { code: 'HKG', city: 'Hong Kong', name: 'Hong Kong International Airport', country: 'Hong Kong' },
    { code: 'NRT', city: 'Tokyo', name: 'Narita International Airport', country: 'Japan' },
    { code: 'HND', city: 'Tokyo', name: 'Haneda Airport', country: 'Japan' },
    { code: 'ICN', city: 'Seoul', name: 'Incheon International Airport', country: 'South Korea' },
    { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle Airport', country: 'France' },
    { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt Airport', country: 'Germany' },
    { code: 'AMS', city: 'Amsterdam', name: 'Amsterdam Airport Schiphol', country: 'Netherlands' },
    { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport', country: 'Turkey' },
    { code: 'DOH', city: 'Doha', name: 'Hamad International Airport', country: 'Qatar' },
    { code: 'AUH', city: 'Abu Dhabi', name: 'Abu Dhabi International Airport', country: 'UAE' },
    { code: 'SYD', city: 'Sydney', name: 'Sydney Kingsford Smith Airport', country: 'Australia' },
    { code: 'MEL', city: 'Melbourne', name: 'Melbourne Airport', country: 'Australia' },
    { code: 'SHJ', city: 'Sharjah', name: 'Sharjah International Airport', country: 'UAE' },
    { code: 'KUL', city: 'Kuala Lumpur', name: 'Kuala Lumpur International Airport', country: 'Malaysia' },
    { code: 'MNL', city: 'Manila', name: 'Ninoy Aquino International Airport', country: 'Philippines' },
    { code: 'CGK', city: 'Jakarta', name: 'Soekarno-Hatta International Airport', country: 'Indonesia' },
    { code: 'PEK', city: 'Beijing', name: 'Beijing Capital International Airport', country: 'China' },
    { code: 'PVG', city: 'Shanghai', name: 'Shanghai Pudong International Airport', country: 'China' },
    { code: 'CAN', city: 'Guangzhou', name: 'Guangzhou Baiyun International Airport', country: 'China' },
    { code: 'TPE', city: 'Taipei', name: 'Taiwan Taoyuan International Airport', country: 'Taiwan' },
    { code: 'YYZ', city: 'Toronto', name: 'Toronto Pearson International Airport', country: 'Canada' },
    { code: 'YVR', city: 'Vancouver', name: 'Vancouver International Airport', country: 'Canada' },
    { code: 'MEX', city: 'Mexico City', name: 'Mexico City International Airport', country: 'Mexico' },
    { code: 'GRU', city: 'Sao Paulo', name: 'Sao Paulo-Guarulhos International Airport', country: 'Brazil' },
    { code: 'EZE', city: 'Buenos Aires', name: 'Ministro Pistarini International Airport', country: 'Argentina' },
    { code: 'JNB', city: 'Johannesburg', name: 'O.R. Tambo International Airport', country: 'South Africa' },
    { code: 'CAI', city: 'Cairo', name: 'Cairo International Airport', country: 'Egypt' },
    { code: 'MCT', city: 'Muscat', name: 'Muscat International Airport', country: 'Oman' },
    { code: 'BAH', city: 'Bahrain', name: 'Bahrain International Airport', country: 'Bahrain' },
    { code: 'KWI', city: 'Kuwait', name: 'Kuwait International Airport', country: 'Kuwait' },
    { code: 'RUH', city: 'Riyadh', name: 'King Khalid International Airport', country: 'Saudi Arabia' },
    { code: 'JED', city: 'Jeddah', name: 'King Abdulaziz International Airport', country: 'Saudi Arabia' },
    { code: 'DMM', city: 'Dammam', name: 'King Fahd International Airport', country: 'Saudi Arabia' },
];

const AirportAutocomplete = ({ value, onChange, placeholder = "Search airports...", label, icon }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredAirports, setFilteredAirports] = useState([]);
    const dropdownRef = useRef(null);

    // Get selected airport details
    const selectedAirport = airports.find(a => a.code === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term.trim() === '') {
            setFilteredAirports(airports.slice(0, 10)); // Show top 10 by default
        } else {
            const filtered = airports.filter(airport =>
                airport.city.toLowerCase().includes(term.toLowerCase()) ||
                airport.code.toLowerCase().includes(term.toLowerCase()) ||
                airport.country.toLowerCase().includes(term.toLowerCase())
            ).slice(0, 10);
            setFilteredAirports(filtered);
        }
    };

    const handleSelect = (airport) => {
        onChange(airport.code);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleFocus = () => {
        setIsOpen(true);
        handleSearch(searchTerm);
    };

    return (
        <div className="airport-autocomplete" ref={dropdownRef}>
            <div
                className={`airport-input-container ${isOpen ? 'is-open' : ''}`}
                onClick={() => {
                    setIsOpen(true);
                    // Slight delay to ensure render before focus if needed, though ref focus usually works
                    setTimeout(() => {
                        const input = dropdownRef.current?.querySelector('input');
                        if (input) input.focus();
                    }, 0);
                }}
            >
                {label && <div className="airport-label">{label}</div>}

                <div className="airport-main-wrapper">
                    {icon && <i className={`${icon} main-icon`}></i>}

                    <div className="input-content-area">
                        {!isOpen && selectedAirport ? (
                            <div className="display-mode">
                                <span className="airport-code">{selectedAirport.code}</span>
                                <span className="airport-city">{selectedAirport.city}</span>
                            </div>
                        ) : (
                            <input
                                type="text"
                                className="airport-search-input"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                onFocus={handleFocus}
                                placeholder={placeholder}
                                autoComplete="off"
                                autoFocus={isOpen}
                            />
                        )}
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="airport-dropdown">
                    <div className="dropdown-header">
                        <i className="fas fa-search"></i>
                        <span>Select Airport</span>
                    </div>
                    <div className="airport-list">
                        {filteredAirports.length > 0 ? (
                            filteredAirports.map((airport) => (
                                <div
                                    key={airport.code}
                                    className="airport-item"
                                    onClick={() => handleSelect(airport)}
                                >
                                    <div className="airport-item-main">
                                        <span className="airport-item-code">{airport.code}</span>
                                        <span className="airport-item-city">{airport.city}</span>
                                    </div>
                                    <div className="airport-item-name">{airport.name}</div>
                                    <div className="airport-item-country">{airport.country}</div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">
                                <i className="fas fa-exclamation-circle"></i>
                                <span>No airports found</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AirportAutocomplete;
