import { useEffect, useState } from "react";
import { getAllOrderByShopID, updateOrderStatus } from "../../services/order-service";
import tableStyles from "../shared/Table.module.css";
import PopUpModal from "../shared/popup/Pop-Up-Modal";
import paginationStyle from "../shared/pagination/Pagination.module.css"

function OrderListComponent ({shop_id, status}) {
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    useEffect(() => {
        setPage(1)
    }, [status])

    useEffect(() => {
        if(!shop_id) return

        const delay = setTimeout(async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getAllOrderByShopID(shop_id, { page, status });
                setOrders(data.orders || []);
                setPagination(data.pagination || null);
            } catch (err) {
                if (err.response) {
                    setError(err.response.data.error || "Gagal mengambil data");
                } else {
                    setError("Network Error");
                }
            }finally{
                setLoading(false);
            }
        }, 500)
        return () => clearTimeout(delay)
    }, [shop_id, status, page])

    const handleUpdateStatus = async (order_id, status) => {
        try {
            const res = await updateOrderStatus(order_id, status);
            // Update state lokal agar tidak perlu refetch
            setOrders(prev => prev.map(o => 
                o.id === order_id ? { ...o, status: res.order.status } : o
            ));
            setSelectedOrder(prev => ({ ...prev, status: res.order.status }));
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
    };

    return (
        <div>
            
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && orders.length === 0 && (
                <p>No order available</p>
            )}

            {!loading && orders.length > 0 && (
                <div className={tableStyles["table-wrapper"]}> 
                    <table className={tableStyles.table}>
                        <thead>
                            <tr>
                                {/* <th  className={tableStyles.th}>ID</th> */}
                                <th  className={tableStyles.th}>Buyer</th>
                                <th  className={tableStyles.th}>Total</th>
                                <th  className={tableStyles.th}>Order Status</th>
                                <th  className={tableStyles.th}>Order Date</th>
                                <th  className={tableStyles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    {/* <td className={tableStyles.td}>{order.id}</td> */}
                                    <td className={tableStyles.td}>{order.buyer_name}</td>
                                    <td className={tableStyles.td}>
                                        Rp.{Number(order.grand_total).toLocaleString("id-ID")}
                                    </td>
                                    <td className={tableStyles.td}>{order.status}</td>
                                    <td className={tableStyles.td}>
                                        {new Date(order.created_at).toLocaleDateString("id-ID")}
                                    </td>
                                    <td className={tableStyles.td}>
                                        {/* <button onClick={() => alert(JSON.stringify(order.items, null, 2))}>
                                            Lihat Item
                                        </button> */}
                                        <button onClick={() => setSelectedOrder(order)}>
                                            See Detail
                                        </button>
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

            {/* detail order */}
            {selectedOrder && (
                <PopUpModal title = "Detail Order" onClose={() => setSelectedOrder(false)}>
                        <p>Pembeli: {selectedOrder.buyer_name}</p>
                        <p>Status: {selectedOrder.status}</p>
                        <p>Tanggal: {new Date(selectedOrder.created_at).toLocaleDateString("id-ID")}</p>

                        {/* Update Status */}
                        <div>
                            <label>Status: </label>
                            <select
                                value={selectedOrder.status}
                                onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="done">Done</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <h4>Item Pesanan</h4>
                        <table className={tableStyles.table}>
                            <thead>
                                <tr>
                                    <th className={tableStyles.th}>Produk</th>
                                    <th className={tableStyles.th}>Harga</th>
                                    <th className={tableStyles.th}>Qty</th>
                                    <th className={tableStyles.th}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className={tableStyles.td}>{item.product_name}</td>
                                        <td className={tableStyles.td}>
                                            Rp.{Number(item.price).toLocaleString("id-ID")}
                                        </td>
                                        <td className={tableStyles.td}>{item.quantity}</td>
                                        <td className={tableStyles.td}>
                                            Rp.{Number(item.total_price).toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <p style={{ fontWeight: "bold", marginTop: "12px" }}>
                            Grand Total: Rp.{Number(selectedOrder.grand_total).toLocaleString("id-ID")}
                        </p>

                        <button onClick={() => setSelectedOrder(null)}>
                            Tutup
                        </button>
                </PopUpModal>
            )}

        </div>
    )

}

export default OrderListComponent