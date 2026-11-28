import { supabase } from '../config/database.js';
import { mockBrands, mockProducts } from '../config/mockData.js';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

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

  async create(payload) {
    const baseSlug = slugify(payload.slug || payload.name) || `brand-${Date.now()}`;
    const row = {
      name: String(payload.name).trim(),
      slug: baseSlug,
      description: payload.description || null,
      logo_url: payload.logo_url || null,
      website_url: payload.website_url || null,
      country: payload.country || null,
      founded_year: payload.founded_year ? Number(payload.founded_year) : null,
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('brands')
          .insert(row)
          .select()
          .single();
        if (!error && data) return data;
        if (error) {
          console.warn('[Supabase brand create error, using mock fallback]:', error.message);
          throw new Error(error.message);
        }
      } catch (err) {
        console.warn('[Supabase brand create failed, using mock fallback]:', err.message);
      }
    }

    const nextId = Math.max(0, ...mockBrands.map((b) => Number(b.id) || 0)) + 1;
    const uniqueSlug = mockBrands.some((b) => b.slug === baseSlug)
      ? `${baseSlug}-${nextId}`
      : baseSlug;
    const created = {
      id: nextId,
      ...row,
      slug: uniqueSlug,
      created_at: new Date().toISOString(),
    };
    mockBrands.push(created);
    return created;
  },

  async update(id, payload) {
    const updates = {};
    if (payload.name !== undefined) {
      updates.name = String(payload.name).trim();
      updates.slug = slugify(payload.slug || payload.name);
    }
    if (payload.description !== undefined) updates.description = payload.description || null;
    if (payload.logo_url !== undefined) updates.logo_url = payload.logo_url || null;
    if (payload.website_url !== undefined) updates.website_url = payload.website_url || null;
    if (payload.country !== undefined) updates.country = payload.country || null;
    if (payload.founded_year !== undefined) {
      updates.founded_year = payload.founded_year ? Number(payload.founded_year) : null;
    }

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('brands')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
        if (error) console.warn('[Supabase brand update error, using mock fallback]:', error.message);
      } catch (err) {
        console.warn('[Supabase brand update failed, using mock fallback]:', err.message);
      }
    }

    const idx = mockBrands.findIndex((b) => b.id === Number(id));
    if (idx === -1) return null;
    mockBrands[idx] = { ...mockBrands[idx], ...updates };
    return mockBrands[idx];
  },

  async remove(id) {
    if (supabase) {
      try {
        const { error } = await supabase.from('brands').delete().eq('id', id);
        if (!error) return true;
        console.warn('[Supabase brand delete error, using mock fallback]:', error.message);
      } catch (err) {
        console.warn('[Supabase brand delete failed, using mock fallback]:', err.message);
      }
    }

    const idx = mockBrands.findIndex((b) => b.id === Number(id));
    if (idx === -1) return false;
    mockBrands.splice(idx, 1);
    return true;
  },
};
