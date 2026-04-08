import { useEffect, useState } from "react";
import ShopListComponent from "../../components/user_components/Shop-List-Component";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/auth-service";


function DashboardUser(){
    const [user, setUser] = useState(null)


    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getProfile();
                setUser(data.user);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser()
    }, []);


    return(
        <div>
            <div>
                <h1>Hi, {user?.name}</h1>
                <div>
                    <button onClick={() => navigate("/shop/create-shop")}>Create Shop</button>
                </div>
                <ShopListComponent/>
            </div>
        </div>
    )

}

export default DashboardUser;