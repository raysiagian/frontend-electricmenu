

function ProductCardPublicComponent({product, cartItem, onAdd, onIncrease, onDecrease}){

    return(
        <div>
            <img src={product?.product_image_url} alt="Product Image" />
            <p> {product.product_name}</p>
            <p>Price: Rp.{product?.price}</p>
            {/* Kalau belum di cart → tombol Add */}
            {/* Kalau sudah di cart → tombol - jumlah + */}
            {!cartItem ? (
                <button onClick={() => onAdd(product)}>Add</button>
            ) : (
                <div>
                    <button onClick={() => onDecrease(product.id)}>-</button>
                    <span>{cartItem.quantity}</span>
                    <button onClick={() => onIncrease(product.id)}>+</button>
                </div>
            )}
        </div>
    )

}

export default ProductCardPublicComponent
