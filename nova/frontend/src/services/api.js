// frontend/src/services/api.js
import axios from "axios";

const BASE = "http://localhost:4000/api"; // tu backend

const apiClient = axios.create({
  baseURL: BASE,
});

// attach token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default apiClient;

// Specific helpers
export const getProductDetail = (id) => apiClient.get(`/warehouse/products/${id}`).then(r => r.data);
export const addBatch = (data) => apiClient.post(`/warehouse/batches`, data).then(r => r.data);
export const createPurchase = (data) => apiClient.post(`/warehouse/purchases`, data).then(r => r.data);
export const adjustStock = (data) => apiClient.post(`/warehouse/stock/adjust`, data).then(r => r.data);
export const getAlerts = () => apiClient.get(`/warehouse/alerts`).then(r => r.data);
export const resolveAlert = (id) => apiClient.post(`/warehouse/alerts/${id}/resolve`).then(r => r.data);
