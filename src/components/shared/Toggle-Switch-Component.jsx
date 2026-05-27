function ToggleSwitchComponent({ value, onChange, disabled = false }) {
    return (
        <div
            onClick={!disabled ? onChange : undefined}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                cursor: disabled ? "not-allowed" : "pointer"
            }}
        >
            <div style={{
                width: "48px",
                height: "26px",
                borderRadius: "999px",
                backgroundColor: value ? "#4caf50" : "#ccc",
                position: "relative",
                transition: "background-color 0.2s",
                opacity: disabled ? 0.5 : 1
            }}>
                <div style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    position: "absolute",
                    top: "3px",
                    left: value ? "25px" : "3px",
                    transition: "left 0.2s"
                }} />
            </div>
            <span>{value ? "Avaliable" : "Not Available"}</span>
        </div>
    );
}

export default ToggleSwitchComponent;