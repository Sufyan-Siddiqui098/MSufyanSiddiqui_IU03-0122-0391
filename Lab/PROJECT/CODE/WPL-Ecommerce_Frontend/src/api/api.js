import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Helper function to handle logout without circular dependency
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle unauthorized - logout user
      if (status === 401) {
        handleLogout();
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
      
      // Handle forbidden
      if (status === 403) {
        toast.error(data?.message || 'You do not have permission to perform this action.');
      }
      
      // Handle not found
      if (status === 404) {
        // Don't show generic error for 404, let components handle it
      }
      
      // Handle conflict
      if (status === 409) {
        toast.error(data?.message || 'Resource already exists.');
      }
      
      // Handle bad request
      if (status === 400) {
        toast.error(data?.message || 'Invalid request.');
      }
      
      // Handle server errors
      if (status >= 500) {
        toast.error('Server error. Please try again later.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  updateUser: (data) => api.put('/auth/update-user', data),
  updatePassword: (data) => api.put('/auth/update-password', data),
  getUserById: (userId) => api.get(`/auth/user/${userId}`),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/product/all'),
  getById: (id) => api.get(`/product/${id}`),
  getByCategory: (categoryId) => api.get(`/product/category/${categoryId}`),
  getPhoto: (id) => `${API_BASE_URL}/product/photo/${id}`,
  
  // Seller endpoints
  create: (formData) => api.post('/product/create', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, formData) => api.put(`/product/update/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/product/delete/${id}`),
  getSellerProducts: () => api.get('/product/seller/my-products'),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/category/all'),
  getById: (id) => api.get(`/category/${id}`),
  getPhoto: (id) => `${API_BASE_URL}/category/photo/${id}`,
};

// Cart API (Backend integration)
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity = 1) => api.post('/cart/add', { productId, quantity }),
  updateCartItem: (productId, quantity) => api.put(`/cart/update/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// Order API
export const orderAPI = {
  create: (shippingAddress) => api.post('/order/create', { shippingAddress }),
  getMyOrders: () => api.get('/order/my-orders'),
  getOrderById: (orderId) => api.get(`/order/${orderId}`),
  getSellerOrders: () => api.get('/order/seller/orders'),
  updateStatus: (orderId, status) => api.put(`/order/seller/update-status/${orderId}`, { status }),
};

// Admin API
export const adminAPI = {
  // Categories
  createCategory: (formData) => api.post('/admin/create-category', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateCategory: (id, formData) => api.put(`/admin/update-category/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteCategory: (id) => api.delete(`/admin/delete-category/${id}`),
  
  // Users
  getAllUsers: () => api.get('/admin/get-all-users'),
  updateUser: (userId, data) => api.put(`/admin/update-user/${userId}`, data),
  updateUserPassword: (userId, data) => api.put(`/admin/update-user-passowrd/${userId}`, data),
  deleteUser: (userId) => api.delete(`/admin/delete-user/${userId}`),
  
  // Products
  deleteProduct: (id) => api.delete(`/admin/delete-product/${id}`),
};

export default api;
