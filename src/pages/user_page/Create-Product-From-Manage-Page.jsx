import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/product-service";
import { getUserShops } from "../../services/shop-service";

function CreateProductFromManagePage() {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        shop_id: "",
        product_name: "",
        type_id: "",
        service_type: "",
        price: "",
        stock: "",
        product_image: null
    });

    // Fetch daftar shop milik user
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const data = await getUserShops();
                setShops(data.shop || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchShops();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, product_image: file });
            setPreview(URL.createObjectURL(file)); // preview gambar
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Gunakan FormData karena ada file upload
            const formData = new FormData();
            formData.append("shop_id", form.shop_id);
            formData.append("product_name", form.product_name);
            formData.append("service_type", form.service_type);
            formData.append("price", form.price);
            if (form.type_id) formData.append("type_id", form.type_id);
            if (form.stock) formData.append("stock", form.stock);
            if (form.product_image) formData.append("product_image", form.product_image);

            await createProduct(formData);
            navigate(`/shop/${form.shop_id}`); // redirect setelah sukses

        } catch (err) {
            setError(err.response?.data?.error || "Gagal membuat produk");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Create New Product</h2>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>

                {/* Pilih Shop */}
                <div>
                    <label>Shop</label>
                    <select name="shop_id" value={form.shop_id} onChange={handleChange} required>
                        <option value="">-- Pilih Shop --</option>
                        {shops.map((shop) => (
                            <option key={shop.id} value={shop.id}>
                                {shop.shop_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Nama Produk */}
                <div>
                    <label>Product Name</label>
                    <input
                        type="text"
                        name="product_name"
                        value={form.product_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Service Type */}
                <div>
                    <label>Service Type</label>
                    <select name="service_type" value={form.service_type} onChange={handleChange} required>
                        <option value="">-- Pilih Service Type --</option>
                        <option value="delivery">Delivery</option>
                        <option value="dine_in">Dine In</option>
                        <option value="both">Both</option>
                    </select>
                </div>

                {/* Harga */}
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Stok (opsional) */}
                <div>
                    <label>Stock (opsional)</label>
                    <input
                        type="number"
                        name="stock"
                        value={form.stock}
                        onChange={handleChange}
                    />
                </div>

                {/* Gambar Produk */}
                <div>
                    <label>Product Image</label>
                    <input
                        type="file"
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={handleFileChange}
                        required
                    />
                    {preview && (
                        <img src={preview} alt="Preview" style={{ width: 150, marginTop: 8 }} />
                    )}
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Create Product"}
                </button>

            </form>
        </div>
    );
}

export default CreateProductFromManagePage;