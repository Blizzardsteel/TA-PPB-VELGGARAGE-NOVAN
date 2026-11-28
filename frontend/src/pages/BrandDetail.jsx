import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, AlertCircle } from 'lucide-react';
import { brandsApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/LoadingSkeleton';
import { fallbackBrands, fallbackProducts } from '../data/fallbackCatalog';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export default function BrandDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await brandsApi.getById(id);
        const data = res.data;
        setBrand(data.data || data);
      } catch (err) {
        console.warn('Brand detail API error, using fallback:', err.message);
        const fbBrand = fallbackBrands.find((b) => String(b.id) === String(id));
        if (fbBrand) {
          const prods = fallbackProducts.filter((p) => p.brand_id === fbBrand.id);
          setBrand({ ...fbBrand, products: prods });
          setError(null);
        } else {
          setError(err.message || 'Failed to load brand');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBrand();
  }, [id]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 flex flex-col items-center gap-4 text-center">
        <AlertCircle size={40} className="text-vg-gray" />
        <p className="text-vg-gray text-sm">{error}</p>
        <button onClick={() => navigate(-1)} className="btn-outline text-sm">Go Back</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-vg-border rounded w-1/4" />
          <div className="h-5 bg-vg-border rounded w-1/3" />
          <div className="h-4 bg-vg-border rounded w-2/3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!brand) return null;

  const products = brand.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-vg-gray hover:text-vg-white text-sm uppercase tracking-widest mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> All Brands
      </button>

      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 pb-10 border-b border-vg-border"
      >
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-vg-dark border border-vg-border rounded flex items-center justify-center shrink-0 p-3 overflow-hidden">
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-vg-white font-black text-2xl">{brand.name?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-4xl font-black uppercase tracking-tight text-vg-white">{brand.name}</h1>
              {brand.country && (
                <span className="text-xs border border-vg-border text-vg-gray px-3 py-1 uppercase tracking-widest">
                  {brand.country}
                </span>
              )}
              {brand.founded_year && (
                <span className="text-xs text-vg-gray uppercase tracking-widest">
                  Est. {brand.founded_year}
                </span>
              )}
            </div>
            {brand.description && (
              <p className="text-vg-gray text-sm leading-relaxed max-w-2xl mb-4">{brand.description}</p>
            )}
            {brand.website_url && (
              <a
                href={brand.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-vg-gray hover:text-vg-white text-xs uppercase tracking-widest transition-colors"
              >
                <Globe size={14} /> {brand.website_url}
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Products */}
      <div>
        <div className="mb-6">
          <p className="text-vg-gray text-xs uppercase tracking-[0.3em] mb-1">Collection</p>
          <h2 className="section-title">{brand.name} Wheels</h2>
          <p className="text-vg-gray text-sm mt-1">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>

        {products.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center border border-vg-border">
            <p className="text-vg-gray text-sm uppercase tracking-widest">No products found for this brand</p>
          </div>
        )}
      </div>
    </div>
  );
}
