import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.split("/api")[0] 
  : "http://localhost:5000";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 60000, // Increased to 60 seconds for cold starts
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Retry logic for cold starts
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, message } = error;
    
    // If it's a network error or timeout, and we haven't retried yet
    if (!config || !config.retry) {
      config.retry = 0;
    }

    if (config.retry < 2 && (!error.response || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK')) {
      config.retry += 1;
      console.log(`Retry attempt ${config.retry} for cold start...`);
      
      // Wait for 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
      return API(config);
    }

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




