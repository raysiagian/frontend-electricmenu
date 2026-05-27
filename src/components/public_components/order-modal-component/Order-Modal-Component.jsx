import { useNavigate } from "react-router-dom";
import styles from "./OrderModalComponent.module.css"

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
        <div className={styles.bar}>
            <div className={styles["bar-info"]}>

                <div className={styles.summary}>
                    <div>
                        <p className={styles["item-count"]}>
                            {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                        </p>

                        <p className={styles.total}>
                            Rp.{grandTotal.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>

                <div className={styles["order-list"]}>
                    {cart.map((item) => (
                        <div key={item.id} className={styles["order-item"]}>
                            <div className={styles["order-name"]}>
                                {item.product_name}
                            </div>

                            <div className={styles["order-qty"]}>
                                x{item.quantity}
                            </div>

                            <div className={styles["order-price"]}>
                                Rp.{(item.price * item.quantity).toLocaleString("id-ID")}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className={styles["next-btn"]}
                    onClick={handleNext}
                >
                    Continue Order
                </button>

            </div>
        </div>
    );
}

export default OrderModalComponent;