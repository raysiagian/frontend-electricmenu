import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createProduct } from "../../../services/product-service";
import { searchTypes } from "../../../services/type-service";
import formStyle from "../../../components/shared/Form.module.css"
import { Button } from "../../../components/shared/button/Button";

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

    const isSelectingRef = useRef(false);

    const [form, setForm] = useState({
        product_name: "",
        service_type: "",
        price: "",
        stock: "",
        product_image: null
    });

     // const handleSelectType = (type) => {
    //     setSelectedType(type);
    //     setTypeSearch(type.type_name);
    //     setTypeResults([]); // tutup dropdown
    // };

    const handleSelectType = (type) => {
        isSelectingRef.current = true;
        setSelectedType(type);
        setTypeSearch(type.type_name);
        setTypeResults([]);
    };

    // Search type dengan debounce
    useEffect(() => {
        if (!typeSearch) {
            setTypeResults([]);
            return;
        }

        if (isSelectingRef.current) {
            isSelectingRef.current = false;
            return;
        }


        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const data = await searchTypes(typeSearch);
                setTypeResults(data);
            } catch (err) {
                console.error("Failed to search type:", err);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [typeSearch]);

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
    <div className={formStyle.page}>
        <div className={formStyle.card}>
            <h2 className={formStyle.title}>Create New Product</h2>


            <form className={formStyle.form} onSubmit={handleSubmit}>

                <div className={formStyle.field}>
                    <label className={formStyle.label}>Product Name</label>
                    <input
                        className={formStyle.input}
                        type="text"
                        name="product_name"
                        value={form.product_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Type Search */}
                <div className={formStyle["field-relative"]}>
                    <label className={formStyle.label}>Type (optional)</label>
                    <input
                        className={formStyle.input}
                        type="text"
                        placeholder="Search your product type..."
                        value={typeSearch}
                        onChange={(e) => {
                            setTypeSearch(e.target.value);
                            setSelectedType(null);
                        }}
                        onBlur={() => setTypeResults([])}
                        // onBlur={() => {
                        //     // hanya tutup kalau user tidak sedang memilih item
                        //     if (!isSelectingRef.current) {
                        //         setTimeout(() => setTypeResults([]), 200);
                        //     }
                        // }}
                    />
                    {typeResults.length > 0 && (
                        <ul className={formStyle["dropdown-list"]}>
                            {typeResults.map((type) => (
                                <li
                                    key={type.id}
                                    className={formStyle["dropdown-item"]}
                                    onPointerDown={(e) => {
                                        e.preventDefault();
                                        isSelectingRef.current = true;
                                        handleSelectType(type);
                                    }}
                                >
                                    {type.type_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className={formStyle.field}>
                    <label className={formStyle.label}>Service Type</label>
                    <select
                        className={formStyle.select}
                        name="service_type"
                        value={form.service_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Select Service Type --</option>
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                    </select>
                </div>

                <div className={formStyle.field}>
                    <label className={formStyle.label}>Price</label>
                    <input
                        className={formStyle.input}
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                {form.service_type === "product" && (
                    <div className={formStyle.field}>
                        <label className={formStyle.label}>Stock</label>
                        <input
                            className={formStyle.input}
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <div className={formStyle.field}>
                    <label className={formStyle.label}>Product Image</label>
                    <input
                        className={formStyle["file-input"]}
                        type="file"
                        accept="image/png, image/jpg, image/jpeg"
                        onChange={handleFileChange}
                        required
                    />
                    {preview && (
                        <img
                            className={formStyle["image-preview"]}
                            src={preview}
                            alt="Preview"
                        />
                    )}
                </div>
                {error && <p className={formStyle["error-text"]}>{error}</p>}
                <div className={formStyle.actions}>
                    <Button variant="primary" type="submit" disabled={loading} full>
                        {loading ? "Loading..." : "Create Product"}
                    </Button>
                    <Button variant="ghost" onClick={() => navigate(-1)} full>
                        Cancel
                    </Button>
                </div>

            </form>
        </div>
    </div>
);
}

export default CreateProductPage;