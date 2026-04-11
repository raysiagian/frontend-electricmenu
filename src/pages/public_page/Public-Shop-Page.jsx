import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicShop } from "../../services/shop-service";
import ProductListPublicComponent from "../../components/public_components/Product-List-Public-Components";
import OrderModalComponent from "../../components/public_components/Order-Modal-Component";


function PublicShopPage() {
    const { shop_slug } = useParams();
    const [shop, setShop] = useState(null);
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        console.log(`${shop_slug}`)
        const fetchShop = async () => {
            const data = await getPublicShop(shop_slug);
            setShop(data.shop);
        }
        fetchShop();
    }, [shop_slug]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                // kalau sudah ada, tambah quantity
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            // kalau belum ada, tambah baru dengan quantity 1
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const increaseQty = (product_id) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === product_id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decreaseQty = (product_id) => {
        setCart((prev) => {
            return prev
                .map((item) =>
                    item.id === product_id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0); // ← hapus kalau quantity 0
        });
    };

    if (!shop) return <p>Loading...</p>;

    return (
        <div>
            <h1>{shop.shop_name}</h1>

            <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div>
                <ProductListPublicComponent 
                    shop_slug={shop_slug}
                    cart={cart}
                    onAdd={addToCart}
                    onIncrease={increaseQty}
                    onDecrease={decreaseQty}
                    search={search}
                />
            </div>
            {cart.length > 0 && (
                <OrderModalComponent
                    cart={cart}
                    shop_slug={shop_slug}
                />
            )}
        </div>
    );
}

export default PublicShopPage;