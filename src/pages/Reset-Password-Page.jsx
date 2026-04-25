import { useState } from "react";
import { changePassword, resendResetPasswordOTP } from "../services/auth-service";
import { useNavigate, useLocation } from "react-router-dom";

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
        <div>
            <h1>Reset your password</h1>
            <p>to complete this action please type the otp code and create your new password</p>
            <form onSubmit={handleChangePassword}>
                <input 
                    type="text"
                    placeholder="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <div>
                    <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="password"
                        value={password}
                        onChange = {(e) => setPassword(e.target.value)}
                    />
                    <button
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
                <div>
                    <input 
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="confirm password"
                        value={confirmPassword}
                        onChange = {(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
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
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Change Password"}
                </button>
            </form>
            <p>Didnt recive</p>
            <button onClick={handleResendPasswordOTP}>
                Resend OTP
            </button>
        </div>
    )

}

export default ResetPasswordPage