import axios from "axios";

// const BASE_URL = "http://localhost:3000/api"
const ENV_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

// Otomatis merapikan slash ganda dan menambahkan sub-folder /api
export const BASE_URL = `${ENV_URL.replace(/\/$/, "")}/api`;

const api = axios.create({
    baseURL: BASE_URL,
});

// kirim token
api.interceptors.request.use((config) => {
    let token = localStorage.getItem("accessToken");

    if (token) {
        token = token.replace(/"/g, "");
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// response invalid token
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 const refreshToken = localStorage.getItem("refreshToken");
//                 const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
//                     refreshToken
//                 });

//                 const newAccessToken = res.data.token;
//                 localStorage.setItem("accessToken", newAccessToken);

//                 // ulangi request yang gagal dengan token baru
//                 originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//                 return api(originalRequest);

//             } catch (err) {
//                 // refresh token expired → paksa logout
//                 localStorage.removeItem("accessToken");
//                 localStorage.removeItem("refreshToken");
//                 window.location.href = "/login";
//             }
//         }

//         return Promise.reject(error);
//     }
// );

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        console.log("ERROR STATUS:", error.response?.status);

        const isEmailNotVerified =
    error.response?.data?.emailVerified === false;

        if (
            (error.response?.status === 401 ||
            error.response?.status === 403) &&
            !originalRequest._retry &&
            !originalRequest?.url?.includes("/auth/refresh-token") &&
            !originalRequest?.url?.includes("/auth/login") &&
            !isEmailNotVerified
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
                    refreshToken
                });

                const newAccessToken = res.data.token;

                localStorage.setItem("accessToken", newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (err) {
                console.log("REFRESH FAILED");
                console.log("REFRESH ERROR:", err.response?.data || err.message);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);



export default api;