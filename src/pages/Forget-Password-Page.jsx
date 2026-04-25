import { useState } from "react";
import {  useNavigate, useLocation } from "react-router-dom";
import { resetPasswordOTP } from "../services/auth-service";

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
        <div>
            <h1>Forgot your password</h1>
            <p>Please type your email to verify the action</p>
            <form onSubmit={handleSendResetPasswordOTP}>
                <input 
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Send OTP"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    )
}

export default ForgetPasswordPage