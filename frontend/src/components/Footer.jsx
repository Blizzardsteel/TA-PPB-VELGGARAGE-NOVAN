import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-vg-dark border-t border-vg-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-3">VelgGarage</h3>
            <p className="text-vg-gray text-sm leading-relaxed">
              Premium automotive wheel catalog. Discover authentic aftermarket wheels from the
              world's most respected manufacturers.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-3 text-vg-accent">
              Navigate
            </h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/wheels', label: 'Wheels' },
                { to: '/brands', label: 'Brands' },
                { to: '/favorites', label: 'Favorites' },
                { to: '/about', label: 'About' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-vg-gray hover:text-vg-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest mb-3 text-vg-accent">
              Categories
            </h4>
            <ul className="space-y-2">
              {['Monoblock', 'Multi-Piece', 'Forged', 'Flow Formed', 'Cast'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/wheels?construction_type=${cat.toLowerCase().replace(' ', '-')}`}
                    className="text-vg-gray hover:text-vg-white text-sm transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-vg-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-vg-gray text-xs uppercase tracking-widest">
            © {year} VelgGarage. Academic Project PPB 2026.
          </p>
          <p className="text-vg-gray text-xs uppercase tracking-widest">Version 1.0.0</p>
        </div>
      </div>
    </footer>
  );
}
