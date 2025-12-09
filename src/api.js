 
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const api = axios.create({ baseURL: `${API_BASE}/api` });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Helper to build full API URLs for fetch calls
export const getApiUrl = (endpoint) => `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

export default api;
