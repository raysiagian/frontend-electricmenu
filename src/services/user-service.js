import api from "./api"

export const editName = async ({name}) => {
    const res = await api.patch("/user/manage-account/edit-name", {
        name
    })
    return res.data
}

export const getProfile = async () => {
    const res = await api.get("/user/profile");
    return res.data;
};