import { supabase } from '../config/database.js';
import { mockBrands, mockProducts } from '../config/mockData.js';

export const brandService = {
  async getAll() {
    if (!supabase) return mockBrands;
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');
    if (error) throw error;
    return data;
  },

  async getById(id) {
    if (!supabase) {
      const brand = mockBrands.find((b) => b.id === Number(id));
      if (!brand) return null;
      const products = mockProducts.filter((p) => p.brand_id === brand.id);
      return { ...brand, products };
    }
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();
    if (brandError) throw brandError;
    if (!brand) return null;

    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
      .eq('brand_id', id)
      .order('name');
    if (prodError) throw prodError;

    return { ...brand, products: products || [] };
  },
};
