import { supabase } from '../config/database.js';
import { mockBrands, mockProducts, mockSpecs } from '../config/mockData.js';

// ─── helpers for mock mode ───────────────────────────────────────────────────
function attachBrandAndSpecs(products) {
  return products.map((p) => {
    const brand = mockBrands.find((b) => b.id === p.brand_id) || null;
    const specifications = mockSpecs.filter((s) => s.product_id === p.id);
    return {
      ...p,
      brand: brand ? { id: brand.id, name: brand.name, slug: brand.slug } : null,
      specifications,
    };
  });
}

function applyFilters(products, { brand, category, diameter, q, sort, featured }) {
  let result = [...products];

  if (featured === true || featured === 'true') {
    result = result.filter((p) => p.is_featured);
  }

  if (brand) {
    const b = mockBrands.find(
      (mb) => mb.slug === brand || String(mb.id) === String(brand)
    );
    if (b) result = result.filter((p) => p.brand_id === b.id);
    else result = [];
  }

  if (category) {
    result = result.filter(
      (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (diameter) {
    const d = parseFloat(diameter);
    const matchingProductIds = new Set(
      mockSpecs.filter((s) => s.diameter === d).map((s) => s.product_id)
    );
    result = result.filter((p) => matchingProductIds.has(p.id));
  }

  if (q) {
    const term = q.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.model && p.model.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term))
    );
  }

  if (sort === 'name_asc')  result.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'name_desc') result.sort((a, b) => b.name.localeCompare(a.name));
  if (sort === 'newest')    result.sort((a, b) => b.id - a.id);
  if (sort === 'featured')  result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));

  return result;
}

// ─── service ─────────────────────────────────────────────────────────────────
export const productService = {
  async getAll(filters = {}) {
    if (supabase) {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            brand:brands(id, name, slug),
            specifications:product_specifications(*)
          `);

        if (filters.brand) {
          const isNumeric = /^\d+$/.test(filters.brand);
          if (isNumeric) {
            query = query.eq('brand_id', filters.brand);
          } else {
            const { data: brandRow } = await supabase
              .from('brands')
              .select('id')
              .eq('slug', filters.brand)
              .single();
            if (brandRow) query = query.eq('brand_id', brandRow.id);
            else return [];
          }
        }

        if (filters.category) {
          query = query.ilike('category', filters.category);
        }

        if (filters.featured === true || filters.featured === 'true') {
          query = query.eq('is_featured', true);
        }

        if (filters.q) {
          query = query.or(
            `name.ilike.%${filters.q}%,model.ilike.%${filters.q}%,category.ilike.%${filters.q}%`
          );
        }

        if (filters.sort === 'name_asc')  query = query.order('name', { ascending: true });
        else if (filters.sort === 'name_desc') query = query.order('name', { ascending: false });
        else if (filters.sort === 'newest') query = query.order('id', { ascending: false });
        else query = query.order('id');

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          if (filters.diameter) {
            const d = parseFloat(filters.diameter);
            return data.filter((p) =>
              p.specifications && p.specifications.some((s) => Number(s.diameter) === d)
            );
          }
          return data;
        }
        if (error) console.warn('[Supabase getAll error, using mock fallback]:', error.message);
      } catch (err) {
        console.warn('[Supabase connection failed, using mock fallback]:', err.message);
      }
    }

    // Fallback to mock
    const filtered = applyFilters(mockProducts, filters);
    return attachBrandAndSpecs(filtered);
  },

  async search(q) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            brand:brands(id, name, slug),
            specifications:product_specifications(*)
          `)
          .or(`name.ilike.%${q}%,model.ilike.%${q}%,category.ilike.%${q}%`)
          .order('name');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[Supabase search error, using mock fallback]:', err.message);
      }
    }

    const term = (q || '').toLowerCase();
    const matched = mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.model && p.model.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term))
    );
    return attachBrandAndSpecs(matched);
  },

  async getByBrandId(brandId) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            brand:brands(id, name, slug),
            specifications:product_specifications(*)
          `)
          .eq('brand_id', brandId)
          .order('name');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[Supabase getByBrandId error, using mock fallback]:', err.message);
      }
    }

    const products = mockProducts.filter((p) => p.brand_id === Number(brandId));
    return attachBrandAndSpecs(products);
  },

  async getByCategory(category) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            brand:brands(id, name, slug),
            specifications:product_specifications(*)
          `)
          .ilike('category', category)
          .order('name');
        if (!error && data && data.length > 0) return data;
      } catch (err) {
        console.warn('[Supabase getByCategory error, using mock fallback]:', err.message);
      }
    }

    const products = mockProducts.filter(
      (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
    );
    return attachBrandAndSpecs(products);
  },

  async getById(id) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            brand:brands(id, name, slug),
            specifications:product_specifications(*)
          `)
          .eq('id', id)
          .single();
        if (!error && data) return data;
        if (error) console.warn('[Supabase getById error, using mock fallback]:', error.message);
      } catch (err) {
        console.warn('[Supabase getById error, using mock fallback]:', err.message);
      }
    }

    const product = mockProducts.find((p) => p.id === Number(id));
    if (!product) return null;
    const brand = mockBrands.find((b) => b.id === product.brand_id);
    const specifications = mockSpecs.filter((s) => s.product_id === product.id);
    return {
      ...product,
      brand: brand ? { id: brand.id, name: brand.name, slug: brand.slug } : null,
      specifications,
    };
  },

  async getCategories() {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('category')
          .not('category', 'is', null);
        if (!error && data && data.length > 0) {
          const cats = [...new Set(data.map((r) => r.category))].sort();
          return cats;
        }
      } catch (err) {
        console.warn('[Supabase getCategories error, using mock fallback]:', err.message);
      }
    }

    const cats = [...new Set(mockProducts.map((p) => p.category).filter(Boolean))].sort();
    return cats;
  },
};
