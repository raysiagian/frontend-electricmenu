import api from "./api";

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