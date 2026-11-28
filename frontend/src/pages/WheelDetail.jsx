import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, ExternalLink, AlertCircle, ShoppingBag, ShoppingCart, ShieldCheck, Check, LogIn, WifiOff } from 'lucide-react';
import { productsApi } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import ProductCard from '../components/ProductCard';
import OrderModal from '../components/OrderModal';
import AuthModal from '../components/AuthModal';
import { DetailSkeleton, ProductCardSkeleton } from '../components/LoadingSkeleton';
import { formatPrice } from '../utils/helpers';
import { fallbackProducts } from '../data/fallbackCatalog';

export default function WheelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { addToCart, isInCart } = useCart();
  const { isLoggedIn } = useAuth();
  const isOnline = useOnlineStatus();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);

  const fav = product ? isFavorite(product.id) : false;
  const inCart = product ? isInCart(product.id) : false;

  useEffect(() => {
    setImgError(false);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await productsApi.getById(id);
        const data = res.data;
        const prod = data.data || data;
        setProduct(prod);
        setCurrentStock(prod.stock ?? 4);

        // Fetch related by brand
        if (prod.brand_id || prod.brand?.id) {
          const brandId = prod.brand_id || prod.brand.id;
          const relRes = await productsApi.getByBrand(brandId);
          const relData = relRes.data;
          const relArr = Array.isArray(relData) ? relData : relData.data || [];
          setRelated(relArr.filter((p) => p.id !== prod.id).slice(0, 4));
        }
      } catch (err) {
        console.warn('API error on detail, using fallback:', err.message);
        const fallback = fallbackProducts.find((p) => String(p.id) === String(id));
        if (fallback) {
          setProduct(fallback);
          setCurrentStock(fallback.stock ?? 4);
          const rel = fallbackProducts.filter(
            (p) => p.brand_id === fallback.brand_id && p.id !== fallback.id
          );
          setRelated(rel.slice(0, 4));
          setError(null);
        } else {
          setError(err.message || 'Failed to load product');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleFavToggle = () => {
    if (!product) return;
    if (fav) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const handleAddToCart = () => {
    if (!product || (currentStock ?? product.stock ?? 0) <= 0) return;
    addToCart(product, 1);
  };

  const handleOrderClick = () => {
    if (!isOnline) return;
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsOrderModalOpen(true);
  };

  const specValue = (val) => {
    if (val === null || val === undefined || val === '') return 'Informasi belum tersedia';
    return val;
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 flex flex-col items-center gap-4 text-center">
        <AlertCircle size={40} className="text-vg-gray" />
        <p className="text-vg-gray text-sm">{error}</p>
        <button onClick={() => navigate(-1)} className="btn-outline text-sm">
          Go Back
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <DetailSkeleton />
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const rawSpecs = product.product_specifications || product.specifications;
  const specs = Array.isArray(rawSpecs) ? rawSpecs : [];

  const uniqueSpecValues = (key, suffix = '') => {
    const vals = specs
      .map((s) => s?.[key])
      .filter((v) => v !== null && v !== undefined && v !== '')
      .map((v) => `${v}${suffix}`);
    const unique = [...new Set(vals)];
    return unique.length > 0 ? unique.join(', ') : null;
  };

  const aggregatedSpecs = [
    { label: 'Diameter', value: uniqueSpecValues('diameter', '"') },
    { label: 'Width', value: uniqueSpecValues('width', '"') },
    { label: 'PCD', value: uniqueSpecValues('pcd') },
    { label: 'Offset', value: uniqueSpecValues('offset_range') },
    { label: 'Finish', value: uniqueSpecValues('finish') },
    { label: 'Weight', value: uniqueSpecValues('weight_kg', ' kg') },
    { label: 'Load Rating', value: uniqueSpecValues('load_rating', ' kg') },
  ].filter((row) => row.value !== null);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-vg-gray hover:text-vg-white text-xs sm:text-sm uppercase tracking-widest mb-6 md:mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-12 md:mb-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative aspect-square bg-vg-dark border border-vg-border overflow-hidden flex items-center justify-center p-4 sm:p-6"
        >
          {product.image_url && !imgError ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-vg-gray">
              <div className="w-24 h-24 rounded-full border border-vg-border flex items-center justify-center">
                <span className="text-3xl font-black text-vg-border">VG</span>
              </div>
              <p className="text-xs uppercase tracking-widest">Image unavailable</p>
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="flex flex-col gap-5 md:gap-6 min-w-0"
        >
          <div>
            <p className="text-vg-gray text-xs uppercase tracking-[0.3em] mb-1">
              {product.brand?.name || product.brand_name || 'Unknown Brand'}
            </p>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-vg-white leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.construction_type && (
              <span className="text-xs border border-vg-border text-vg-gray px-3 py-1 uppercase tracking-widest">
                {product.construction_type}
              </span>
            )}
            {product.material && (
              <span className="text-xs border border-vg-border text-vg-gray px-3 py-1 uppercase tracking-widest">
                {product.material}
              </span>
            )}
            {product.category && (
              <span className="text-xs border border-vg-border text-vg-gray px-3 py-1 uppercase tracking-widest">
                {product.category}
              </span>
            )}
            {product.is_featured && (
              <span className="text-xs bg-vg-white text-vg-black px-3 py-1 font-bold uppercase tracking-widest">
                Featured
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-vg-gray text-sm leading-relaxed">{product.description}</p>
          )}

          {/* Specifications */}
          {aggregatedSpecs.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-vg-accent mb-3">
                Specifications
              </h3>
              <div className="border border-vg-border divide-y divide-vg-border">
                {aggregatedSpecs.map((row) => (
                  <div key={row.label} className="grid grid-cols-2 text-sm">
                    <div className="px-4 py-2.5 text-vg-gray text-xs uppercase tracking-wider">
                      {row.label}
                    </div>
                    <div className="px-4 py-2.5 text-vg-white text-xs font-medium">
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
              {specs.length > 1 && (
                <div className="mt-3">
                  <p className="text-[10px] uppercase tracking-widest text-vg-gray mb-2">
                    Available Fitments
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {specs.map((spec, idx) => (
                      <span
                        key={spec.id || idx}
                        className="text-[11px] bg-vg-dark border border-vg-border text-vg-gray px-2.5 py-1 rounded"
                      >
                        {spec.diameter ? `${spec.diameter}"` : ''}
                        {spec.width ? ` × ${spec.width}"` : ''}
                        {spec.pcd ? ` · ${spec.pcd}` : ''}
                        {spec.offset_range ? ` · ${spec.offset_range}` : ''}
                        {spec.finish ? ` · ${spec.finish}` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Price & Stock Section */}
          <div className="border border-vg-border p-5 bg-vg-dark/40 rounded">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-vg-gray text-[10px] uppercase tracking-widest mb-1">Harga Resmi Distributor</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl font-black text-vg-white tracking-tight">
                    {formatPrice(product.price || 45000000)}
                  </span>
                  <span className="text-xs text-vg-gray">/ 1 set (4 pcs)</span>
                </div>
              </div>

              {/* Stock Indicator Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded border ${
                    (currentStock ?? product.stock ?? 4) <= 2
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse bg-current" />
                  {(currentStock ?? product.stock ?? 4) <= 0
                    ? 'Stok Habis'
                    : `Sisa ${(currentStock ?? product.stock ?? 4)} Set Siap Kirim`}
                </span>
              </div>
            </div>

            {/* Buy / Order Button */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={(currentStock ?? product.stock ?? 4) <= 0}
                className={`flex items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  inCart
                    ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                    : 'border-vg-border text-vg-gray hover:border-vg-white hover:text-vg-white'
                }`}
              >
                {inCart ? <Check size={16} /> : <ShoppingCart size={16} />}
                {inCart ? 'Di Keranjang' : 'Keranjang'}
              </button>

              {/* Pesan / Beli */}
              <button
                onClick={handleOrderClick}
                disabled={!isOnline || (currentStock ?? product.stock ?? 4) <= 0}
                className="flex-1 btn-primary py-3 px-4 text-xs tracking-widest font-black uppercase flex items-center justify-center gap-2 shadow-lg hover:shadow-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {!isOnline ? <WifiOff size={18} /> : <ShoppingBag size={18} />}
                {!isOnline
                  ? 'OFFLINE — TIDAK BISA MEMBELI'
                  : !isLoggedIn
                  ? 'LOGIN UNTUK MEMESAN'
                  : (currentStock ?? product.stock ?? 4) <= 0
                  ? 'STOK SAAT INI HABIS'
                  : 'PESAN / BELI SEKARANG'}
              </button>
            </div>

            {!isOnline && (
              <div className="flex items-center justify-center gap-2 p-2.5 mb-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded text-center">
                <WifiOff size={14} className="shrink-0" />
                <span>Anda sedang offline, tidak bisa melakukan pembelian saat ini.</span>
              </div>
            )}

            {isOnline && !isLoggedIn && (
              <p className="text-center text-[11px] text-vg-gray mb-2">
                <span className="text-amber-400">⚠</span> Kamu perlu{' '}
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-vg-white underline"
                >
                  login
                </button>{' '}
                terlebih dahulu untuk memesan.
              </p>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-vg-gray">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Garansi 100% Produk Original & Konsultasi Fitment Gratis</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <button
              onClick={handleFavToggle}
              className={`flex items-center gap-2 btn-outline text-xs sm:text-sm px-4 py-3 flex-1 justify-center ${fav ? 'border-vg-white text-vg-white' : ''}`}
            >
              <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
              {fav ? 'Saved in Wishlist' : 'Add to Wishlist'}
            </button>
            {product.manufacturer_source_url && (
              <a
                href={product.manufacturer_source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-xs sm:text-sm px-4 py-3 flex items-center justify-center gap-2"
              >
                <ExternalLink size={16} /> Website Resmi
              </a>
            )}
          </div>
        </motion.div>
      </div>

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        product={{ ...product, stock: currentStock ?? product.stock ?? 4 }}
        onClose={() => setIsOrderModalOpen(false)}
        onOrderSuccess={(prodId, orderedQty) => {
          setCurrentStock((prev) => Math.max(0, (prev ?? 4) - orderedQty));
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab="login"
      />

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <div className="border-t border-vg-border pt-10 mb-8">
            <p className="text-vg-gray text-xs uppercase tracking-[0.3em] mb-2">Same Brand</p>
            <h2 className="section-title">Related Wheels</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
