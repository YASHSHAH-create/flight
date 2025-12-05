'use client';
import React from 'react';
import styles from '../../app/search/search.module.css';

const FlightCardSkeleton = () => {
    return (
        <div className={`${styles.flightCard} ${styles.skeleton}`}>
            <div className={styles.fcHeader}>
                <div className={`${styles.skeletonText} ${styles.skeletonAirline}`}></div>
            </div>
            <div className={styles.fcContent}>
                <div className={`${styles.skeletonBox} ${styles.skeletonLogo}`}></div>
                <div className={styles.fcDepart}>
                    <div className={`${styles.skeletonText} ${styles.skeletonTime}`}></div>
                    <div className={`${styles.skeletonText} ${styles.skeletonCity}`}></div>
                </div>
                <div className={styles.fcMiddle}>
                    <div className={`${styles.skeletonText} ${styles.skeletonDuration}`}></div>
                    <div className={`${styles.skeletonText} ${styles.skeletonStops}`}></div>
                </div>
                <div className={styles.fcArrive}>
                    <div className={`${styles.skeletonText} ${styles.skeletonTime}`}></div>
                    <div className={`${styles.skeletonText} ${styles.skeletonCity}`}></div>
                </div>
                <div className={styles.fcPricing}>
                    <div className={`${styles.skeletonText} ${styles.skeletonPrice}`}></div>
                    <div className={`${styles.skeletonText} ${styles.skeletonOldPrice}`}></div>
                </div>
            </div>
        </div>
    );
};

export default FlightCardSkeleton;
