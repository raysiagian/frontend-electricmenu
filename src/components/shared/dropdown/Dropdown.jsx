import { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.css";

function Dropdown({ label, items }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    // tutup kalau klik di luar dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={styles.wrapper} ref={ref}>
            <button
                className={styles.trigger}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {label}
                <span className={styles.arrow}>{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
                <ul className={styles.menu}>
                    {items.map((item, index) => (
                        <li key={index}>
                            <button
                                className={`${styles.item} ${item.danger ? styles.danger : ""}`}
                                onClick={() => {
                                    item.onClick();
                                    setIsOpen(false);
                                }}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Dropdown;