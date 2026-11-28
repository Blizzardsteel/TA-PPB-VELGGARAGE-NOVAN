import { supabase } from '../config/database.js';
import { mockBrands, mockProducts } from '../config/mockData.js';

export const brandService = {
  async getAll() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .order('name');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[Supabase brands getAll error, using mock fallback]:', err.message);
      }
    }
    return mockBrands;
  },

  async getById(id) {
    if (supabase) {
      try {
        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('*')
          .eq('id', id)
          .single();
        if (!brandError && brand) {
          const { data: products } = await supabase
            .from('products')
            .select('*')
            .eq('brand_id', id)
            .order('name');
          return { ...brand, products: products || [] };
        }
      } catch (err) {
        console.warn('[Supabase brands getById error, using mock fallback]:', err.message);
      }
    }

    const brand = mockBrands.find((b) => b.id === Number(id));
    if (!brand) return null;
    const products = mockProducts.filter((p) => p.brand_id === brand.id);
    return { ...brand, products };
  },
};
