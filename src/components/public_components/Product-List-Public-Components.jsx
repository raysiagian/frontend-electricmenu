import { useEffect, useState } from "react";
import { getProductByShopPublic } from "../../services/product-service";
import ProductCardPublicComponent from "./Product-Card-Public-Components";

function ProductListPublicComponent({shop_slug, cart, onAdd, onIncrease, onDecrease}) {

    const [products, setProduct] = useState([])
    const [error, setError] = useState("");

    useEffect(() => {

        if (!shop_slug) return

        const fetchProduct = async () => {
            try {
                const data = await getProductByShopPublic(shop_slug)
                setProduct(data.products)
            } catch (err) {
                if (err.response) {
                    setError(err.response.data.error || "Gagal mengambil data");
                } else {
                    setError("Network Error");
                }
            }
        }
        fetchProduct()
    }, [shop_slug]);

    return (
        <div>
            {error && <p>{error}</p>}
            {products.map((product) => {
                const cartItem = cart.find((item) => item.id === product.id);
                return (
                    <ProductCardPublicComponent
                        key={product.id}
                        product={product}
                        cartItem={cartItem} // ← null kalau belum di cart
                        onAdd={onAdd}
                        onIncrease={onIncrease}
                        onDecrease={onDecrease}
                    />
                );
            })}
        </div>
    )

}

export default ProductListPublicComponent