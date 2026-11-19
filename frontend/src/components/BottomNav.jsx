import { NavLink } from 'react-router-dom';
import { Home, Circle, Layers, Heart, Info } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/wheels', icon: Circle, label: 'Wheels' },
  { to: '/brands', icon: Layers, label: 'Brands' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
  { to: '/about', icon: Info, label: 'About' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-vg-black/95 backdrop-blur-sm border-t border-vg-border">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors duration-200 ${
              isActive ? 'text-vg-white' : 'text-vg-gray'
            }`
          }
        >
          <Icon size={20} />
          <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
