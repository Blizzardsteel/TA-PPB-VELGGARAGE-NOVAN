import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '../context/FavoritesContext';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProductCard({ product, showRemove = false }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const fav = isFavorite(product.id);

  const handleFavToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fav) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="card-base group relative flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-vg-dark overflow-hidden">
        {product.image_url ? (
          <>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              className="absolute inset-0 items-center justify-center hidden bg-vg-dark"
            >
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
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-vg-gray text-xs uppercase tracking-widest">
            {product.brand?.name || product.brand_name || 'Unknown Brand'}
          </p>
          {product.construction_type && (
            <span className="text-[10px] border border-vg-border text-vg-gray px-2 py-0.5 uppercase tracking-wider whitespace-nowrap">
              {product.construction_type}
            </span>
          )}
        </div>
        <h3 className="font-bold text-vg-white text-sm leading-tight mb-2 flex-1">
          {product.name}
        </h3>
        {product.category && (
          <p className="text-vg-gray text-xs mb-3">{product.category}</p>
        )}
        <div className="flex gap-2 mt-auto">
          <Link
            to={`/wheels/${product.id}`}
            className="flex-1 text-center btn-primary text-xs py-2"
          >
            View Details
          </Link>
          {showRemove && (
            <button
              onClick={() => removeFavorite(product.id)}
              className="btn-outline text-xs py-2 px-3"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
