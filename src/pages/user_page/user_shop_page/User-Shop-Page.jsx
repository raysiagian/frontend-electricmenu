import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShop, editShopUser, deleteShopUser } from "../../../services/shop-service";
import ProductListComponent from "../../../components/user_components/Product-List-Components";
import SearchBarComponent from "../../../components/shared/searchbar/Search-Bar-Component";
import OrderListComponent from "../../../components/user_components/Order-List-Component";
import styles from './UserShopPage.module.css';
import { Button } from "../../../components/shared/button/Button";
import Dropdown from "../../../components/shared/dropdown/Dropdown";
import Tab from "../../../components/shared/tab/Tab";
import PopUpModal from "../../../components/shared/popup/Pop-Up-Modal";
import WalkInOrderModal from "../../../components/user_components/walk_in_order_modal/Walk-In-Order-Modal";
import formStyle from "../../../components/shared/Form.module.css"
import { Download, Copy, Plus, Settings } from "lucide-react";

function UserShopPage() {
    const { id } = useParams();
    const [shop, setShop] = useState(null);
    const [activeTab, setActiveTab] = useState("products");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [openWalkInModal, setOpenWalkInModal] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [shopName, setShopName] = useState("")
    const [openEditShopModal, setOpenEditShopModal] = useState(false)

    const [confirmShopName, setConfirmShopName] = useState("")
    const [openDeleteShopModal, setOpenDeleteShopModal] = useState(false);

    const navigate = useNavigate();
    

    // console.log(shop);

    const manageItems = [
        {
            label: "Edit Shop",
            onClick: () => handleOpenEditShopModal()
        },
        {
            label: "Delete Shop",
            danger: true,
            onClick: () => handleOpenDeleteShopModal()
        },
    ];

    const SHOP_TABS = [
        { label: "Products", value: "products" },
        { label: "Orders",   value: "orders"   },
    ];

    const handleCopy = () => {
        if (shop?.shop_url) {
            navigator.clipboard.writeText(shop.shop_url);
        }
    };

    const handleDownloadQR = async () => {
        if (!shop?.qr_url) return;

        try {
            // Fetch file sebagai blob dulu
            const response = await fetch(shop.qr_url);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = "qr-shop.png";
            link.click();

            // Cleanup
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error("Gagal download QR:", err);
        }
    };

    useEffect(() => {
        const fetchShop = async () => {
            const data = await getShop(id);
            setShop(data.shop);
        };

        fetchShop();
    }, [id]);

    const handleOpenEditShopModal = () => {
        setShopName("");
        setError("")
        setOpenEditShopModal(true)
    }

    const handleCloseEditShopModal = () => {
        setOpenEditShopModal(false)
    }
    
    const handleSubmitEditShop = async (e) => {
        e.preventDefault();

        if(!shopName.trim()){
            setError("Shop name cannot be empty")
            return;
        }   

        setLoading(true);

        try {
            const data = await editShopUser({
                id,
                shop_name: shopName
            })

            setShop((prev) => ({
                ...prev,
                ...data.shop
            }));


            handleCloseEditShopModal();
        }catch (err) {

            console.error(err);

            if (err.response?.status === 429) {
                setError("Too many attempts. Please wait a moment and try again.");
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

        if (
            confirmShopName.trim().toLowerCase() !==
            shop.shop_name.trim().toLowerCase()
        ) {
            setError("Name doesnt match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await deleteShopUser({
                id,
                confirm_shop_name: confirmShopName
            });
            handleCloseDeleteShopModal();

            navigate("/dashboard-user", {
                state: {
                    successMessage: "Shop deleted successfully"
                }
            });

        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete shop");
        }finally{
            setLoading(false);
        }
    }


    return (
        <div className={styles.page}>
            {/* Info Shop */}
            <div className={styles.header}>
            <img className={styles["qr-image"]} src={shop?.qr_url} alt="QR Code" />

            <div className={styles["header-info"]}>
                <p className={styles["shop-name"]}>{shop?.shop_name}</p>

                <div className={styles["shop-widget"]}>
                    <div className={styles["widget-btn"]}>
                        <Button variant="primary" onClick={() => setOpenWalkInModal(true)}>
                            <Plus size={18} />
                            <span className={styles["btn-text"]}>
                                New Order
                            </span>
                        </Button>
                    </div>
                    <div className={styles["widget-btn"]}>
                        <Button variant="outline" onClick={handleDownloadQR}>
                            <Download size={18} />
                            <span className={styles["btn-text"]}>
                                Download QR
                            </span>
                        </Button>
                    </div>
                    <div className={styles["widget-btn"]}>
                        <Button variant="outline" onClick={handleCopy}>
                            <Copy size={18} />
                            <span className={styles["btn-text"]}>
                                Copy Link
                            </span>
                        </Button>
                    </div>
                    <div className={styles["widget-btn"]}>
                        <Dropdown label={
                            <div className={styles["manage-label"]}>
                                <Settings size={18} />
                                <span className={styles["btn-text"]}>
                                    Manage Shop
                                </span>
                            </div>
                            }
                            items={manageItems} 
                        />
                    </div>
                </div>
            </div>
        </div>

             {/* Tab */}
            <Tab tabs={SHOP_TABS} activeTab={activeTab} onChange={setActiveTab} />

            {/*open create walk in order modal*/}
            {openWalkInModal && (
                <WalkInOrderModal
                    shop_id={Number(id)}
                    onClose={() => setOpenWalkInModal(false)}
                    onSuccess={() => navigate(0)}  // refresh halaman
                />
            )}
                    
            {/* Tab Content — Products */}
            {activeTab === "products" && (
                <div className={styles["tab-content"]}>
                    <div className={styles["tab-title"]}>
                        <h2>Product List</h2>
                        <div className={styles["tab-title-btn"]}>
                            <Button
                                variant="primary"
                                onClick={() => navigate(`/dashboard-user/shop/${id}/create-product`)}
                                full
                            >
                                Add Product
                            </Button>
                        </div>
                    </div>
                    <SearchBarComponent
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search product"
                    />
                    <ProductListComponent shop_id={Number(id)} search={search} />
                </div>
            )}

            {/* Tab Content — Orders */}
            {activeTab === "orders" && (
                <div className={styles["tab-content"]}>
                    <div className={styles["tab-title"]}>
                        <h2>Order List</h2>
                        <select
                            className={styles.select}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="done">Done</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <OrderListComponent shop_id={Number(id)} status={status} />
                </div>
            )}

            {/* edit shop modal */}
            {openEditShopModal && (
                <PopUpModal title="Edit Shop" onClose={handleCloseEditShopModal}>
                    <form className={formStyle.form} onSubmit={handleSubmitEditShop}>
                        <div className={formStyle.field}>
                            <label className={formStyle.label}>Shop Name</label>
                            <input
                                className={formStyle.input}
                                type="text"
                                placeholder="Your new shop name"
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                            />
                        </div>
                        {error && <p className={formStyle["error-text"]}>{error}</p>}
                        <div className={formStyle.actions}>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ?  "Loading..." : "Edit Shop"}
                            </Button>
                            <Button variant="ghost" onClick={handleCloseEditShopModal}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </PopUpModal>
            )}

            
            {/* delete shop modal */}
            {openDeleteShopModal && (
                <PopUpModal title="Delete Shop" onClose={handleCloseDeleteShopModal}>
                    <p>To confirm, type <strong>{shop?.shop_name}</strong> in the form field</p>
                    <form className={formStyle.form} onSubmit={handleDeleteShop}>
                        <div className={formStyle.field}>
                            <label className={formStyle.label}>Confirm Shop Name</label>
                            <input
                                className={formStyle.input}
                                type="text"
                                placeholder="enter your shop name"
                                value={confirmShopName}
                                onChange={(e) => setConfirmShopName(e.target.value)}
                            />
                        </div>
                        {error && <p className={formStyle["error-text"]}>{error}</p>}
                        <div className={formStyle.actions}>
                            <Button variant="danger" type="submit" disabled={loading}>
                                {loading ? "Loading..." : "Delete Shop"}
                            </Button>
                            <Button variant="ghost" onClick={handleCloseDeleteShopModal}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </PopUpModal>
            )}
        </div>
    );
}


export default UserShopPage;