"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './search.module.css';
import Sidebar from '../../components/search/Sidebar';
import SearchHeader from '../../components/search/SearchHeader';
import FilterSection from '../../components/search/FilterSection';
import FlightCard from '../../components/search/FlightCard';
import FlightCardSkeleton from '../../components/search/FlightCardSkeleton';
import AirportAutocomplete from '../../components/AirportAutocomplete';
import FlightDetails from './FlightDetails';



const SearchClient = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterSliderOpen, setIsFilterSliderOpen] = useState(false);
    const [flights, setFlights] = useState([]);
    const [rawFlights, setRawFlights] = useState([]);
    const [traceId, setTraceId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [filteredFlights, setFilteredFlights] = useState([]);
    const [sortType, setSortType] = useState('recommended');

    // Search Params State
    const [from, setFrom] = useState(searchParams.get('from') || 'DEL');
    const [to, setTo] = useState(searchParams.get('to') || 'BLR');
    const [date, setDate] = useState(searchParams.get('date') || '03122025');
    const [adults, setAdults] = useState(searchParams.get('adults') || '1');
    const [children, setChildren] = useState(searchParams.get('children') || '0');
    const [infants, setInfants] = useState(searchParams.get('infants') || '0');
    const [travelClass, setTravelClass] = useState(searchParams.get('class') || 'e');

    const classOptions = {
        'e': 'Economy',
        'pe': 'Premium Economy',
        'b': 'Business',
        'pb': 'Premium Business',
        'f': 'First'
    };

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            setError(null);
            try {
                const query = new URLSearchParams({
                    from,
                    to,
                    date,
                    adults,
                    children,
                    infants,
                    class: travelClass
                }).toString();

                const response = await fetch(`http://localhost:3001/api/search?${query}`);
                const data = await response.json();

                if (data.Response && data.Response.Results) {
                    // Store traceId for fare rule/quote API calls
                    setTraceId(data.Response.TraceId || null);

                    // Flattening the results as they are in an array of arrays (segments)
                    const rawFlightData = data.Response.Results.flat();
                    setRawFlights(rawFlightData);

                    const allFlights = rawFlightData.map(mapFlightData);
                    setFlights(allFlights);
                    setFilteredFlights(allFlights);
                } else {
                    setFlights([]);
                    setFilteredFlights([]);
                    setRawFlights([]);
                    setTraceId(null);
                    if (data.Response && data.Response.Error) {
                        setError(data.Response.Error.ErrorMessage || "No flights found.");
                    }
                }
            } catch (err) {
                console.error("Failed to fetch flights:", err);
                setError("Failed to fetch flights. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [searchParams]); // Re-fetch when URL params change

    const mapFlightData = (flight, index) => {
        const segment = flight.Segments[0][0]; // Assuming single segment for now
        const airlineCode = segment.Airline.AirlineCode;
        const flightNumber = segment.Airline.FlightNumber;
        const airlineName = segment.Airline.AirlineName;

        // Format Times
        const depTime = new Date(segment.Origin.DepTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        const arrTime = new Date(segment.Destination.ArrTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        // Duration
        const durationHours = Math.floor(segment.Duration / 60);
        const durationMinutes = segment.Duration % 60;
        const durationStr = `${durationHours}h ${durationMinutes}m`;

        return {
            id: flight.ResultIndex || index,
            resultIndex: flight.ResultIndex || '',
            airline: airlineName,
            flightNumber: `${airlineCode} ${flightNumber}`,
            logo: `https://images.ixigo.com/img/common-resources/airline-new/${airlineCode}.png`,
            departTime: depTime,
            departCity: segment.Origin.Airport.CityCode,
            duration: durationStr,
            stops: segment.StopOver ? "Stopover" : "Non-stop",
            arriveTime: arrTime,
            arriveCity: segment.Destination.Airport.CityCode,
            price: `₹${flight.Fare.PublishedFare}`,
            oldPrice: `₹${Math.round(flight.Fare.PublishedFare * 1.1)}`,
            rawDepTime: segment.Origin.DepTime,
            rawArrTime: segment.Destination.ArrTime
        };
    };

    const handleSearch = () => {
        const query = new URLSearchParams({
            from,
            to,
            date,
            adults,
            children,
            infants,
            class: travelClass
        }).toString();
        router.push(`/search?${query}`);
        closeModal();
    };

    const openModal = () => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    const handleFlightClick = (flightData) => {
        setSelectedFlight(flightData);
        setShowDetails(true);
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setTimeout(() => setSelectedFlight(null), 300); // Wait for animation to complete
    };

    const getTimeSlot = (timeString) => {
        const hour = parseInt(timeString.split(':')[0]);
        if (hour >= 0 && hour < 6) return 'early';
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        return 'evening';
    };

    const handleFilterChange = (filters) => {
        let filtered = [...flights];

        // Filter by stops
        if (filters.stops.length > 0) {
            filtered = filtered.filter(flight => {
                if (filters.stops.includes('Non-stop') && flight.stops === 'Non-stop') return true;
                if (filters.stops.includes('1 Stop') && flight.stops !== 'Non-stop') return true;
                return false;
            });
        }

        // Filter by airlines
        if (filters.airlines.length > 0) {
            filtered = filtered.filter(flight => filters.airlines.includes(flight.airline));
        }

        // Filter by price range
        if (filters.priceRange.min || filters.priceRange.max) {
            filtered = filtered.filter(flight => {
                const price = parseInt(flight.price.replace(/[₹,]/g, ''));
                const min = filters.priceRange.min ? parseInt(filters.priceRange.min) : 0;
                const max = filters.priceRange.max ? parseInt(filters.priceRange.max) : Infinity;
                return price >= min && price <= max;
            });
        }

        // Filter by departure time
        if (filters.departureTime.length > 0) {
            filtered = filtered.filter(flight => {
                const timeSlot = getTimeSlot(flight.departTime);
                return filters.departureTime.includes(timeSlot);
            });
        }

        // Filter by arrival time
        if (filters.arrivalTime.length > 0) {
            filtered = filtered.filter(flight => {
                const timeSlot = getTimeSlot(flight.arriveTime);
                return filters.arrivalTime.includes(timeSlot);
            });
        }

        // Apply sorting
        filtered = applySorting(filtered, sortType);

        setFilteredFlights(filtered);
    };

    const applySorting = (flightList, type) => {
        const sorted = [...flightList];
        
        switch(type) {
            case 'cheapest':
                return sorted.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/[₹,]/g, ''));
                    const priceB = parseInt(b.price.replace(/[₹,]/g, ''));
                    return priceA - priceB;
                });
            
            case 'fastest':
                return sorted.sort((a, b) => {
                    const getDurationMinutes = (duration) => {
                        const parts = duration.match(/(\d+)h\s*(\d+)m/);
                        if (parts) {
                            return parseInt(parts[1]) * 60 + parseInt(parts[2]);
                        }
                        return 0;
                    };
                    return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
                });
            
            case 'recommended':
            default:
                // Recommended: balance of price and duration
                return sorted.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/[₹,]/g, ''));
                    const priceB = parseInt(b.price.replace(/[₹,]/g, ''));
                    const getDurationMinutes = (duration) => {
                        const parts = duration.match(/(\d+)h\s*(\d+)m/);
                        if (parts) {
                            return parseInt(parts[1]) * 60 + parseInt(parts[2]);
                        }
                        return 0;
                    };
                    const durationA = getDurationMinutes(a.duration);
                    const durationB = getDurationMinutes(b.duration);
                    
                    // Score: lower is better (normalized price + duration)
                    const scoreA = (priceA / 10000) + (durationA / 60);
                    const scoreB = (priceB / 10000) + (durationB / 60);
                    return scoreA - scoreB;
                });
        }
    };

    const handleSortChange = (type) => {
        setSortType(type);
        const sorted = applySorting(filteredFlights, type);
        setFilteredFlights(sorted);
    };

    const openFilterSlider = () => {
        setIsFilterSliderOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeFilterSlider = () => {
        setIsFilterSliderOpen(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className={styles.container}>
            <Sidebar />

            <div className={styles.mainContent}>
                <div className={styles.mobileHeaderNew}>
                    <div className={styles.headerTop}>
                        <div className={styles.backBtn} onClick={() => router.back()}>
                            <i className="fas fa-arrow-left"></i>
                        </div>
                        <div className={styles.headerCenter}>
                            <div className={styles.routeText}>
                                {from} <i className="fas fa-arrow-right" style={{ fontSize: '12px' }}></i> {to}
                            </div>
                            <div className={styles.subText}>{date} • {parseInt(adults) + parseInt(children) + parseInt(infants)} Passenger • {classOptions[travelClass]}</div>
                        </div>
                        <div className={styles.filterBtn} onClick={openFilterSlider}>
                            <i className="fas fa-plane"></i>
                        </div>
                    </div>

                    <div className={styles.sortTabs}>
                        <button 
                            className={`${styles.sortTab} ${sortType === 'recommended' ? styles.active : ''}`}
                            onClick={() => handleSortChange('recommended')}
                        >
                            Recommended
                        </button>
                        <button 
                            className={`${styles.sortTab} ${sortType === 'cheapest' ? styles.active : ''}`}
                            onClick={() => handleSortChange('cheapest')}
                        >
                            Cheapest
                        </button>
                        <button 
                            className={`${styles.sortTab} ${sortType === 'fastest' ? styles.active : ''}`}
                            onClick={() => handleSortChange('fastest')}
                        >
                            Fastest
                        </button>
                    </div>
                </div>

                <SearchHeader
                    from={from}
                    to={to}
                    date={date}
                    travelers={parseInt(adults) + parseInt(children) + parseInt(infants)}
                    adults={adults}
                    children={children}
                    infants={infants}
                    travelClass={travelClass}
                />

                <div className={styles.contentGrid}>
                    <FilterSection 
                        flights={flights} 
                        onFilterChange={handleFilterChange}
                    />

                    <div className={`${styles.resultsList} ${showDetails ? styles.slideOut : ''}`} data-lenis-prevent>
                        {loading ? (
                            <>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <FlightCardSkeleton key={i} />
                                ))}
                            </>
                        ) : error ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>
                        ) : filteredFlights.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <i className="fas fa-filter" style={{ fontSize: '48px', color: '#D1D5DB', marginBottom: '15px' }}></i>
                                <h3 style={{ color: '#6B7280', marginBottom: '10px' }}>No flights found</h3>
                                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>Try adjusting your filters</p>
                            </div>
                        ) : (
                            filteredFlights.map((flight, index) => (
                                <FlightCard
                                    key={flight.id}
                                    {...flight}
                                    traceId={traceId}
                                    from={from}
                                    to={to}
                                    date={date}
                                    index={index}
                                    onClick={handleFlightClick}
                                />
                            ))
                        )}
                    </div>

                    {/* Flight Details Panel */}
                    <div className={`${styles.detailsPanel} ${showDetails ? styles.slideIn : ''}`} data-lenis-prevent>
                        {selectedFlight && (
                            <FlightDetails
                                flight={selectedFlight}
                                traceId={traceId}
                                onClose={handleCloseDetails}
                            />
                        )}
                    </div>
                </div>

                <nav className={styles.bottomNav}>
                    <a href="#" className={styles.bottomNavItem}>
                        <i className="fas fa-bed"></i>
                        <span>Hotels</span>
                    </a>
                    <a href="#" className={`${styles.bottomNavItem} ${styles.active}`}>
                        <i className="fas fa-plane"></i>
                        <span>Flights</span>
                    </a>
                    <a href="#" className={styles.bottomNavItem}>
                        <i className="fas fa-bookmark"></i>
                        <span>Trips</span>
                    </a>
                    <a href="#" className={styles.bottomNavItem}>
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </a>
                </nav>

                {/* Mobile Filter Slider */}
                <div className={`${styles.mobileFilterSlider} ${isFilterSliderOpen ? styles.open : ''}`}>
                    <div className={styles.filterSliderHeader}>
                        <h3>Filters</h3>
                        <i className="fas fa-times" onClick={closeFilterSlider}></i>
                    </div>
                    <div className={styles.filterSliderBody}>
                        <FilterSection 
                            flights={flights} 
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                    <div className={styles.filterSliderFooter}>
                        <button className={styles.applyFiltersBtn} onClick={closeFilterSlider}>
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Modify Search Modal */}
                <div className={`${styles.mobileSearchModal} ${isModalOpen ? styles.open : ''}`}>
                    <div className={styles.modalHeader}>
                        <i className="fas fa-times" onClick={closeModal}></i>
                        <h3>Modify Flight Search</h3>
                        <div style={{ width: '24px' }}></div>
                    </div>

                    <div className={styles.modalBody}>
                        <div className={styles.tripTypeTabs}>
                            <button className={`${styles.tab} ${styles.active}`}>One Way</button>
                            <button className={styles.tab}>Round Trip</button>
                        </div>

                        <div className={styles.modalInputGroup}>
                            <div className={styles.modalField}>
                                <AirportAutocomplete
                                    value={from}
                                    onChange={setFrom}
                                    label="From"
                                    icon="fas fa-plane-departure"
                                    placeholder="Search departure..."
                                />
                            </div>
                            <div className={styles.swapIcon} onClick={() => {
                                const temp = from;
                                setFrom(to);
                                setTo(temp);
                            }}>
                                <i className="fas fa-exchange-alt"></i>
                            </div>
                            <div className={styles.modalField}>
                                <AirportAutocomplete
                                    value={to}
                                    onChange={setTo}
                                    label="To"
                                    icon="fas fa-plane-arrival"
                                    placeholder="Search arrival..."
                                />
                            </div>
                        </div>

                        <div className={styles.singleField}>
                            <i className={`far fa-calendar-alt ${styles.fieldIconLeft}`}></i>
                            <div>
                                <input
                                    type="text"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    placeholder="DDMMYYYY"
                                    style={{ border: 'none', fontSize: '16px', width: '100%' }}
                                />
                            </div>
                        </div>

                        <div className={styles.singleField} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <i className={`fas fa-user ${styles.fieldIconLeft}`}></i>
                                <div style={{ flex: 1 }}>
                                    <div className={styles.value}>Passengers</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'space-between' }}>
                                <label>
                                    Adults:
                                    <input type="number" min="1" value={adults} onChange={(e) => setAdults(e.target.value)} style={{ width: '50px', marginLeft: '5px' }} />
                                </label>
                                <label>
                                    Children:
                                    <input type="number" min="0" value={children} onChange={(e) => setChildren(e.target.value)} style={{ width: '50px', marginLeft: '5px' }} />
                                </label>
                                <label>
                                    Infants:
                                    <input type="number" min="0" value={infants} onChange={(e) => setInfants(e.target.value)} style={{ width: '50px', marginLeft: '5px' }} />
                                </label>
                            </div>
                        </div>

                        <div className={styles.singleField}>
                            <i className={`fas fa-chair ${styles.fieldIconLeft}`}></i>
                            <select
                                value={travelClass}
                                onChange={(e) => setTravelClass(e.target.value)}
                                style={{ border: 'none', fontSize: '16px', width: '100%', background: 'transparent' }}
                            >
                                <option value="e">Economy</option>
                                <option value="pe">Premium Economy</option>
                                <option value="b">Business</option>
                                <option value="pb">Premium Business</option>
                                <option value="f">First</option>
                            </select>
                        </div>

                        <div className={styles.specialFares}>
                            <div className={styles.fareLabel}>Special Fares (Optional)</div>
                            <div className={styles.fareChips}>
                                <div className={styles.chip}>Student</div>
                                <div className={styles.chip}>Senior Citizen</div>
                                <div className={styles.chip}>Armed Forces</div>
                            </div>
                        </div>

                        <button className={styles.modalSearchBtn} onClick={handleSearch}>
                            <i className="fas fa-search"></i> Search Flights
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchClient;
