import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, ShoppingBag, MessageCircle, Package, ShieldCheck, Truck, AlertTriangle, WifiOff } from 'lucide-react';
import { formatPrice } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function OrderModal({ product, isOpen, onClose, onOrderSuccess }) {
  const { currentUser } = useAuth();
  const { addOrder } = useOrders();
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    carDetails: '',
    paymentMethod: 'transfer',
    notes: '',
  });
  const [error, setError] = useState('');
  const [orderSummary, setOrderSummary] = useState(null);

  // Prefill form with logged-in user's data
  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || prev.address || '',
        carDetails: currentUser.carDetails || prev.carDetails || '',
      }));
    }
  }, [isOpen, currentUser]);

  if (!isOpen || !product) return null;

  const currentStock = product.stock ?? 5;
  const isOutOfStock = currentStock <= 0;
  const unitPrice = product.price || 45000000;
  const totalPrice = unitPrice * quantity;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleQtyChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= currentStock) {
      setQuantity(newQty);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isOnline) {
      setError('Anda sedang offline, tidak bisa melakukan pembelian saat ini.');
      return;
    }
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setError('Mohon lengkapi Nama, Nomor WhatsApp, dan Alamat Pengiriman.');
      return;
    }

    const invoiceId = `INV-VG-${Date.now().toString().slice(-6)}`;
    const newOrder = addOrder({
      invoiceId,
      userId: currentUser?.id || null,
      userEmail: currentUser?.email || formData.email || '',
      productId: product.id,
      productName: product.name,
      brandName: product.brand?.name || 'Authentic Wheel',
      productImage: product.image_url || '',
      quantity,
      unitPrice,
      totalPrice,
      customer: formData,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    });

    if (onOrderSuccess) {
      onOrderSuccess(product.id, quantity);
    }

    setOrderSummary(newOrder);
  };

  const handleClose = () => {
    setOrderSummary(null);
    setFormData({
      name: currentUser?.name || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      address: currentUser?.address || '',
      carDetails: currentUser?.carDetails || '',
      paymentMethod: 'transfer',
      notes: '',
    });
    setQuantity(1);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-vg-card border border-vg-border rounded-lg shadow-2xl overflow-hidden my-4 sm:my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-vg-border bg-vg-dark/60">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-vg-accent" />
              <h2 className="text-base font-bold uppercase tracking-wider text-vg-white">
                {orderSummary ? 'Faktur Pemesanan Resmi' : 'Form Pemesanan Velg'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-vg-gray hover:text-vg-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-6 max-h-[82vh] overflow-y-auto">
            {orderSummary ? (
              /* Success / Receipt Screen */
              <div className="flex flex-col items-center text-center py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
                  <CheckCircle size={36} />
                </div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full mb-2">
                  Pesanan Berhasil Dicatat
                </span>
                <h3 className="text-2xl font-black text-vg-white mb-1 uppercase tracking-tight">
                  Terima Kasih, {orderSummary.customer.name}!
                </h3>
                <p className="text-vg-gray text-xs mb-6">
                  Nomor Referensi: <span className="font-mono text-vg-white font-bold">{orderSummary.invoiceId}</span>
                </p>

                {/* Receipt Box */}
                <div className="w-full bg-vg-dark border border-vg-border p-5 text-left text-xs mb-6 rounded space-y-3 font-sans">
                  <div className="flex justify-between border-b border-vg-border pb-3">
                    <span className="text-vg-gray">Produk:</span>
                    <span className="font-bold text-vg-white text-right">{orderSummary.productName} ({orderSummary.quantity} Set)</span>
                  </div>
                  <div className="flex justify-between border-b border-vg-border pb-3">
                    <span className="text-vg-gray">Spesifikasi Kendaraan:</span>
                    <span className="text-vg-white text-right">{orderSummary.customer.carDetails || 'Tidak dicantumkan'}</span>
                  </div>
                  <div className="flex justify-between border-b border-vg-border pb-3">
                    <span className="text-vg-gray">Tujuan Pengiriman:</span>
                    <span className="text-vg-white text-right max-w-xs truncate">{orderSummary.customer.address}</span>
                  </div>
                  <div className="flex justify-between border-b border-vg-border pb-3">
                    <span className="text-vg-gray">Metode Pembayaran:</span>
                    <span className="text-vg-white uppercase tracking-wider">{orderSummary.customer.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between pt-1 text-sm font-bold">
                    <span className="text-vg-gray">Total Pembayaran:</span>
                    <span className="text-vg-white text-base">{formatPrice(orderSummary.totalPrice)}</span>
                  </div>
                </div>

                <div className="bg-vg-border/20 border border-vg-border p-4 rounded text-left flex items-start gap-3 mb-6 w-full">
                  <MessageCircle size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-vg-gray leading-relaxed">
                    Pesanan Anda telah diteruskan ke <span className="text-vg-white font-semibold">Admin VelgGarage</span> untuk proses ACC &amp; verifikasi. Anda dapat memantau status pesanan (Processing / Dikirim) di halaman <span className="text-vg-white font-semibold">Pesanan Saya</span>.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <button
                    onClick={() => {
                      handleClose();
                      navigate('/orders');
                    }}
                    className="flex-1 btn-primary py-3 text-xs tracking-widest flex items-center justify-center gap-2"
                  >
                    <Package size={15} />
                    LIHAT STATUS PESANAN
                  </button>
                  <button onClick={handleClose} className="flex-1 btn-outline py-3 text-xs tracking-widest">
                    TUTUP
                  </button>
                </div>
              </div>
            ) : (
              /* Order Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Summary Box */}
                <div className="flex gap-4 p-4 bg-vg-dark border border-vg-border rounded">
                  <div className="w-20 h-20 bg-black border border-vg-border shrink-0 flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-xs text-vg-gray">VG</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-vg-gray uppercase tracking-widest">{product.brand?.name || 'Authentic Wheel'}</p>
                    <h3 className="font-bold text-vg-white text-sm truncate">{product.name}</h3>
                    <p className="text-xs text-vg-accent font-semibold mt-1">{formatPrice(unitPrice)} <span className="text-[10px] text-vg-gray font-normal">/ 1 set (4 velg)</span></p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded ${
                        currentStock <= 2 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isOutOfStock ? 'Stok Habis' : `Stok Tersisa: ${currentStock} Set`}
                      </span>
                    </div>
                  </div>
                </div>

                {isOutOfStock ? (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded text-center">
                    Maaf, stok untuk velg ini saat ini sedang habis. Silakan hubungi distributor resmi untuk indent.
                  </div>
                ) : (
                  <>
                    {/* Quantity Picker */}
                    <div className="flex items-center justify-between border-b border-vg-border pb-4">
                      <div>
                        <p className="text-xs font-bold text-vg-white uppercase tracking-wider">Jumlah Pesanan</p>
                        <p className="text-[11px] text-vg-gray">1 Set = 4 Unit Velg Lengkap</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(-1)}
                          disabled={quantity <= 1}
                          className="w-8 h-8 rounded border border-vg-border flex items-center justify-center text-vg-white hover:bg-vg-border/50 disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-bold text-sm text-vg-white">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(1)}
                          disabled={quantity >= currentStock}
                          className="w-8 h-8 rounded border border-vg-border flex items-center justify-center text-vg-white hover:bg-vg-border/50 disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Customer Inputs */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-vg-accent uppercase tracking-widest">Informasi Pembeli</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] text-vg-gray uppercase tracking-wider mb-1">
                            Nama Lengkap <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Contoh: Budi Santoso"
                            className="w-full bg-vg-dark border border-vg-border rounded px-3 py-2 text-xs text-vg-white focus:border-vg-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-vg-gray uppercase tracking-wider mb-1">
                            No. WhatsApp / Telepon <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Contoh: 08123456789"
                            className="w-full bg-vg-dark border border-vg-border rounded px-3 py-2 text-xs text-vg-white focus:border-vg-white outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] text-vg-gray uppercase tracking-wider mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="alamat@email.com"
                            className="w-full bg-vg-dark border border-vg-border rounded px-3 py-2 text-xs text-vg-white focus:border-vg-white outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-vg-gray uppercase tracking-wider mb-1">
                            Merk & Model Mobil (Konsultasi Fitment)
                          </label>
                          <input
                            type="text"
                            name="carDetails"
                            value={formData.carDetails}
                            onChange={handleChange}
                            placeholder="Contoh: Honda Civic Turbo 2021"
                            className="w-full bg-vg-dark border border-vg-border rounded px-3 py-2 text-xs text-vg-white focus:border-vg-white outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-vg-gray uppercase tracking-wider mb-1">
                          Alamat Pengiriman Lengkap <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          name="address"
                          rows={2}
                          required
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Jalan, No. Rumah, Kecamatan, Kota, Kode Pos"
                          className="w-full bg-vg-dark border border-vg-border rounded px-3 py-2 text-xs text-vg-white focus:border-vg-white outline-none resize-none"
                        />
                      </div>

                      {/* Payment Method */}
                      <div>
                        <label className="block text-[11px] text-vg-gray uppercase tracking-wider mb-2">
                          Metode Pembayaran
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'transfer', label: 'Transfer Bank (VA)' },
                            { id: 'cicilan', label: 'Cicilan 0% / SPayLater' },
                            { id: 'cod', label: 'DP + Pelunasan di Workshop' },
                          ].map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                              className={`p-2.5 text-center text-[11px] font-semibold rounded border transition-colors ${
                                formData.paymentMethod === m.id
                                  ? 'bg-vg-white text-vg-black border-vg-white'
                                  : 'bg-vg-dark text-vg-gray border-vg-border hover:border-vg-gray'
                              }`}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {!isOnline && (
                      <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded">
                        <WifiOff size={16} className="shrink-0" />
                        <span>Anda sedang offline, tidak bisa melakukan pembelian saat ini.</span>
                      </div>
                    )}

                    {error && (
                      <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded">
                        <AlertTriangle size={16} />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Guarantees */}
                    <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-vg-gray border-t border-vg-border">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        <span>100% Produk Velg Original Pabrikan</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck size={14} className="text-blue-400" />
                        <span>Pengiriman Peti Kayu & Asuransi</span>
                      </div>
                    </div>

                    {/* Total & Submit */}
                    <div className="pt-4 border-t border-vg-border flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] text-vg-gray uppercase tracking-widest block">Total Tagihan ({quantity} Set)</span>
                        <span className="text-xl font-black text-vg-white">{formatPrice(totalPrice)}</span>
                      </div>
                      <button
                        type="submit"
                        disabled={!isOnline}
                        className="w-full sm:w-auto btn-primary py-3 px-8 text-xs tracking-widest font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {!isOnline ? <WifiOff size={16} /> : <ShoppingBag size={16} />}
                        {!isOnline ? 'OFFLINE — TIDAK BISA BELI' : 'KONFIRMASI PEMBELIAN'}
                      </button>
                    </div>
                  </>
                )}
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
