import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ShoppingCart, User, LogOut, Package, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import AuthModal from './AuthModal';
import CartModal from './CartModal';
import OrderModal from './OrderModal';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/wheels', label: 'Wheels' },
  { to: '/brands', label: 'Brands' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/orders', label: 'Orders' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [authOpen, setAuthOpen]       = useState(false);
  const [cartOpen, setCartOpen]       = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);

  const { isLoggedIn, isAdmin, currentUser, logout } = useAuth();
  const { totalItems } = useCart();
  const { pendingCount } = useOrders();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/wheels?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  // Called from CartModal when user clicks "Beli" on a cart item
  const handleCartCheckout = (cartItem) => {
    // Convert cart item back into product-like shape for OrderModal
    setCheckoutProduct({
      id: cartItem.id,
      name: cartItem.name,
      price: cartItem.price,
      stock: cartItem.stock,
      image_url: cartItem.image_url,
      slug: cartItem.slug,
      brand: { name: cartItem.brand },
    });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-vg-black/95 backdrop-blur-sm border-b border-vg-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-vg-white uppercase">
                Velg<span className="text-vg-gray">Garage</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `text-sm font-medium uppercase tracking-widest transition-colors duration-200 ${
                      isActive ? 'text-vg-white' : 'text-vg-gray hover:text-vg-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-vg-gray hover:text-vg-white transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-vg-gray hover:text-vg-white transition-colors"
                aria-label="Keranjang"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-vg-white text-vg-black text-[9px] font-black rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Auth / User */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 p-2 text-vg-gray hover:text-vg-white transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-vg-border overflow-hidden flex items-center justify-center">
                      {currentUser?.profilePicture ? (
                        <img
                          src={currentUser.profilePicture}
                          alt={currentUser.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-black text-vg-white">
                          {currentUser?.avatar || currentUser?.name?.slice(0, 2).toUpperCase() || 'U'}
                        </span>
                      )}
                    </div>
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 top-full mt-1 w-56 bg-vg-card border border-vg-border rounded-lg shadow-xl overflow-hidden z-10"
                      >
                        <div className="p-3 border-b border-vg-border">
                          <p className="text-xs font-bold text-vg-white truncate">{currentUser?.name}</p>
                          <p className="text-[10px] text-vg-gray truncate">{currentUser?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-vg-gray hover:text-vg-white hover:bg-vg-dark/60 transition-colors"
                        >
                          <User size={14} />
                          Profil Saya
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-vg-gray hover:text-vg-white hover:bg-vg-dark/60 transition-colors"
                        >
                          <Package size={14} />
                          Pesanan Saya
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <ShieldCheck size={14} />
                              Admin Panel
                            </span>
                            {pendingCount > 0 && (
                              <span className="bg-emerald-500 text-vg-black text-[10px] font-black px-1.5 py-0.5 rounded-full">
                                {pendingCount}
                              </span>
                            )}
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-vg-gray hover:text-red-400 hover:bg-red-500/5 border-t border-vg-border transition-colors"
                        >
                          <LogOut size={14} />
                          Keluar
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-vg-border text-vg-gray hover:text-vg-white hover:border-vg-gray text-xs uppercase tracking-widest rounded transition-colors"
                >
                  <User size={14} />
                  Masuk
                </button>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-vg-gray hover:text-vg-white transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Search Bar Dropdown */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleSearch} className="pb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari velg, brand..."
                      autoFocus
                      className="flex-1 bg-vg-dark border border-vg-border text-vg-white placeholder-vg-gray px-4 py-2 text-sm focus:outline-none focus:border-vg-gray"
                    />
                    <button type="submit" className="btn-primary py-2 px-4">
                      Search
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-vg-border bg-vg-black overflow-hidden"
            >
              <div className="px-4 py-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-sm font-medium uppercase tracking-widest transition-colors duration-200 ${
                        isActive ? 'text-vg-white' : 'text-vg-gray'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                {/* Auth row mobile */}
                <div className="pt-2 border-t border-vg-border">
                  {isLoggedIn ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-vg-white">{currentUser?.name}</p>
                          <p className="text-[10px] text-vg-gray">{currentUser?.email}</p>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-1 text-xs text-vg-gray hover:text-red-400 uppercase tracking-wider"
                        >
                          <LogOut size={13} /> Keluar
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="px-3 py-1.5 bg-vg-dark border border-vg-border rounded text-xs text-vg-white"
                        >
                          Profil Saya
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setMenuOpen(false)}
                            className="px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded text-xs text-emerald-400"
                          >
                            Admin Panel {pendingCount > 0 ? `(${pendingCount})` : ''}
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setMenuOpen(false); setAuthOpen(true); }}
                      className="w-full flex items-center justify-center gap-2 btn-outline text-xs py-2"
                    >
                      <User size={14} /> Masuk / Daftar
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckoutItem={handleCartCheckout}
        onLoginRequest={() => setAuthOpen(true)}
      />

      {/* Order Modal (from cart checkout) */}
      <OrderModal
        product={checkoutProduct}
        isOpen={!!checkoutProduct}
        onClose={() => setCheckoutProduct(null)}
        onOrderSuccess={() => setCheckoutProduct(null)}
      />
    </>
  );
}
