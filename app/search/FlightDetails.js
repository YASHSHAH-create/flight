'use client';
import React, { useState, useEffect } from 'react';
import { fetchFareRule, fetchFareQuote, fetchSSR } from '../../utils/api';
import styles from './search.module.css';

const FlightDetails = ({ flight, traceId, onClose }) => {
    const [fareRule, setFareRule] = useState(null);
    const [fareQuote, setFareQuote] = useState(null);
    const [ssrData, setSSRData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fareRulesExpanded, setFareRulesExpanded] = useState({});
    const [showSSRPage, setShowSSRPage] = useState(false);
    const [activeSSRTab, setActiveSSRTab] = useState('seats'); // seats, baggage, meals
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [selectedBaggage, setSelectedBaggage] = useState([]);
    const [selectedMeals, setSelectedMeals] = useState([]);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!flight || !traceId || !flight.resultIndex) {
                console.error('Missing required data:', { flight, traceId, resultIndex: flight?.resultIndex });
                setError('Missing flight information');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                console.log('Fetching details with:', { traceId, resultIndex: flight.resultIndex });

                // First fetch fare rule and fare quote
                const [ruleData, quoteData] = await Promise.all([
                    fetchFareRule(traceId, flight.resultIndex),
                    fetchFareQuote(traceId, flight.resultIndex)
                ]);

                console.log('Fare Rule Response:', ruleData);
                console.log('Fare Quote Response:', quoteData);

                // Check if responses have data
                if (!ruleData || !ruleData.data) {
                    console.error('Invalid fare rule response:', ruleData);
                }
                if (!quoteData || !quoteData.data) {
                    console.error('Invalid fare quote response:', quoteData);
                }

                setFareRule(ruleData);
                setFareQuote(quoteData);

                // Fetch SSR using the ResultIndex from Fare Quote response
                if (quoteData?.data?.Results?.ResultIndex) {
                    console.log('Fetching SSR with Fare Quote ResultIndex:', quoteData.data.Results.ResultIndex);
                    try {
                        const ssrResponse = await fetchSSR(traceId, quoteData.data.Results.ResultIndex);
                        console.log('SSR Response:', ssrResponse);

                        if (ssrResponse?.data && ssrResponse.data.ResponseStatus === 1) {
                            setSSRData(ssrResponse);
                        } else {
                            console.warn('SSR not available or failed:', ssrResponse?.data?.Error);
                        }
                    } catch (ssrErr) {
                        console.error('Error fetching SSR:', ssrErr);
                        // Don't set error, SSR is optional
                    }
                } else {
                    console.warn('No ResultIndex in Fare Quote response, skipping SSR');
                }
            } catch (err) {
                console.error('Error fetching flight details:', err);
                setError(`Failed to load flight details: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [flight, traceId]);

    const getPassengerType = (type) => {
        switch (type) {
            case 1: return 'Adult';
            case 2: return 'Child';
            case 3: return 'Infant';
            default: return 'Passenger';
        }
    };

    return (
        <div className={styles.flightDetailsContainer}>
            <div className={styles.detailsHeader}>
                <button className={styles.backButton} onClick={() => {
                    if (showSSRPage) {
                        setShowSSRPage(false);
                    } else {
                        onClose();
                    }
                }}>
                    <i className="fas fa-arrow-left"></i> {showSSRPage ? 'Back to Details' : 'Back to Results'}
                </button>
            </div>

            <div className={styles.detailsContent}>
                {/* Flight Summary - Hide on SSR page */}
                {!showSSRPage && (
                    <div className={styles.detailsSummary}>
                        <div className={styles.summaryTop}>
                            <div className={styles.airlineInfo}>
                                <img src={flight.logo} alt={flight.airline} className={styles.airlineLogo} />
                                <div>
                                    <div className={styles.airlineName}>{flight.airline}</div>
                                    <div className={styles.flightNum}>{flight.flightNumber}</div>
                                </div>
                            </div>
                            <div className={styles.priceInfo}>
                                <div className={styles.priceLabel}>Total Fare</div>
                                <div className={styles.priceValue}>{flight.price}</div>
                            </div>
                        </div>

                        <div className={styles.routeInfo}>
                            <div className={styles.routePoint}>
                                <div className={styles.routeTime}>{flight.departTime}</div>
                                <div className={styles.routeCity}>{flight.departCity}</div>
                                {fareQuote?.data?.Results?.Segments?.[0]?.[0]?.Origin && (
                                    <div className={styles.routeDetails}>
                                        <div className={styles.airportName}>
                                            {fareQuote.data.Results.Segments[0][0].Origin.Airport.AirportName}
                                        </div>
                                        {fareQuote.data.Results.Segments[0][0].Origin.Airport.Terminal && (
                                            <div className={styles.terminalInfo}>
                                                Terminal {fareQuote.data.Results.Segments[0][0].Origin.Airport.Terminal}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className={styles.routeMiddle}>
                                <div className={styles.routeDuration}>{flight.duration}</div>
                                <div className={styles.routeLine}>
                                    <i className="fas fa-plane"></i>
                                </div>
                                <div className={styles.routeStops}>{flight.stops}</div>
                            </div>
                            <div className={styles.routePoint}>
                                <div className={styles.routeTime}>{flight.arriveTime}</div>
                                <div className={styles.routeCity}>{flight.arriveCity}</div>
                                {fareQuote?.data?.Results?.Segments?.[0]?.[0]?.Destination && (
                                    <div className={styles.routeDetails}>
                                        <div className={styles.airportName}>
                                            {fareQuote.data.Results.Segments[0][0].Destination.Airport.AirportName}
                                        </div>
                                        {fareQuote.data.Results.Segments[0][0].Destination.Airport.Terminal && (
                                            <div className={styles.terminalInfo}>
                                                Terminal {fareQuote.data.Results.Segments[0][0].Destination.Airport.Terminal}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {!showSSRPage && loading && (
                    <div className={styles.detailsLoadingContainer}>
                        {/* Fare Rules Skeleton */}
                        <div className={styles.detailsSection}>
                            <div className={`${styles.skeletonText} ${styles.skeletonSectionTitle}`}></div>
                            <div className={styles.ruleCard}>
                                <div className={styles.ruleHeader}>
                                    <div className={`${styles.skeletonText} ${styles.skeletonBadge}`}></div>
                                    <div className={`${styles.skeletonText} ${styles.skeletonBadge}`}></div>
                                </div>
                                <div className={styles.ruleContent}>
                                    <div className={`${styles.skeletonText} ${styles.skeletonLine}`}></div>
                                    <div className={`${styles.skeletonText} ${styles.skeletonLine}`}></div>
                                    <div className={`${styles.skeletonText} ${styles.skeletonLine} ${styles.skeletonLineShort}`}></div>
                                </div>
                            </div>
                        </div>

                        {/* Fare Quote Skeleton */}
                        <div className={styles.detailsSection}>
                            <div className={`${styles.skeletonText} ${styles.skeletonSectionTitle}`}></div>
                            <div className={styles.fareBreakdown}>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className={styles.fareRow}>
                                        <div className={`${styles.skeletonText} ${styles.skeletonFareLabel}`}></div>
                                        <div className={`${styles.skeletonText} ${styles.skeletonFareValue}`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {!showSSRPage && error && (
                    <div className={styles.errorSection}>
                        <i className="fas fa-exclamation-circle"></i>
                        <p>{error}</p>
                    </div>
                )}

                {!showSSRPage && !loading && !error && (
                    <>
                        {/* Show error if Fare Quote failed */}
                        {fareQuote?.data?.Error?.ErrorCode > 0 && fareQuote?.data?.Error?.ErrorMessage && (
                            <div className={styles.detailsSection} style={{ background: '#FFF3CD', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #FFE69C' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className="fas fa-exclamation-triangle" style={{ color: '#856404', fontSize: '20px' }}></i>
                                    <div>
                                        <h4 style={{ color: '#856404', margin: '0 0 5px 0', fontSize: '15px' }}>
                                            Fare Quote Unavailable
                                        </h4>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#856404' }}>
                                            {fareQuote.data.Error.ErrorMessage}
                                        </p>
                                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#856404' }}>
                                            Showing basic fare information. Detailed breakdown may not be available.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Fare Rules Section */}
                        {fareRule?.data?.FareRules && fareRule.data.FareRules.length > 0 && (
                            <div className={styles.detailsSection}>
                                <h3><i className="fas fa-file-contract"></i> Fare Rules</h3>
                                {fareRule.data.FareRules.map((rule, index) => (
                                    <div key={index} className={styles.ruleCard}>
                                        <div
                                            className={styles.ruleHeader}
                                            onClick={() => setFareRulesExpanded(prev => ({
                                                ...prev,
                                                [index]: !prev[index]
                                            }))}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                                                <span className={styles.routeBadge}>
                                                    {rule.Origin} → {rule.Destination}
                                                </span>
                                                <span className={styles.fareBasisBadge}>
                                                    {rule.FareBasisCode}
                                                </span>
                                            </div>
                                            <i className={`fas fa-chevron-${fareRulesExpanded[index] ? 'up' : 'down'}`}
                                                style={{ color: 'var(--primary-blue)', fontSize: '16px' }}></i>
                                        </div>

                                        {fareRulesExpanded[index] && (
                                            <>
                                                {rule.FareInclusions && rule.FareInclusions.length > 0 && (
                                                    <div className={styles.inclusions}>
                                                        <h4>Inclusions:</h4>
                                                        <ul>
                                                            {rule.FareInclusions.map((inclusion, idx) => (
                                                                <li key={idx}>
                                                                    <i className="fas fa-check-circle"></i>
                                                                    {inclusion}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                <div className={styles.ruleContent}>
                                                    <div
                                                        className={styles.ruleText}
                                                        dangerouslySetInnerHTML={{ __html: rule.FareRuleDetail }}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Fare Quote Section - Show if available OR show basic info */}
                        <div className={styles.detailsSection}>
                            <h3><i className="fas fa-receipt"></i> Fare Information</h3>

                            {fareQuote?.data?.Results ? (
                                <>
                                    {/* Full Price Breakdown from API */}
                                    <div className={styles.fareBreakdown}>
                                        <div className={styles.fareRow}>
                                            <span>Base Fare</span>
                                            <span>₹{fareQuote.data.Results.Fare.BaseFare}</span>
                                        </div>
                                        <div className={styles.fareRow}>
                                            <span>Taxes & Fees</span>
                                            <span>₹{fareQuote.data.Results.Fare.Tax}</span>
                                        </div>
                                        {fareQuote.data.Results.Fare.TaxBreakup && (
                                            <div className={styles.taxBreakdown}>
                                                {fareQuote.data.Results.Fare.TaxBreakup.map((tax, idx) => (
                                                    <div key={idx} className={styles.taxRow}>
                                                        <span>{tax.key}</span>
                                                        <span>₹{tax.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className={styles.fareDivider}></div>
                                        <div className={`${styles.fareRow} ${styles.totalRow}`}>
                                            <span>Total Amount</span>
                                            <span>₹{fareQuote.data.Results.Fare.OfferedFare}</span>
                                        </div>
                                    </div>

                                    {/* Passenger Breakdown */}
                                    {fareQuote.data.Results.FareBreakdown && (
                                        <div className={styles.passengerSection}>
                                            <h4>Passenger Breakdown</h4>
                                            {fareQuote.data.Results.FareBreakdown.map((passenger, idx) => (
                                                <div key={idx} className={styles.passengerRow}>
                                                    <span>
                                                        {getPassengerType(passenger.PassengerType)} × {passenger.PassengerCount}
                                                    </span>
                                                    <span>₹{passenger.BaseFare + passenger.Tax}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Additional Info */}
                                    <div className={styles.additionalInfo}>
                                        <div className={styles.infoItem}>
                                            <i className="fas fa-undo"></i>
                                            <div>
                                                <div className={styles.infoLabel}>Refundable</div>
                                                <div className={styles.infoValue}>
                                                    {fareQuote.data.Results.IsRefundable ? 'Yes' : 'No'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <i className="fas fa-suitcase"></i>
                                            <div>
                                                <div className={styles.infoLabel}>Baggage</div>
                                                <div className={styles.infoValue}>
                                                    {fareQuote.data.Results.Segments?.[0]?.[0]?.Baggage || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <i className="fas fa-briefcase"></i>
                                            <div>
                                                <div className={styles.infoLabel}>Cabin Baggage</div>
                                                <div className={styles.infoValue}>
                                                    {fareQuote.data.Results.Segments?.[0]?.[0]?.CabinBaggage || 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <i className="fas fa-couch"></i>
                                            <div>
                                                <div className={styles.infoLabel}>Cabin Class</div>
                                                <div className={styles.infoValue}>
                                                    {fareQuote.data.Results.Segments?.[0]?.[0]?.SupplierFareClass || 'Economy'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Basic Price Info from flight card */}
                                    <div className={styles.fareBreakdown}>
                                        <div className={styles.fareRow}>
                                            <span>Total Fare (Approx.)</span>
                                            <span>{flight.price}</span>
                                        </div>
                                        <div style={{ padding: '15px', background: '#F8F9FA', borderRadius: '8px', marginTop: '10px' }}>
                                            <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>
                                                <i className="fas fa-info-circle"></i> Detailed fare breakdown is currently unavailable.
                                                The final price will be confirmed during booking.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Show baggage info from Fare Rules if available */}
                                    {fareRule?.data?.FareRules?.[0]?.FareInclusions && fareRule.data.FareRules[0].FareInclusions.length > 0 && (
                                        <div className={styles.additionalInfo}>
                                            <h4 style={{ marginBottom: '15px', fontSize: '15px' }}>Inclusions</h4>
                                            {fareRule.data.FareRules[0].FareInclusions.map((inclusion, idx) => (
                                                <div key={idx} className={styles.infoItem}>
                                                    <i className="fas fa-check-circle" style={{ color: '#10B981' }}></i>
                                                    <div>
                                                        <div className={styles.infoValue}>{inclusion}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                    </>
                )}
            </div>

            {/* Booking Footer - Flight Details Page (Fixed at bottom) */}
            {!showSSRPage && !loading && !error && (
                <div className={styles.bookingFooter}>
                    <button
                        className={styles.bookNowBtn}
                        onClick={() => {
                            if (ssrData?.data && ssrData.data.ResponseStatus === 1) {
                                setShowSSRPage(true);
                            } else {
                                // Direct booking if no SSR available
                                alert('Proceeding to booking...');
                            }
                        }}
                    >
                        {ssrData?.data && ssrData.data.ResponseStatus === 1 ? (
                            <>
                                <span>Next: Select Seats & Add-ons</span>
                                <i className="fas fa-arrow-right"></i>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-check-circle"></i>
                                <span>Book Now - {flight.price}</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* SSR Selection Page - Slides in */}
            {!loading && !error && showSSRPage && ssrData?.data && ssrData.data.ResponseStatus === 1 && (
                <div className={`${styles.ssrPage} ${showSSRPage ? styles.slideIn : ''}`}>
                    <div className={styles.ssrPageContent}>
                        <div className={styles.ssrPageHeader}>
                            <h2><i className="fas fa-plus-circle"></i> Customize Your Journey</h2>
                            <p>Select seats, add baggage, and choose meals</p>
                        </div>

                        {/* SSR Section - Seats, Baggage, Meals */}
                        <div className={styles.detailsSection}>
                            <h3><i className="fas fa-plus-circle"></i> Add-ons & Services</h3>

                            {/* SSR Tabs */}
                            <div className={styles.ssrTabs}>
                                <button
                                    className={`${styles.ssrTab} ${activeSSRTab === 'seats' ? styles.active : ''}`}
                                    onClick={() => setActiveSSRTab('seats')}
                                >
                                    <i className="fas fa-couch"></i>
                                    <span>Seats</span>
                                    {selectedSeats.length > 0 && <span className={styles.badge}>{selectedSeats.length}</span>}
                                </button>
                                <button
                                    className={`${styles.ssrTab} ${activeSSRTab === 'baggage' ? styles.active : ''}`}
                                    onClick={() => setActiveSSRTab('baggage')}
                                >
                                    <i className="fas fa-suitcase"></i>
                                    <span>Baggage</span>
                                    {selectedBaggage.length > 0 && <span className={styles.badge}>{selectedBaggage.length}</span>}
                                </button>
                                <button
                                    className={`${styles.ssrTab} ${activeSSRTab === 'meals' ? styles.active : ''}`}
                                    onClick={() => setActiveSSRTab('meals')}
                                >
                                    <i className="fas fa-utensils"></i>
                                    <span>Meals</span>
                                    {selectedMeals.length > 0 && <span className={styles.badge}>{selectedMeals.length}</span>}
                                </button>
                            </div>

                            {/* Seats Tab */}
                            {activeSSRTab === 'seats' && ssrData.data.SeatDynamic && (
                                <div className={styles.ssrContent}>
                                    {ssrData.data.SeatDynamic.map((segment, segmentIndex) => (
                                        <div key={segmentIndex} className={styles.seatMapContainer}>
                                            {segment.SegmentSeat.map((segmentSeat, seatIndex) => (
                                                <div key={seatIndex} className={styles.seatSection}>
                                                    <div className={styles.seatLegend}>
                                                        <div className={styles.legendItem}>
                                                            <div className={`${styles.legendSeat} ${styles.available}`}></div>
                                                            <span>Available</span>
                                                        </div>
                                                        <div className={styles.legendItem}>
                                                            <div className={`${styles.legendSeat} ${styles.selected}`}></div>
                                                            <span>Selected</span>
                                                        </div>
                                                        <div className={styles.legendItem}>
                                                            <div className={`${styles.legendSeat} ${styles.occupied}`}></div>
                                                            <span>Occupied</span>
                                                        </div>
                                                    </div>

                                                    <div className={styles.seatMap}>
                                                        {segmentSeat.RowSeats.map((row, rowIndex) => (
                                                            row.Seats && row.Seats.length > 0 && (
                                                                <div key={rowIndex} className={styles.seatRow}>
                                                                    <div className={styles.rowNumber}>{row.Seats[0].RowNo}</div>
                                                                    <div className={styles.seatsContainer}>
                                                                        {row.Seats.map((seat, seatIdx) => {
                                                                            if (seat.Code === 'NoSeat') {
                                                                                return <div key={seatIdx} className={styles.noSeat}></div>;
                                                                            }

                                                                            const isSelected = selectedSeats.some(s => s.Code === seat.Code);
                                                                            const isAvailable = seat.AvailablityType === 1;
                                                                            const isWindow = seat.SeatType === 1 || seat.SeatTypeEnum?.includes('Window');
                                                                            const isAisle = seat.SeatType === 2 || seat.SeatTypeEnum?.includes('Aisle');

                                                                            return (
                                                                                <button
                                                                                    key={seatIdx}
                                                                                    className={`${styles.seat} ${isSelected ? styles.selected :
                                                                                        !isAvailable ? styles.occupied :
                                                                                            styles.available
                                                                                        } ${isWindow ? styles.window : ''} ${isAisle ? styles.aisle : ''}`}
                                                                                    onClick={() => {
                                                                                        if (isAvailable) {
                                                                                            if (isSelected) {
                                                                                                setSelectedSeats(prev => prev.filter(s => s.Code !== seat.Code));
                                                                                            } else {
                                                                                                setSelectedSeats(prev => [...prev, seat]);
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                    disabled={!isAvailable}
                                                                                    title={`${seat.Code} - ${seat.SeatTypeEnum || 'Seat'} - ₹${seat.Price}`}
                                                                                >
                                                                                    <span className={styles.seatLabel}>{seat.SeatNo}</span>
                                                                                    {seat.Price > 0 && <span className={styles.seatPrice}>₹{seat.Price}</span>}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Baggage Tab */}
                            {activeSSRTab === 'baggage' && ssrData.data.Baggage && (
                                <div className={styles.ssrContent}>
                                    <div className={styles.baggageGrid}>
                                        {ssrData.data.Baggage.flat().map((baggage, index) => {
                                            const isSelected = selectedBaggage.some(b => b.Code === baggage.Code);
                                            return (
                                                <div
                                                    key={index}
                                                    className={`${styles.baggageCard} ${isSelected ? styles.selected : ''}`}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedBaggage(prev => prev.filter(b => b.Code !== baggage.Code));
                                                        } else {
                                                            setSelectedBaggage(prev => [...prev, baggage]);
                                                        }
                                                    }}
                                                >
                                                    <div className={styles.baggageIcon}>
                                                        <i className="fas fa-suitcase-rolling"></i>
                                                    </div>
                                                    <div className={styles.baggageInfo}>
                                                        <div className={styles.baggageWeight}>{baggage.Weight} KG</div>
                                                        <div className={styles.baggageRoute}>{baggage.Origin} → {baggage.Destination}</div>
                                                    </div>
                                                    <div className={styles.baggagePrice}>₹{baggage.Price}</div>
                                                    {isSelected && <i className="fas fa-check-circle" style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--primary-blue)' }}></i>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Meals Tab */}
                            {activeSSRTab === 'meals' && ssrData.data.MealDynamic && (
                                <div className={styles.ssrContent}>
                                    <div className={styles.mealsGrid}>
                                        {ssrData.data.MealDynamic.flat().map((meal, index) => {
                                            const isSelected = selectedMeals.some(m => m.Code === meal.Code);
                                            return (
                                                <div
                                                    key={index}
                                                    className={`${styles.mealCard} ${isSelected ? styles.selected : ''}`}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedMeals(prev => prev.filter(m => m.Code !== meal.Code));
                                                        } else {
                                                            setSelectedMeals(prev => [...prev, meal]);
                                                        }
                                                    }}
                                                >
                                                    <div className={styles.mealIcon}>
                                                        <i className="fas fa-utensils"></i>
                                                    </div>
                                                    <div className={styles.mealInfo}>
                                                        <div className={styles.mealName}>{meal.AirlineDescription || meal.Code}</div>
                                                        <div className={styles.mealRoute}>{meal.Origin} → {meal.Destination}</div>
                                                    </div>
                                                    <div className={styles.mealPrice}>₹{meal.Price}</div>
                                                    {isSelected && <i className="fas fa-check-circle" style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--primary-blue)' }}></i>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Footer - SSR Page */}
                    <div className={styles.bookingFooter}>
                        <div className={styles.bookingSummary}>
                            <div className={styles.summaryItem}>
                                <span>Base Fare:</span>
                                <span>{flight.price}</span>
                            </div>
                            {selectedSeats.length > 0 && (
                                <div className={styles.summaryItem}>
                                    <span>Seats ({selectedSeats.length}):</span>
                                    <span>₹{selectedSeats.reduce((sum, seat) => sum + seat.Price, 0)}</span>
                                </div>
                            )}
                            {selectedBaggage.length > 0 && (
                                <div className={styles.summaryItem}>
                                    <span>Baggage ({selectedBaggage.length}):</span>
                                    <span>₹{selectedBaggage.reduce((sum, bag) => sum + bag.Price, 0)}</span>
                                </div>
                            )}
                            {selectedMeals.length > 0 && (
                                <div className={styles.summaryItem}>
                                    <span>Meals ({selectedMeals.length}):</span>
                                    <span>₹{selectedMeals.reduce((sum, meal) => sum + meal.Price, 0)}</span>
                                </div>
                            )}
                            <div className={`${styles.summaryItem} ${styles.totalRow}`}>
                                <span>Total Amount:</span>
                                <span>₹{
                                    parseInt(flight.price.replace(/[₹,]/g, '')) +
                                    selectedSeats.reduce((sum, seat) => sum + seat.Price, 0) +
                                    selectedBaggage.reduce((sum, bag) => sum + bag.Price, 0) +
                                    selectedMeals.reduce((sum, meal) => sum + meal.Price, 0)
                                }</span>
                            </div>
                        </div>
                        <button className={styles.bookNowBtn} onClick={() => alert('Proceeding to booking...')}>
                            <i className="fas fa-check-circle"></i>
                            <span>Continue to Book</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlightDetails;
