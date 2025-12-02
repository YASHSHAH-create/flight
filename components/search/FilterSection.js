import React from 'react';
import styles from '../../app/search/search.module.css';

const FilterSection = () => {
    return (
        <aside className={styles.filterSection} data-lenis-prevent>
            <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>
                    Stops <span>Reset</span>
                </div>
                <div className={styles.checkboxRow}>
                    <label>
                        <input type="checkbox" /> Non stop
                    </label>
                    <span>$158</span>
                </div>
                <div className={styles.checkboxRow}>
                    <label>
                        <input type="checkbox" /> 1 Stop
                    </label>
                    <span>$119</span>
                </div>
            </div>

            <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Price Range</div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Min"
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Max"
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                        }}
                    />
                </div>
            </div>

            <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>Airlines</div>
                <div className={styles.checkboxRow}>
                    <label>
                        <input type="checkbox" /> Vietjet
                    </label>
                    <span>8</span>
                </div>
                <div className={styles.checkboxRow}>
                    <label>
                        <input type="checkbox" /> Air Asia
                    </label>
                    <span>7</span>
                </div>
            </div>
        </aside>
    );
};

export default FilterSection;
