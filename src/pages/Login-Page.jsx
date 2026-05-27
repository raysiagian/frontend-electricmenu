import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/auth-service";
import { Button } from "../components/shared/button/Button";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../components/shared/Form.module.css"
import backgroundImage from '../assets/images/background_image.png'

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (loading) return;
    
    setError("");

    if(!email || !password){
        setError("Email dan Password wajib diisi")
        return
    }

    setLoading(true);

    try {
        const data = await login({ email, password });

        // localStorage.setItem("token", data.token);

        // handle role
        const role = data.user.role_id
        if (role === 1) {
            navigate("/dashboard-admin");
        } else if (role === 2) {
            navigate("/dashboard-user");
        } else {
            navigate("/unauthorized");
        }

        } catch (err) {
            console.log("ERROR:", err.response?.data || err.message);

            if(err.response){
                const res = err.response.data;
                
                if(res.emailVerified === false){
                    navigate("/verify-email", {
                        state: {email}
                    });
                    return;
                }

                if (res.error) {
                    setError(res.error);
                } else if (res.message) {
                    setError(res.message);
                } else {
                    setError("Login gagal");
                }
            }else{
                setError("Network error")
            }
        }finally{
            setLoading(false)
        }
    };

    return (
        <div className={styles.page}>
            <img src={backgroundImage} className={styles["background-image"]} alt="" />
            <div className={styles.overlay}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Sign In</h2>
                    <p className={styles.subtitle}>Log in into your account</p>

                    {location.state?.message && (
                        <p style={{ color: "green" }}>
                            {location.state.message}
                        </p>
                    )}

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.field}>
                            <label className={styles.label}>Email</label>
                            <input
                                className={styles.input}
                                type="email"
                                placeholder="email"
                                value={email}
                                onChange={(e) => {
                                // console.log("EMAIL INPUT:", e.target.value);
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
                            <a href="/forgot-password" className={styles["forgot-password"]}>
                                Forgot Password?
                            </a>

                            {error && <p className={styles.errorText}>{error}</p>}

                            <div className={styles.actions}>
                                <Button variant="primary" type="submit" full disabled={loading}>
                                {loading ? "Loading..." : "Sign In"}
                                </Button>
                                <p className={styles.divider}>Didnt have an account?</p>
                                <Button type="button" variant="outline" full onClick={() => navigate("/register-user")}>
                                Sign Up
                                </Button>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    );
}

export default Login;