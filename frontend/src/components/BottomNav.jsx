import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Circle, Layers, Heart, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/wheels', icon: Circle, label: 'Wheels' },
  { to: '/brands', icon: Layers, label: 'Brands' },
  { to: '/favorites', icon: Heart, label: 'Saved' },
];

export default function BottomNav() {
  const { isLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-vg-black/95 backdrop-blur-sm border-t border-vg-border pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors duration-200 ${
                isActive ? 'text-vg-white' : 'text-vg-gray'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
          </NavLink>
        ))}

        {/* Auth / Profile Button */}
        <button
          onClick={() => (isLoggedIn ? navigate('/profile') : setAuthOpen(true))}
          className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1 text-vg-gray"
        >
          {isLoggedIn ? (
            <div className="w-5 h-5 rounded-full bg-vg-border overflow-hidden flex items-center justify-center">
              {currentUser?.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[8px] font-black text-vg-white">
                  {currentUser?.avatar || currentUser?.name?.slice(0, 2).toUpperCase() || 'U'}
                </span>
              )}
            </div>
          ) : (
            <User size={20} />
          )}
          <span className="text-[10px] font-medium uppercase tracking-wider">
            {isLoggedIn ? 'Profil' : 'Masuk'}
          </span>
        </button>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />
    </>
  );
}
