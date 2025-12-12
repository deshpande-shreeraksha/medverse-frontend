 
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";
const api = axios.create({ baseURL: `${API_BASE}/api` });

api.interceptors.request.use((config) => {
  // Support token stored in either `authToken` (used by AuthContext) or legacy `token`
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken") || localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor to surface auth errors more clearly
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Clear stored auth and mark session expired so UI can show message
      try {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('authUser');
      } catch (e) {
        console.error('Error clearing auth storage', e);
      }
      // set a flag so components can read and show a message if needed
      try { localStorage.setItem('authExpired', '1'); } catch {}
      console.warn('API 401 Unauthorized:', err?.response?.data || err.message);
      // Redirect to login to force re-authentication
      if (typeof window !== 'undefined') {
        // small delay to allow any in-flight handlers to run
        setTimeout(() => { window.location.href = '/login'; }, 200);
      }
    }
    return Promise.reject(err);
  }
);

// Helper to build full API URLs for fetch calls
export const getApiUrl = (endpoint) => `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

export default api;

// Admin API helpers
export const adminListUsers = (params = {}) => api.get(`/admin/users`, { params });
export const adminGetUser = (id) => api.get(`/admin/users/${id}`);
export const adminUpdateUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const adminDeleteUser = (id) => api.delete(`/admin/users/${id}`);
// Admin appointments
export const adminListAppointments = (params = {}) => api.get(`/admin/appointments`, { params });
export const adminCancelAppointment = (id) => api.patch(`/admin/appointments/${id}/cancel`);
export const adminRescheduleAppointment = (id, data) => api.patch(`/admin/appointments/${id}/reschedule`, data);
export const adminExportAppointments = (params = {}) => api.get(`/admin/appointments/export`, { params, responseType: 'blob' });
export const adminListAudits = (params = {}) => api.get(`/admin/audits`, { params });
