import { motion } from 'framer-motion';

const techStack = [
  { name: 'React 18', desc: 'UI framework with hooks' },
  { name: 'Vite 5', desc: 'Build tool & dev server' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling' },
  { name: 'Framer Motion', desc: 'Animations & transitions' },
  { name: 'React Router v6', desc: 'Client-side routing' },
  { name: 'Node.js + Express', desc: 'Backend REST API' },
  { name: 'Supabase', desc: 'PostgreSQL database' },
  { name: 'vite-plugin-pwa', desc: 'Progressive Web App' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="mb-16"
      >
        <p className="text-vg-gray text-xs uppercase tracking-[0.3em] mb-2">Info</p>
        <h1 className="section-title mb-6">About VelgGarage</h1>
        <div className="w-16 h-px bg-vg-border mb-8" />
        <p className="text-vg-gray text-base leading-relaxed mb-4">
          <strong className="text-vg-white">VelgGarage</strong> is a premium automotive wheel
          catalog Progressive Web App (PWA) designed to help car enthusiasts discover, explore,
          and save their favorite aftermarket wheels from the world's most respected manufacturers.
        </p>
        <p className="text-vg-gray text-sm leading-relaxed">
          The platform aggregates data from leading wheel brands including BBS, RAYS, Enkei, WORK
          Wheels, OZ Racing, and SSR Wheels — presenting technical specifications, construction
          types, and curated collections in a clean, editorial interface.
        </p>
      </motion.div>

      {/* Project Purpose */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="mb-16"
      >
        <h2 className="text-lg font-black uppercase tracking-tight mb-4 text-vg-white">
          Project Purpose
        </h2>
        <div className="bg-vg-dark border border-vg-border p-6">
          <p className="text-vg-gray text-sm leading-relaxed mb-3">
            This application was developed as an <strong className="text-vg-white">academic final
            project</strong> for the <strong className="text-vg-white">Mobile Web Development
            (PPB)</strong> course in 2026. The project demonstrates:
          </p>
          <ul className="space-y-2 text-vg-gray text-sm">
            <li className="flex items-start gap-2">
              <span className="text-vg-white mt-0.5">→</span>
              Full-stack web application development with modern JavaScript frameworks
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vg-white mt-0.5">→</span>
              Progressive Web App (PWA) implementation with offline support
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vg-white mt-0.5">→</span>
              REST API design and integration with cloud PostgreSQL (Supabase)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vg-white mt-0.5">→</span>
              Responsive design for mobile and desktop platforms
            </li>
            <li className="flex items-start gap-2">
              <span className="text-vg-white mt-0.5">→</span>
              State management and local data persistence with localStorage
            </li>
          </ul>
        </div>
      </motion.section>

      {/* Developer Info */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="mb-16"
      >
        <h2 className="text-lg font-black uppercase tracking-tight mb-4 text-vg-white">
          Developer
        </h2>
        <div className="bg-vg-card border border-vg-border p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-vg-dark border border-vg-border flex items-center justify-center shrink-0">
            <span className="text-2xl font-black text-vg-white">K</span>
          </div>
          <div>
            <h3 className="font-bold text-vg-white mb-1">Kevin Novan</h3>
            <p className="text-vg-gray text-sm">Full-Stack Developer</p>
            <p className="text-vg-gray text-xs mt-1 uppercase tracking-widest">PPB 2026 — Final Project</p>
          </div>
        </div>
      </motion.section>

      {/* Tech Stack */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="mb-16"
      >
        <h2 className="text-lg font-black uppercase tracking-tight mb-4 text-vg-white">
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {techStack.map(({ name, desc }) => (
            <div key={name} className="bg-vg-dark border border-vg-border p-4">
              <p className="font-semibold text-vg-white text-sm mb-1">{name}</p>
              <p className="text-vg-gray text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Version */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="border-t border-vg-border pt-8 flex items-center justify-between"
      >
        <p className="text-vg-gray text-xs uppercase tracking-widest">VelgGarage</p>
        <p className="text-vg-gray text-xs uppercase tracking-widest">Version 1.0.0</p>
      </motion.div>
    </div>
  );
}
