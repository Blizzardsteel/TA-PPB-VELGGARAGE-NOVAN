import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = 'API not available. Please check your connection.';
    }
    return Promise.reject(error);
  }
);

export const productsApi = {
  getAll: (params) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  search: (q) => api.get('/api/products', { params: { q } }),
  getByBrand: (brandId) => api.get(`/api/products/brand/${brandId}`),
  getByCategory: (category) => api.get(`/api/products/category/${category}`),
};

export const brandsApi = {
  getAll: () => api.get('/api/brands'),
  getById: (id) => api.get(`/api/brands/${id}`),
};

export const categoriesApi = {
  getAll: () => api.get('/api/categories'),
};

export default api;
