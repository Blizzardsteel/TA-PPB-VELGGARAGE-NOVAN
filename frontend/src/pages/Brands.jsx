import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import BrandCard from '../components/BrandCard';
import { BrandCardSkeleton } from '../components/LoadingSkeleton';
import { useBrands } from '../hooks/useBrands';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Brands() {
  const { brands, loading, error } = useBrands();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-vg-gray text-xs uppercase tracking-[0.3em] mb-2">Manufacturers</p>
        <h1 className="section-title">Brands</h1>
        <p className="text-vg-gray text-sm mt-2 max-w-xl">
          Discover the world's leading wheel manufacturers, each with a unique heritage and
          commitment to precision engineering.
        </p>
      </div>

      {error && brands.length === 0 ? (
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
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <BrandCardSkeleton key={i} />)
            : brands.length > 0
            ? brands.map((b) => <BrandCard key={b.id} brand={b} />)
            : (
              <div className="col-span-3 flex flex-col items-center justify-center py-20 gap-4 text-center">
                <p className="text-vg-white font-semibold uppercase tracking-widest text-sm">No Brands Available</p>
                <p className="text-vg-gray text-xs">Check back after the database is seeded.</p>
              </div>
            )}
        </motion.div>
      )}
    </div>
  );
}
