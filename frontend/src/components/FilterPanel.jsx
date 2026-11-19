import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';

const constructionTypes = [
  { value: '', label: 'All Types' },
  { value: 'monoblock', label: 'Monoblock' },
  { value: 'multi-piece', label: 'Multi-Piece' },
  { value: 'forged', label: 'Forged' },
  { value: 'flow-formed', label: 'Flow Formed' },
  { value: 'cast', label: 'Cast' },
];

const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'name_desc', label: 'Name Z–A' },
  { value: 'newest', label: 'Newest' },
  { value: 'featured', label: 'Featured First' },
];

export default function FilterPanel({ filters, onChange, brands = [], categories = [], isOpen, onClose }) {
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    setLocal(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    const updated = { ...local, [key]: value };
    setLocal(updated);
    onChange(updated);
  };

  const handleReset = () => {
    const reset = { brand: '', category: '', construction_type: '', sort: '' };
    setLocal(reset);
    onChange(reset);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold uppercase tracking-widest text-sm">Filters</h3>
        <div className="flex items-center gap-3">
          <button onClick={handleReset} className="text-vg-gray text-xs uppercase tracking-wider hover:text-vg-white">
            Reset
          </button>
          <button onClick={onClose} className="text-vg-gray hover:text-vg-white">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div>
          <label className="text-xs uppercase tracking-widest text-vg-gray mb-2 block">Brand</label>
          <div className="relative">
            <select
              value={local.brand || ''}
              onChange={(e) => handleChange('brand', e.target.value)}
              className="w-full bg-vg-dark border border-vg-border text-vg-white text-sm px-3 py-2 appearance-none focus:outline-none focus:border-vg-gray"
            >
              <option value="">All Brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-vg-gray pointer-events-none" />
          </div>
        </div>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div>
          <label className="text-xs uppercase tracking-widest text-vg-gray mb-2 block">Category</label>
          <div className="relative">
            <select
              value={local.category || ''}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full bg-vg-dark border border-vg-border text-vg-white text-sm px-3 py-2 appearance-none focus:outline-none focus:border-vg-gray"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-vg-gray pointer-events-none" />
          </div>
        </div>
      )}

      {/* Construction Type */}
      <div>
        <label className="text-xs uppercase tracking-widest text-vg-gray mb-2 block">Construction</label>
        <div className="relative">
          <select
            value={local.construction_type || ''}
            onChange={(e) => handleChange('construction_type', e.target.value)}
            className="w-full bg-vg-dark border border-vg-border text-vg-white text-sm px-3 py-2 appearance-none focus:outline-none focus:border-vg-gray"
          >
            {constructionTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-vg-gray pointer-events-none" />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="text-xs uppercase tracking-widest text-vg-gray mb-2 block">Sort By</label>
        <div className="relative">
          <select
            value={local.sort || ''}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="w-full bg-vg-dark border border-vg-border text-vg-white text-sm px-3 py-2 appearance-none focus:outline-none focus:border-vg-gray"
          >
            {sortOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-vg-gray pointer-events-none" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block w-64 shrink-0">
        <div className="sticky top-20 bg-vg-dark border border-vg-border p-6">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-vg-black/80 z-40 md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-vg-dark z-50 p-6 overflow-y-auto md:hidden"
            >
              <FilterContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
