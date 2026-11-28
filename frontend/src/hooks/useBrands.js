import { useState, useEffect } from 'react';
import { brandsApi } from '../services/api';
import { fallbackBrands } from '../data/fallbackCatalog';

export function useBrands() {
  const [brands, setBrands] = useState(fallbackBrands);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await brandsApi.getAll();
      const data = res.data;
      const list = Array.isArray(data) ? data : data.data || [];
      if (list.length > 0) {
        setBrands(list);
      } else {
        setBrands(fallbackBrands);
      }
    } catch (err) {
      console.warn('Brands API error, using local fallback:', err.message);
      setBrands(fallbackBrands);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return { brands, loading, error, refetch: fetchBrands };
}
