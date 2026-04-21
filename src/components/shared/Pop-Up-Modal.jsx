function PopUpModal ({ title, onClose, children }) {
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100
        }}>
            <div style={{
                background: "white",
                borderRadius: "8px",
                padding: "24px",
                width: "500px",
                maxHeight: "80vh",
                overflowY: "auto"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <button onClick={onClose}>✕</button>
                </div>
                <div style={{ marginTop: "16px" }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default PopUpModal