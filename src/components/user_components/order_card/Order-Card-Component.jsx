import { useState } from "react";
import styles from "./OrderCard.module.css";

function OrderCard({ order }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={styles.cardInfo}>
                    <p className={styles.buyerName}>{order.buyer_name}</p>
                    <p className={styles.shopName}>{order.shop_name}</p>
                    <p className={styles.date}>
                        {new Date(order.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </p>
                </div>
                <div className={styles.cardRight}>
                    <p className={styles.total}>
                        Rp{Number(order.grand_total).toLocaleString("id-ID")}
                    </p>
                    <button
                        className={styles.toggleBtn}
                        onClick={() => setIsOpen((prev) => !prev)}
                    >
                        {isOpen ? "Close ▲" : "See Detail ▼"}
                    </button>
                    {/* {isOpen ? "Tutup ▲" : "Lihat Detail ▼"} */}
                </div>
            </div>

            {isOpen && (
                <div className={styles.detail}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Produk</th>
                                <th className={styles.th}>Harga</th>
                                <th className={styles.th}>Qty</th>
                                <th className={styles.th}>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item, index) => (
                                <tr key={index} className={styles.tr}>
                                    <td className={styles.td}>{item.product_name}</td>
                                    <td className={styles.td}>
                                        Rp{Number(item.price).toLocaleString("id-ID")}
                                    </td>
                                    <td className={styles.td}>{item.quantity}</td>
                                    <td className={styles.td}>
                                        Rp{Number(item.total_price).toLocaleString("id-ID")}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default OrderCard;