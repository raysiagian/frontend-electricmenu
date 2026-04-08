import { useEffect, useState } from "react";
import { getUserShops } from "../../services/shop-service";
import ShopCardComponent from "./Shop-Card-Component";


function ShopListComponent(){
    const [shops, setShops] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    console.log(shops);

    useEffect(() => {
        
        const fetchShops = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getUserShops();
                setShops(data.shop || []);

            } catch (err) {
                console.log(err.response?.data || err.message)

                if(err.response){
                    setError(err.response.data.error || "gagal mengambil data")
                }else{
                    setError("Network Error")
                }
            }finally{
                setLoading(false)
            }
        }
        fetchShops();
    }, []);

    return(
        <div>
            <h2>Shop List</h2>

            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}

            {shops.length === 0 && !loading && <p>No shop Avaliable</p>}

            {shops.map((shop) => (
                <ShopCardComponent key={shop.id} shop={shop} />
            ))}

        </div>
    )

}

export default ShopListComponent