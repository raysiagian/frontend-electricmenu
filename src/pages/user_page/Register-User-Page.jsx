import { useState } from "react";
import { registerUser } from "../../services/auth-service";
import { useNavigate } from "react-router-dom";

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

            alert(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Terjadi kesalahan"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>

            
            <form onSubmit={handleSubmit}>
                <div>
                    <input 
                        type="text" 
                        placeholder="name"
                        value={name}
                        onChange={(e) => {
                            console.log("Name INPUT:", e.target.value);
                            setName(e.target.value);
                        }} 
                    />
                </div>

                <div>
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => {
                    setEmail(e.target.value);
                    }}
                />
                </div>

                <div>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={password}
                    onChange={(e) => {
                    setPassword(e.target.value);
                    }}
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

                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Sign Up"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={() => navigate("/login")}>Sign In</button>
        </div>
    );
}

export default RegisterUser;