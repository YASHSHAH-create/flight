'use client';
import React from 'react';
import styles from '../../app/search/search.module.css';

const FlightCard = ({
    airline,
    flightNumber,
    logo,
    departTime,
    departCity,
    duration,
    stops,
    arriveTime,
    arriveCity,
    price,
    oldPrice,
    resultIndex,
    traceId,
    from,
    to,
    date,
    index,
    rawDepTime,
    rawArrTime,
    onClick
}) => {
    const handleClick = () => {
        if (onClick) {
            onClick({
                airline,
                flightNumber,
                logo,
                departTime,
                departCity,
                duration,
                stops,
                arriveTime,
                arriveCity,
                price,
                oldPrice,
                resultIndex,
                rawDepTime,
                rawArrTime
            });
        }
    };

    return (
        <div className={styles.flightCard} style={{ cursor: 'pointer' }} onClick={handleClick}>
            <div className={styles.fcHeader}>
                <span className={styles.fcAirlineText}>{airline} • {flightNumber}</span>
            </div>
            <div className={styles.fcContent}>
                <img src={logo} alt={airline} className={styles.fcLogo} />
                <div className={styles.fcDepart}>
                    <div className={styles.fcTime}>{departTime}</div>
                    <div className={styles.fcCity}>{departCity}</div>
                </div>
                <div className={styles.fcMiddle}>
                    <div className={styles.fcDuration}>{duration}</div>
                    <div className={styles.fcStops}>{stops}</div>
                </div>
                <div className={styles.fcArrive}>
                    <div className={styles.fcTime}>{arriveTime}</div>
                    <div className={styles.fcCity}>{arriveCity}</div>
                </div>
                <div className={styles.fcPricing}>
                    <div className={styles.fcPrice}>{price}</div>
                    <div className={styles.fcOldPrice}>{oldPrice}</div>
                </div>
            </div>
        </div>
    );
};

export default FlightCard;
