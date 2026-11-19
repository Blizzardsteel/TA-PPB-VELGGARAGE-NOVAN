import { useState, useEffect } from 'react';
import { brandsApi } from '../services/api';

export function useBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await brandsApi.getAll();
      const data = res.data;
      setBrands(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load brands');
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return { brands, loading, error, refetch: fetchBrands };
}
