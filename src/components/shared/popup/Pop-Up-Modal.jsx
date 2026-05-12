import styles from "./PopUpModal.module.css";

function PopUpModal({ title, onClose, children }) {
    return (
        <div className={styles.overlay} onClick={onClose}>

            {/* stop propagation supaya klik di dalam modal tidak menutup */}
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{title}</h3>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </div>

        </div>
    );
}

export default PopUpModal;