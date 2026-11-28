import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Camera,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Lock,
  Package,
  ShieldCheck,
  LogOut,
  LogIn,
  Car,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders, ORDER_STATUS } from '../context/OrderContext';
import AuthModal from '../components/AuthModal';

function resizeImageToDataUrl(file, maxSize = 256) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => reject(new Error('Gagal memproses gambar.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.readAsDataURL(file);
  });
}

export default function Profile() {
  const { currentUser, isLoggedIn, isAdmin, updateProfile, changePassword, logout } = useAuth();
  const { getUserOrders, pendingCount } = useOrders();
  const fileInputRef = useRef(null);

  const [authOpen, setAuthOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    carDetails: '',
    bio: '',
    profilePicture: '',
  });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        carDetails: currentUser.carDetails || '',
        bio: currentUser.bio || '',
        profilePicture: currentUser.profilePicture || '',
      });
    }
  }, [currentUser]);

  const userOrders = getUserOrders(currentUser);
  const activeOrdersCount = userOrders.filter(
    (o) => o.status === ORDER_STATUS.PENDING || o.status === ORDER_STATUS.PROCESSING || o.status === ORDER_STATUS.SHIPPED
  ).length;

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setProfileMsg({ type: 'error', text: 'File harus berupa gambar (JPG, PNG, WebP).' });
      return;
    }
    try {
      const dataUrl = await resizeImageToDataUrl(file, 256);
      setForm((prev) => ({ ...prev, profilePicture: dataUrl }));
      setProfileMsg({ type: '', text: '' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message });
    }
    e.target.value = '';
  };

  const handleRemovePicture = () => {
    setForm((prev) => ({ ...prev, profilePicture: '' }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const res = updateProfile(form);
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profil berhasil diperbarui.' });
    } else {
      setProfileMsg({ type: 'error', text: res.error });
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
      return;
    }
    const res = changePassword(pwForm.currentPassword, pwForm.newPassword);
    if (res.success) {
      setPwMsg({ type: 'success', text: 'Password berhasil diubah.' });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPwMsg({ type: 'error', text: res.error });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-16">
        <div className="card-base p-8 text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-vg-dark border border-vg-border mx-auto flex items-center justify-center">
            <User size={28} className="text-vg-gray" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-vg-white">
              Profil Pengguna
            </h1>
            <p className="text-sm text-vg-gray mt-2">
              Silakan masuk atau daftar terlebih dahulu untuk mengelola profil, foto profil, dan alamat pengiriman Anda.
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

  const memberSince = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('id-ID', {
        month: 'long',
        year: 'numeric',
      })
    : '-';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-vg-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-vg-gray mb-1">Akun Saya</p>
          <h1 className="section-title">Pengaturan Profil</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/orders"
            className="btn-outline py-2 px-4 text-xs inline-flex items-center gap-2"
          >
            <Package size={14} />
            Pesanan Saya
            {activeOrdersCount > 0 && (
              <span className="bg-vg-white text-vg-black text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {activeOrdersCount}
              </span>
            )}
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-2"
            >
              <ShieldCheck size={14} />
              Admin Panel
              {pendingCount > 0 && (
                <span className="bg-vg-black text-vg-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary */}
        <div className="space-y-6">
          <div className="card-base p-6 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-vg-dark border-2 border-vg-border overflow-hidden flex items-center justify-center">
                {form.profilePicture ? (
                  <img
                    src={form.profilePicture}
                    alt={form.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-black text-vg-white">
                    {currentUser?.avatar || form.name?.slice(0, 2).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-vg-white text-vg-black flex items-center justify-center shadow-lg hover:bg-vg-accent transition-colors"
                title="Ganti foto profil"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <h2 className="mt-4 text-lg font-bold text-vg-white">{form.name || currentUser?.name}</h2>
            <p className="text-xs text-vg-gray">{currentUser?.email}</p>

            <div className="mt-3 flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border ${
                  isAdmin
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-vg-dark text-vg-gray border-vg-border'
                }`}
              >
                {isAdmin ? 'Admin' : 'Member'}
              </span>
              <span className="text-[11px] text-vg-gray">Sejak {memberSince}</span>
            </div>

            <div className="mt-5 flex gap-2 w-full">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 btn-outline py-2 px-3 text-[11px]"
              >
                Upload Foto
              </button>
              {form.profilePicture && (
                <button
                  type="button"
                  onClick={handleRemovePicture}
                  className="p-2 border border-vg-border rounded text-vg-gray hover:text-red-400 hover:border-red-500/40 transition-colors"
                  title="Hapus foto profil"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
            <p className="text-[10px] text-vg-gray mt-2">
              Klik &ldquo;Simpan Perubahan&rdquo; setelah mengganti foto profil.
            </p>
          </div>

          {/* Account Actions */}
          <div className="card-base p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-vg-gray">
              Ringkasan Aktivitas
            </h3>
            <div className="flex justify-between text-xs py-2 border-b border-vg-border">
              <span className="text-vg-gray">Total Pesanan</span>
              <span className="font-bold text-vg-white">{userOrders.length}</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-b border-vg-border">
              <span className="text-vg-gray">Pesanan Aktif</span>
              <span className="font-bold text-vg-white">{activeOrdersCount}</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded text-xs font-semibold uppercase tracking-widest transition-colors"
            >
              <LogOut size={14} />
              Keluar Akun
            </button>
          </div>
        </div>

        {/* Right Column: Edit Form & Change Password */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleProfileSubmit} className="card-base p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-vg-border pb-3">
              <h3 className="text-sm font-bold uppercase tracking-widest text-vg-white">
                Informasi Profil &amp; Pengiriman
              </h3>
            </div>

            {profileMsg.text && (
              <div
                className={`p-3 rounded border text-xs flex items-center gap-2 ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {profileMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-vg-gray mb-1.5">
                  Display Name *
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vg-gray" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nama tampilan Anda"
                    className="w-full bg-vg-dark border border-vg-border rounded pl-9 pr-3 py-2.5 text-sm text-vg-white placeholder-vg-gray focus:outline-none focus:border-vg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-vg-gray mb-1.5">
                  Email (Akun)
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vg-gray" />
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || ''}
                    className="w-full bg-vg-dark/50 border border-vg-border rounded pl-9 pr-3 py-2.5 text-sm text-vg-gray cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-vg-gray mb-1.5">
                  Nomor WhatsApp / Telepon
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vg-gray" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                    className="w-full bg-vg-dark border border-vg-border rounded pl-9 pr-3 py-2.5 text-sm text-vg-white placeholder-vg-gray focus:outline-none focus:border-vg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-vg-gray mb-1.5">
                  Mobil / Fitment Default
                </label>
                <div className="relative">
                  <Car size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-vg-gray" />
                  <input
                    type="text"
                    value={form.carDetails}
                    onChange={(e) => setForm({ ...form, carDetails: e.target.value })}
                    placeholder="Contoh: Civic Type R FK8 (5x120)"
                    className="w-full bg-vg-dark border border-vg-border rounded pl-9 pr-3 py-2.5 text-sm text-vg-white placeholder-vg-gray focus:outline-none focus:border-vg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-vg-gray mb-1.5">
                Alamat Pengiriman Default
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-3 text-vg-gray" />
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Alamat lengkap untuk pengiriman velg (otomatis terisi saat checkout)"
                  className="w-full bg-vg-dark border border-vg-border rounded pl-9 pr-3 py-2.5 text-sm text-vg-white placeholder-vg-gray focus:outline-none focus:border-vg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-vg-gray mb-1.5">
                Bio / Catatan
              </label>
              <textarea
                rows={2}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Ceritakan setup atau preferensi velg Anda..."
                className="w-full bg-vg-dark border border-vg-border rounded px-3 py-2.5 text-sm text-vg-white placeholder-vg-gray focus:outline-none focus:border-vg-white"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="btn-primary py-2.5 px-6 text-xs inline-flex items-center gap-2"
              >
                <Save size={14} />
                Simpan Perubahan
              </button>
            </div>
          </form>

          {/* Change Password Card */}
          <form onSubmit={handlePasswordSubmit} className="card-base p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-vg-border pb-3">
              <Lock size={16} className="text-vg-gray" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-vg-white">
                Ubah Password
              </h3>
            </div>

            {pwMsg.text && (
              <div
                className={`p-3 rounded border text-xs flex items-center gap-2 ${
                  pwMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                {pwMsg.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                <span>{pwMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-vg-gray mb-1.5">
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  required
                  value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                  className="w-full bg-vg-dark border border-vg-border rounded px-3 py-2.5 text-sm text-vg-white focus:outline-none focus:border-vg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-vg-gray mb-1.5">
                  Password Baru
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                  className="w-full bg-vg-dark border border-vg-border rounded px-3 py-2.5 text-sm text-vg-white focus:outline-none focus:border-vg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-vg-gray mb-1.5">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                  className="w-full bg-vg-dark border border-vg-border rounded px-3 py-2.5 text-sm text-vg-white focus:outline-none focus:border-vg-white"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn-outline py-2 px-5 text-xs">
                Perbarui Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
