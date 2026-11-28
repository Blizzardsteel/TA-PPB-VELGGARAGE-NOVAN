import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProductCard({ product, showRemove = false, onLoginRequest }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { addToCart, isInCart } = useCart();
  const fav = isFavorite(product.id);
  const inCart = isInCart(product.id);

  const handleFavToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fav) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if ((product.stock ?? 0) <= 0) return;
    addToCart(product, 1);
  };

  const isOutOfStock = (product.stock ?? 0) <= 0;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="card-base group relative flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-vg-dark overflow-hidden flex items-center justify-center p-3">
        {product.image_url ? (
          <>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="absolute inset-0 items-center justify-center hidden bg-vg-dark">
              <span className="text-vg-gray text-xs uppercase tracking-widest">No Image</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-vg-gray text-xs uppercase tracking-widest">No Image</span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
            fav
              ? 'bg-vg-white/20 text-vg-white'
              : 'bg-vg-black/50 text-vg-gray hover:text-vg-white'
          }`}
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
        </button>

        {/* Featured Badge */}
        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-vg-white text-vg-black text-[10px] font-bold uppercase tracking-widest px-2 py-1">
            Featured
          </div>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-vg-black/60 flex items-center justify-center">
            <span className="text-vg-gray text-xs font-bold uppercase tracking-widest border border-vg-border px-3 py-1">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1.5 mb-1 min-w-0">
          <p className="text-vg-gray text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest truncate">
            {product.brand?.name || product.brand_name || 'Unknown Brand'}
          </p>
          <span className={`shrink-0 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 uppercase tracking-wider rounded font-medium border ${
            isOutOfStock
              ? 'border-red-500/40 text-red-400 bg-red-500/10'
              : (product.stock ?? 4) <= 2
              ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
              : 'border-vg-border text-vg-gray'
          }`}>
            {isOutOfStock ? 'Habis' : `Sisa ${product.stock ?? 4}`}
          </span>
        </div>
        <h3 className="font-bold text-vg-white text-xs sm:text-sm leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Price & Construction */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2 text-xs mb-3 pt-1.5 border-t border-vg-border/40 min-w-0">
          <span className="font-bold text-vg-white truncate">
            {formatPrice(product.price || 45000000)}
          </span>
          {product.construction_type && (
            <span className="text-[10px] text-vg-gray uppercase tracking-wider truncate">
              {product.construction_type}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1.5 sm:gap-2 mt-auto">
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`shrink-0 flex items-center justify-center px-2.5 sm:px-3 py-2 text-xs font-semibold uppercase tracking-wider border rounded transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${
              inCart
                ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                : 'border-vg-border text-vg-gray hover:border-vg-white hover:text-vg-white'
            }`}
            title={inCart ? 'Sudah di keranjang' : 'Tambah ke keranjang'}
          >
            {inCart ? <Check size={13} /> : <ShoppingCart size={13} />}
          </button>

          {/* Detail / Beli */}
          <Link
            to={`/wheels/${product.id}`}
            className="flex-1 min-w-0 text-center bg-vg-white text-vg-black font-semibold uppercase tracking-wider sm:tracking-widest hover:bg-vg-accent transition-colors duration-200 text-[11px] sm:text-xs py-2 px-2 sm:px-4 whitespace-nowrap flex items-center justify-center"
          >
            Detail / Beli
          </Link>

          {/* Remove from favorites (Favorites page) */}
          {showRemove && (
            <button
              onClick={() => removeFavorite(product.id)}
              className="shrink-0 btn-outline text-[11px] sm:text-xs py-2 px-2.5 sm:px-3"
            >
              Hapus
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
