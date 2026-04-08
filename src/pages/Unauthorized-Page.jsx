import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Unauthorized(){

    const navigate = useNavigate();
    
    return(
        
        <div>
            <h1>Unauthorized User</h1>
            <button onClick={() => navigate("/login")}>Sign In</button>
            <button onClick={() => navigate("/register-user")}>Sign Up</button>
        </div>

    )

}

export default Unauthorized;