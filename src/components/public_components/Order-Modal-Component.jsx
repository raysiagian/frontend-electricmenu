import { useNavigate } from "react-router-dom";

function OrderModalComponent({ cart, shop_slug }) {
    const navigate = useNavigate();
    const grandTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleNext = () => {
        // kirim cart dan shop_slug lewat state navigate
        navigate(`/shop/${shop_slug}/order`, {
            state: { cart, shop_slug }
        });
    };

    return (
        <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "white",
            borderTop: "1px solid #ccc",
            padding: "16px"
        }}>
            <p>Total Item: {cart.reduce((acc, item) => acc + item.quantity, 0)}</p>
            <p>Total Harga: Rp.{grandTotal}</p>
            <ul>
                {cart.map((item) => (
                    <li key={item.id}>
                        {item.product_name} x{item.quantity} = Rp.{item.price * item.quantity}
                    </li>
                ))}
            </ul>
            <button onClick={handleNext}>Next</button>
        </div>
    );
}

export default OrderModalComponent;