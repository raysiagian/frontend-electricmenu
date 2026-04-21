import { useEffect, useState } from "react";
import { getUserShopProducts, searchProductByShop } from "../../services/product-service";
import { Link } from "react-router-dom";
import styles from "./ProductList.module.css"

function ProductListComponent({ shop_id, search }) {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    // reset page kalau search berubah
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

                if (!search || search.trim() === "") {
                    data = await getUserShopProducts(shop_id, page);
                } else {
                    data = await searchProductByShop({
                        shop_id,
                        search,
                        page
                    });
                }

                setProducts(data.products || []);
                setPagination(data.pagination || null);

                console.log(data.products)

            } catch (err) {
                console.log("ERROR:", err.response?.data || err.message);

                if (err.response) {
                    setError(err.response.data.error || "Gagal mengambil data");
                } else {
                    setError("Network Error");
                }
            } finally {
                setLoading(false);
            }
        }, 500); // debounce

        return () => clearTimeout(delay);
    }, [shop_id, search, page]);
    
    
    return (
        <div>
            <h2>Product List</h2>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && products.length === 0 && (
                <p>No product available</p>
            )}

            {!loading && products.length > 0 && (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {/* <th style={thStyle}>ID</th> */}
                            <th style={thStyle}>Nama Produk</th>
                            <th style={thStyle}>Harga</th>
                            <th style={thStyle}>Stok</th>
                            <th style={thStyle}>Service Type</th>
                            <th style={thStyle}>Ketersediaan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                {/* <td style={tdStyle}>{product.id ?? "-"}</td> */}
                                <td>
                                    <Link className={styles.productName} to={`/dashboard-user/shop/${shop_id}/product/${product.id}`}>
                                        {product.product_name}
                                    </Link>
                                </td>
                                <td style={tdStyle}>
                                    Rp.{Number(product.price).toLocaleString("id-ID")}
                                </td>
                                <td style={tdStyle}>{product.stock ?? "-"}</td>
                                <td style={tdStyle}>{product.service_type}</td>
                                <td style={tdStyle}>
                                    {Boolean(product.is_available) ? "Tersedia" : "Tidak Tersedia"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div style={{ marginTop: "10px" }}>
                    <button
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 1 || loading}
                    >
                        Prev
                    </button>

                    <span style={{ margin: "0 10px" }}>
                        Page {page} of {pagination.totalPages}
                    </span>

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

const thStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#f5f5f5"
};

const tdStyle = {
    border: "1px solid #ccc",
    padding: "8px"
};

export default ProductListComponent;