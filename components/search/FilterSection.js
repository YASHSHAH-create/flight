'use client';
import React, { useState, useEffect } from 'react';
import styles from '../../app/search/search.module.css';

const FilterSection = ({ flights, onFilterChange }) => {
    const [filters, setFilters] = useState({
        stops: [],
        airlines: [],
        priceRange: { min: '', max: '' },
        departureTime: [],
        arrivalTime: []
    });

    // Extract unique airlines from flights
    const airlines = [...new Set(flights.map(f => f.airline))].sort();
    
    // Get price range
    const prices = flights.map(f => parseInt(f.price.replace(/[₹,]/g, '')));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    // Count flights by stops
    const stopCounts = {
        'Non-stop': flights.filter(f => f.stops === 'Non-stop').length,
        '1 Stop': flights.filter(f => f.stops !== 'Non-stop').length
    };

    // Count flights by airline
    const airlineCounts = {};
    airlines.forEach(airline => {
        airlineCounts[airline] = flights.filter(f => f.airline === airline).length;
    });

    const handleStopChange = (stop) => {
        const newStops = filters.stops.includes(stop)
            ? filters.stops.filter(s => s !== stop)
            : [...filters.stops, stop];
        
        const newFilters = { ...filters, stops: newStops };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleAirlineChange = (airline) => {
        const newAirlines = filters.airlines.includes(airline)
            ? filters.airlines.filter(a => a !== airline)
            : [...filters.airlines, airline];
        
        const newFilters = { ...filters, airlines: newAirlines };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePriceChange = (type, value) => {
        const newFilters = {
            ...filters,
            priceRange: { ...filters.priceRange, [type]: value }
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleTimeChange = (type, timeSlot) => {
        const currentTimes = filters[type];
        const newTimes = currentTimes.includes(timeSlot)
            ? currentTimes.filter(t => t !== timeSlot)
            : [...currentTimes, timeSlot];
        
        const newFilters = { ...filters, [type]: newTimes };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const resetFilters = () => {
        const newFilters = {
            stops: [],
            airlines: [],
            priceRange: { min: '', max: '' },
            departureTime: [],
            arrivalTime: []
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const timeSlots = [
        { label: 'Early Morning', value: 'early', time: '00:00 - 06:00', icon: 'fa-cloud-moon' },
        { label: 'Morning', value: 'morning', time: '06:00 - 12:00', icon: 'fa-sun' },
        { label: 'Afternoon', value: 'afternoon', time: '12:00 - 18:00', icon: 'fa-cloud-sun' },
        { label: 'Evening', value: 'evening', time: '18:00 - 24:00', icon: 'fa-moon' }
    ];

    return (
        <aside className={styles.filterSection} data-lenis-prevent>
            {/* Reset All Button */}
            <div className={styles.filterHeader}>
                <h3>Filters</h3>
                <button className={styles.resetBtn} onClick={resetFilters}>
                    <i className="fas fa-redo"></i> Reset All
                </button>
            </div>

            {/* Stops Filter */}
            <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Stops</div>
                <div className={styles.checkboxRow}>
                    <label>
                        <input 
                            type="checkbox" 
                            checked={filters.stops.includes('Non-stop')}
                            onChange={() => handleStopChange('Non-stop')}
                        /> Non-stop
                    </label>
                    <span>{stopCounts['Non-stop']}</span>
                </div>
                <div className={styles.checkboxRow}>
                    <label>
                        <input 
                            type="checkbox"
                            checked={filters.stops.includes('1 Stop')}
                            onChange={() => handleStopChange('1 Stop')}
                        /> 1+ Stop
                    </label>
                    <span>{stopCounts['1 Stop']}</span>
                </div>
            </div>

            {/* Price Range Filter */}
            <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>
                    Price Range
                    <span className={styles.priceHint}>₹{minPrice} - ₹{maxPrice}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="number"
                        placeholder={`Min ₹${minPrice}`}
                        value={filters.priceRange.min}
                        onChange={(e) => handlePriceChange('min', e.target.value)}
                        className={styles.priceInput}
                    />
                    <input
                        type="number"
                        placeholder={`Max ₹${maxPrice}`}
                        value={filters.priceRange.max}
                        onChange={(e) => handlePriceChange('max', e.target.value)}
                        className={styles.priceInput}
                    />
                </div>
            </div>

            {/* Airlines Filter */}
            <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Airlines</div>
                {airlines.map(airline => (
                    <div key={airline} className={styles.checkboxRow}>
                        <label>
                            <input 
                                type="checkbox"
                                checked={filters.airlines.includes(airline)}
                                onChange={() => handleAirlineChange(airline)}
                            /> {airline}
                        </label>
                        <span>{airlineCounts[airline]}</span>
                    </div>
                ))}
            </div>

            {/* Departure Time Filter */}
            <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Departure Time</div>
                {timeSlots.map(slot => (
                    <div key={slot.value} className={styles.timeSlotRow}>
                        <label>
                            <input 
                                type="checkbox"
                                checked={filters.departureTime.includes(slot.value)}
                                onChange={() => handleTimeChange('departureTime', slot.value)}
                            />
                            <i className={`fas ${slot.icon}`}></i>
                            <div>
                                <div className={styles.timeLabel}>{slot.label}</div>
                                <div className={styles.timeRange}>{slot.time}</div>
                            </div>
                        </label>
                    </div>
                ))}
            </div>

            {/* Arrival Time Filter */}
            <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Arrival Time</div>
                {timeSlots.map(slot => (
                    <div key={slot.value} className={styles.timeSlotRow}>
                        <label>
                            <input 
                                type="checkbox"
                                checked={filters.arrivalTime.includes(slot.value)}
                                onChange={() => handleTimeChange('arrivalTime', slot.value)}
                            />
                            <i className={`fas ${slot.icon}`}></i>
                            <div>
                                <div className={styles.timeLabel}>{slot.label}</div>
                                <div className={styles.timeRange}>{slot.time}</div>
                            </div>
                        </label>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default FilterSection;
