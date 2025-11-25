import axios from "axios";
import { showErrorPopup } from "./errorPopup";

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ---- REQUEST INTERCEPTOR ----
// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---- RESPONSE INTERCEPTOR ----
// Global error popup handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    showErrorPopup(msg); // <-- your popup function

    return Promise.reject(error); // Keep existing behavior
  },
);

export default api;
