import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useFavorites } from '../context/FavoritesContext';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-vg-gray text-xs uppercase tracking-[0.3em] mb-2">Saved</p>
        <h1 className="section-title">Favorites</h1>
        {favorites.length > 0 && (
          <p className="text-vg-gray text-sm mt-2">{favorites.length} saved wheel{favorites.length !== 1 ? 's' : ''}</p>
        )}
      </div>

      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center py-24 gap-6 text-center"
        >
          <div className="w-24 h-24 rounded-full border border-vg-border flex items-center justify-center">
            <Heart size={32} className="text-vg-border" />
          </div>
          <div>
            <p className="text-vg-white font-bold uppercase tracking-widest text-sm mb-2">
              No Favorites Yet
            </p>
            <p className="text-vg-gray text-sm max-w-xs">
              Save wheels you love by tapping the heart icon on any product card.
            </p>
          </div>
          <Link to="/wheels" className="btn-primary text-sm">
            EXPLORE WHEELS
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} showRemove={true} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
