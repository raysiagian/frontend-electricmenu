import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByID, getProductByShopIDAndProductID, getProductStatsByID, editProduct, deleteProduct, updateProductAvailability } from "../../../services/product-service";
import ToggleSwitchComponent from "../../../components/shared/Toggle-Switch-Component";
import { searchTypes } from "../../../services/type-service";
import PopUpModal from "../../../components/shared/popup/Pop-Up-Modal";
import formStyle from "../../../components/shared/Form.module.css"
import styles from "./UserProductPage.module.css"
import { Button } from "../../../components/shared/button/Button";

function UserProductPage (){

    const { shop_id, id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [stats, setProductStat] = useState(null)
    // edit
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(null);
    const [typeSearch, setTypeSearch] = useState("");
    const [typeResults, setTypeResults] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const debounceRef = useRef(null);

    const isSelectingRef = useRef(false);

    const [form, setForm] = useState({
        product_name: "",
        service_type: "",
        price: "",
        stock: "",
        product_image: null
    });

     // Isi form dengan data produk saat modal dibuka
    const handleOpenEditModal = () => {
        if (product) {
            setForm({
                product_name: product.product_name || "",
                service_type: product.service_type || "",
                price: product.price || "",
                stock: product.stock || "",
                product_image: null
            });
            setTypeSearch(product.type_name || "");
            setSelectedType(product.type_id ? { id: product.type_id } : null);
            setPreview(product.product_image_url || null);
        }
        setShowEditModal(true);
    };

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
                console.error("Faled to search type:", err);
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

    const handleEdit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("product_name", form.product_name);
            formData.append("service_type", form.service_type);
            formData.append("price", form.price);
            if (selectedType?.id) formData.append("type_id", selectedType.id);
            if (form.stock) formData.append("stock", form.stock);
            if (form.product_image) formData.append("product_image", form.product_image);

            const res = await editProduct(id, formData);
            setProduct(prev => ({ ...prev, ...res.product }));
            setShowEditModal(false);

        } catch (err) {
            setError(err.response?.data?.error || "Gagal mengupdate produk");
        } finally {
            setLoading(false);
        }
    };

    // delete
    const [openDeleteProductModal, setOpenDeleteProductModal] = useState(false);
    const [confirmName, setConfirmName] = useState("");

    const handleOpenDeleteProductModal = () => {
        setConfirmName("")
        setError("")
        setOpenDeleteProductModal(true)
    }

    const handleCloseDeleteProductModal = () => {
        setOpenDeleteProductModal(false)
    }

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!confirmName) {
            setError("Nama produk wajib diisi");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await deleteProduct(id, confirmName);

            alert(res.message);

            // redirect setelah delete
            navigate(`/dashboard-user/shop/${shop_id}`);
        } catch (err) {
            setError(
                err.response?.data?.error || "Gagal menghapus produk"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAvailability = async (id) => {
        try {
            const res = await updateProductAvailability(id)

            setProduct(prev => ({
                ...prev,
                is_available: res.product.is_available
            }));

        } catch (err) {
            console.error(err)
            console.log("STATUS:", err.response?.status);
            console.log("DATA:", err.response?.data);
            // rollback kalau gagal
        }

    }

    useEffect(() => {
        console.log("shop_id:", shop_id, "id:", id);
        if (!shop_id || !id) return;


        const fetchProduct = async () => {
            const data = await getProductByShopIDAndProductID(shop_id, id);
            
            setProduct(data.product);
        };

        fetchProduct();
    }, [shop_id, id]);

    useEffect(() => {
        console.log("id:", id);
        if (!id) return;

        const fetchProductStats = async () => {
            const data = await getProductStatsByID(id);

            setProductStat(data.stats)
        };
        fetchProductStats();
    }, [id])

    

    return(
        <div className={styles.page}>
            <div className={styles["product-card"]}>
                {product?.product_image_url ? (
                    <img
                        className={styles["product-image"]}
                        src={product.product_image_url}
                        alt="Product Image"
                    />
                ) : (
                    <div className={styles["product-image-placeholder"]}>
                        No Image
                    </div>
                )}
                <div className={styles["product-info"]}>
                    <h1 className={styles["product-name"]}>{product?.product_name}</h1>
                    {/* <p>Price : Rp.{product?.price}</p>
                    <p>Stock : {product?.stock}</p>
                    <p>Service Type : {product?.service_type}</p>             */}
                    <div className={styles["product-meta"]}>
                        <p className={styles["meta-item"]}>
                            Price: <span className={styles["meta-value"]}>
                                Rp{Number(product?.price).toLocaleString("id-ID")}
                            </span>
                        </p>
                        <p className={styles["meta-item"]}>
                            Stock: <span className={styles["meta-value"]}>
                                {product?.service_type === "service" ? "∞" : product?.stock}
                            </span>
                        </p>
                        <p className={styles["meta-item"]}>
                            Service Type: <span className={styles["meta-value"]}>
                                {product?.service_type}
                            </span>
                        </p>
                        {product?.type_name && (
                            <p className={styles["meta-item"]}>
                                Type: <span className={styles["meta-value"]}>{product.type_name}</span>
                            </p>
                        )}
                    </div>
                    <div className={styles["availability-row"]}>
                        <span className={styles["availability-label"]}>Availability</span>
                        <ToggleSwitchComponent
                            value={product?.is_available || false}
                            onChange={() => product && handleUpdateAvailability(product.id)}
                        />
                    </div>

                    <div className={styles.actions}>
                        <div className={styles["actions-btn"]}>
                            <Button variant="primary" onClick={handleOpenEditModal}>
                                Edit Product
                            </Button>
                        </div>
                        <div className={styles["actions-btn"]}>
                            <Button variant="danger" onClick={() => setOpenDeleteProductModal(true)}>
                                Delete Product
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div>
                <p>Product Statistic</p>
                <p>Total Sell : {stats?.total_quantity}</p>
                <p>Total Revenue : Rp.{stats?.total_revenue}</p>
            </div> */}
            <div className={styles["stats-card"]}>
                <h2 className={styles["stats-title"]}>Product Statistics</h2>
                <div className={styles["stats-grid"]}>
                    <div className={styles["stat-item"]}>
                        <span className={styles["stat-label"]}>Total Sold</span>
                        <span className={styles["stat-value"]}>
                            {stats?.total_quantity ?? 0}
                        </span>
                    </div>
                    <div className={styles["stat-item"]}>
                        <span className={styles["stat-label"]}>Total Revenue</span>
                        <span className={styles["stat-value"]}>
                            Rp{Number(stats?.total_revenue ?? 0).toLocaleString("id-ID")}
                        </span>
                    </div>
                </div>
            </div>

             {/* Modal Edit */}
            {showEditModal && (
                <PopUpModal title = "Edit Produk" onClose ={() => setShowEditModal(false)}>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <form className={formStyle.form} onSubmit={handleEdit}>
                        <div className={formStyle.field}>
                            <label className={formStyle.label}>Product Name (optional)</label>
                            <input
                                className={formStyle.input}
                                type="text"
                                name="product_name"
                                value={form.product_name}
                                onChange={handleChange}
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
                            <label className={formStyle.label}>Service Type (optional)</label>
                            <select
                                className={formStyle.select}
                                name="service_type"
                                value={form.service_type}
                                onChange={handleChange}
                            >
                                <option value="">-- Select Service Type --</option>
                                <option value="product">Product</option>
                                <option value="service">Service</option>
                            </select>
                        </div>

                        <div className={formStyle.field}>
                            <label className={formStyle.label}>Price (optional)</label>
                            <input
                                className={formStyle.input}
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                            />
                        </div>

                        {form.service_type === "product" && (
                            <div className={formStyle.field}>
                                <label className={formStyle.label}> Stock (optional)</label>
                                <input
                                    className={formStyle.input}
                                    type="number"
                                    name="stock"
                                    value={form.stock}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <div className={formStyle.field}>
                            <label className={formStyle.label}>Product Image (optional)</label>
                            <input
                                className={formStyle["file-input"]}
                                type="file"
                                accept="image/png, image/jpg, image/jpeg"
                                onChange={handleFileChange}
                            />
                            {preview && (
                                <img 
                                src={preview} 
                                alt="Preview" 
                                className={formStyle["image-preview"]}
                            />
                            )}
                        </div>

                        <div  className={formStyle.actions}>
                            <Button type="submit" disabled={loading} full>
                                {loading ? "Loading..." : "Edit Product"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => setShowEditModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </PopUpModal>
            )}
            
            {/* Modal delete */}
            {openDeleteProductModal && (
                <PopUpModal title = "Confirm Deleting Product" onClose ={handleCloseDeleteProductModal}>
                    {/* <p>Menghapus Produk {product?.product_name}</p> */}
                    <p>To confirm this action, type <b>{product?.product_name}</b></p>
                    <form className={formStyle.form} onSubmit={handleDelete}>
                        <div  className={formStyle.field}>
                            <input
                                className={formStyle.input}
                                type="text"
                                placeholder="Type product name"
                                value={confirmName}
                                onChange={(e) => setConfirmName(e.target.value)}
                            />
                        </div>
                        {error && <p className={formStyle["error-text"]}>{error}</p>}
                        <div className={formStyle.actions}>
                            <Button variant="outline" onClick={handleCloseDeleteProductModal}>
                                Cancel
                            </Button>
                            <Button variant="danger" type="submit" disabled={loading}>
                                {loading ?  "Loading..." : "Delete Product"}
                            </Button>
                        </div>
                    </form>
                </PopUpModal>
            )}
        </div>     
    )
}

export default UserProductPage