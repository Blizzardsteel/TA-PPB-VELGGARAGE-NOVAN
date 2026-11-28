import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const OrderContext = createContext(null);

const STORAGE_KEY = 'velggarage_orders';

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

export const ORDER_STATUS_META = {
  [ORDER_STATUS.PENDING]: {
    label: 'Menunggu ACC Admin',
    shortLabel: 'Menunggu ACC',
    description: 'Pesanan masuk dan sedang menunggu konfirmasi dari admin.',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  },
  [ORDER_STATUS.PROCESSING]: {
    label: 'Sedang Diproses',
    shortLabel: 'Processing',
    description: 'Pesanan telah di-ACC admin dan sedang disiapkan untuk pengiriman.',
    badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  [ORDER_STATUS.SHIPPED]: {
    label: 'Sudah Dikirim',
    shortLabel: 'Dikirim',
    description: 'Barang sudah dikirim dan sedang dalam perjalanan ke alamat Anda.',
    badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
  [ORDER_STATUS.COMPLETED]: {
    label: 'Selesai',
    shortLabel: 'Selesai',
    description: 'Pesanan telah diterima dengan baik.',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  [ORDER_STATUS.REJECTED]: {
    label: 'Ditolak',
    shortLabel: 'Ditolak',
    description: 'Pesanan dibatalkan atau ditolak oleh admin.',
    badgeClass: 'bg-red-500/15 text-red-400 border-red-500/30',
  },
};

function normalizeOrder(order) {
  return {
    ...order,
    status: order.status || ORDER_STATUS.PENDING,
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || order.createdAt || new Date().toISOString(),
    trackingNumber: order.trackingNumber || '',
    courier: order.courier || '',
    adminNote: order.adminNote || '',
  };
}

function loadOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(normalizeOrder) : [];
  } catch {
    return [];
  }
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore quota errors
    }
  }, [orders]);

  // Sync across tabs if admin and user are open in separate tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setOrders(loadOrders());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addOrder = useCallback((orderData) => {
    const now = new Date().toISOString();
    const newOrder = normalizeOrder({
      ...orderData,
      status: ORDER_STATUS.PENDING,
      createdAt: now,
      updatedAt: now,
    });
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((invoiceId, status, extra = {}) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) =>
        order.invoiceId === invoiceId
          ? {
              ...order,
              status,
              updatedAt: now,
              ...(extra.trackingNumber !== undefined ? { trackingNumber: extra.trackingNumber } : {}),
              ...(extra.courier !== undefined ? { courier: extra.courier } : {}),
              ...(extra.adminNote !== undefined ? { adminNote: extra.adminNote } : {}),
            }
          : order
      )
    );
  }, []);

  const getUserOrders = useCallback(
    (user) => {
      if (!user) return [];
      const userEmail = user.email?.toLowerCase();
      return orders.filter((order) => {
        if (order.userId && order.userId === user.id) return true;
        if (userEmail && order.userEmail?.toLowerCase() === userEmail) return true;
        if (userEmail && order.customer?.email?.toLowerCase() === userEmail) return true;
        return false;
      });
    },
    [orders]
  );

  const pendingCount = orders.filter((o) => o.status === ORDER_STATUS.PENDING).length;

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getUserOrders,
        pendingCount,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}

export default OrderContext;
