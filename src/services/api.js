import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pi_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const googleLoginUser = (data) => api.post('/auth/google', data);

// Pizzas
export const fetchPizzas = () => api.get('/pizzas');
export const togglePizzaStock = (id) => api.put(`/pizzas/${id}/stock`);

// Cart
export const fetchCart = () => api.get('/cart');
export const saveCart = (cart) => api.put('/cart', { cart });

// Orders
export const createOrder = (data) => api.post('/orders', data);
export const fetchOrders = () => api.get('/orders');
export const updateOrderStatus = (orderId, status) => api.put(`/orders/${orderId}/status`, { status });

