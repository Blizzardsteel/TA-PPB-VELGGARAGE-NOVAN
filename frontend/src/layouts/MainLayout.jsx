import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';

export default function MainLayout() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-vg-black pb-16 md:pb-0 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-16">
        {!isOnline && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-300 px-4 py-2 text-xs flex items-center justify-center gap-2">
            <WifiOff size={14} className="shrink-0" />
            <span>Mode Offline — Menampilkan katalog dan data tersimpan.</span>
          </div>
        )}
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
