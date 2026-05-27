import api from "./api";

// export const login = async (data) => {
//     const res = await api.post("/auth/login", data);

//     if (res.data?.token) {
//         localStorage.setItem("accessToken", res.data.token);
//         localStorage.setItem("refreshToken", res.data.refreshToken);
//     }

//     return res.data;
// };

export const login = async ({ email, password }) => {
    const res = await api.post("/auth/login", { email, password });

    // simpan kedua token
    localStorage.setItem("accessToken", res.data.token);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    return res.data;
};

export const registerUser = async (data) => {
    const res = await api.post("/auth/register-user", data)
    return res.data;
}

export const verifyOTP = async (data) => {
    const res = await api.post("/auth/verify-otp", data)
    return res.data;
}

export const resendOTP = async (data) => {
    const res = await api.post("/auth/resend-otp", data)
    return res.data;
}

export const resetPasswordOTP = async (data) => {
    const res = await api.post("auth/reset-password-otp", data)
    return res.data;
}

export const resendResetPasswordOTP = async (data) => {
    const res = await api.post("auth/resend-reset-password-otp", data)
    return res.data
}

export const resetPassword = async (data) => {
    const res = await api.patch("/auth/reset-password", data)
    return res.data
}

export const changePasswordOTP = async (data) => {
    const res = await api.post("/auth/change-password/send-otp")
    return res.data;
}

export const verifyChangePasswordOTP = async ({otp}) => {
    const res = await api.post("/auth/change-password/verify-otp", {otp})
    return res.data
}

export const changePassword = async ({current_password, new_password, confirm_new_password}) => {
    const res = await api.post("/auth/change-password/confirm", {current_password,new_password, confirm_new_password})
    return res.data
}

export const logout = async () => {
    try {

        // kirim request logout ke backend
        await api.post("/auth/logout");

    } catch (err) {

        console.error("Logout error:", err);

    } finally {

        // tetap hapus token di browser
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // redirect login
        window.location.href = "/login";
    }
}