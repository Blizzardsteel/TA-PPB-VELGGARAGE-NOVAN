import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import { productsApi, brandsApi, categoriesApi } from '../services/api';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function Wheels() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const [filters, setFilters] = useState({
    brand: searchParams.get('brand') || '',
    category: searchParams.get('category') || '',
    construction_type: searchParams.get('construction_type') || '',
    sort: searchParams.get('sort') || '',
  });

  const fetchProducts = useCallback(async (currentFilters, q) => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      if (currentFilters.brand) params.brand = currentFilters.brand;
      if (currentFilters.category) params.category = currentFilters.category;
      if (currentFilters.construction_type) params.construction_type = currentFilters.construction_type;
      if (currentFilters.sort) params.sort = currentFilters.sort;
      if (q) params.q = q;

      const res = await productsApi.getAll(params);
      const data = res.data;
      setProducts(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters, searchQuery);
  }, [filters, searchQuery, fetchProducts]);

  useEffect(() => {
    brandsApi.getAll().then((r) => {
      const d = r.data;
      setBrands(Array.isArray(d) ? d : d.data || []);
    }).catch(() => {});

    categoriesApi.getAll().then((r) => {
      const d = r.data;
      setCategories(Array.isArray(d) ? d : d.data || []);
    }).catch(() => {});
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const params = {};
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params[k] = v; });
    if (searchQuery) params.q = searchQuery;
    setSearchParams(params);
  };

  const handleSearch = (q) => {
    setSearchQuery(q);
    const params = {};
    Object.entries(filters).forEach(([k, v]) => { if (v) params[k] = v; });
    if (q) params.q = q;
    setSearchParams(params);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-vg-gray text-xs uppercase tracking-[0.3em] mb-2">Catalog</p>
        <h1 className="section-title">Wheels</h1>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex gap-3 mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Search wheels, brands, models..."
        />
        <button
          onClick={() => setFilterOpen(true)}
          className="md:hidden flex items-center gap-2 btn-outline text-sm relative"
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-vg-white text-vg-black text-[9px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Filter Sidebar */}
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          brands={brands}
          categories={categories}
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
        />

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {/* Results count */}
          {!loading && !error && (
            <p className="text-vg-gray text-xs uppercase tracking-widest mb-6">
              {products.length} {products.length === 1 ? 'result' : 'results'}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          )}

          {error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <AlertCircle size={40} className="text-vg-gray" />
              <p className="text-vg-gray text-sm max-w-sm">{error}</p>
              <p className="text-vg-gray text-xs uppercase tracking-widest">Backend may not be running</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {loading ? (
                <LoadingSkeleton type="product" count={8} />
              ) : products.length > 0 ? (
                products.map((p) => <ProductCard key={p.id} product={p} />)
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full border border-vg-border flex items-center justify-center">
                    <span className="text-vg-gray text-2xl">∅</span>
                  </div>
                  <p className="text-vg-white font-semibold uppercase tracking-widest text-sm">No Results Found</p>
                  <p className="text-vg-gray text-xs max-w-xs">
                    Try adjusting your filters or search term.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
