import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Không ép Content-Type khi gửi FormData
    if (config.data instanceof FormData) {
        // Xóa Content-Type để browser tự set boundary đúng
        delete config.headers['Content-Type'];
        // Hoặc: config.headers['Content-Type'] = undefined;
    } else {
        // Chỉ set json cho các request thông thường (POST/PUT json)
        config.headers['Content-Type'] = 'application/json';

    }

    return config;
});


export default axiosClient;
