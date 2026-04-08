import { useState } from "react";
import { registerUser } from "../../services/auth-service";
import { useNavigate } from "react-router-dom";

function RegisterUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const data = await registerUser({ name, email, password });

        console.log("RESPONSE:", data);

        alert("Registrasi berhasil");
        } catch (err) {
        console.log("ERROR:", err.response?.data || err.message);
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
                    console.log("EMAIL INPUT:", e.target.value);
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
                    console.log("PASSWORD INPUT:", e.target.value);
                    setPassword(e.target.value);
                    }}
                />
                </div>

                <button type="submit">Sign Up</button>
            </form>
            <button onClick={() => navigate("/login")}>Sign In</button>
        </div>
    );
}

export default RegisterUser;