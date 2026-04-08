import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByID, getProductByShopIDAndProductID } from "../../services/product-service";

function UserProductPage (){

    const { shop_id, id } = useParams();
    const [product, setProduct] = useState(null);

    const navigate = useNavigate();


    useEffect(() => {
            console.log("shop_id:", shop_id, "id:", id);
            if (!shop_id || !id) return;


            const fetchProduct = async () => {
                const data = await getProductByShopIDAndProductID(shop_id, id);
                
                setProduct(data.product);
            };
    
            fetchProduct();
        }, [shop_id, id]);

    return(
        <div>
            <img src={product?.product_image_url} alt="Product Image" />
            <p>{product?.product_name}</p>
            <p>Price: Rp.{product?.price}</p>
            <p>Stock: {product?.stock}</p>
        </div>
    )

}

export default UserProductPage