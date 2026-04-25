import api from "./api";

export const login = async (data) => {
    const res = await api.post("/auth/login", data);

    if (res.data?.token) {
        localStorage.setItem("accessToken", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
    }

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

export const changePassword = async (data) => {
    const res = await api.patch("/auth/change-password", data)
    return res.data
}

export const logout = async (data) => {
    localStorage.removeItem("token");
    window.location.href = "/login";
}

export const getProfile = async () => {
    const res = await api.get("/auth/profile");
    return res.data;
};