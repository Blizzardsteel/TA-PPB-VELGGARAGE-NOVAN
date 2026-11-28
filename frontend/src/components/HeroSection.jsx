import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const subVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3, ease: 'easeOut' } },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.6, ease: 'easeOut' } },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[82vh] md:min-h-screen py-16 md:py-0 flex items-center justify-center overflow-hidden bg-vg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-vg-black via-vg-dark to-vg-black" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 60%),
                            radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)`,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          className="space-y-6 md:space-y-8"
        >
          <motion.p
            variants={subVariants}
            className="text-vg-gray text-xs uppercase tracking-[0.3em] font-medium"
          >
            Premium Wheel Catalog
          </motion.p>

          <motion.h1
            variants={textVariants}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-vg-white leading-none"
          >
            FIND YOUR
            <br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.4)' }}>
              PERFECT
            </span>
            <br />
            WHEELS.
          </motion.h1>

          <motion.p
            variants={subVariants}
            className="text-vg-gray text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Explore authentic aftermarket wheels from the world's most respected
            wheel manufacturers.
          </motion.p>

          <motion.div
            variants={ctaVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4"
          >
            <Link
              to="/wheels"
              className="w-full sm:w-auto flex items-center justify-center gap-2 btn-primary text-sm"
            >
              EXPLORE COLLECTION <ArrowRight size={16} />
            </Link>
            <Link to="/brands" className="w-full sm:w-auto text-center btn-outline text-sm">
              VIEW BRANDS
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-vg-black to-transparent" />
    </section>
  );
}
