import axios from "axios";
import toast from "react-hot-toast";

export const API_BASE_URL = "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "An unexpected error occurred";
    
    // Specifically handle structured errors from our backend
    toast.error(message, {
      id: "global-error-toast", // Prevent duplicate toasts for the same error
      duration: 4000
    });

    return Promise.reject(error);
  }
);

export default api;
