import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import BrandCard from '../components/BrandCard';
import { ProductCardSkeleton, BrandCardSkeleton } from '../components/LoadingSkeleton';
import { useProducts } from '../hooks/useProducts';
import { useBrands } from '../hooks/useBrands';
import { ArrowRight } from 'lucide-react';
import { fallbackProducts, fallbackBrands } from '../data/fallbackCatalog';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const constructionTypes = [
  { label: 'Monoblock', value: 'monoblock', desc: 'One-piece precision' },
  { label: 'Multi-Piece', value: 'multi-piece', desc: 'Custom configurations' },
  { label: 'Forged', value: 'forged', desc: 'Maximum strength' },
  { label: 'Flow Formed', value: 'flow-formed', desc: 'Lightweight performance' },
  { label: 'Cast', value: 'cast', desc: 'Accessible quality' },
];

export default function Home() {
  const { products: featured, loading: featLoading } = useProducts({ featured: true });
  const { brands, loading: brandsLoading } = useBrands();

  const displayFeatured = (featured && featured.length > 0
    ? featured
    : fallbackProducts.filter((p) => p.is_featured)
  ).slice(0, 4);

  const displayBrands = (brands && brands.length > 0
    ? brands
    : fallbackBrands
  ).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Featured Collections */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01 }}
          variants={sectionVariants}
          className="flex items-end justify-between mb-8 md:mb-10"
        >
          <div>
            <p className="text-vg-gray text-xs uppercase tracking-[0.3em] mb-2">Handpicked</p>
            <h2 className="section-title">Featured Collections</h2>
          </div>
          <Link to="/wheels?featured=true" className="hidden md:flex items-center gap-2 text-vg-gray hover:text-vg-white text-sm uppercase tracking-widest transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {displayFeatured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.div>

        <div className="mt-6 md:hidden">
          <Link to="/wheels" className="btn-outline w-full text-center block">
            View All Wheels
          </Link>
        </div>
      </section>

      {/* Popular Brands */}
      <section className="py-12 md:py-20 bg-vg-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01 }}
            variants={sectionVariants}
            className="flex items-end justify-between mb-8 md:mb-10"
          >
            <div>
              <p className="text-vg-gray text-xs uppercase tracking-[0.3em] mb-2">Top Manufacturers</p>
              <h2 className="section-title">Popular Brands</h2>
            </div>
            <Link to="/brands" className="hidden md:flex items-center gap-2 text-vg-gray hover:text-vg-white text-sm uppercase tracking-widest transition-colors">
              All Brands <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01 }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {displayBrands.map((b) => (
              <BrandCard key={b.id} brand={b} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Explore by Type */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01 }}
          variants={sectionVariants}
          className="mb-8 md:mb-10"
        >
          <p className="text-vg-gray text-xs uppercase tracking-[0.3em] mb-2">By Construction</p>
          <h2 className="section-title">Explore by Type</h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01 }}
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
      <section className="py-16 md:py-24 bg-vg-dark border-t border-b border-vg-border">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01 }}
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
