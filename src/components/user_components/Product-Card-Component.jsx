import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css"

function ProductCardComponent({product, shop_id}){

    return (
        <div className={styles.container}>
            <div className={styles.imageWrapper}>
                <img src={product?.product_image_url} alt="Product Image" />
            </div>
            <Link className={styles.title} to={`/dashboard-user/shop/${shop_id}/product/${product.id}`}>
                {product.product_name}
            </Link>
            <div>
                <p className={styles.atribute}>Price: <span className={styles.price}>Rp.{product?.price}</span></p>
                <p className={styles.atribute}>Stock: {product?.stock}</p>
            </div>
        </div>
    )

}

export default ProductCardComponent