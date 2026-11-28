import axios from 'axios';
import {
  buildCacheKey,
  getCachedResponse,
  setCachedResponse,
  invalidateApiCache,
  getOfflineProducts,
  getOfflineProductById,
  getOfflineBrandById,
} from '../utils/offlineCache';

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

async function cachedGet(url, config = {}, offlineLookup) {
  const params = config.params;
  const cacheKey = buildCacheKey(url, params);

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    const offlineData = offlineLookup ? offlineLookup() : getCachedResponse(cacheKey);
    if (offlineData !== null && offlineData !== undefined) {
      return { data: offlineData, status: 200, fromCache: true };
    }
  }

  try {
    const res = await api.get(url, config);
    if (res?.data !== undefined) {
      setCachedResponse(cacheKey, res.data);
    }
    return res;
  } catch (err) {
    const offlineData = offlineLookup ? offlineLookup() : getCachedResponse(cacheKey);
    if (offlineData !== null && offlineData !== undefined) {
      return { data: offlineData, status: 200, fromCache: true };
    }
    throw err;
  }
}

async function mutateRequest(method, url, data) {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    throw new Error('Anda sedang offline, tidak bisa menyimpan perubahan ke database.');
  }
  const res = await api.request({ method, url, data });
  invalidateApiCache();
  return res;
}

export const productsApi = {
  getAll: (params) => cachedGet('/api/products', { params }, () => getOfflineProducts(params)),
  getById: (id) => cachedGet(`/api/products/${id}`, {}, () => getOfflineProductById(id)),
  search: (q) => cachedGet('/api/products', { params: { q } }, () => getOfflineProducts({ q })),
  getByBrand: (brandId) =>
    cachedGet(`/api/products/brand/${brandId}`, {}, () => getOfflineProducts({ brand: brandId })),
  getByCategory: (category) =>
    cachedGet(`/api/products/category/${category}`, {}, () => getOfflineProducts({ category })),
  create: (payload) => mutateRequest('post', '/api/products', payload),
  update: (id, payload) => mutateRequest('put', `/api/products/${id}`, payload),
  remove: (id) => mutateRequest('delete', `/api/products/${id}`),
};

export const brandsApi = {
  getAll: () => cachedGet('/api/brands'),
  getById: (id) => cachedGet(`/api/brands/${id}`, {}, () => getOfflineBrandById(id)),
  create: (payload) => mutateRequest('post', '/api/brands', payload),
  update: (id, payload) => mutateRequest('put', `/api/brands/${id}`, payload),
  remove: (id) => mutateRequest('delete', `/api/brands/${id}`),
};

export const categoriesApi = {
  getAll: () => cachedGet('/api/categories'),
};

export default api;
