import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { createOrder } from "../../services/order-service"
import { Button } from "../../components/shared/button/Button";
import formStyle from "../../components/shared/Form.module.css"
import tableStyle from "../../components/shared/Table.module.css"
import styles from './OrderFormPage.module.css';

function OrderFormPage() {

    const [buyer_name, setBuyerName] = useState("")
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    // membaca informasi url
    const location = useLocation();

    // ambil cart dan shop_slug dari state navigate
    const { cart, shop_slug } = location.state || {};

    // kalau tidak ada cart, redirect balik
    useEffect(() => {
        if (!cart || cart.length === 0) {
            navigate(-1);
        }
    }, [cart, navigate]);


    const grandTotal = cart.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

    const handleOrder = async (e) => {
        e.preventDefault();

        if(!buyer_name){
            setError("Buyer name must be filled")
            return
        }

        if (loading) return;
        setLoading(true);
        setError("");

        console.log("Data yang dikirim:", {  // ← tambah ini
            shop_slug,
            buyer_name,
            items: cart.map((item) => ({
                product_id: item.id,
                quantity: item.quantity
            }))
        });

        try {
            await createOrder({
                shop_slug,
                buyer_name,
                items: cart.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity
                }))
            })

            localStorage.removeItem(`cart-${shop_slug}`);
            navigate(`/shop/${shop_slug}`)
            
            
        } catch (err) {
            setError(err.response?.data?.error || "Gagal melakukan pemesanan");
        }finally{
            setLoading(false)
        }
    }

    return(
        <div className={styles.page}>
            <div className={styles["content-wrapper"]}>
                <h2>Order Detail</h2>
                <div className={tableStyle["table-wrapper"]}>
                    <table className={tableStyle.table}>
                        <thead>
                            <tr>
                                <th className={tableStyle.th}>Product</th>
                                <th className={tableStyle.th}>Item Price</th>
                                <th className={tableStyle.th}>Qty</th>
                                <th className={tableStyle.th}>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => {
                                const cartItem = cart.find((i) => i.id === item.id);
                                return (
                                    <tr key={item.id} className={styles.tr}>
                                        <td className={tableStyle.th}>{item.product_name}</td>
                                        <td className={tableStyle.th}> Rp{Number(item.price).toLocaleString("id-ID")}</td>
                                        <td className={tableStyle.th}>{item.quantity}</td>
                                        <td className={tableStyle.th}>
                                            Rp{(Number(item.price) * item.quantity).toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                
                <form className={formStyle.form} onSubmit={handleOrder}>
                    <div className={formStyle.field}>
                        <input
                            className={formStyle.input}
                            type="text"
                            placeholder="Buyer name"
                            value={buyer_name}
                            onChange={(e) => {
                                setBuyerName(e.target.value)
                            }}
                        />
                    </div>
                    {error && <p className={formStyle["error-text"]}>{error}</p>}
                    <div className={styles["order-summary"]}>
                        <p className={styles.cartInfo}>
                            {cart.reduce((acc, i) => acc + i.quantity, 0)} item •{" "}
                            Rp{grandTotal.toLocaleString("id-ID")}
                        </p>
                        <div className={styles.actions}>
                            <Button type="submit" variant="primary" disabled={loading}>
                                {loading ? "Loading..." : "Order"}
                            </Button>
                            <Button variant="ghost" onClick={() => navigate(`/shop/${shop_slug}`)}>Cancel</Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default OrderFormPage