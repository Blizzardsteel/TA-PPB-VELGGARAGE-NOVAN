import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, LogIn, ShoppingBag, WifiOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { formatPrice } from '../utils/helpers';
import OfflineWarningModal from './OfflineWarningModal';

export default function CartModal({ isOpen, onClose, onCheckoutItem, onLoginRequest }) {
  const { items, updateQty, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const { isLoggedIn } = useAuth();
  const isOnline = useOnlineStatus();
  const [offlineWarningOpen, setOfflineWarningOpen] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = (item) => {
    if (!isOnline) {
      setOfflineWarningOpen(true);
      return;
    }
    if (!isLoggedIn) {
      onClose();
      onLoginRequest();
      return;
    }
    onClose();
    onCheckoutItem(item);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[55] flex items-start justify-end p-4 pt-16 bg-black/60 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-sm bg-vg-card border border-vg-border rounded-lg shadow-2xl flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-vg-border shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} className="text-vg-white" />
              <span className="font-bold text-sm uppercase tracking-widest text-vg-white">
                Keranjang
              </span>
              {totalItems > 0 && (
                <span className="bg-vg-white text-vg-black text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-vg-gray hover:text-red-400 text-xs uppercase tracking-wider transition-colors"
                >
                  Kosongkan
                </button>
              )}
              <button onClick={onClose} className="p-1 text-vg-gray hover:text-vg-white transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center px-6">
                <div className="w-16 h-16 rounded-full border border-vg-border flex items-center justify-center">
                  <ShoppingCart size={24} className="text-vg-border" />
                </div>
                <div>
                  <p className="text-vg-white font-bold uppercase tracking-widest text-xs mb-1">
                    Keranjang Kosong
                  </p>
                  <p className="text-vg-gray text-xs">
                    Tambahkan velg dari katalog untuk memulai.
                  </p>
                </div>
                <Link
                  to="/wheels"
                  onClick={onClose}
                  className="btn-primary text-xs py-2"
                >
                  Jelajahi Velg
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-vg-border">
                {items.map((item) => (
                  <div key={item.id} className="p-4 flex gap-3">
                    {/* Image */}
                    <div className="w-16 h-16 bg-vg-dark border border-vg-border rounded shrink-0 flex items-center justify-center overflow-hidden p-1">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <span className="text-vg-gray text-xs">VG</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-vg-gray uppercase tracking-widest">{item.brand}</p>
                      <p className="text-xs font-bold text-vg-white truncate">{item.name}</p>
                      <p className="text-[11px] text-vg-white font-semibold mt-0.5">
                        {formatPrice(item.price)}
                        <span className="text-vg-gray font-normal"> /set</span>
                      </p>

                      {/* Qty Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-6 h-6 border border-vg-border rounded flex items-center justify-center text-vg-white hover:bg-vg-border/50 transition-colors"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="text-xs font-bold text-vg-white w-5 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          disabled={item.qty >= item.stock}
                          className="w-6 h-6 border border-vg-border rounded flex items-center justify-center text-vg-white hover:bg-vg-border/50 disabled:opacity-30 transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                        <span className="text-[10px] text-vg-gray ml-1">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-vg-gray hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        onClick={() => handleCheckout(item)}
                        className={`p-1.5 text-vg-gray hover:text-vg-white transition-colors ${!isOnline ? 'opacity-50' : ''}`}
                        title={isOnline ? 'Checkout item ini' : 'Anda sedang offline, tidak bisa membeli'}
                      >
                        <ShoppingBag size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-vg-border shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-vg-gray uppercase tracking-widest">Total ({totalItems} set)</span>
                <span className="font-black text-vg-white text-sm">{formatPrice(totalPrice)}</span>
              </div>
              {!isOnline && (
                <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] rounded">
                  <WifiOff size={14} className="shrink-0" />
                  <span>Anda sedang offline, tidak bisa membeli saat ini.</span>
                </div>
              )}
              {!isLoggedIn ? (
                <button
                  onClick={() => {
                    if (!isOnline) {
                      setOfflineWarningOpen(true);
                      return;
                    }
                    onClose();
                    onLoginRequest();
                  }}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-xs"
                >
                  <LogIn size={14} />
                  LOGIN UNTUK CHECKOUT
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-vg-gray text-[10px] text-center">Pilih "Beli" di tiap item untuk proses pesanan.</p>
                  <Link
                    to="/wheels"
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 btn-outline text-xs py-2.5"
                  >
                    <ArrowRight size={14} />
                    Lanjut Belanja
                  </Link>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
      <OfflineWarningModal
        isOpen={offlineWarningOpen}
        onClose={() => setOfflineWarningOpen(false)}
      />
    </AnimatePresence>
  );
}
