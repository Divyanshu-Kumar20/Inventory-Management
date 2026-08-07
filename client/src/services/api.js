// API Client for connecting React Frontend to Live Vercel Backend API

const BASE_URL = import.meta.env.VITE_API_URL || 'https://inventory-management-backend-8g0j7m3w8-divyanshu-s-project20.vercel.app/api';

const getHeaders = () => {
  const user = JSON.parse(localStorage.getItem('inventra_user') || '{}');
  const token = user.token || localStorage.getItem('inventra_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const api = {
  // Auth API
  register: async (payload) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  getProfile: async () => {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // Products API
  getProducts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/products?${query}`, {
      headers: getHeaders()
    });
    return res.json();
  },

  createProduct: async (productData) => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  // Orders API
  getOrders: async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: getHeaders()
    });
    return res.json();
  },

  createOrder: async (orderData) => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  // Dashboard & Reports API
  getDashboardSummary: async () => {
    const res = await fetch(`${BASE_URL}/dashboard/summary`, {
      headers: getHeaders()
    });
    return res.json();
  }
};
