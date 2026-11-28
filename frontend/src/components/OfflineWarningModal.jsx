import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff, X } from 'lucide-react';

export default function OfflineWarningModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-vg-card border border-red-500/40 rounded-lg p-6 shadow-2xl text-center space-y-4"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-vg-gray hover:text-vg-white transition-colors"
            aria-label="Tutup peringatan"
          >
            <X size={18} />
          </button>

          <div className="w-14 h-14 mx-auto rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center">
            <WifiOff size={26} className="text-red-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-black uppercase tracking-wide text-vg-white">
              Anda Sedang Offline
            </h3>
            <p className="text-xs text-vg-gray leading-relaxed">
              Koneksi internet sedang terputus. Anda tidak bisa memesan atau membeli barang saat
              offline. Silakan hubungkan kembali ke internet untuk melanjutkan pembelian.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full btn-primary py-2.5 text-xs uppercase tracking-widest font-bold"
          >
            Mengerti
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
