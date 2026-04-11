import api from "./api";
import publicApi from "./public-api.js";

export const getUserShopProducts = async (shop_id, page = 1, limit = 10) => {
    const res = await api.get(`/product/shop/${shop_id}?page=${page}&limit=${limit}`);
    return res.data;
};

export const getUserProduct = async (id) => {
    const res = await api.get(`/product/get-product/${id}`)
    return res.data
}

export const getProducts = async () => {
    const res = await api.get("/product/get-all-product")
    return res.data
}

export const getProductByID = async (id) => {
    const res = await api.get(`/product/get-product/${id}`)
    return res.data
}

export const getProductByShopIDAndProductID = async (shop_id, id) => {
    const res = await api.get(`product/shop/${shop_id}/product/${id}`)
    return res.data
}

export const createProduct = async (formData) => {
    const res = await api.post("/product/create-product", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data
}

// search product on specific shop
export const searchProductByShop = async ({ shop_id, search = "", page = 1, limit = 10, sort = "created_at", order = "desc" }) => {
    const res = await api.get(`/product/shop/${shop_id}/search-product`, {
        params: {
            search,
            page,
            limit,
            sort,
            order
        }
    })
    return res.data
}

// public
export const getProductByShopPublic = async (shop_slug, page = 1, limit = 10) => {
    const res = await publicApi.get(`/public/shop/${shop_slug}/products?page=${page}&limit=${limit}`);
    return res.data
}

export const searchProductsinShopPublic = async ({shop_slug, search = "", page = 1, limit = 10, sort = "created_at", order = "desc"}) => {
    const res = await publicApi.get(`/public/shop/${shop_slug}/search-product`, {
        params: {
            search,
            page,
            limit,
            sort,
            order
        }
    })
    return res.data
}