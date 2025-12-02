import React from 'react';
import styles from '../../app/search/search.module.css';

const SearchHeader = () => {
    return (
        <div className={styles.searchContainer}>
            <div className={styles.searchField}>
                <i className={`fas fa-plane-departure ${styles.icon}`}></i>
                <div className={styles.fieldInfo}>
                    <h4>From</h4>
                    <p>Bangkok</p>
                </div>
            </div>

            <div className={styles.searchField}>
                <i className={`fas fa-plane-arrival ${styles.icon}`}></i>
                <div className={styles.fieldInfo}>
                    <h4>To</h4>
                    <p>Tokyo, Japan</p>
                </div>
            </div>

            <div className={styles.searchField}>
                <i className={`far fa-calendar-alt ${styles.icon}`}></i>
                <div className={styles.fieldInfo}>
                    <h4>Dates</h4>
                    <p>05 Sep 25</p>
                </div>
            </div>

            <div className={styles.searchField}>
                <i className={`fas fa-user-friends ${styles.icon}`}></i>
                <div className={styles.fieldInfo}>
                    <h4>Travelers</h4>
                    <p>2 Travelers</p>
                </div>
            </div>

            <button className={styles.searchBtn}>
                <i className="fas fa-search"></i>
            </button>
        </div>
    );
};

export default SearchHeader;
