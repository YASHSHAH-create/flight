import React from 'react';
import styles from '../../app/search/search.module.css';

const Sidebar = () => {
    return (
        <nav className={styles.sidebar}>
            <div className={styles.logo}>
                <i className="fas fa-plane-departure"></i> Nestia
            </div>

            <a href="#" className={styles.navItem}>
                <i className="fas fa-bed"></i> Hotels & Homes
            </a>
            <a href="#" className={`${styles.navItem} ${styles.active}`}>
                <i className="fas fa-plane"></i> Flights
            </a>
            <a href="#" className={styles.navItem}>
                <i className="fas fa-bookmark"></i> Saved Trips
            </a>
            <a href="#" className={styles.navItem}>
                <i className="fas fa-shield-alt"></i> Insurance
            </a>
            <a href="#" className={styles.navItem}>
                <i className="fas fa-percentage"></i> Top Deals
            </a>

            <div className={styles.promoCard}>
                <h3>Get Nestia App</h3>
                <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.9 }}>
                    Smart picks, live answers, and on-the-go trip help.
                </p>
            </div>
        </nav>
    );
};

export default Sidebar;
