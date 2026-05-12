import { useEffect, useState } from "react";
import ShopListComponent from "../../../components/user_components/Shop-List-Component";
import { createShop, deleteShopUser } from "../../../services/shop-service";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../../services/auth-service";
import { Button } from "../../../components/shared/button/Button";
import SearchBarComponent from "../../../components/shared/searchbar/Search-Bar-Component";
import DashboardOrderCardList from "../../../components/user_components/dashboard_order_card_list/Dashboard-Order-Card-List-Component";
import styles from './DashboardUserPage.module.css';
import PopUpModal from "../../../components/shared/popup/Pop-Up-Modal";
import formStyle from "../../../components/shared/AuthForm.module.css"

function DashboardUser(){
    const [user, setUser] = useState(null)
    const [search, setSearch] = useState("");

    // create shop open modal
    const [openCreateShopModal, setOpenCreateShopModal] = useState(false);

    // delete shop open model
    const [selectedShop, setSelectedShop] = useState(null);
    const [openDeleteShopModal, setOpenDeleteShopModal] = useState(false);

    const [shopName, setShopName] = useState("")
    const [confirmShopName, setConfirmShopName] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


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

    const handleOpenModal = () => {
        setShopName("");
        setError("");
        setOpenCreateShopModal(true);
    };

    const handleCloseModal = () => {
        setOpenCreateShopModal(false);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!shopName.trim()){
            setError("Shop name cannot be empty")
            return;
        }   

        setLoading(true);

        try{
            const data = await createShop({ shop_name: shopName });
            handleCloseModal();
            
            navigate(0);
        }catch(err){
            setError(err.response?.data?.error || "Gagal membuat toko");
        }finally{
            setLoading(false);
        }
    }

    const handleOpenDeleteShopModal = () => {
        setConfirmShopName("")
        setError("");
        setOpenDeleteShopModal(true)
    }

    const handleCloseDeleteShopModal = () => {
        setOpenDeleteShopModal(false)
    }

    const handleDeleteShop = async (e) => {
        e.preventDefault();

        if(!confirmShopName.trim()){
            setError("Shop name cannot be empty")
            return;
        }

        if (!selectedShop) {
            setError("No shop selected");
            return;
        }

        if(
            confirmShopName.trim().toLowerCase() !== selectedShop.shop_name.trim().toLowerCase()
        ) {
            setError("Name doesnt match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await deleteShopUser({
                id: selectedShop.id,
                confirm_shop_name: confirmShopName
            });
            handleCloseDeleteShopModal();
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete shop");
        }finally{
            setLoading(false);
        }
    }


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

                {/* <Button
                    variant="primary"
                    onClick={() => navigate("/dashboard-user/shop/create-shop")}
                >
                    Create Shop
                </Button> */}

                <Button variant="primary" onClick={handleOpenModal}>
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

              {/* MODAL */}
            {openCreateShopModal && (
                <PopUpModal title="Create Shop" onClose={handleCloseModal}>
                    <form className={formStyle.form} onSubmit={handleSubmit}>
                        <div className={formStyle.field}>
                            <label className={formStyle.label}>Shop Name</label>
                            <input
                                className={formStyle.input}
                                type="text"
                                placeholder="Your shop name"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                            />
                        </div>

                        {error && <p className={formStyle["error-text"]}>{error}</p>}

                        <div className={formStyle.actions}>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? "Loading..." : "Create Shop"}
                            </Button>
                            <Button variant="outline" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </PopUpModal>
            )}


        </div>
    );
}

export default DashboardUser;