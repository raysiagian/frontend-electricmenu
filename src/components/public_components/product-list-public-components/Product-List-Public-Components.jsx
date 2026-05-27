import { useEffect, useState } from "react";
import { getProductByShopPublic, searchProductsinShopPublic } from "../../../services/product-service";
import ProductCardPublicComponent from "../product-card-public-components/Product-Card-Public-Components";
import styles from "./ProductListPublicComponent.module.css"
import paginationStyle from "../../shared/pagination/Pagination.module.css"

function ProductListPublicComponent({shop_slug, cart, onAdd, onIncrease, onDecrease, search}) {

    const [products, setProducts] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);                
    const [pagination, setPagination] = useState(null); 

    
    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        if (!shop_slug) return;

        const delay = setTimeout(async () => {
            setLoading(true);
            setError("");

            try {
                let data;

                if (search.trim() === "") {
                    data = await getProductByShopPublic(shop_slug, page);
                } else {
                    data = await searchProductsinShopPublic({ shop_slug, search, page });
                }

                setProducts(data.products || []);
                setPagination(data.pagination || null)
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
    }, [shop_slug, search, page]);

    return (
        <div className={styles.wrapper}>
            
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <div className={styles.grid}>
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

            {/* ← Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className={paginationStyle.pagination}>
                    <button
                        className={paginationStyle["page-btn"]}
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 1 || loading}
                    >
                        Prev
                    </button>

                    <span className={paginationStyle["page-info"]}>{page}</span>
                    
                    <button
                        className={paginationStyle["page-btn"]}
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= pagination.totalPages || loading}
                    >
                        Next
                    </button>
                </div>
            )}

        </div>
    )

}

export default ProductListPublicComponent