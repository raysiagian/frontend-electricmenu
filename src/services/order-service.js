import api from "./api";
import publicApi from "./public-api.js";

export const createOrder = async ({ shop_slug, buyer_name, items }) => {
    const res = await publicApi.post(`/public/shop/${shop_slug}/order/create-order`, {
        buyer_name,
        items
    });
    return res.data;
};

export const createWalkInOrder = async ({shop_id, buyer_name, items}) => {
    const res = await api.post(`order/shop/${shop_id}/create-walk-order`,{
        buyer_name,
        items
    })
    return res.data;
}

export const getAllOrderByShopID = async (shop_id, { page = 1, limit = 10, status } = {}) => {
    const res = await api.get(`/order/shop/${shop_id}/get-shop-order`, {
        params: { page, limit, status }  // ← status opsional, kalau undefined tidak dikirim
    });
    return res.data;
};

export const updateOrderStatus = async (order_id, status) => {
    const res = await api.patch(`/order/${order_id}/status`, { status });
    return res.data;
};

export const getUserPendingOrders = async () => {
    const res = await api.get("order/pending-orders")
    return res.data
}