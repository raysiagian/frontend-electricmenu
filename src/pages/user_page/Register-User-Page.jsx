import { useState } from "react";
import { registerUser } from "../../services/auth-service";
import { useNavigate } from "react-router-dom";

function RegisterUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    
    setError("");

    if(!name || !email || !password){
        setError("Nama, email dan password wajib diisi")
        return
    }

    setLoading(true);

    try {
        const data = await registerUser({ name, email, password });

        console.log("RESPONSE:", data);

        navigate("/login", {
                state: {
                    message: "Registrasi berhasil! Silakan login."
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
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => {
                    setPassword(e.target.value);
                    }}
                />
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