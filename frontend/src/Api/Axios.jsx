import axios from 'axios'
import React from 'react'

const Axios = axios.create({
    baseURL: "https://file-app-api.amiigo.in/api",
    // baseURL: "http://localhost:8493/api",
    withCredentials: true,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
})

export default Axios
