"use client";
import React, { useState } from 'react';
import styles from './search.module.css';
import Sidebar from '../../components/search/Sidebar';
import SearchHeader from '../../components/search/SearchHeader';
import FilterSection from '../../components/search/FilterSection';
import FlightCard from '../../components/search/FlightCard';

const flightData = [
    {
        id: 1,
        airline: "Indigo",
        flightNumber: "175",
        logo: "https://images.ixigo.com/img/common-resources/airline-new/6E.png",
        departTime: "10:45",
        departCity: "BLR",
        duration: "2h 55m",
        stops: "Non-stop",
        arriveTime: "13:40",
        arriveCity: "DEL",
        price: "₹7,707",
        oldPrice: "₹8,772"
    },
    {
        id: 2,
        airline: "Indigo",
        flightNumber: "869",
        logo: "https://images.ixigo.com/img/common-resources/airline-new/6E.png",
        departTime: "11:45",
        departCity: "BLR",
        duration: "3h 0m",
        stops: "Non-stop",
        arriveTime: "14:45",
        arriveCity: "DEL",
        price: "₹7,707",
        oldPrice: "₹8,772"
    },
    {
        id: 3,
        airline: "Air India",
        flightNumber: "2814",
        logo: "https://images.ixigo.com/img/common-resources/airline-new/AI.png",
        departTime: "22:00",
        departCity: "BLR",
        duration: "2h 40m",
        stops: "Non-stop",
        arriveTime: "00:40",
        arriveCity: "DEL",
        price: "₹9,436",
        oldPrice: "₹10,801"
    },
    {
        id: 4,
        airline: "Vistara",
        flightNumber: "UK 807",
        logo: "https://images.ixigo.com/img/common-resources/airline-new/UK.png",
        departTime: "06:00",
        departCity: "BLR",
        duration: "2h 30m",
        stops: "Non-stop",
        arriveTime: "08:30",
        arriveCity: "DEL",
        price: "₹8,950",
        oldPrice: "₹9,500"
    },
    {
        id: 5,
        airline: "SpiceJet",
        flightNumber: "SG 8192",
        logo: "https://images.ixigo.com/img/common-resources/airline-new/SG.png",
        departTime: "07:15",
        departCity: "BLR",
        duration: "2h 45m",
        stops: "Non-stop",
        arriveTime: "10:00",
        arriveCity: "DEL",
        price: "₹6,850",
        oldPrice: "₹7,400"
    },
    {
        id: 6,
        airline: "Indigo",
        flightNumber: "6E 5012",
        logo: "https://images.ixigo.com/img/common-resources/airline-new/6E.png",
        departTime: "12:30",
        departCity: "BLR",
        duration: "3h 15m",
        stops: "Non-stop",
        arriveTime: "15:45",
        arriveCity: "DEL",
        price: "₹7,500",
        oldPrice: "₹8,100"
    },
    {
        id: 7,
        airline: "Air India",
        flightNumber: "AI 503",
        logo: "https://images.ixigo.com/img/common-resources/airline-new/AI.png",
        departTime: "14:20",
        departCity: "BLR",
        duration: "2h 50m",
        stops: "Non-stop",
        arriveTime: "17:10",
        arriveCity: "DEL",
        price: "₹9,200",
        oldPrice: "₹10,500"
    },
    {
        id: 8,
        airline: "Vistara",
        flightNumber: "UK 851",
        logo: "https://images.ixigo.com/img/common-resources/airline-new/UK.png",
        departTime: "16:45",
        departCity: "BLR",
        duration: "2h 35m",
        stops: "Non-stop",
        arriveTime: "19:20",
        arriveCity: "DEL",
        price: "₹8,600",
        oldPrice: "₹9,200"
    },
    {
        id: 9,
        airline: "Indigo",
        flightNumber: "6E 2177",
        logo: "https://images.ixigo.com/img/common-resources/airline-new/6E.png",
        departTime: "18:15",
        departCity: "BLR",
        duration: "2h 55m",
        stops: "Non-stop",
        arriveTime: "21:10",
        arriveCity: "DEL",
        price: "₹7,350",
        oldPrice: "₹8,000"
    },
    {
        id: 10,
        airline: "SpiceJet",
        flightNumber: "SG 8708",
        logo: "https://images.ixigo.com/img/common-resources/airline-new/SG.png",
        departTime: "20:30",
        departCity: "BLR",
        duration: "2h 40m",
        stops: "Non-stop",
        arriveTime: "23:10",
        arriveCity: "DEL",
        price: "₹6,990",
        oldPrice: "₹7,500"
    },
    {
        id: 11,
        airline: "Air India",
        flightNumber: "AI 806",
        logo: "https://images.ixigo.com/img/common-resources/airline-new/AI.png",
        departTime: "05:30",
        departCity: "BLR",
        duration: "2h 45m",
        stops: "Non-stop",
        arriveTime: "08:15",
        arriveCity: "DEL",
        price: "₹9,800",
        oldPrice: "₹11,000"
    },
    {
        id: 12,
        airline: "Vistara",
        flightNumber: "UK 819",
        logo: "https://images.ixigo.com/img/common-resources/airline-new/UK.png",
        departTime: "09:00",
        departCity: "BLR",
        duration: "2h 30m",
        stops: "Non-stop",
        arriveTime: "11:30",
        arriveCity: "DEL",
        price: "₹8,450",
        oldPrice: "₹9,000"
    },
    {
        id: 13,
        airline: "Indigo",
        flightNumber: "6E 6177",
        logo: "https://images.ixigo.com/img/common-resources/airline-new/6E.png",
        departTime: "15:20",
        departCity: "BLR",
        duration: "3h 0m",
        stops: "Non-stop",
        arriveTime: "18:20",
        arriveCity: "DEL",
        price: "₹7,550",
        oldPrice: "₹8,200"
    }
];

const SearchClient = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    return (
        <div className={styles.container}>
            <Sidebar />

            <div className={styles.mainContent}>
                <div className={styles.mobileHeaderNew}>
                    <div className={styles.headerTop}>
                        <div className={styles.backBtn}>
                            <i className="fas fa-arrow-left"></i>
                        </div>
                        <div className={styles.headerCenter}>
                            <div className={styles.routeText}>
                                BLR <i className="fas fa-arrow-right" style={{ fontSize: '12px' }}></i> DEL
                            </div>
                            <div className={styles.subText}>2025-11-16 • 1 Passenger • Economy</div>
                        </div>
                        <div className={styles.filterBtn} onClick={openModal}>
                            <i className="fas fa-sliders-h"></i>
                        </div>
                    </div>

                    <div className={styles.sortTabs}>
                        <button className={`${styles.sortTab} ${styles.active}`}>Recommended</button>
                        <button className={styles.sortTab}>Cheapest</button>
                        <button className={styles.sortTab}>Fastest</button>
                    </div>

                    <div className={styles.flightCount}>111 flights found</div>
                </div>



                <SearchHeader />

                <div className={styles.contentGrid}>
                    <FilterSection />

                    <div className={styles.resultsList} data-lenis-prevent>
                        {flightData.map((flight) => (
                            <FlightCard key={flight.id} {...flight} />
                        ))}
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
                                <div className={styles.label}>From</div>
                                <div className={styles.value}>IDR</div>
                                <div className={styles.subValue}>Indore</div>
                                <i className={`fas fa-plane-departure ${styles.fieldIcon}`}></i>
                            </div>
                            <div className={styles.swapIcon}>
                                <i className="fas fa-exchange-alt"></i>
                            </div>
                            <div className={styles.modalField}>
                                <div className={styles.label}>To</div>
                                <div className={styles.value}>BOM</div>
                                <div className={styles.subValue}>Mumbai</div>
                                <i className={`fas fa-plane-arrival ${styles.fieldIcon}`}></i>
                            </div>
                        </div>

                        <div className={styles.singleField}>
                            <i className={`far fa-calendar-alt ${styles.fieldIconLeft}`}></i>
                            <div>
                                <div className={styles.value}>Wed, 03 Dec</div>
                            </div>
                        </div>

                        <div className={styles.singleField}>
                            <i className={`fas fa-user ${styles.fieldIconLeft}`}></i>
                            <div>
                                <div className={styles.value}>1 Traveller • Economy</div>
                            </div>
                        </div>

                        <div className={styles.specialFares}>
                            <div className={styles.fareLabel}>Special Fares (Optional)</div>
                            <div className={styles.fareChips}>
                                <div className={styles.chip}>Student</div>
                                <div className={styles.chip}>Senior Citizen</div>
                                <div className={styles.chip}>Armed Forces</div>
                            </div>
                        </div>

                        <button className={styles.modalSearchBtn}>
                            <i className="fas fa-search"></i> Search Flights
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchClient;
