import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  Check,
  X,
  Truck,
  CheckCircle2,
  Clock,
  Cog,
  Phone,
  MapPin,
  Car,
  Mail,
  LogIn,
  Package,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders, ORDER_STATUS, ORDER_STATUS_META } from '../context/OrderContext';
import { formatPrice } from '../utils/helpers';
import AuthModal from '../components/AuthModal';

const ADMIN_FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: ORDER_STATUS.PENDING, label: 'Menunggu ACC' },
  { key: ORDER_STATUS.PROCESSING, label: 'Processing' },
  { key: ORDER_STATUS.SHIPPED, label: 'Dikirim' },
  { key: ORDER_STATUS.COMPLETED, label: 'Selesai' },
  { key: ORDER_STATUS.REJECTED, label: 'Ditolak' },
];

export default function AdminOrders() {
  const { isLoggedIn, isAdmin } = useAuth();
  const { orders, updateOrderStatus } = useOrders();

  const [authOpen, setAuthOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Per-order shipping/note inputs keyed by invoiceId
  const [shipInputs, setShipInputs] = useState({});
  const [rejectInputs, setRejectInputs] = useState({});
  const [rejectingId, setRejectingId] = useState(null);

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === ORDER_STATUS.PENDING).length,
      processing: orders.filter((o) => o.status === ORDER_STATUS.PROCESSING).length,
      shipped: orders.filter((o) => o.status === ORDER_STATUS.SHIPPED).length,
      completed: orders.filter((o) => o.status === ORDER_STATUS.COMPLETED).length,
    }),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false;
      if (!q) return true;
      return (
        o.invoiceId?.toLowerCase().includes(q) ||
        o.productName?.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.email?.toLowerCase().includes(q) ||
        o.customer?.phone?.toLowerCase().includes(q)
      );
    });
  }, [orders, filter, search]);

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-16">
        <div className="card-base p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-vg-dark border border-vg-border mx-auto flex items-center justify-center">
            <ShieldCheck size={28} className="text-vg-gray" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-vg-white">
              Akses Admin Diperlukan
            </h1>
            <p className="text-sm text-vg-gray mt-2">
              Halaman ini khusus untuk Admin VelgGarage guna melakukan ACC pesanan dan update status pengiriman.
            </p>
            <p className="text-xs text-vg-gray mt-2 font-mono">
              Demo Admin: admin@velggarage.com / admin123
            </p>
          </div>
          <button
            onClick={() => setAuthOpen(true)}
            className="btn-primary inline-flex items-center gap-2 text-xs"
          >
            <LogIn size={15} />
            Login sebagai Admin
          </button>
        </div>
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  const handleAccOrder = (invoiceId) => {
    updateOrderStatus(invoiceId, ORDER_STATUS.PROCESSING);
  };

  const handleRejectOrder = (invoiceId) => {
    const note = rejectInputs[invoiceId] || 'Stok atau verifikasi pembayaran tidak memenuhi syarat.';
    updateOrderStatus(invoiceId, ORDER_STATUS.REJECTED, { adminNote: note });
    setRejectingId(null);
  };

  const handleShipOrder = (invoiceId) => {
    const data = shipInputs[invoiceId] || {};
    updateOrderStatus(invoiceId, ORDER_STATUS.SHIPPED, {
      courier: data.courier || 'JNE Cargo / Ekspedisi Velg',
      trackingNumber: data.trackingNumber || `VG-${invoiceId.slice(-6)}`,
    });
  };

  const handleCompleteOrder = (invoiceId) => {
    updateOrderStatus(invoiceId, ORDER_STATUS.COMPLETED);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 md:px-6 py-10 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-vg-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-1">
            Admin Dashboard
          </p>
          <h1 className="section-title">Manajemen &amp; ACC Pesanan</h1>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="card-base p-4">
          <p className="text-[10px] uppercase tracking-widest text-vg-gray">Total Pesanan</p>
          <p className="text-2xl font-black text-vg-white mt-1">{stats.total}</p>
        </div>
        <div className="card-base p-4 border-amber-500/30">
          <p className="text-[10px] uppercase tracking-widest text-amber-400 flex items-center gap-1">
            <Clock size={12} /> Menunggu ACC
          </p>
          <p className="text-2xl font-black text-vg-white mt-1">{stats.pending}</p>
        </div>
        <div className="card-base p-4 border-blue-500/30">
          <p className="text-[10px] uppercase tracking-widest text-blue-400 flex items-center gap-1">
            <Cog size={12} /> Processing
          </p>
          <p className="text-2xl font-black text-vg-white mt-1">{stats.processing}</p>
        </div>
        <div className="card-base p-4 border-purple-500/30">
          <p className="text-[10px] uppercase tracking-widest text-purple-400 flex items-center gap-1">
            <Truck size={12} /> Dikirim
          </p>
          <p className="text-2xl font-black text-vg-white mt-1">{stats.shipped}</p>
        </div>
        <div className="card-base p-4 border-emerald-500/30 col-span-2 md:col-span-1">
          <p className="text-[10px] uppercase tracking-widest text-emerald-400 flex items-center gap-1">
            <CheckCircle2 size={12} /> Selesai
          </p>
          <p className="text-2xl font-black text-vg-white mt-1">{stats.completed}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-2">
          {ADMIN_FILTERS.map((f) => {
            const count =
              f.key === 'all' ? orders.length : orders.filter((o) => o.status === f.key).length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded border transition-colors ${
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

        <div className="relative w-full md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vg-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari invoice, nama, produk..."
            className="w-full bg-vg-dark border border-vg-border rounded pl-9 pr-3 py-2 text-xs text-vg-white placeholder-vg-gray focus:outline-none focus:border-vg-white"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="card-base p-12 text-center space-y-3">
          <Package size={28} className="text-vg-gray mx-auto" />
          <p className="text-sm font-bold uppercase tracking-widest text-vg-white">
            Tidak Ada Pesanan
          </p>
          <p className="text-xs text-vg-gray">
            Belum ada pesanan yang sesuai dengan filter atau pencarian saat ini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const meta = ORDER_STATUS_META[order.status] || ORDER_STATUS_META[ORDER_STATUS.PENDING];
            const shipData = shipInputs[order.invoiceId] || {};

            return (
              <div key={order.invoiceId} className="card-base p-5 space-y-4">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-vg-border pb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-xs font-bold text-vg-white">
                      {order.invoiceId}
                    </span>
                    <span className="text-[11px] text-vg-gray">{order.date}</span>
                  </div>
                  <span
                    className={`self-start sm:self-center px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full border ${meta.badgeClass}`}
                  >
                    {meta.label}
                  </span>
                </div>

                {/* Body grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {/* Product */}
                  <div className="flex items-start gap-3">
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
                      <p className="text-sm font-black text-vg-white mt-1">
                        Total: {formatPrice(order.totalPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="text-xs text-vg-gray space-y-1.5">
                    <p className="font-bold text-vg-white uppercase tracking-wider text-[11px]">
                      Pembeli: {order.customer?.name}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone size={12} /> {order.customer?.phone || '-'}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail size={12} /> {order.customer?.email || order.userEmail || '-'}
                    </p>
                    <p className="flex items-start gap-1.5">
                      <MapPin size={12} className="shrink-0 mt-0.5" />
                      <span>{order.customer?.address || '-'}</span>
                    </p>
                    {order.customer?.carDetails && (
                      <p className="flex items-center gap-1.5">
                        <Car size={12} /> {order.customer.carDetails}
                      </p>
                    )}
                    <p className="text-[11px]">
                      Metode: <span className="uppercase text-vg-white">{order.customer?.paymentMethod || '-'}</span>
                    </p>
                    {order.customer?.notes && (
                      <p className="text-[11px] italic">Catatan: {order.customer.notes}</p>
                    )}
                  </div>

                  {/* Admin Action Controls */}
                  <div className="flex flex-col justify-between bg-vg-dark border border-vg-border rounded-lg p-4 space-y-3">
                    {order.status === ORDER_STATUS.PENDING && (
                      <>
                        <p className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                          Perlu Konfirmasi Admin
                        </p>
                        {rejectingId === order.invoiceId ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={rejectInputs[order.invoiceId] || ''}
                              onChange={(e) =>
                                setRejectInputs({ ...rejectInputs, [order.invoiceId]: e.target.value })
                              }
                              placeholder="Alasan penolakan (opsional)"
                              className="w-full bg-vg-card border border-vg-border rounded px-2.5 py-1.5 text-xs text-vg-white"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRejectOrder(order.invoiceId)}
                                className="flex-1 py-2 bg-red-500/20 border border-red-500/40 text-red-400 rounded text-xs font-bold hover:bg-red-500/30"
                              >
                                Konfirmasi Tolak
                              </button>
                              <button
                                onClick={() => setRejectingId(null)}
                                className="px-3 py-2 border border-vg-border rounded text-xs text-vg-gray"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleAccOrder(order.invoiceId)}
                              className="w-full btn-primary py-2.5 px-3 text-xs flex items-center justify-center gap-1.5"
                            >
                              <Check size={14} />
                              ACC &amp; Proses Pesanan
                            </button>
                            <button
                              onClick={() => setRejectingId(order.invoiceId)}
                              className="w-full py-2 px-3 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
                            >
                              <X size={14} />
                              Tolak Pesanan
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    {order.status === ORDER_STATUS.PROCESSING && (
                      <>
                        <p className="text-[11px] text-blue-400 font-semibold uppercase tracking-wider">
                          Siap Dikirim
                        </p>
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={shipData.courier || ''}
                            onChange={(e) =>
                              setShipInputs({
                                ...shipInputs,
                                [order.invoiceId]: { ...shipData, courier: e.target.value },
                              })
                            }
                            placeholder="Kurir (cth: JNE Trucking)"
                            className="w-full bg-vg-card border border-vg-border rounded px-2.5 py-1.5 text-xs text-vg-white placeholder-vg-gray"
                          />
                          <input
                            type="text"
                            value={shipData.trackingNumber || ''}
                            onChange={(e) =>
                              setShipInputs({
                                ...shipInputs,
                                [order.invoiceId]: { ...shipData, trackingNumber: e.target.value },
                              })
                            }
                            placeholder="Nomor Resi (opsional)"
                            className="w-full bg-vg-card border border-vg-border rounded px-2.5 py-1.5 text-xs text-vg-white placeholder-vg-gray"
                          />
                          <button
                            onClick={() => handleShipOrder(order.invoiceId)}
                            className="w-full btn-primary py-2.5 px-3 text-xs flex items-center justify-center gap-1.5"
                          >
                            <Truck size={14} />
                            Kirim Barang
                          </button>
                        </div>
                      </>
                    )}

                    {order.status === ORDER_STATUS.SHIPPED && (
                      <>
                        <div className="space-y-1">
                          <p className="text-[11px] text-purple-400 font-semibold uppercase tracking-wider">
                            Dalam Pengiriman
                          </p>
                          <p className="text-xs text-vg-gray">
                            Kurir: <span className="text-vg-white">{order.courier || '-'}</span>
                          </p>
                          <p className="text-xs text-vg-gray">
                            Resi: <span className="font-mono text-vg-white">{order.trackingNumber || '-'}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleCompleteOrder(order.invoiceId)}
                          className="w-full btn-outline py-2 px-3 text-xs flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={14} />
                          Tandai Selesai
                        </button>
                      </>
                    )}

                    {order.status === ORDER_STATUS.COMPLETED && (
                      <div className="text-xs text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        <span>Pesanan telah selesai.</span>
                      </div>
                    )}

                    {order.status === ORDER_STATUS.REJECTED && (
                      <div className="text-xs text-red-400 space-y-1">
                        <p className="font-semibold flex items-center gap-1.5">
                          <X size={14} /> Pesanan Ditolak
                        </p>
                        {order.adminNote && <p className="text-[11px] text-red-300/80">{order.adminNote}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
