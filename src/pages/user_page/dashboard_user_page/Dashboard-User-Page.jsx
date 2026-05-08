import { useEffect, useState } from "react";
import ShopListComponent from "../../../components/user_components/Shop-List-Component";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../../services/auth-service";
import { Button } from "../../../components/shared/button/Button";
import SearchBarComponent from "../../../components/shared/searchbar/Search-Bar-Component";
import DashboardOrderCardList from "../../../components/user_components/dashboard_order_card_list/Dashboard-Order-Card-List-Component";
import styles from './DashboardUserPage.module.css';

function DashboardUser(){
    const [user, setUser] = useState(null)
    const [search, setSearch] = useState("");

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


    return (
        <div className={styles.page}>

            {/* HEADER */}
            <div className={styles.header}>
                <div>
                    <h1 className="heading-lg">
                        Hi, {user?.name || "Guest"}
                    </h1>
                    <p className="body-md">
                        Start your shop journey
                    </p>
                </div>

                <Button
                    variant="primary"
                    onClick={() => navigate("/dashboard-user/shop/create-shop")}
                >
                    Create Shop
                </Button>
            </div>

            {/* CONTENT */}
            <div className={styles["container-wrapper"]}>

                {/* LEFT */}
                <div className={styles["left-container"]}>
                    <h3 className="heading-md">Your Shop List</h3>

                    <SearchBarComponent
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search shop"
                    />

                    <ShopListComponent search={search} />
                </div>

                {/* RIGHT */}
                <div className={styles["right-container"]}>
                    <h3 className="heading-md">Pending Orders</h3>
                    <DashboardOrderCardList />
                </div>

            </div>

        </div>
    );
}

export default DashboardUser;