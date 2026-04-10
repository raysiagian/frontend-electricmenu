import api from "./api";
import publicApi from "./public-api.js";

export const createOrder = async ({ shop_slug, buyer_name, items }) => {
    const res = await publicApi.post(`/public/shop/${shop_slug}/order/create-order`, {
        buyer_name,
        items
    });
    return res.data;
};