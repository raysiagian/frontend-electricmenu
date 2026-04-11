import { useEffect, useState } from "react";
import { getUserShopProducts,searchProductByShop } from "../../services/product-service";
import ProductCardComponent from "./Product-Card-Component";

function ProductListComponent({shop_id, search}) {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);                // ← tambah
    const [pagination, setPagination] = useState(null); // ← tambah

    // Reset page ke 1 kalau search berubah
    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {
        if (!shop_id) return;

        const delay = setTimeout(async () => {
            setLoading(true);
            setError("");

            try {
                let data;

                if (search.trim() === "") {
                    data = await getUserShopProducts(shop_id, page);
                } else {
                    data = await searchProductByShop({ shop_id, search, page });
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
    }, [shop_id, search, page]);


    return (
        <div>
            <h2>Product List</h2>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            {products.length === 0 && !loading && <p>No product Available</p>}

            {products.map((product) => (
                <ProductCardComponent key={product.id} product={product} shop_id={shop_id} />  // ← tambahkan shop_id
            ))}
            
            {/* ← Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div>
                    <button
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 1 || loading}
                    >
                        Prev
                    </button>

                    <span>Page {page} of {pagination.totalPages}</span>

                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= pagination.totalPages || loading}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
        
    );
}

export default ProductListComponent;