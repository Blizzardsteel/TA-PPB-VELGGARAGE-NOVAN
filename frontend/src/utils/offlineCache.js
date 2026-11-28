const CACHE_PREFIX = 'vg_api_cache:';

function normalizeParams(params = {}) {
  const entries = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .sort(([a], [b]) => a.localeCompare(b));
  if (entries.length === 0) return '';
  return '?' + new URLSearchParams(entries).toString();
}

export function buildCacheKey(url, params) {
  return `${CACHE_PREFIX}${url}${normalizeParams(params)}`;
}

export function getCachedResponse(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.data ?? null;
  } catch {
    return null;
  }
}

export function setCachedResponse(key, data) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        updatedAt: Date.now(),
      })
    );
  } catch {
    // Ignore storage quota errors
  }
}

export async function invalidateApiCache() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(CACHE_PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // Ignore storage errors
  }

  try {
    if (typeof window !== 'undefined' && 'caches' in window) {
      await window.caches.delete('velggarage-api-cache');
    }
  } catch {
    // Ignore CacheStorage errors
  }
}

function extractList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  return null;
}

function filterList(list, params = {}) {
  let result = [...list];
  if (params.featured === true || params.featured === 'true') {
    result = result.filter((p) => p.is_featured);
  }
  if (params.brand) {
    const b = String(params.brand).toLowerCase();
    result = result.filter(
      (p) =>
        p.brand?.slug?.toLowerCase() === b ||
        String(p.brand_id) === String(params.brand) ||
        p.brand?.name?.toLowerCase() === b
    );
  }
  if (params.category) {
    const cat = String(params.category).toLowerCase();
    result = result.filter((p) => p.category && p.category.toLowerCase() === cat);
  }
  if (params.construction_type) {
    const ct = String(params.construction_type).toLowerCase();
    result = result.filter(
      (p) => p.construction_type && p.construction_type.toLowerCase() === ct
    );
  }
  if (params.q) {
    const term = String(params.q).toLowerCase();
    result = result.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.model?.toLowerCase().includes(term) ||
        p.brand?.name?.toLowerCase().includes(term)
    );
  }
  if (params.sort === 'name_asc') result.sort((a, b) => a.name.localeCompare(b.name));
  if (params.sort === 'name_desc') result.sort((a, b) => b.name.localeCompare(a.name));
  if (params.sort === 'newest') result.sort((a, b) => b.id - a.id);
  if (params.sort === 'featured') {
    result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }
  return result;
}

export function getOfflineProducts(params = {}) {
  const exactKey = buildCacheKey('/api/products', params);
  const exact = getCachedResponse(exactKey);
  if (exact) return exact;

  const allCached = getCachedResponse(buildCacheKey('/api/products'));
  const list = extractList(allCached);
  if (!list) return null;

  return filterList(list, params);
}

export function getOfflineProductById(id) {
  const exact = getCachedResponse(buildCacheKey(`/api/products/${id}`));
  if (exact) return exact;

  const allCached = getCachedResponse(buildCacheKey('/api/products'));
  const list = extractList(allCached);
  if (!list) return null;

  return list.find((p) => String(p.id) === String(id)) || null;
}

export function getOfflineBrandById(id) {
  const exact = getCachedResponse(buildCacheKey(`/api/brands/${id}`));
  if (exact) return exact;

  const allBrands = extractList(getCachedResponse(buildCacheKey('/api/brands')));
  if (!allBrands) return null;

  const brand = allBrands.find((b) => String(b.id) === String(id));
  if (!brand) return null;

  const allProducts = extractList(getCachedResponse(buildCacheKey('/api/products'))) || [];
  const brandProducts = allProducts.filter((p) => String(p.brand_id) === String(brand.id));
  return { ...brand, products: brandProducts };
}
