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
  (error) => Promise.reject(error)
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
  }
);

export default api;

// import axios from "axios";

// // Create an Axios instance with a base URL from your .env file
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// // Optional: automatically attach token if it exists
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("auth_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;

// import axios from "axios";
// import { showErrorPopup } from "./errorPopup";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
// });

// // Global error interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const msg =
//       error?.response?.data?.message ||
//       error?.message ||
//       "Something went wrong";

//     showErrorPopup(msg);

//     return Promise.reject(error); // keep behavior unchanged
//   }
// );

// export default api;

