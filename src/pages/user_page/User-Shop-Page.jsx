import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShop } from "../../services/shop-service";
import ProductListComponent from "../../components/user_components/Product-List-Components";

function UserShopPage() {
    const { id } = useParams();
    const [shop, setShop] = useState(null);
    const [search, setSearch] = useState("");

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
            <div>
                <p>{shop?.shop_name}</p>
                <img src={shop?.qr_url} alt="QR Code" />
                <button onClick={handleDownloadQR}>Download QR</button>
                <button onClick={handleCopy}>Copy Link</button>
                <button onClick={() => navigate(`/shop/${id}/create-product`)}>Add Product</button>
            </div>
            
            {/* searchbar */}
            <div>
                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div>
                <ProductListComponent shop_id={Number(id)} search={search}  />
            </div>
        </div>
    );
}

export default UserShopPage;