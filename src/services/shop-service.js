import api from "./api";
import publicApi from "./public-api.js";

export const getUserShops = async () => {
    const res = await api.get("/shop/get-shops");
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

export const getPublicShop = async (shop_slug) => {
    const res = await publicApi.get(`/public/shop/${shop_slug}`);
    return res.data
}