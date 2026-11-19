import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import BrandCard from '../components/BrandCard';
import { ProductCardSkeleton, BrandCardSkeleton } from '../components/LoadingSkeleton';
import { useProducts } from '../hooks/useProducts';
import { useBrands } from '../hooks/useBrands';
import { ArrowRight, AlertCircle } from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const constructionTypes = [
  { label: 'Monoblock', value: 'monoblock', desc: 'One-piece precision' },
  { label: 'Multi-Piece', value: 'multi-piece', desc: 'Custom configurations' },
  { label: 'Forged', value: 'forged', desc: 'Maximum strength' },
  { label: 'Flow Formed', value: 'flow-formed', desc: 'Lightweight performance' },
  { label: 'Cast', value: 'cast', desc: 'Accessible quality' },
];

export default function Home() {
  const { products: featured, loading: featLoading, error: featError } = useProducts({ featured: true });
  const { brands, loading: brandsLoading, error: brandsError } = useBrands();

  const displayFeatured = featured.slice(0, 4);
  const displayBrands = brands.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Featured Collections */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionVariants}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-vg-gray text-xs uppercase tracking-[0.3em] mb-2">Handpicked</p>
            <h2 className="section-title">Featured Collections</h2>
          </div>
          <Link to="/wheels?featured=true" className="hidden md:flex items-center gap-2 text-vg-gray hover:text-vg-white text-sm uppercase tracking-widest transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>

        {featError ? (
          <div className="flex items-center gap-3 text-vg-gray p-6 border border-vg-border">
            <AlertCircle size={20} />
            <p className="text-sm">Could not load featured products. API may be unavailable.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {featLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : displayFeatured.length > 0
              ? displayFeatured.map((p) => <ProductCard key={p.id} product={p} />)
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="card-base p-6 flex flex-col items-center justify-center aspect-square text-vg-gray text-sm">
                    <span className="text-xs uppercase tracking-widest">No data yet</span>
                  </div>
                ))}
          </motion.div>
        )}

        <div className="mt-6 md:hidden">
          <Link to="/wheels" className="btn-outline w-full text-center block">
            View All Wheels
          </Link>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-20 bg-vg-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={sectionVariants}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-vg-gray text-xs uppercase tracking-[0.3em] mb-2">Top Manufacturers</p>
              <h2 className="section-title">Popular Brands</h2>
            </div>
            <Link to="/brands" className="hidden md:flex items-center gap-2 text-vg-gray hover:text-vg-white text-sm uppercase tracking-widest transition-colors">
              All Brands <ArrowRight size={16} />
            </Link>
          </motion.div>

          {brandsError ? (
            <div className="flex items-center gap-3 text-vg-gray p-6 border border-vg-border">
              <AlertCircle size={20} />
              <p className="text-sm">Could not load brands. API may be unavailable.</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              {brandsLoading
                ? Array.from({ length: 6 }).map((_, i) => <BrandCardSkeleton key={i} />)
                : displayBrands.length > 0
                ? displayBrands.map((b) => <BrandCard key={b.id} brand={b} />)
                : (
                  <div className="col-span-3 text-center py-16 text-vg-gray">
                    <p className="text-sm uppercase tracking-widest">No brands available yet</p>
                  </div>
                )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Explore by Type */}
      <section className="py-20 max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionVariants}
          className="mb-10"
        >
          <p className="text-vg-gray text-xs uppercase tracking-[0.3em] mb-2">By Construction</p>
          <h2 className="section-title">Explore by Type</h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-5 gap-3"
        >
          {constructionTypes.map((type) => (
            <motion.div key={type.value} variants={sectionVariants}>
              <Link
                to={`/wheels?construction_type=${type.value}`}
                className="block card-base p-6 text-center group hover:border-vg-gray transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-full border border-vg-border mx-auto mb-3 group-hover:border-vg-gray transition-colors" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-vg-white mb-1">
                  {type.label}
                </h3>
                <p className="text-vg-gray text-xs">{type.desc}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Editorial Banner */}
      <section className="py-24 bg-vg-dark border-t border-b border-vg-border">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={sectionVariants}
          className="max-w-7xl mx-auto px-4 md:px-6 text-center"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-vg-white leading-none">
            YOUR CAR.
            <br />
            <span className="text-vg-gray">YOUR STYLE.</span>
            <br />
            YOUR WHEELS.
          </h2>
          <div className="mt-10">
            <Link to="/wheels" className="btn-primary">
              FIND YOUR FIT
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
