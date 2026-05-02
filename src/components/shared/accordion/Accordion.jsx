import { useState } from 'react';
import clsx from 'clsx';
import styles from './Accordion.module.css';

export const Accordion = ({ items }) => {
    const [openIndex, setOpenIndex] = useState(null);

    // set hanya ada 1 accordion terbuka
    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.accordion}>
        {items.map((item, index) => (
            <div key={index} className={styles.item}>

            <button
                className={clsx(styles.trigger, openIndex === index && styles.open)}
                onClick={() => toggle(index)}
            >
                <span>{item.question}</span>
                <span className={styles.icon}>
                {openIndex === index ? '−' : '+'}
                </span>
            </button>

            {openIndex === index && (
                <div className={styles.answer}>
                <p>{item.answer}</p>
                </div>
            )}

            </div>
        ))}
        </div>
    );
};