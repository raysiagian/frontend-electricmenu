// public-api.js - untuk route public, tanpa token
import axios from "axios";

// const BASE_URL = "http://localhost:3000/api"
export const BASE_URL = process.env.BASE_URL

const publicApi = axios.create({
    baseURL: BASE_URL,
});

export default publicApi;