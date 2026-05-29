// public-api.js - untuk route public, tanpa token
import axios from "axios";

// const BASE_URL = "http://localhost:3000/api"
const BASE_URL = "https://backend-electricmenu.onrender.com/api"

const publicApi = axios.create({
    baseURL: BASE_URL,
});

export default publicApi;