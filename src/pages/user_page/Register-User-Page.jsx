import { useState } from "react";
import { registerUser } from "../../services/auth-service";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/shared/button/Button";
import styles from "../../components/shared/Form.module.css"
import backgroundImage from "../../assets/images/background_image.png"

function RegisterUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(true)
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    
    setError("");

    if(!name || !email || !password){
        setError("Nama, email dan password wajib diisi")
        return
    }

    if(!emailRegex.test(email)){
        setError("Format email tidak valid")
        return
    }

    setLoading(true);

    try {
        const data = await registerUser({ name, email, password });

        console.log("RESPONSE:", data);

        navigate("/verify-email", {
                state: {
                    email:email,
                    message: "Registrasi berhasil! silahkan verifikasi otp."
                }
            });

        } catch (err) {
            console.log("ERROR:", err.response?.data || err.message);

            const message =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Terjadi kesalahan";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <img src={backgroundImage} className={styles["background-image"]} alt="" />
            <div className={styles.overlay}>
                <div className={styles.card}>
                <h2>Sign Up</h2>
                <p className={styles.subtitle}>Get start and create your account</p>            
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label className={styles.label}>Name</label>
                        <input
                            className={styles.input}    
                            type="text" 
                            placeholder="name"
                            value={name}
                            onChange={(e) => {
                                console.log("Name INPUT:", e.target.value);
                                setName(e.target.value);
                            }} 
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Email</label>
                        <input
                            className={styles.input}
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => {
                            setEmail(e.target.value);
                            }}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Password</label>
                        <div className={styles["input-wrapper"]}>
                            <input
                                className={styles.input}
                                type={showPassword ? "text" : "password"}
                                placeholder="password"
                                value={password}
                                onChange={(e) => {
                                // console.log("PASSWORD INPUT:", e.target.value);
                                setPassword(e.target.value);
                                }}
                            />
                            <button
                                className={styles["toggle-password"]}
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                style={{
                                    right: "5px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer"
                                }}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    {error && <p className={styles["error-text"]}>{error}</p>}

                    <div className={styles.actions}>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? "Loading..." : "Sign Up"}
                        </Button>
                        <p className={styles.divider}>Already have an account?</p>
                        <Button type="button" variant="outline" onClick={() => navigate("/login")}> Sign In</Button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterUser;