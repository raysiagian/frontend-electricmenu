import { useEffect, useState } from "react";
import { getUserPendingOrders } from "../../../services/order-service";
import styles from "./DashboardOrderCardList.module.css";
import OrderCard from "../order_card/Order-Card-Component";

function DashboardOrderCardList () {  
    const [orders, setOrders] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        
        const fetchPendingOrders = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await getUserPendingOrders();
                setOrders(data.orders || [])

            } catch (err) {
                console.log(err.response?.data || err.message)

                if(err.response){
                    setError(err.response.data.error || "failed to fetch data")
                }else{
                    setError("Network Error")
                }
            }finally{
                setLoading(false)
            }
        }
        fetchPendingOrders();
    },[])


    return(
        <div>

            {loading && <p>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {orders.length === 0 && !loading && <p>No Pending Orders Available</p>} 

            {!loading && orders.length > 0 && (
                <div className={styles.wrapper}>
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    )


}

export default DashboardOrderCardList