"use client";
import React, { useState } from 'react';
import './FlightSearchWidget.css';
import { useRouter } from 'next/navigation';

const FlightSearchWidget = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('round-trip');
    const [fromCity, setFromCity] = useState({ code: 'DAC', name: 'Dhaka', airport: 'Hazrat Shahjalal International' });
    const [toCity, setToCity] = useState({ code: 'CXB', name: "Cox's Bazar", airport: "Cox's Bazar Airport" });
    const [departureDate, setDepartureDate] = useState({ day: '24', month: "Feb'24", dayName: 'Sat' });
    const [returnDate, setReturnDate] = useState({ day: '27', month: "Feb'24", dayName: 'Tue' });
    const [travelers, setTravelers] = useState({ count: 2, class: 'Economy' });

    const handleSwap = () => {
        const temp = fromCity;
        setFromCity(toCity);
        setToCity(temp);
    };

    const handleSearch = () => {
        // Construct query parameters
        const queryParams = new URLSearchParams({
            from: fromCity.code,
            to: toCity.code,
            date: `2024-02-${departureDate.day}`, // Example date format
            returnDate: activeTab === 'round-trip' ? `2024-02-${returnDate.day}` : '',
            travelers: travelers.count,
            class: travelers.class,
            type: activeTab
        }).toString();

        router.push(`/search?${queryParams}`);
    };

    return (
        <div className="widget-wrapper">
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

            <div className="search-container-widget">

                <div className="cities-container">
                    <div className="field-box f-city">
                        <div className="label">Departure City</div>
                        <div className="value">
                            <i className="fas fa-plane-departure"></i> {fromCity.code} <span>{fromCity.name}</span>
                        </div>
                        <div className="sub-info">{fromCity.airport}</div>
                    </div>

                    <div className="swap-circle" onClick={handleSwap}>
                        <i className="fas fa-exchange-alt"></i>
                    </div>

                    <div className="field-box f-city">
                        <div className="label">Arrival City</div>
                        <div className="value">
                            <i className="fas fa-plane-arrival"></i> {toCity.code} <span>{toCity.name}</span>
                        </div>
                        <div className="sub-info">{toCity.airport}</div>
                    </div>
                </div>


                <div className="dates-container">
                    <div className="field-box f-date">
                        <div className="label">Departure Date</div>
                        <div className="value">
                            <i className="far fa-calendar-alt"></i> {departureDate.day} <span>{departureDate.dayName}</span>
                        </div>
                        <div className="sub-info">{departureDate.month}</div>
                    </div>

                    <div className={`field-box f-date return-date-field ${activeTab !== 'round-trip' ? 'hidden' : ''}`}>
                        <div className="label">Return Date</div>
                        <div className="value">
                            <i className="far fa-calendar-alt"></i> {returnDate.day} <span>{returnDate.dayName}</span>
                        </div>
                        <div className="sub-info">{returnDate.month}</div>
                    </div>
                </div>

                <div className="field-box f-traveler">
                    <div className="label">Traveler & Class</div>
                    <div className="value">
                        <i className="fas fa-users"></i> {travelers.count} <span>{travelers.class}</span>
                    </div>
                    <div className="sub-info">&nbsp;</div>
                </div>

                <div className="btn-wrapper">
                    <button className="search-btn" onClick={handleSearch}>
                        Search Flights <i className="fas fa-search"></i>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default FlightSearchWidget;
