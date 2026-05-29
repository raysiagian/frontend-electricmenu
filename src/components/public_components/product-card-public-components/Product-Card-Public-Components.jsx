import styles from "./ProductCardPublicComponent.module.css"

function ProductCardPublicComponent({product, cartItem, onAdd, onIncrease, onDecrease}){

    return(
        <div className={styles.card}>
            
            {product?.product_image_url ? (
                <img className={styles.image} src={product?.product_image_url} alt={product.product_name} />
            ) : (
                <div className={styles["image-placeholder"]}>
                    No Image
                </div>
            )}
            <div className={styles.info}>
                <p className={styles.name}> {product.product_name}</p>
                <p>Price: <span className={styles.price}>Rp{Number(product.price).toLocaleString("id-ID")}</span></p>
                {/* Kalau belum di cart → tombol Add */}
                {/* Kalau sudah di cart → tombol - jumlah + */}
                {!cartItem ? (
                    <button className={styles["add-btn"]} onClick={() => onAdd(product)}>Add</button>
                ) : (
                    <div className={styles["qty-control"]}>   
                        <button className={styles["qty-btn"]} onClick={() => onDecrease(product.id)}>-</button>
                        <span className={styles["qty-values"]}>{cartItem.quantity}</span>
                        <button className={styles["qty-btn"]} onClick={() => onIncrease(product.id)}>+</button>
                    </div>
                )}
            </div>
        </div>
    )

}

export default ProductCardPublicComponent
