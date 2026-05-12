import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByID, getProductByShopIDAndProductID, getProductStatsByID, editProduct, deleteProduct, updateProductAvailability } from "../../../services/product-service";
import ToggleSwitchComponent from "../../../components/shared/Toggle-Switch-Component";
import { searchTypes } from "../../../services/type-service";
import PopUpModal from "../../../components/shared/popup/Pop-Up-Modal";

function UserProductPage (){

    const { shop_id, id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [stats, setProductStat] = useState(null)
    // edit
    const [showEditModal, setShowEditModal] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState("");
    const [preview, setPreview] = useState(null);
    const [typeSearch, setTypeSearch] = useState("");
    const [typeResults, setTypeResults] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const debounceRef = useRef(null);

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

    const handleEdit = async (e) => {
        e.preventDefault();
        setEditError("");
        setEditLoading(true);

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
            setEditError(err.response?.data?.error || "Gagal mengupdate produk");
        } finally {
            setEditLoading(false);
        }
    };

    // delete
    const [showModal, setShowModal] = useState(false);
    const [confirmName, setConfirmName] = useState("");
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [errorDelete, setErrorDelete] = useState("");

    const handleDelete = async () => {
        if (!confirmName) {
            setErrorDelete("Nama produk wajib diisi");
            return;
        }

        setLoadingDelete(true);
        setErrorDelete("");

        try {
            const res = await deleteProduct(id, confirmName);

            alert(res.message);

            // redirect setelah delete
            navigate(`/dashboard-user/shop/${shop_id}`);
        } catch (err) {
            setErrorDelete(
                err.response?.data?.error || "Gagal menghapus produk"
            );
        } finally {
            setLoadingDelete(false);
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
        <div>
            <div>
                <div>
                    <img src={product?.product_image_url} alt="Product Image" />
                    <p>{product?.product_name}</p>
                    <p>Harga : Rp.{product?.price}</p>
                    <p>Stok : {product?.stock}</p>
                    <p>Tipe layanan : {product?.service_type}</p>            
                    <div>
                        <p>Keteresediaan Produk :</p>
                        <ToggleSwitchComponent
                            value={product?.is_available || false}
                            onChange={() => product && handleUpdateAvailability(product.id)}
                        />
                    </div>
                </div>
            </div>
            <div>
                <p>Statistik Produk</p>
                <p>Total Penjualan : {stats?.total_quantity}</p>
                <p>Total Penjualan : {stats?.total_revenue}</p>
            </div>
            <div>
                <button onClick= {() => setShowEditModal(true)}>
                    Edit
                </button>
                <button onClick={() => setShowModal(true)}>
                    Delete Product
                </button>
            </div>

             {/* Modal Edit */}
            {showEditModal && (
                <PopUpModal title = "Edit Produk" onClose ={() => setShowEditModal(false)}>
                    {editError && <p style={{ color: "red" }}>{editError}</p>}
                    <form onSubmit={handleEdit}>
                        <div>
                            <label>Nama Produk</label>
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
                                    setSelectedType(null);
                                }}
                                onBlur={() => setTimeout(() => setTypeResults([]), 200)}
                            />
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
                                            style={{ padding: "8px", cursor: "pointer" }}
                                        >
                                            {type.type_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
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
                            <label>Harga</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {form.service_type === "product" && (
                            <div>
                                <label>Stok</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={form.stock}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <div>
                            <label>Gambar Produk (opsional)</label>
                            <input
                                type="file"
                                accept="image/png, image/jpg, image/jpeg"
                                onChange={handleFileChange}
                            />
                            {preview && (
                                <img src={preview} alt="Preview" style={{ width: 150, marginTop: 8 }} />
                            )}
                        </div>

                        <div>
                            <button type="button" onClick={() => setShowEditModal(false)}>
                                Batal
                            </button>
                            <button type="submit" disabled={editLoading}>
                                {editLoading ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </PopUpModal>
            )}
            
            {/* Modal delete */}
            {showModal && (
                <PopUpModal title = "Konfirmasi Hapus" onClose ={() => setShowModal(false)}>
                    <p>Menghapus Produk {product?.product_name}</p>
                    <p>Untuk mengkonfirmasi, ketik <b>{product?.product_name}</b></p>
                    <input
                        type="text"
                        placeholder="Masukkan nama produk"
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                    />
                    {errorDelete && <p style={{ color: "red" }}>{errorDelete}</p>}
                    <div style={{ marginTop: "10px" }}>
                        <button onClick={() => setShowModal(false)}>Batal</button>
                        <button onClick={handleDelete} disabled={loadingDelete}>
                            {loadingDelete ? "Deleting..." : "Confirm Delete"}
                        </button>
                    </div>
                </PopUpModal>
            )}
        </div>     
    )
}

export default UserProductPage