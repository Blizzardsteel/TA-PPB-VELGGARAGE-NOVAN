import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialTab = 'login' }) {
  const [tab, setTab] = useState(initialTab);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  // Login form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setError('');
    setLoginData({ email: '', password: '' });
    setRegData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    setShowPass(false);
    onClose();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = login(loginData.email, loginData.password);
    setLoading(false);
    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (regData.password !== regData.confirmPassword) {
      setError('Password dan konfirmasi password tidak sama.');
      return;
    }
    setLoading(true);
    const result = register(regData.name, regData.email, regData.password, regData.phone);
    setLoading(false);
    if (result.success) {
      handleClose();
    } else {
      setError(result.error);
    }
  };

  const fillDummy = () => {
    setLoginData({ email: 'kevin@velggarage.com', password: 'velg1234' });
    setError('');
  };

  const fillAdmin = () => {
    setLoginData({ email: 'admin@velggarage.com', password: 'admin123' });
    setError('');
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-vg-card border border-vg-border rounded-lg shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-vg-border bg-vg-dark/60">
            <div className="flex gap-1">
              <button
                onClick={() => { setTab('login'); setError(''); }}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                  tab === 'login'
                    ? 'bg-vg-white text-vg-black'
                    : 'text-vg-gray hover:text-vg-white'
                }`}
              >
                Masuk
              </button>
              <button
                onClick={() => { setTab('register'); setError(''); }}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                  tab === 'register'
                    ? 'bg-vg-white text-vg-black'
                    : 'text-vg-gray hover:text-vg-white'
                }`}
              >
                Daftar
              </button>
            </div>
            <button onClick={handleClose} className="p-1 text-vg-gray hover:text-vg-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {error && (
              <div className="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs">
                {error}
              </div>
            )}

            {/* ── LOGIN TAB ──────────────────────────────────── */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs text-vg-gray uppercase tracking-widest mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="email@kamu.com"
                    className="w-full bg-vg-dark border border-vg-border text-vg-white placeholder-vg-gray/50 px-3 py-2.5 text-sm rounded focus:outline-none focus:border-vg-gray"
                  />
                </div>
                <div>
                  <label className="block text-xs text-vg-gray uppercase tracking-widest mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-vg-dark border border-vg-border text-vg-white placeholder-vg-gray/50 px-3 py-2.5 pr-10 text-sm rounded focus:outline-none focus:border-vg-gray"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-vg-gray hover:text-vg-white"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                >
                  <LogIn size={16} />
                  {loading ? 'Memproses...' : 'MASUK'}
                </button>

                {/* Dummy account helper */}
                <div className="pt-2 border-t border-vg-border/50 space-y-2">
                  <p className="text-vg-gray text-xs text-center">Pakai akun demo untuk testing:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={fillDummy}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-vg-border/50 text-vg-gray hover:text-vg-white hover:border-vg-gray text-[11px] uppercase tracking-wider rounded transition-colors"
                    >
                      <ShieldCheck size={13} />
                      Demo User
                    </button>
                    <button
                      type="button"
                      onClick={fillAdmin}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-[11px] uppercase tracking-wider rounded transition-colors"
                    >
                      <ShieldCheck size={13} />
                      Demo Admin
                    </button>
                  </div>
                </div>

                <p className="text-center text-xs text-vg-gray">
                  Belum punya akun?{' '}
                  <button type="button" onClick={() => setTab('register')} className="text-vg-white underline">
                    Daftar sekarang
                  </button>
                </p>
              </form>
            )}

            {/* ── REGISTER TAB ───────────────────────────────── */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-xs text-vg-gray uppercase tracking-widest mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    placeholder="Nama kamu"
                    className="w-full bg-vg-dark border border-vg-border text-vg-white placeholder-vg-gray/50 px-3 py-2.5 text-sm rounded focus:outline-none focus:border-vg-gray"
                  />
                </div>
                <div>
                  <label className="block text-xs text-vg-gray uppercase tracking-widest mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    placeholder="email@kamu.com"
                    className="w-full bg-vg-dark border border-vg-border text-vg-white placeholder-vg-gray/50 px-3 py-2.5 text-sm rounded focus:outline-none focus:border-vg-gray"
                  />
                </div>
                <div>
                  <label className="block text-xs text-vg-gray uppercase tracking-widest mb-1.5">No. WhatsApp <span className="normal-case text-vg-gray/50">(opsional)</span></label>
                  <input
                    type="tel"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full bg-vg-dark border border-vg-border text-vg-white placeholder-vg-gray/50 px-3 py-2.5 text-sm rounded focus:outline-none focus:border-vg-gray"
                  />
                </div>
                <div>
                  <label className="block text-xs text-vg-gray uppercase tracking-widest mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      placeholder="Minimal 6 karakter"
                      className="w-full bg-vg-dark border border-vg-border text-vg-white placeholder-vg-gray/50 px-3 py-2.5 pr-10 text-sm rounded focus:outline-none focus:border-vg-gray"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-vg-gray hover:text-vg-white"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-vg-gray uppercase tracking-widest mb-1.5">Konfirmasi Password</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={regData.confirmPassword}
                    onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                    placeholder="Ulangi password"
                    className="w-full bg-vg-dark border border-vg-border text-vg-white placeholder-vg-gray/50 px-3 py-2.5 text-sm rounded focus:outline-none focus:border-vg-gray"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                >
                  <UserPlus size={16} />
                  {loading ? 'Mendaftarkan...' : 'BUAT AKUN'}
                </button>

                <p className="text-center text-xs text-vg-gray">
                  Sudah punya akun?{' '}
                  <button type="button" onClick={() => setTab('login')} className="text-vg-white underline">
                    Masuk di sini
                  </button>
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
