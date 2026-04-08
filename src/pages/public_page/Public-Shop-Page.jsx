import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PublicShopPage() {
    const { slug } = useParams();
    const [shop, setShop] = useState(null);

    useEffect(() => {
        fetch(`/api/public/shop/${slug}`)
            .then(res => res.json())
            .then(data => setShop(data.shop));
    }, [slug]);

    if (!shop) return <p>Loading...</p>;

    return (
        <div>
            <h1>{shop.shop_name}</h1>
            <img src={shop.qr_url} alt="QR" />
        </div>
    );
}

export default PublicShopPage;