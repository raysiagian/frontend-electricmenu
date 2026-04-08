import { useNavigate } from "react-router-dom";

function LandingPage(){

    const navigate = useNavigate();

    return(
        
        <div>
            <p>
                Manage shop never been easy than ever
            </p>

            <div>
                <button onClick={() => navigate("/login")}>Sign In</button>
                <button onClick={() => navigate("/register-user")}>Sign Up</button>
            </div>
        </div>

    )

}

export default LandingPage