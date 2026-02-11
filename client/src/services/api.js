import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("google_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // console.log("✓ Auth header set with token");
  } else {
    console.warn("✗ No token found in localStorage - user may not be logged in");
  }
  return config;
});

export default api;
