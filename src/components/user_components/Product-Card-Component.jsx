import { Link } from "react-router-dom";

function ProductCardComponent({product, shop_id}){

    return (
        <div>
            <img src={product?.product_image_url} alt="Product Image" />
            <Link to={`/shop/${shop_id}/product/${product.id}`}>
                {product.product_name}
            </Link>
            <p>Price: Rp.{product?.price}</p>
        </div>
    )

}

export default ProductCardComponent