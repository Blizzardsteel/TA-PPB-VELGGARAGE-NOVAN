import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Clock,
  Cog,
  Truck,
  CheckCircle2,
  XCircle,
  LogIn,
  ShoppingBag,
  ShieldCheck,
  MapPin,
  Car,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders, ORDER_STATUS, ORDER_STATUS_META } from '../context/OrderContext';
import { formatPrice } from '../utils/helpers';
import AuthModal from '../components/AuthModal';

const STEPS = [
  { key: ORDER_STATUS.PENDING, label: 'Menunggu ACC', icon: Clock },
  { key: ORDER_STATUS.PROCESSING, label: 'Processing', icon: Cog },
  { key: ORDER_STATUS.SHIPPED, label: 'Sudah Dikirim', icon: Truck },
  { key: ORDER_STATUS.COMPLETED, label: 'Selesai', icon: CheckCircle2 },
];

const STEP_INDEX = {
  [ORDER_STATUS.PENDING]: 0,
  [ORDER_STATUS.PROCESSING]: 1,
  [ORDER_STATUS.SHIPPED]: 2,
  [ORDER_STATUS.COMPLETED]: 3,
};

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: ORDER_STATUS.PENDING, label: 'Menunggu ACC' },
  { key: ORDER_STATUS.PROCESSING, label: 'Processing' },
  { key: ORDER_STATUS.SHIPPED, label: 'Dikirim' },
  { key: ORDER_STATUS.COMPLETED, label: 'Selesai' },
  { key: ORDER_STATUS.REJECTED, label: 'Ditolak' },
];

export default function Orders() {
  const { currentUser, isLoggedIn, isAdmin } = useAuth();
  const { getUserOrders, updateOrderStatus } = useOrders();
  const [filter, setFilter] = useState('all');
  const [authOpen, setAuthOpen] = useState(false);

  const userOrders = useMemo(() => getUserOrders(currentUser), [getUserOrders, currentUser]);

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return userOrders;
    return userOrders.filter((o) => o.status === filter);
  }, [userOrders, filter]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-16">
        <div className="card-base p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-vg-dark border border-vg-border mx-auto flex items-center justify-center">
            <Package size={28} className="text-vg-gray" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-vg-white">
              Status Pesanan Saya
            </h1>
            <p className="text-sm text-vg-gray mt-2">
              Silakan login untuk melihat riwayat pembelian dan memantau apakah pesanan Anda sedang diproses atau sudah dikirim.
            </p>
          </div>
          <button
            onClick={() => setAuthOpen(true)}
            className="btn-primary inline-flex items-center gap-2 text-xs"
          >
            <LogIn size={15} />
            Masuk / Daftar
          </button>
        </div>
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-5xl mx-auto px-4 md:px-6 py-10 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-vg-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-vg-gray mb-1">Tracking Pembelian</p>
          <h1 className="section-title">Pesanan Saya</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-2"
            >
              <ShieldCheck size={14} />
              Kelola Pesanan (Admin)
            </Link>
          )}
          <Link to="/wheels" className="btn-outline py-2 px-4 text-xs inline-flex items-center gap-2">
            <ShoppingBag size={14} />
            Belanja Velg
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count =
            f.key === 'all'
              ? userOrders.length
              : userOrders.filter((o) => o.status === f.key).length;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider rounded border transition-colors ${
                filter === f.key
                  ? 'bg-vg-white text-vg-black border-vg-white'
                  : 'bg-vg-card text-vg-gray border-vg-border hover:text-vg-white'
              }`}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="card-base p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-vg-dark border border-vg-border mx-auto flex items-center justify-center">
            <Package size={26} className="text-vg-gray" />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-vg-white">
              {userOrders.length === 0 ? 'Belum Ada Pesanan' : 'Tidak Ada Pesanan di Status Ini'}
            </p>
            <p className="text-xs text-vg-gray mt-1">
              {userOrders.length === 0
                ? 'Pesanan velg yang Anda buat akan muncul di sini beserta status pengirimannya.'
                : 'Coba pilih filter status lainnya.'}
            </p>
          </div>
          {userOrders.length === 0 && (
            <Link to="/wheels" className="btn-primary inline-flex items-center gap-2 text-xs">
              Jelajahi Katalog Velg
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const meta = ORDER_STATUS_META[order.status] || ORDER_STATUS_META[ORDER_STATUS.PENDING];
            const currentStep = STEP_INDEX[order.status] ?? 0;
            const isRejected = order.status === ORDER_STATUS.REJECTED;

            return (
              <div key={order.invoiceId} className="card-base p-5 md:p-6 space-y-5">
                {/* Top Row: Invoice + Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-vg-border pb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-vg-white">
                        {order.invoiceId}
                      </span>
                      <span className="text-[11px] text-vg-gray">• {order.date}</span>
                    </div>
                    <p className="text-[11px] text-vg-gray mt-1">{meta.description}</p>
                  </div>
                  <span
                    className={`self-start sm:self-center px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${meta.badgeClass}`}
                  >
                    {meta.label}
                  </span>
                </div>

                {/* Product & Price Row */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-vg-dark border border-vg-border rounded shrink-0 flex items-center justify-center overflow-hidden p-1">
                      {order.productImage ? (
                        <img
                          src={order.productImage}
                          alt={order.productName}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-xs font-bold text-vg-gray">VG</span>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-vg-gray">
                        {order.brandName}
                      </p>
                      <h3 className="text-sm font-bold text-vg-white">{order.productName}</h3>
                      <p className="text-xs text-vg-gray mt-0.5">
                        {order.quantity} Set × {formatPrice(order.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase tracking-widest text-vg-gray">Total Bayar</p>
                    <p className="text-base font-black text-vg-white">
                      {formatPrice(order.totalPrice)}
                    </p>
                  </div>
                </div>

                {/* Status Stepper */}
                {isRejected ? (
                  <div className="p-3.5 rounded bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-400">
                    <XCircle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold uppercase tracking-wider">Pesanan Ditolak Admin</p>
                      {order.adminNote && (
                        <p className="text-red-300/90 mt-1">Catatan: {order.adminNote}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-vg-dark border border-vg-border rounded-lg p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        const active = idx <= currentStep;
                        const isCurrent = idx === currentStep;
                        return (
                          <div
                            key={step.key}
                            className={`flex items-center gap-2.5 p-2 rounded border ${
                              isCurrent
                                ? 'border-vg-white/40 bg-vg-card'
                                : active
                                ? 'border-emerald-500/30 bg-emerald-500/5'
                                : 'border-transparent opacity-40'
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                                active
                                  ? 'bg-vg-white text-vg-black'
                                  : 'bg-vg-border text-vg-gray'
                              }`}
                            >
                              <Icon size={14} />
                            </div>
                            <span className="text-[11px] font-semibold text-vg-white leading-tight">
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Shipping / Customer Details & Action */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1 text-xs text-vg-gray">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-vg-gray shrink-0" />
                      <span>{order.customer?.address || '-'}</span>
                    </div>
                    {order.customer?.carDetails && (
                      <div className="flex items-center gap-1.5">
                        <Car size={13} className="text-vg-gray shrink-0" />
                        <span>Fitment: {order.customer.carDetails}</span>
                      </div>
                    )}
                    {(order.courier || order.trackingNumber) && (
                      <div className="flex items-center gap-1.5 text-purple-300 font-medium pt-1">
                        <Truck size={13} className="shrink-0" />
                        <span>
                          {order.courier ? `${order.courier} — ` : ''}
                          Resi: <span className="font-mono font-bold">{order.trackingNumber || '-'}</span>
                        </span>
                      </div>
                    )}
                    {order.adminNote && !isRejected && (
                      <p className="text-[11px] text-vg-accent pt-1">
                        Catatan Admin: {order.adminNote}
                      </p>
                    )}
                  </div>

                  {order.status === ORDER_STATUS.SHIPPED && (
                    <button
                      onClick={() => updateOrderStatus(order.invoiceId, ORDER_STATUS.COMPLETED)}
                      className="btn-primary py-2 px-4 text-xs shrink-0 inline-flex items-center gap-2"
                    >
                      <CheckCircle2 size={14} />
                      Konfirmasi Barang Diterima
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
