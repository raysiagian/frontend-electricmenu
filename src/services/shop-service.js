import api from "./api";
import publicApi from "./public-api.js";

export const getUserShops = async (page = 1, limit = 10) => {
    const res = await api.get(`/shop/get-shops?page=${page}&limit=${limit}`);
    return res.data;
};

export const getShop = async (id) => {
    const res = await api.get(`/shop/${id}`);
    return res.data
}

export const createShop = async (data) => {
    const res = await api.post("/shop/create-shop", data)
    return res.data
}

export const searchShopUser = async ({search = "", page = 1, limit = 10, sort = "created_at", order = "desc"}) => {
    const res = await api.get(`/shop/search`,{
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

export const deleteShopUser = async ({confirm_shop_name, id}) => {
    const res = await api.delete(`/shop/delete-shop/${id}`,
        {
            data: {
                confirm_shop_name
            }
        }
    );
    return res.data
}

export const getPublicShop = async (shop_slug) => {
    const res = await publicApi.get(`/public/shop/${shop_slug}`);
    return res.data
}