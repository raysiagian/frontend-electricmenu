import { useState, useEffect } from "react";
import { getUserShopProducts, searchProductByShop } from "../../../services/product-service";
import { createWalkInOrder } from "../../../services/order-service";
import PopUpModal from "../../shared/popup/Pop-Up-Modal";
import { Button } from "../../shared/button/Button";
import SearchBarComponent from "../../shared/searchbar/Search-Bar-Component";
import styles from "./WalkInOrderModal.module.css";

function WalkInOrderModal({ shop_id, onClose, onSuccess }) {
    const [step, setStep] = useState(1);

    // step 1 — pilih produk
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // step 2 — isi buyer name
    const [buyerName, setBuyerName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // fetch produk
    useEffect(() => {
        if (!shop_id) return;

        const delay = setTimeout(async () => {
            setLoading(true);
            setError("");
            try {
                let data;
                if (!search || search.trim() === "") {
                    data = await getUserShopProducts(shop_id, 1);
                } else {
                    data = await searchProductByShop({ shop_id, search, page: 1 });
                }
                setProducts(data.products || []);
            } catch (err) {
                setError("Gagal mengambil produk");
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [shop_id, search]);

    // cart helpers
    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const increaseQty = (product_id) => {
        setCart((prev) =>
            prev.map((i) =>
                i.id === product_id ? { ...i, quantity: i.quantity + 1 } : i
            )
        );
    };

    const decreaseQty = (product_id) => {
        setCart((prev) =>
            prev
                .map((i) =>
                    i.id === product_id ? { ...i, quantity: i.quantity - 1 } : i
                )
                .filter((i) => i.quantity > 0)
        );
    };

    const grandTotal = cart.reduce(
        (acc, item) => acc + Number(item.price) * item.quantity, 0
    );

    // submit order
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!buyerName.trim()) {
            setSubmitError("Nama pembeli wajib diisi");
            return;
        }

        setSubmitting(true);
        setSubmitError("");

        try {
            await createWalkInOrder({
                shop_id,
                buyer_name: buyerName,
                items: cart.map((i) => ({
                    product_id: i.id,
                    quantity: i.quantity,
                })),
            });
            onSuccess();
            onClose();
        } catch (err) {
            setSubmitError(err.response?.data?.error || "Gagal membuat order");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PopUpModal
            title={step === 1 ? "Pilih Produk" : "Detail Pembeli"}
            onClose={onClose}
        >
            {/* ===== STEP INDICATOR ===== */}
            <div className={styles.stepIndicator}>
                <span className={`${styles.step} ${step === 1 ? styles.activeStep : styles.doneStep}`}>
                    1. Pilih Produk
                </span>
                <span className={styles.stepDivider}>→</span>
                <span className={`${styles.step} ${step === 2 ? styles.activeStep : ""}`}>
                    2. Detail Pembeli
                </span>
            </div>

            {/* ===== STEP 1: PILIH PRODUK ===== */}
            {step === 1 && (
                <div className={styles.stepContent}>
                    <SearchBarComponent
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari produk..."
                    />

                    {loading && <p className={styles.info}>Loading...</p>}
                    {error && <p className={styles.errorText}>{error}</p>}

                    {!loading && products.length === 0 && (
                        <p className={styles.info}>Tidak ada produk</p>
                    )}

                    {!loading && products.length > 0 && (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Produk</th>
                                    <th className={styles.th}>Harga</th>
                                    <th className={styles.th}>Stok</th>
                                    <th className={styles.th}>Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    const cartItem = cart.find((i) => i.id === product.id);
                                    return (
                                        <tr key={product.id} className={styles.tr}>
                                            <td className={styles.td}>{product.product_name}</td>
                                            <td className={styles.td}>
                                                Rp{Number(product.price).toLocaleString("id-ID")}
                                            </td>
                                            <td className={styles.td}>
                                                {product.service_type === "service"
                                                    ? "∞"
                                                    : product.stock}
                                            </td>
                                            <td className={styles.td}>
                                                {!cartItem ? (
                                                    <button
                                                        className={styles.addBtn}
                                                        onClick={() => addToCart(product)}
                                                        disabled={!product.is_available}
                                                    >
                                                        + Add
                                                    </button>
                                                ) : (
                                                    <div className={styles.qtyControl}>
                                                        <button
                                                            className={styles.qtyBtn}
                                                            onClick={() => decreaseQty(product.id)}
                                                        >
                                                            −
                                                        </button>
                                                        <span className={styles.qtyValue}>
                                                            {cartItem.quantity}
                                                        </span>
                                                        <button
                                                            className={styles.qtyBtn}
                                                            onClick={() => increaseQty(product.id)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {/* Ringkasan cart */}
                    {cart.length > 0 && (
                        <div className={styles.cartSummary}>
                            <p className={styles.cartInfo}>
                                {cart.reduce((acc, i) => acc + i.quantity, 0)} item •{" "}
                                Rp{grandTotal.toLocaleString("id-ID")}
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => setStep(2)}
                            >
                                Lanjut →
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* ===== STEP 2: DETAIL PEMBELI ===== */}
            {step === 2 && (
                <div className={styles.stepContent}>

                    {/* ringkasan order */}
                    <div className={styles.orderSummary}>
                        <h4 className={styles.summaryTitle}>Ringkasan Order</h4>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Produk</th>
                                    <th className={styles.th}>Qty</th>
                                    <th className={styles.th}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr key={item.id} className={styles.tr}>
                                        <td className={styles.td}>{item.product_name}</td>
                                        <td className={styles.td}>{item.quantity}</td>
                                        <td className={styles.td}>
                                            Rp{(Number(item.price) * item.quantity).toLocaleString("id-ID")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className={styles.grandTotal}>
                            Total: Rp{grandTotal.toLocaleString("id-ID")}
                        </p>
                    </div>

                    {/* form buyer name */}
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.field}>
                            <label className={styles.label}>Buyer Name</label>
                            <input
                                className={styles.input}
                                type="text"
                                placeholder="Buyer name..."
                                value={buyerName}
                                onChange={(e) => setBuyerName(e.target.value)}
                            />
                        </div>

                        {submitError && (
                            <p className={styles.errorText}>{submitError}</p>
                        )}

                        <div className={styles.actions}>
                            <Button
                                variant="outline"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? "Loading..." : "Konfirmasi Order"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}
        </PopUpModal>
    );
}

export default WalkInOrderModal;