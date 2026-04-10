import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { createOrder } from "../../services/order-service"

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
            setError("Nama pembeli wajib diisi")
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

            navigate(`/shop/${shop_slug}`)
            
        } catch (err) {
            setError(err.response?.data?.error || "Gagal melakukan pemesanan");
        }finally{
            setLoading(false)
        }
    }

    return(
        <div>
            <h2>Detail Pesanan</h2>

            {/* Ringkasan order */}
            <ul>
                {cart.map((item) => (
                    <li key={item.id}>
                        {item.product_name} x{item.quantity} = Rp.{Number(item.price) * item.quantity}
                    </li>
                ))}
            </ul>
            <p>Total: Rp.{grandTotal}</p>
            <form onSubmit={handleOrder}>
                <div>
                    <input 
                        type="text"
                        placeholder="Buyer name"
                        value={buyer_name}
                        onChange={(e) => {
                            setBuyerName(e.target.value)
                        }}
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Order"}
                </button>
            </form>
        </div>
    )

}

export default OrderFormPage