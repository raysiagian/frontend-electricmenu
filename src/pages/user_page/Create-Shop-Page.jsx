import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createShop } from "../../services/shop-service";


function CreateShopPage(){

    const [shop_name, setShopName] = useState("")
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!shop_name){
            setError("Nama toko wajib diisi")
        }

        setLoading(true);

        try{
            const data = await createShop({shop_name});

            navigate("/dashboard-user")
            

        }catch(err){
            setError(err.response?.data?.error || "Gagal membuat toko");
        }finally{
            setLoading(false);
        }

    }

    return(

        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input 
                        type="text"
                        placeholder="Shop Name"
                        value={shop_name}
                        onChange={(e) => {
                            setShopName(e.target.value)
                        }}
                    />
                </div>
                {error && <p>{error}</p>}
                <button type="submit" disabled={loading}>{loading ? loading : "Create Shop"}</button>
            </form>
        </div>

    )

}

export default CreateShopPage