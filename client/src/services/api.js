import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("google_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // console.log("Auth header set:", config.headers.Authorization.substring(0, 20) + "...");
  } else {
    console.log("No token found in localStorage");
  }
  return config;
});

export default api;
