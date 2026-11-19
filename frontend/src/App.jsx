import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Wheels from './pages/Wheels';
import Brands from './pages/Brands';
import WheelDetail from './pages/WheelDetail';
import BrandDetail from './pages/BrandDetail';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Offline from './pages/Offline';
import { FavoritesProvider } from './context/FavoritesContext';

export default function App() {
  const location = useLocation();

  return (
    <FavoritesProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="wheels" element={<Wheels />} />
            <Route path="wheels/:id" element={<WheelDetail />} />
            <Route path="brands" element={<Brands />} />
            <Route path="brands/:id" element={<BrandDetail />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="about" element={<About />} />
            <Route path="offline" element={<Offline />} />
            <Route path="*" element={<Home />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </FavoritesProvider>
  );
}
