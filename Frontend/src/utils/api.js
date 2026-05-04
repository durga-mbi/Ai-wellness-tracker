import axios from "axios";
import toast from "react-hot-toast";

export const MODE = import.meta.env.VITE_ENV_MODE || 'dev';
export const BASE_URL = MODE === 'prod' ? import.meta.env.VITE_PROD_URL : import.meta.env.VITE_DEV_URL;
export const API_BASE_URL = `${BASE_URL}/api`;

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
    const status = error.response?.status;
    const url = error.config?.url || "";
    let message = error.response?.data?.message || "An unexpected error occurred";

    // Auth endpoints handle their own errors — skip global toast for them
    const isAuthEndpoint = ["/auth/login", "/auth/signup", "/auth/verify-otp",
      "/auth/forgot-password", "/auth/reset-password", "/auth/guest-login",
      "/system/config"
    ].some((path) => url.includes(path));

    // Skip toast for handled auth errors (400, 401, 403)
    if (isAuthEndpoint && [400, 401, 403].includes(status)) {
      return Promise.reject(error);
    }

    if (status === 429) {
      message = "Mindmetrics AI is currently receiving many whispers. Please give the sanctuary a moment to breathe and try again.";
    } else if (message.toLowerCase().includes("quota") || message.toLowerCase().includes("exhausted")) {
      message = "Our shared AI resource has reached its current limit. You can add your own API key in Settings to continue without interruption!";
    }

    // Show global toast only for non-auth errors
    toast.error(message, {
      id: "global-error-toast",
      duration: 4000
    });

    return Promise.reject(error);
  }
);

export default api;
