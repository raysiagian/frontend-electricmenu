import { useEffect, useState } from "react";
import { getUserShopProducts,searchProductByShop } from "../../services/product-service";


import ProductCardComponent from "./Product-Card-Component";

function ProductListComponent({shop_id, search}) {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!shop_id) return;

        const delay = setTimeout(async () => {
            setLoading(true);
            setError("");

            try {
                let data;

                if (search.trim() === "") {
                    data = await getUserShopProducts(shop_id);
                } else {
                    data = await searchProductByShop({ shop_id, search });
                }

                setProducts(data.products || []);
            } catch (err) {
                if (err.response) {
                    setError(err.response.data.error || "Gagal mengambil data");
                } else {
                    setError("Network Error");
                }
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [shop_id, search]);


    return (
        <div>
            <h2>Product List</h2>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            {products.length === 0 && !loading && <p>No product Available</p>}

            {products.map((product) => (
                <ProductCardComponent key={product.id} product={product} shop_id={shop_id} />  // ← tambahkan shop_id
            ))}
        </div>
    );
}

export default ProductListComponent;