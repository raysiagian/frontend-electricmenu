import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/auth-service";
import { useNavigate, useLocation } from "react-router-dom";

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

        localStorage.setItem("token", data.token);

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
        <div>
            <h2>Login</h2>

            {location.state?.message && (
                <p style={{ color: "green" }}>
                    {location.state.message}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => {
                    // console.log("EMAIL INPUT:", e.target.value);
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
                        // console.log("PASSWORD INPUT:", e.target.value);
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
                    {loading ? "Loading..." : "Sign In"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <button onClick={() => navigate("/register-user")}>Sign Up</button>
            <Link to={`/forgot-password`}>
                Forgot Password
            </Link>
        </div>
    );
}

export default Login;