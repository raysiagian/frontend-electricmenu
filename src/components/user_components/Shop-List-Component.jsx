import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserShops, searchShopUser } from "../../services/shop-service";
import tableStyles from "../shared/Table.module.css";
import paginationStyle from "../shared/pagination/Pagination.module.css"

function ShopListComponent({search}){
    const [shops, setShops] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    // reset page kalau search berubah
    useEffect(() => {
        setPage(1);
    }, [search]);

    useEffect(() => {

        const delay = setTimeout(async () => {
            setLoading(true);
            setError("")

            try {
                let data;

                if(!search || search.trim() === ""){
                    data = await getUserShops(page)
                }else{
                    data = await searchShopUser({
                        search,
                        page
                    })
                }

                setShops(data.shops || [])
                setPagination(data.pagination || null)

            } catch (err) {
                console.log("ERROR:", err.response?.data || err.message);
                if (err.response) {
                    setError(err.response.data.error || "Gagal mengambil data");
                } else {
                    setError("Network Error");
                }

            }finally {
                setLoading(false);
            }
        }, 500)
        return () => clearTimeout(delay);
    },[search,page])

    // useEffect(() => {
        
    //     const fetchShops = async () => {
    //         setLoading(true);
    //         setError("");

    //         try {
    //             const data = await getUserShops();
    //             setShops(data.shop || []);

    //         } catch (err) {
    //             console.log(err.response?.data || err.message)

    //             if(err.response){
    //                 setError(err.response.data.error || "gagal mengambil data")
    //             }else{
    //                 setError("Network Error")
    //             }
    //         }finally{
    //             setLoading(false)
    //         }
    //     }
    //     fetchShops();
    // }, []);

    return(
        <div>
            <div>
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}

                {!loading && shops.length === 0 && (
                    <p>No shop available</p>
                )}

                {!loading && shops.length > 0 && (
                    <table className={tableStyles.table}>
                        <thead>
                            <tr>
                                <th className={tableStyles.th}>Shop Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shops.map((shop) =>(
                                <tr key={shop.id}>
                                    <td className={tableStyles.td}> 
                                        <Link className={tableStyles["table-text-link"]} to={`/dashboard-user/shop/${shop.id}`}>
                                            {shop.shop_name}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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

        </div>
    )

}

export default ShopListComponent