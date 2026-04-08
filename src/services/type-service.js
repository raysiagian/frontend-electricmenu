import api from "./api";

export const searchTypes = async (search) => {
    const res = await api.get("/type/search-type", {
        params: { search }
    });
    return res.data.result;
};