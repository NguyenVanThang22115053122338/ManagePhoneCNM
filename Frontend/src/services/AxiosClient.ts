import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:9090",
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
