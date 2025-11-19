import axios from "axios";

// Create an Axios instance with a base URL from your .env file
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Optional: automatically attach token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
