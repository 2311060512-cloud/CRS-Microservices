// path: crs-frontend/src/api/axiosClient.ts
// purpose: axios instance duy nhat cua frontend, tro ve api-gateway va tu dong dinh kem
// Authorization header neu co token trong localStorage.
import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('crs_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosClient;