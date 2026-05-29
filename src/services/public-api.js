// public-api.js - untuk route public, tanpa token
import axios from "axios";

// const BASE_URL = "http://localhost:3000/api"
const ENV_URL = import.meta.env.VITE_BASE_URL || "https://backend-electricmenu.onrender.com";

// Gabungkan langsung dengan /api
export const BASE_URL = `${ENV_URL.replace(/\/$/, "")}/api`;


const publicApi = axios.create({
    baseURL: BASE_URL,
});

export default publicApi;