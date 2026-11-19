import { Link } from 'react-router-dom';
import { WifiOff } from 'lucide-react';

export default function Offline() {
  return (
    <div className="min-h-screen bg-vg-black flex flex-col items-center justify-center px-4 text-center gap-6">
      <div className="w-20 h-20 rounded-full border border-vg-border flex items-center justify-center">
        <WifiOff size={32} className="text-vg-gray" />
      </div>
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-vg-white mb-3">
          You're Offline
        </h1>
        <p className="text-vg-gray text-sm max-w-xs leading-relaxed">
          VelgGarage requires an internet connection to load new data. Previously cached pages may
          still be available.
        </p>
      </div>
      <Link to="/" className="btn-primary text-sm">
        Go Home
      </Link>
    </div>
  );
}
