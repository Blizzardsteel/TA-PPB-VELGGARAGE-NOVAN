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

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeSpecs(specs, productId) {
  if (!Array.isArray(specs)) return [];
  return specs
    .filter((s) => s && (s.diameter || s.width || s.pcd || s.offset_range || s.finish || s.weight_kg || s.load_rating))
    .map((s) => ({
      product_id: productId,
      diameter: s.diameter !== '' && s.diameter !== null && s.diameter !== undefined ? Number(s.diameter) : null,
      width: s.width !== '' && s.width !== null && s.width !== undefined ? Number(s.width) : null,
      pcd: s.pcd || null,
      offset_range: s.offset_range || null,
      finish: s.finish || null,
      weight_kg: s.weight_kg !== '' && s.weight_kg !== null && s.weight_kg !== undefined ? Number(s.weight_kg) : null,
      load_rating: s.load_rating !== '' && s.load_rating !== null && s.load_rating !== undefined ? Number(s.load_rating) : null,
    }));
}

function applyFilters(products, { brand, category, construction_type, diameter, q, sort, featured }) {
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

  if (construction_type) {
    result = result.filter(
      (p) => p.construction_type && p.construction_type.toLowerCase() === construction_type.toLowerCase()
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

        if (filters.construction_type) {
          query = query.ilike('construction_type', filters.construction_type);
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

  async create(payload) {
    const baseSlug = slugify(payload.slug || payload.name) || `wheel-${Date.now()}`;
    const row = {
      brand_id: payload.brand_id ? Number(payload.brand_id) : null,
      name: String(payload.name).trim(),
      slug: `${baseSlug}-${Date.now().toString().slice(-4)}`,
      model: payload.model ? String(payload.model).trim() : String(payload.name).trim(),
      category: payload.category || 'Sport',
      construction_type: payload.construction_type || 'Forged',
      material: payload.material || null,
      description: payload.description || null,
      price: payload.price !== undefined && payload.price !== '' ? Number(payload.price) : 45000000,
      stock: payload.stock !== undefined && payload.stock !== '' ? Number(payload.stock) : 5,
      image_url: payload.image_url || null,
      manufacturer_source_url: payload.manufacturer_source_url || null,
      is_featured: Boolean(payload.is_featured),
    };

    if (supabase) {
      let { data: created, error } = await supabase
        .from('products')
        .insert(row)
        .select()
        .single();

      // Retry once with explicit next id if serial sequence is out of sync
      if (error && error.code === '23505' && String(error.message).includes('_pkey')) {
        const { data: maxRow } = await supabase
          .from('products')
          .select('id')
          .order('id', { ascending: false })
          .limit(1)
          .single();
        const nextDbId = (maxRow?.id || 0) + 1;
        ({ data: created, error } = await supabase
          .from('products')
          .insert({ id: nextDbId, ...row })
          .select()
          .single());
      }

      if (!error && created) {
        const specsToInsert = normalizeSpecs(payload.specifications, created.id);
        if (specsToInsert.length > 0) {
          const { error: specError } = await supabase
            .from('product_specifications')
            .insert(specsToInsert);
          if (specError) console.warn('[Supabase spec insert error]:', specError.message);
        }
        return await this.getById(created.id);
      }
      if (error) {
        const isNetworkError = String(error.message || '').toLowerCase().includes('fetch failed');
        if (!isNetworkError) {
          throw new Error(`Supabase product insert failed: ${error.message}`);
        }
        console.warn('[Supabase product create network error, using mock fallback]:', error.message);
      }
    }

    const nextId = Math.max(0, ...mockProducts.map((p) => Number(p.id) || 0)) + 1;
    const created = {
      id: nextId,
      ...row,
      created_at: new Date().toISOString(),
    };
    mockProducts.push(created);

    const specsToInsert = normalizeSpecs(payload.specifications, nextId);
    let nextSpecId = Math.max(0, ...mockSpecs.map((s) => Number(s.id) || 0)) + 1;
    for (const spec of specsToInsert) {
      mockSpecs.push({ id: nextSpecId++, ...spec });
    }

    return attachBrandAndSpecs([created])[0];
  },

  async update(id, payload) {
    const updates = {};
    if (payload.brand_id !== undefined) updates.brand_id = payload.brand_id ? Number(payload.brand_id) : null;
    if (payload.name !== undefined) {
      updates.name = String(payload.name).trim();
      if (payload.slug !== undefined) updates.slug = slugify(payload.slug);
    }
    if (payload.model !== undefined) updates.model = payload.model || null;
    if (payload.category !== undefined) updates.category = payload.category || null;
    if (payload.construction_type !== undefined) updates.construction_type = payload.construction_type || null;
    if (payload.material !== undefined) updates.material = payload.material || null;
    if (payload.description !== undefined) updates.description = payload.description || null;
    if (payload.price !== undefined && payload.price !== '') updates.price = Number(payload.price);
    if (payload.stock !== undefined && payload.stock !== '') updates.stock = Number(payload.stock);
    if (payload.image_url !== undefined) updates.image_url = payload.image_url || null;
    if (payload.manufacturer_source_url !== undefined) updates.manufacturer_source_url = payload.manufacturer_source_url || null;
    if (payload.is_featured !== undefined) updates.is_featured = Boolean(payload.is_featured);

    if (supabase) {
      try {
        const { data: updated, error } = await supabase
          .from('products')
          .update(updates)
          .eq('id', id)
          .select()
          .single();

        if (!error && updated) {
          if (Array.isArray(payload.specifications)) {
            await supabase.from('product_specifications').delete().eq('product_id', id);
            const specsToInsert = normalizeSpecs(payload.specifications, Number(id));
            if (specsToInsert.length > 0) {
              await supabase.from('product_specifications').insert(specsToInsert);
            }
          }
          return await this.getById(id);
        }
        if (error) console.warn('[Supabase product update error, using mock fallback]:', error.message);
      } catch (err) {
        console.warn('[Supabase product update failed, using mock fallback]:', err.message);
      }
    }

    const idx = mockProducts.findIndex((p) => p.id === Number(id));
    if (idx === -1) return null;
    mockProducts[idx] = { ...mockProducts[idx], ...updates };

    if (Array.isArray(payload.specifications)) {
      for (let i = mockSpecs.length - 1; i >= 0; i--) {
        if (mockSpecs[i].product_id === Number(id)) {
          mockSpecs.splice(i, 1);
        }
      }
      let nextSpecId = Math.max(0, ...mockSpecs.map((s) => Number(s.id) || 0)) + 1;
      for (const spec of normalizeSpecs(payload.specifications, Number(id))) {
        mockSpecs.push({ id: nextSpecId++, ...spec });
      }
    }

    return attachBrandAndSpecs([mockProducts[idx]])[0];
  },

  async remove(id) {
    if (supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) return true;
        console.warn('[Supabase product delete error, using mock fallback]:', error.message);
      } catch (err) {
        console.warn('[Supabase product delete failed, using mock fallback]:', err.message);
      }
    }

    const idx = mockProducts.findIndex((p) => p.id === Number(id));
    if (idx === -1) return false;
    mockProducts.splice(idx, 1);
    for (let i = mockSpecs.length - 1; i >= 0; i--) {
      if (mockSpecs[i].product_id === Number(id)) {
        mockSpecs.splice(i, 1);
      }
    }
    return true;
  },
};
