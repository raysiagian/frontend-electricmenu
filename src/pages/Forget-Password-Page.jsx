import { useState } from "react";
import {  useNavigate, useLocation } from "react-router-dom";
import { resetPasswordOTP } from "../services/auth-service";
import { Button } from "../components/shared/button/Button";
import styles from "../components/shared/AuthForm.module.css"
import backgroundImage from '../assets/images/background_image.png'

function ForgetPasswordPage () {
    

    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSendResetPasswordOTP = async (e) => {
        e.preventDefault();

        setError("");

        if(!email){
            setError("Email cannot be empty")
            return
        }

        setLoading(true);

        try {
            const data = await resetPasswordOTP({email})
            navigate("/reset-password", {
                state: {email}
            })
        } catch (err) {
            console.log("RESEND ERROR:", err.response?.data || err.message);

            if (err.response) {
                setError(err.response.data.error || err.response.data.message);
            } else {
                setError("Network error");
            }
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <img src={backgroundImage} className={styles["background-image"]} alt="" />
            <div className={styles.overlay}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Forgot your password</h2>
                    <p className={styles.subtitle}>Please type your email to verify the action</p>
                    <form className={styles.form} onSubmit={handleSendResetPasswordOTP}>
                        <div className={styles.field}>
                            <label className={styles.label}>Email</label>
                            <input
                                className={styles.input}    
                                type="email"
                                placeholder="email"
                                value={email}
                                onChange={(e) => {setEmail(e.target.value)}}
                            />
                        </div>
                        <Button variant="primary" type="submit" full disabled={loading}>
                            {loading ? "Loading..." : "Request OTP"}
                        </Button>
                    </form>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            </div>
        </div>
    )
}

export default ForgetPasswordPage