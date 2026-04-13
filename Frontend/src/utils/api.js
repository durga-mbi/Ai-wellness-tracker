import axios from "axios";

export const API_BASE_URL = "https://ai-wellness-tracker.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending/receiving cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
