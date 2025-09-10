import axios from 'axios'
import React from 'react'

export const BASE_URL = "https://file-app-api.amiigo.in";
const Axios = axios.create({
    baseURL: BASE_URL+`/api`,
    // baseURL: "http://localhost:8493/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
})

export default Axios
