import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.split("/api")[0] 
  : "http://localhost:5000";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000, // 15 seconds timeout
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a network error or a timeout
    if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      window.dispatchEvent(new Event('offline'));
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;




