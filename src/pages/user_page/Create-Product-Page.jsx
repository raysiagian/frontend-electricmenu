import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createProduct } from "../../services/product-service";
import { searchTypes } from "../../services/type-service";

function CreateProductPage() {
    const { shop_id: paramShopId } = useParams();
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    // State untuk type search
    const [typeSearch, setTypeSearch] = useState("");
    const [typeResults, setTypeResults] = useState([]);
    const [selectedType, setSelectedType] = useState(null); // { id, type_name }
    const debounceRef = useRef(null);

    const [form, setForm] = useState({
        product_name: "",
        service_type: "",
        price: "",
        stock: "",
        product_image: null
    });

    // Search type dengan debounce
    useEffect(() => {
        if (!typeSearch) {
            setTypeResults([]);
            return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const data = await searchTypes(typeSearch);
                setTypeResults(data);
            } catch (err) {
                console.error("Gagal search type:", err);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [typeSearch]);

    const handleSelectType = (type) => {
        setSelectedType(type);
        setTypeSearch(type.type_name);
        setTypeResults([]); // tutup dropdown
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "service_type" && value === "service") {
            setForm({ ...form, service_type: value, stock: "" });
            return;
        }

        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, product_image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("shop_id", paramShopId);
            formData.append("product_name", form.product_name);
            formData.append("service_type", form.service_type);
            formData.append("price", form.price);
            if (selectedType?.id) formData.append("type_id", selectedType.id);
            if (form.stock) formData.append("stock", form.stock);
            if (form.product_image) formData.append("product_image", form.product_image);

            await createProduct(formData);
            navigate(`/dashboard-user/shop/${paramShopId}`);

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

                {/* Type Search */}
                <div style={{ position: "relative" }}>
                    <label>Type (opsional)</label>
                    <input
                        type="text"
                        placeholder="Cari type produk..."
                        value={typeSearch}
                        onChange={(e) => {
                            setTypeSearch(e.target.value);
                            setSelectedType(null); // reset pilihan kalau user ketik ulang
                        }}
                        onBlur={() => setTimeout(() => setTypeResults([]), 200)}
                    />
                    {/* Dropdown hasil search */}
                    {typeResults.length > 0 && (
                        <ul style={{
                            position: "absolute",
                            background: "white",
                            border: "1px solid #ccc",
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                            width: "100%",
                            zIndex: 10
                        }}>
                            {typeResults.map((type) => (
                                <li
                                    key={type.id}
                                    onPointerDown={(e) => {
                                        e.preventDefault();
                                        handleSelectType(type);
                                    }}
                                    style={{ padding: "12px", cursor: "pointer" }}
                                >
                                    {type.type_name}
                                </li>
                            ))}
                        </ul>
                    )}
                    {/* {selectedType && (
                        <p style={{ fontSize: 12, color: "green" }}>
                            Terpilih: {selectedType.type_name}
                        </p>
                    )} */}
                </div>

                <div>
                    <label>Service Type</label>
                    <select name="service_type" value={form.service_type} onChange={handleChange} required>
                        <option value="">-- Select Service Type --</option>
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                    </select>
                </div>

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

                {/* tampilkan stock hanya kalau service_type = product */}
                {form.service_type === "product" && (
                    <div>
                        <label>Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

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

export default CreateProductPage;