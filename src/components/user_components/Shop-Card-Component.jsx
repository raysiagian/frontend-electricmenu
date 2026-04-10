import { Link } from "react-router-dom";

function ShopCardComponent({shop}){

    return (
        <div>
            <Link to={`/dashboard-user/shop/${shop.id}`}>
                {shop.shop_name}
            </Link>
        </div>
    )

}

export default ShopCardComponent