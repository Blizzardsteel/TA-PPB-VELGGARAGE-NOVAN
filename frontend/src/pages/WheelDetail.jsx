import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react';
import { productsApi } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import { DetailSkeleton, ProductCardSkeleton } from '../components/LoadingSkeleton';

export default function WheelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  const fav = product ? isFavorite(product.id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await productsApi.getById(id);
        const data = res.data;
        const prod = data.data || data;
        setProduct(prod);

        // Fetch related by brand
        if (prod.brand_id || prod.brand?.id) {
          const brandId = prod.brand_id || prod.brand.id;
          const relRes = await productsApi.getByBrand(brandId);
          const relData = relRes.data;
          const relArr = Array.isArray(relData) ? relData : relData.data || [];
          setRelated(relArr.filter((p) => p.id !== prod.id).slice(0, 4));
        }
      } catch (err) {
        setError(err.message || 'Failed to load product');
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

  const specs = product.product_specifications || product.specifications || [];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-vg-gray hover:text-vg-white text-sm uppercase tracking-widest mb-8 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-square bg-vg-dark border border-vg-border overflow-hidden"
        >
          {product.image_url && !imgError ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
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
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-6"
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
          {specs.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-vg-accent mb-3">
                Specifications
              </h3>
              <div className="border border-vg-border divide-y divide-vg-border">
                {specs.map((spec, i) => (
                  <div key={i} className="grid grid-cols-2 text-sm">
                    {spec.diameter !== undefined && (
                      <>
                        <div className="px-4 py-2.5 text-vg-gray text-xs uppercase tracking-wider">Diameter</div>
                        <div className="px-4 py-2.5 text-vg-white text-xs">{specValue(spec.diameter)}{spec.diameter ? '"' : ''}</div>
                      </>
                    )}
                    {spec.width !== undefined && (
                      <>
                        <div className="px-4 py-2.5 text-vg-gray text-xs uppercase tracking-wider border-t border-vg-border">Width</div>
                        <div className="px-4 py-2.5 text-vg-white text-xs border-t border-vg-border">{specValue(spec.width)}{spec.width ? '"' : ''}</div>
                      </>
                    )}
                    {spec.pcd !== undefined && (
                      <>
                        <div className="px-4 py-2.5 text-vg-gray text-xs uppercase tracking-wider border-t border-vg-border">PCD</div>
                        <div className="px-4 py-2.5 text-vg-white text-xs border-t border-vg-border">{specValue(spec.pcd)}</div>
                      </>
                    )}
                    {spec.offset_range !== undefined && (
                      <>
                        <div className="px-4 py-2.5 text-vg-gray text-xs uppercase tracking-wider border-t border-vg-border">Offset</div>
                        <div className="px-4 py-2.5 text-vg-white text-xs border-t border-vg-border">{specValue(spec.offset_range)}</div>
                      </>
                    )}
                    {spec.finish !== undefined && (
                      <>
                        <div className="px-4 py-2.5 text-vg-gray text-xs uppercase tracking-wider border-t border-vg-border">Finish</div>
                        <div className="px-4 py-2.5 text-vg-white text-xs border-t border-vg-border">{specValue(spec.finish)}</div>
                      </>
                    )}
                    {spec.weight_kg !== undefined && (
                      <>
                        <div className="px-4 py-2.5 text-vg-gray text-xs uppercase tracking-wider border-t border-vg-border">Weight</div>
                        <div className="px-4 py-2.5 text-vg-white text-xs border-t border-vg-border">{specValue(spec.weight_kg)}{spec.weight_kg ? ' kg' : ''}</div>
                      </>
                    )}
                    {spec.load_rating !== undefined && (
                      <>
                        <div className="px-4 py-2.5 text-vg-gray text-xs uppercase tracking-wider border-t border-vg-border">Load Rating</div>
                        <div className="px-4 py-2.5 text-vg-white text-xs border-t border-vg-border">{specValue(spec.load_rating)}{spec.load_rating ? ' kg' : ''}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="border border-vg-border p-4">
            <p className="text-vg-gray text-xs uppercase tracking-widest mb-1">Price</p>
            <p className="text-vg-white font-semibold text-sm">Hubungi distributor resmi</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleFavToggle}
              className={`flex items-center gap-2 btn-outline text-sm flex-1 justify-center ${fav ? 'border-vg-white text-vg-white' : ''}`}
            >
              <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
              {fav ? 'Saved' : 'Save to Favorites'}
            </button>
            {product.manufacturer_source_url && (
              <a
                href={product.manufacturer_source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-sm flex items-center gap-2"
              >
                <ExternalLink size={16} /> Source
              </a>
            )}
          </div>
        </motion.div>
      </div>

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
