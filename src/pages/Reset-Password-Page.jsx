import { useState } from "react";
import { changePassword, resendResetPasswordOTP } from "../services/auth-service";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/shared/button/Button";
import styles from "../components/shared/AuthForm.module.css"
import backgroundImage from '../assets/images/background_image.png'

function ResetPasswordPage () {
    const navigate = useNavigate();
    const location = useLocation();

    const [otp, setOtp] = useState("");
    const emailFromState = location.state?.email || "";
    const [email, setEmail] = useState(emailFromState);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        setLoading(true)

        if(!email){
            setError("Email cannot be empty")
            return
        }

        if(!otp || !password || !confirmPassword){
            setError("All field required")
            return
        }

        if(password !== confirmPassword){
            setError("Password and confrim password not matching")
        }

        try {
            
            const data = await changePassword({otp, email, password, confirmPassword})
            alert("Password successfully changed");

            navigate("/login")

        } catch (err) {
            console.log("VERIFY ERROR:", err.response?.data || err.message);

            if (err.response) {
                setError(err.response.data.error || err.response.data.message);
            } else {
                setError("Network error");
            }
        }finally{
            setLoading(false)
        }
    }

    const handleResendPasswordOTP = async (e) => {
        e.preventDefault();

        setError("");

        if(!email){
            setError("Email cannot be empty")
            return
        }

        setLoading(true);
        try {

            const data = await resendResetPasswordOTP({email})

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

    return(
        <div className={styles.page}>
            <img src={backgroundImage} className={styles["background-image"]} alt="" />
            <div className={styles.overlay}>
                <div className={styles.card}>
                    <h2 className={styles.title}>Reset your password</h2>
                    <p className={styles.subtitle}>to complete this action please type the otp code and create your new password</p>
                    <form className={styles.form} onSubmit={handleChangePassword}>
                        <div className={styles.field}>
                            <label className={styles.label}>Email</label>
                            <input 
                                className={styles.input}
                                type="text"
                                placeholder="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
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
                                    onChange = {(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className={styles["toggle-password"]}
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
                        <div className={styles.field}>
                            <label className={styles.label}>Password</label>
                            <div className={styles["input-wrapper"]}>
                                <input
                                    className={styles.input}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="confirm password"
                                    value={confirmPassword}
                                    onChange = {(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    className={styles["toggle-password"]}
                                    type="button"
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                        style={{
                                        right: "5px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer"
                                    }}
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                        {error && <p className={styles.errorText}>{error}</p>}
                        <div className={styles.actions}>
                            <Button variant="primary" type="submit" full disabled={loading}>
                                {loading ? "Loading..." : "Change Password"}
                            </Button>
                            <p className={styles.divider}> Didnt recive</p>
                            <Button variant="outline" full onClick={handleResendPasswordOTP}>
                                Resend OTP
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default ResetPasswordPage