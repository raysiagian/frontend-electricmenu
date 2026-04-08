import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP, resendOTP } from "../services/auth-service";

function VerifyEmail() {
    const location = useLocation();
    const navigate = useNavigate();

    const emailFromState = location.state?.email || "";

    const [email, setEmail] = useState(emailFromState);
    const [otpCode, setOtpCode] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    const handleVerify = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email || !otp) {
        setError("Email dan OTP wajib diisi");
        return;
    }

    setLoading(true)

        try {
            const data = await verifyOTP({ email, otp });

            console.log("VERIFY SUCCESS:", data);

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            alert("Email berhasil diverifikasi");

            // redirect setelah verify
            navigate("/login");

        } catch (err) {
            console.log("VERIFY ERROR:", err.response?.data || err.message);

            if (err.response) {
                setError(err.response.data.error || err.response.data.message);
            } else {
                setError("Network error");
            }
        }finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError("");
        setMessage("");

        if (!email) {
        setError("Email wajib diisi");
        return;
        }

        try {
        const data = await resendOTP({ email });

        console.log("RESEND:", data);

        setMessage("OTP berhasil dikirim ulang");

        } catch (err) {
        console.log("RESEND ERROR:", err.response?.data || err.message);

        if (err.response) {
            setError(err.response.data.error || err.response.data.message);
        } else {
            setError("Network error");
        }
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleVerify}>
                <div>
                    <input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                <div>
                    <input 
                        type="text" 
                        placeholder="Otp Code"
                        value={otpCode}
                        onChange={(e) => {
                            console.log("OTP INPUT:", e.target.value);
                            setOtpCode(e.target.value);
                        }} 
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Verifying..." : "Verify"}
                </button>

            </form>

            <button onClick={handleResend}>
                Resend OTP
            </button>
        </div>
    );
}

export default VerifyEmail;