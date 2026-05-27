import { useEffect, useState } from "react";
import { getUserShopProducts, searchProductByShop } from "../../services/product-service";
import { Link } from "react-router-dom";
import tableStyles from "../shared/Table.module.css";
import paginationStyle from "../shared/pagination/Pagination.module.css"

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

                // console.log(data.products)

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
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && products.length === 0 && (
                <p>No product available</p>
            )}

            {!loading && products.length > 0 && (
                <div className={tableStyles["table-wrapper"]}>
                    <table className={tableStyles.table}>
                        <thead>
                            <tr>
                                {/* <th className={tableStyles.th}>ID</th> */}
                                <th className={tableStyles.th}>Product Name</th>
                                <th className={tableStyles.th}>Price</th>
                                <th className={tableStyles.th}>Stock</th>
                                <th className={tableStyles.th}>Service Type</th>
                                <th className={tableStyles.th}>Avaliability</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id}>
                                    {/* <td style={tdStyle}>{product.id ?? "-"}</td> */}
                                    <td className={tableStyles.td}>
                                        <Link className={tableStyles["table-text-link"]} to={`/dashboard-user/shop/${shop_id}/product/${product.id}`}>
                                            {product.product_name}
                                        </Link>
                                    </td>
                                    <td className={tableStyles.td}>
                                        Rp.{Number(product.price).toLocaleString("id-ID")}
                                    </td>
                                    <td className={tableStyles.td}>{product.stock ?? "-"}</td>
                                    <td className={tableStyles.td}>{product.service_type}</td>
                                    <td className={tableStyles.td}>
                                        {Boolean(product.is_available) ? "Available" : "Not Available"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className={paginationStyle.pagination}>
                    <button
                        className={paginationStyle["page-btn"]}
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 1 || loading}
                    >
                        Prev
                    </button>

                    {/* <span style={{ margin: "0 10px" }}>
                        Page {page} of {pagination.totalPages}
                    </span> */}

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
    );
}

export default ProductListComponent;