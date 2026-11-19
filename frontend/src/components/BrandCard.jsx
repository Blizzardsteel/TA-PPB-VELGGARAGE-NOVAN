import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function BrandCard({ brand }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="card-base p-6 flex flex-col gap-3 group"
    >
      {/* Brand Image / Placeholder */}
      <div className="w-16 h-16 bg-vg-dark border border-vg-border rounded flex items-center justify-center mb-2">
        {brand.logo_url ? (
          <img
            src={brand.logo_url}
            alt={brand.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <span className="text-vg-white font-black text-xl">
            {brand.name?.charAt(0) || 'B'}
          </span>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-black text-lg text-vg-white uppercase tracking-tight">
            {brand.name}
          </h3>
          {brand.country && (
            <span className="text-vg-gray text-xs uppercase tracking-widest border border-vg-border px-2 py-0.5">
              {brand.country}
            </span>
          )}
        </div>
        {brand.founded_year && (
          <p className="text-vg-gray text-xs mb-2">Est. {brand.founded_year}</p>
        )}
        {brand.description && (
          <p className="text-vg-gray text-sm leading-relaxed line-clamp-3 mb-4">
            {brand.description}
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-auto">
        <Link
          to={`/brands/${brand.id}`}
          className="flex-1 flex items-center justify-center gap-2 btn-primary text-xs py-2"
        >
          Explore Collection <ArrowRight size={14} />
        </Link>
        {brand.website_url && (
          <a
            href={brand.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-xs py-2 px-3"
          >
            <Globe size={14} />
          </a>
        )}
      </div>
    </motion.div>
  );
}
