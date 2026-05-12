import styles from "./Tab.module.css";

function Tab({ tabs, activeTab, onChange }) {
    return (
        <div className={styles.wrapper}>
            {tabs.map((tab) => (
                <button
                    key={tab.value}
                    className={`${styles.tab} ${activeTab === tab.value ? styles.active : ""}`}
                    onClick={() => onChange(tab.value)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default Tab;