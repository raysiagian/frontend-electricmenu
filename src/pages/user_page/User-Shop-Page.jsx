import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShop } from "../../services/shop-service";
import ProductListComponent from "../../components/user_components/Product-List-Components";
import SearchBarComponent from "../../components/shared/Search-Bar-Component";
import OrderListComponent from "../../components/user_components/Order-List-Component";

function UserShopPage() {
    const { id } = useParams();
    const [shop, setShop] = useState(null);
    const [activeTab, setActiveTab] = useState("products");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const navigate = useNavigate();

    console.log(shop);

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
        <div>
            {/* Info Shop */}
            <div>
                <div>
                    <img src={shop?.qr_url} alt="QR Code" />
                </div>
                <p>{shop?.shop_name}</p>
                <button onClick={handleDownloadQR}>Download QR</button>
                <button onClick={handleCopy}>Copy Link</button>
                <button onClick={() => navigate(`/dashboard-user/shop/${id}/create-product`)}>Add Product</button>
            </div>

             {/* Tab */}
            <div>
                <button
                    onClick={() => setActiveTab("products")}
                    style={{ fontWeight: activeTab === "products" ? "bold" : "normal" }}
                >
                    Products
                </button>
                <button
                    onClick={() => setActiveTab("orders")}
                    style={{ fontWeight: activeTab === "orders" ? "bold" : "normal" }}
                >
                    Orders
                </button>
            </div>
            
             {/* Konten Tab */}
            {activeTab === "products" && (
                <div>
                    {/* Search hanya di tab product */}
                    <SearchBarComponent
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari produk..."
                    />
                    <ProductListComponent shop_id={Number(id)} search={search} />
                </div>
            )}

            {activeTab === "orders" && (
                <div>
                    {/* Filter status hanya di tab order */}
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Semua</option>
                        <option value="pending">Pending</option>
                        <option value="done">Done</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <OrderListComponent shop_id={Number(id)} status={status} />
                </div>
            )}
        </div>
    );
}


export default UserShopPage;