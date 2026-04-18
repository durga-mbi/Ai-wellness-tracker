import axios from "axios";
import toast from "react-hot-toast";

export const API_BASE_URL = "https://ai-wellness-tracker.onrender.com/api";

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
    let message = error.response?.data?.message || "An unexpected error occurred";

    if (status === 429) {
      message = "Mindmetrics AI is currently receiving many whispers. Please give the sanctuary a moment to breathe and try again.";
    } else if (message.toLowerCase().includes("quota") || message.toLowerCase().includes("exhausted")) {
      message = "Our shared AI resource has reached its current limit. You can add your own API key in Settings to continue without interruption!";
    }

    // Specifically handle structured errors from our backend
    toast.error(message, {
      id: "global-error-toast", // Prevent duplicate toasts for the same error
      duration: 4000
    });

    return Promise.reject(error);
  }
);

export default api;
