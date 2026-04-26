import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pi_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const fetchPizzas = () => api.get('/pizzas');
export const togglePizzaStock = (id) => api.put(`/pizzas/${id}/stock`);
export const fetchOrders = () => api.get('/orders');
export const updateOrderStatus = (orderId, status) => api.put(`/orders/${orderId}/status`, { status });
