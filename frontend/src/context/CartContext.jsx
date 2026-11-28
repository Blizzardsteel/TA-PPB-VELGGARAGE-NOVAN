import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'velggarage_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  /** Tambah item ke keranjang. Jika sudah ada, naikkan quantity */
  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        const maxQty = product.stock ?? 5;
        const newQty = Math.min(existing.qty + qty, maxQty);
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: newQty } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          brand: product.brand?.name || 'Unknown Brand',
          price: product.price || 0,
          stock: product.stock ?? 5,
          image_url: product.image_url || null,
          slug: product.slug || String(product.id),
          qty,
        },
      ];
    });
  };

  /** Update quantity item di keranjang */
  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, i.stock) } : i))
    );
  };

  /** Hapus satu item dari keranjang */
  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  /** Kosongkan seluruh keranjang */
  const clearCart = () => {
    setItems([]);
  };

  /** Cek apakah produk ada di keranjang */
  const isInCart = (id) => items.some((i) => i.id === id);

  /** Total item (sum of qty) */
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  /** Total harga */
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        isInCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export default CartContext;
