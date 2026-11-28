import { useState, useEffect } from 'react';
import { productsApi } from '../services/api';
import { fallbackProducts } from '../data/fallbackCatalog';

function filterFallbackProducts(products, params) {
  let result = [...products];
  if (params.featured === true || params.featured === 'true') {
    result = result.filter((p) => p.is_featured);
  }
  if (params.brand) {
    result = result.filter(
      (p) =>
        p.brand?.slug === params.brand ||
        String(p.brand_id) === String(params.brand) ||
        p.brand?.name?.toLowerCase() === params.brand.toLowerCase()
    );
  }
  if (params.category) {
    result = result.filter(
      (p) => p.category && p.category.toLowerCase() === params.category.toLowerCase()
    );
  }
  if (params.q) {
    const term = params.q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.model.toLowerCase().includes(term) ||
        (p.brand?.name && p.brand.name.toLowerCase().includes(term))
    );
  }
  return result;
}

export function useProducts(params = {}) {
  const [products, setProducts] = useState(() => filterFallbackProducts(fallbackProducts, params));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await productsApi.getAll(params);
      const data = res.data;
      const list = Array.isArray(data) ? data : data.data || [];
      if (list.length > 0) {
        setProducts(list);
      } else {
        setProducts(filterFallbackProducts(fallbackProducts, params));
      }
    } catch (err) {
      console.warn('API error, using local fallback:', err.message);
      setProducts(filterFallbackProducts(fallbackProducts, params));
      setError(null); // Clear error so UI renders cleanly!
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(params)]);

  return { products, loading, error, refetch: fetchProducts };
}
