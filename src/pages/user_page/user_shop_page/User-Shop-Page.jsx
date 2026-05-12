import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShop } from "../../../services/shop-service";
import ProductListComponent from "../../../components/user_components/Product-List-Components";
import SearchBarComponent from "../../../components/shared/searchbar/Search-Bar-Component";
import OrderListComponent from "../../../components/user_components/Order-List-Component";
import styles from './UserShopPage.module.css';
import { Button } from "../../../components/shared/button/Button";
import Dropdown from "../../../components/shared/dropdown/Dropdown";
import Tab from "../../../components/shared/tab/Tab";
import WalkInOrderModal from "../../../components/user_components/walk_in_order_modal/Walk-In-Order-Modal";

function UserShopPage() {
    const { id } = useParams();
    const [shop, setShop] = useState(null);
    const [activeTab, setActiveTab] = useState("products");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [openWalkInModal, setOpenWalkInModal] = useState(false);

    const navigate = useNavigate();

    // console.log(shop);

    const manageItems = [
        {
            label: "Edit Shop",
            onClick: () => console.log("delete shop")
        },
        {
            label: "Delete Shop",
            danger: true,
            onClick: () => console.log("delete shop")
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

    return (
        <div className={styles.page}>
            {/* Info Shop */}
            <div className={styles.header}>
                <div>
                    <img className={styles["qr-image"]} src={shop?.qr_url} alt="QR Code" />
                </div>
                <div>
                    <p className={styles["shop-name"]}>{shop?.shop_name}</p>
                    <div className={styles["shop-widget"]}>
                        <Button variant="primary" onClick={() => setOpenWalkInModal(true)}>
                            New Order
                        </Button>
                        <Button variant="outline"onClick={handleDownloadQR}>Download QR</Button>
                        <Button variant="outline"onClick={handleCopy}>Copy Link</Button>
                        {/* dropdown untuk edit dan delete shop */}
                        <Dropdown label="Manage Shop" items={manageItems} />
                    </div>
                </div>
            </div>

             {/* Tab */}
            <div>
                <Tab
                    tabs={SHOP_TABS}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />
            </div>

            {/*open create walk in order modal*/}
            {openWalkInModal && (
                <WalkInOrderModal
                    shop_id={Number(id)}
                    onClose={() => setOpenWalkInModal(false)}
                    onSuccess={() => navigate(0)}  // refresh halaman
                />
            )}
                    
             {/* Konten Tab */}
            {activeTab === "products" && (
                <div className={styles["tab-content"]}>
                    <div className={styles["tab-title"]}>
                        <h2>Product List</h2>
                        <Button variant="primary" onClick={() => navigate(`/dashboard-user/shop/${id}/create-product`)}>Add Product</Button>
                    </div>
                    {/* Search hanya di tab product */}
                    <SearchBarComponent
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search product"
                    />
                    <ProductListComponent shop_id={Number(id)} search={search} />
                </div>
            )}

            {activeTab === "orders" && (
                <div className={styles["tab-content"]}>
                    <div className={styles["tab-title"]}>
                        <h2>Order List</h2>
                        {/* Filter status hanya di tab order */}
                        <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="done">Done</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <OrderListComponent shop_id={Number(id)} status={status} />
                </div>
            )}
        </div>
    );
}


export default UserShopPage;