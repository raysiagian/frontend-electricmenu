import api from "./api";
import publicApi from "./public-api.js";

export const createOrder = async ({ shop_slug, buyer_name, items }) => {
    const res = await publicApi.post(`/public/shop/${shop_slug}/order/create-order`, {
        buyer_name,
        items
    });
    return res.data;
};

export const getAllOrderByShopID = async (shop_id, { page = 1, limit = 10, status } = {}) => {
    const res = await api.get(`/order/shop/${shop_id}/get-shop-order`, {
        params: { page, limit, status }  // ← status opsional, kalau undefined tidak dikirim
    });
    return res.data;
};