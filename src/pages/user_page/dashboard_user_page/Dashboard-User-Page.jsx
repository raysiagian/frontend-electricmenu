import { useEffect, useState } from "react";
import ShopListComponent from "../../../components/user_components/Shop-List-Component";
import { createShop} from "../../../services/shop-service";
import { useNavigate, useLocation  } from "react-router-dom";
import { Button } from "../../../components/shared/button/Button";
import SearchBarComponent from "../../../components/shared/searchbar/Search-Bar-Component";
import DashboardOrderCardList from "../../../components/user_components/dashboard_order_card_list/Dashboard-Order-Card-List-Component";
import styles from './DashboardUserPage.module.css';
import PopUpModal from "../../../components/shared/popup/Pop-Up-Modal";
import formStyle from "../../../components/shared/Form.module.css"
import Dropdown from "../../../components/shared/dropdown/Dropdown";
import { editName, getProfile } from "../../../services/user-service";
import { logout } from "../../../services/auth-service";
import ChangePasswordFormModal from "../../../components/user_components/change_passowrd_modal/Change-Password-Form-Modal";

function DashboardUser(){
    

    const [user, setUser] = useState(null)
    const [search, setSearch] = useState("");

    // create shop open modal
    const [openCreateShopModal, setOpenCreateShopModal] = useState(false);

    // delete shop open model
    const [selectedShop, setSelectedShop] = useState(null);

    const [shopName, setShopName] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [name, setName]= useState("")
    const [openEditProfileModal, setOpenEditProfileModal]= useState(false)

    // change password
    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const [successMessage, setSuccessMessage] = useState("");


    const profileSettings = [
        {
            label: "Edit Profile",
            onClick: () => handleOpenEditProfileModal()
        },
        {
            label: "Change Password",
            onClick: () => setOpenChangePasswordModal(true)
        },
        {
            label: "Logout",
            danger: true,
            onClick: () => handleLogout( )
        },
    ];

    // message success delete shop 
    // first time alert message
    useEffect(() => {
        if (location.state?.successMessage) {
            setSuccessMessage(location.state.successMessage);

            // bersihkan state dari URL
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, []);

    // alert message timer
    useEffect(() => {
        if (!successMessage) return;

        const timer = setTimeout(() => {
            setSuccessMessage("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMessage]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                
                const data = await getProfile();
                setUser(data.user);
                console.log("RESPONSE:", data);
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

    const handleOpenEditProfileModal = () => {
        setName("")
        setError("")
        setOpenEditProfileModal(true)
    }

    const handleCloseEditProfileModal = () => {
        setOpenEditProfileModal(false)
    }

    const handleSubmitEditProfile = async (e) => {
        e.preventDefault();

        if(!name.trim()){
            setError("Name cannot be empty")
            return;
        }

        setLoading(true)

        try {
            const data = await editName({
                name: name
            })

            console.log("RESPONSE:", data);

            setUser((prev) => ({
                ...prev,
                ...data.user
            }));

            handleCloseEditProfileModal()

        } catch (err) {
            console.error(err);

            if (err.response?.status === 429) {
                setError("You can  only change your name once a week.");
            } else {
                setError(
                    err.response?.data?.error ||
                    err.response?.data?.message ||
                    "Something went wrong"
                );
            }
        }finally{
            setLoading(false);
        }
    }

    const handleLogout = async () => {
        setError("");

        try {
            await logout();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Failed to logout"
            );
        }
    };


    return (
        <div className={styles.page}>

            {/* Success alert when delete shop*/}
            {successMessage && (
                <p className={styles.successText}>
                    {successMessage}
                </p>
            )}

            {/* HEADER */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles["header-text"]}>
                        Hi, {user?.name || "Guest"}
                    </h1>
                    <p className="body-md">
                        Start your shop journey
                    </p>
                </div>

                <Dropdown label="Settings" items={profileSettings}/>
            </div>

            {/* CONTENT */}
            <div className={styles["container-wrapper"]}>

                {/* LEFT */}
                <div className={styles["left-container"]}>
                    <div className={styles["left-container-header"]}>
                        <h3 className="heading-md">Your Shop List</h3>
                        <Button variant="primary" onClick={handleOpenModal}>
                            Create Shop
                        </Button>
                    </div>

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
                            <Button variant="ghost" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </PopUpModal>
            )}

            {/* edit profile modal */}
            {openEditProfileModal && (
                <PopUpModal title="Edit Profile" onClose={handleCloseEditProfileModal}>
                    <form className={formStyle.form} onSubmit={handleSubmitEditProfile}>
                        <div className={formStyle.field}>
                            <label className={formStyle.label}>Name</label>
                            <input
                                className={formStyle.input}
                                type="text"
                                placeholder="Your new name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        {error && <p className={formStyle["error-text"]}>{error}</p>}
                        <div className={formStyle.actions}>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ?  "Loading..." : "Edit Name"}
                            </Button>
                            <Button variant="ghost" onClick={handleCloseEditProfileModal}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </PopUpModal>
            )}

            {/* change password */}
            {openChangePasswordModal && (
                <ChangePasswordFormModal onClose={() => setOpenChangePasswordModal(false)} />
            )}

        </div>
    );
}

export default DashboardUser;