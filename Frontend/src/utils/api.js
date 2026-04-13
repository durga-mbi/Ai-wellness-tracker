import axios from "axios";

export const API_BASE_URL = "https://ai-wellness-tracker.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending/receiving cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the Bearer token if it exists (Dual-Auth)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
