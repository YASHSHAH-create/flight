'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../app/search/search.module.css';
import AirportAutocomplete from '../AirportAutocomplete';

const SearchHeader = ({ from, to, date, travelers, adults, children, infants, travelClass }) => {
    const router = useRouter();
    const dropdownRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [searchParams, setSearchParams] = useState({
        from: from || 'DEL',
        to: to || 'BLR',
        date: date || '',
        adults: adults || '1',
        children: children || '0',
        infants: infants || '0',
        travelClass: travelClass || 'e'
    });
    const [showTravelerDropdown, setShowTravelerDropdown] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowTravelerDropdown(false);
            }
        };

        if (showTravelerDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showTravelerDropdown]);

    const classOptions = {
        'e': 'Economy',
        'pe': 'Premium Economy',
        'b': 'Business',
        'pb': 'Premium Business',
        'f': 'First'
    };

    const handleSearch = () => {
        const query = new URLSearchParams({
            from: searchParams.from,
            to: searchParams.to,
            date: searchParams.date,
            adults: searchParams.adults,
            children: searchParams.children,
            infants: searchParams.infants,
            class: searchParams.travelClass
        }).toString();
        router.push(`/search?${query}`);
        setIsEditing(false);
    };

    const handleSwap = () => {
        setSearchParams({
            ...searchParams,
            from: searchParams.to,
            to: searchParams.from
        });
    };

    const totalTravelers = parseInt(searchParams.adults) + parseInt(searchParams.children) + parseInt(searchParams.infants);

    if (!isEditing) {
        return (
            <div className={styles.searchContainer} onClick={() => setIsEditing(true)}>
                <div className={styles.searchField}>
                    <i className={`fas fa-plane-departure ${styles.icon}`}></i>
                    <div className={styles.fieldInfo}>
                        <h4>From</h4>
                        <p>{from || 'Select'}</p>
                    </div>
                </div>

                <div className={styles.searchField}>
                    <i className={`fas fa-plane-arrival ${styles.icon}`}></i>
                    <div className={styles.fieldInfo}>
                        <h4>To</h4>
                        <p>{to || 'Select'}</p>
                    </div>
                </div>

                <div className={styles.searchField}>
                    <i className={`far fa-calendar-alt ${styles.icon}`}></i>
                    <div className={styles.fieldInfo}>
                        <h4>Dates</h4>
                        <p>{date || 'Select Date'}</p>
                    </div>
                </div>

                <div className={styles.searchField}>
                    <i className={`fas fa-user-friends ${styles.icon}`}></i>
                    <div className={styles.fieldInfo}>
                        <h4>Travelers</h4>
                        <p>{travelers || '1'} Travelers • {classOptions[travelClass] || 'Economy'}</p>
                    </div>
                </div>

                <button className={styles.searchBtn}>
                    <i className="fas fa-edit"></i>
                </button>
            </div>
        );
    }

    return (
        <div className={styles.searchContainerEditing}>
            <div className={styles.searchFieldEditable}>
                <i className={`fas fa-plane-departure ${styles.icon}`}></i>
                <div className={styles.fieldInfo} style={{ overflow: 'visible' }}>
                    <h4>From</h4>
                    <AirportAutocomplete
                        value={searchParams.from}
                        onChange={(value) => setSearchParams({ ...searchParams, from: value })}
                        placeholder="Origin"
                    />
                </div>
            </div>

            <button className={styles.swapBtnDesktop} onClick={handleSwap}>
                <i className="fas fa-exchange-alt"></i>
            </button>

            <div className={styles.searchFieldEditable}>
                <i className={`fas fa-plane-arrival ${styles.icon}`}></i>
                <div className={styles.fieldInfo} style={{ overflow: 'visible' }}>
                    <h4>To</h4>
                    <AirportAutocomplete
                        value={searchParams.to}
                        onChange={(value) => setSearchParams({ ...searchParams, to: value })}
                        placeholder="Destination"
                    />
                </div>
            </div>

            <div className={styles.searchFieldEditable}>
                <i className={`far fa-calendar-alt ${styles.icon}`}></i>
                <div className={styles.fieldInfo}>
                    <h4>Date</h4>
                    <input
                        type="date"
                        value={searchParams.date}
                        onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
                        className={styles.dateInput}
                        placeholder="Select date"
                    />
                </div>
            </div>

            <div 
                ref={dropdownRef}
                className={styles.searchFieldEditable} 
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowTravelerDropdown(!showTravelerDropdown);
                }}
            >
                <i className={`fas fa-user-friends ${styles.icon}`}></i>
                <div className={styles.fieldInfo}>
                    <h4>Travelers & Class</h4>
                    <p>{totalTravelers} Travelers • {classOptions[searchParams.travelClass]}</p>
                </div>
                <i className={`fas fa-chevron-down ${styles.dropdownIcon}`} style={{ 
                    transform: showTravelerDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                }}></i>
                
                {showTravelerDropdown && (
                    <div className={styles.travelerDropdown} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.travelerRow}>
                            <span>Adults</span>
                            <div className={styles.counterGroup}>
                                <button onClick={() => setSearchParams({ ...searchParams, adults: Math.max(1, parseInt(searchParams.adults) - 1).toString() })}>-</button>
                                <span>{searchParams.adults}</span>
                                <button onClick={() => setSearchParams({ ...searchParams, adults: (parseInt(searchParams.adults) + 1).toString() })}>+</button>
                            </div>
                        </div>
                        <div className={styles.travelerRow}>
                            <span>Children</span>
                            <div className={styles.counterGroup}>
                                <button onClick={() => setSearchParams({ ...searchParams, children: Math.max(0, parseInt(searchParams.children) - 1).toString() })}>-</button>
                                <span>{searchParams.children}</span>
                                <button onClick={() => setSearchParams({ ...searchParams, children: (parseInt(searchParams.children) + 1).toString() })}>+</button>
                            </div>
                        </div>
                        <div className={styles.travelerRow}>
                            <span>Infants</span>
                            <div className={styles.counterGroup}>
                                <button onClick={() => setSearchParams({ ...searchParams, infants: Math.max(0, parseInt(searchParams.infants) - 1).toString() })}>-</button>
                                <span>{searchParams.infants}</span>
                                <button onClick={() => setSearchParams({ ...searchParams, infants: (parseInt(searchParams.infants) + 1).toString() })}>+</button>
                            </div>
                        </div>
                        <div className={styles.classSelector}>
                            <h5>Class</h5>
                            {Object.entries(classOptions).map(([key, label]) => (
                                <label key={key} className={styles.classOption}>
                                    <input
                                        type="radio"
                                        name="class"
                                        value={key}
                                        checked={searchParams.travelClass === key}
                                        onChange={(e) => setSearchParams({ ...searchParams, travelClass: e.target.value })}
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                        <button className={styles.doneBtn} onClick={() => setShowTravelerDropdown(false)}>Done</button>
                    </div>
                )}
            </div>

            <button className={styles.searchBtn} onClick={handleSearch}>
                <i className="fas fa-search"></i>
            </button>
        </div>
    );
};

export default SearchHeader;
