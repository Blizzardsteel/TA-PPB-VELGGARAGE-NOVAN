import { Component, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Wheels from './pages/Wheels';
import Brands from './pages/Brands';
import WheelDetail from './pages/WheelDetail';
import BrandDetail from './pages/BrandDetail';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Offline from './pages/Offline';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import AdminOrders from './pages/AdminOrders';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-vg-black text-vg-white flex flex-col items-center justify-center p-6 text-center gap-4">
          <p className="text-lg font-bold uppercase tracking-widest">Terjadi Kesalahan Tampilan</p>
          <p className="text-sm text-vg-gray max-w-sm">
            Halaman gagal dimuat. Silakan muat ulang atau kembali ke beranda.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
            className="btn-primary text-xs"
          >
            Kembali ke Beranda
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <FavoritesProvider>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="wheels" element={<Wheels />} />
                  <Route path="wheels/:id" element={<WheelDetail />} />
                  <Route path="brands" element={<Brands />} />
                  <Route path="brands/:id" element={<BrandDetail />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="about" element={<About />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="admin" element={<AdminOrders />} />
                  <Route path="offline" element={<Offline />} />
                  <Route path="*" element={<Home />} />
                </Route>
              </Routes>
            </FavoritesProvider>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
