import { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  Search,
  Disc,
  Tag,
} from 'lucide-react';
import { productsApi, brandsApi } from '../services/api';
import { formatPrice } from '../utils/helpers';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const CATEGORY_OPTIONS = ['Sport', 'Racing', 'Custom', 'Luxury', 'Off-Road'];
const CONSTRUCTION_OPTIONS = ['Forged', 'Flow Formed', 'Monoblock', 'Multi-piece', 'Cast'];

const emptySpec = () => ({
  diameter: '',
  width: '',
  pcd: '',
  offset_range: '',
  finish: '',
  weight_kg: '',
  load_rating: '',
});

const emptyWheelForm = (defaultBrandId = '') => ({
  name: '',
  model: '',
  brand_id: defaultBrandId,
  category: 'Sport',
  construction_type: 'Forged',
  material: 'Forged aluminum',
  description: '',
  price: '45000000',
  stock: '4',
  image_url: '',
  manufacturer_source_url: '',
  is_featured: false,
  specifications: [emptySpec()],
});

const emptyBrandForm = () => ({
  name: '',
  country: '',
  founded_year: '',
  logo_url: '',
  website_url: '',
  description: '',
});

function readFileAsDataUrl(file, maxSizeKb = 1500) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('File tidak valid'));
    if (file.size > maxSizeKb * 1024) {
      return reject(new Error(`Ukuran gambar maksimal ${maxSizeKb / 1000} MB`));
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
    reader.readAsDataURL(file);
  });
}

export default function AdminCatalogManager({ mode = 'wheels' }) {
  const isOnline = useOnlineStatus();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: string }

  // Wheel modal/form state
  const [wheelFormOpen, setWheelFormOpen] = useState(false);
  const [editingWheelId, setEditingWheelId] = useState(null);
  const [wheelForm, setWheelForm] = useState(emptyWheelForm());
  const [savingWheel, setSavingWheel] = useState(false);

  // Brand modal/form state
  const [brandFormOpen, setBrandFormOpen] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState(null);
  const [brandForm, setBrandForm] = useState(emptyBrandForm());
  const [savingBrand, setSavingBrand] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, brandRes] = await Promise.all([
        productsApi.getAll(),
        brandsApi.getAll(),
      ]);
      const prodList = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data?.data || [];
      const brandList = Array.isArray(brandRes.data) ? brandRes.data : brandRes.data?.data || [];
      setProducts(prodList);
      setBrands(brandList);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Gagal memuat data katalog.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotice = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => {
      setFeedback((curr) => (curr?.text === text ? null : curr));
    }, 4500);
  };

  // ── Wheel Handlers ──────────────────────────────────────────────────────────
  const openCreateWheel = () => {
    setEditingWheelId(null);
    setWheelForm(emptyWheelForm(brands[0]?.id ? String(brands[0].id) : ''));
    setWheelFormOpen(true);
  };

  const openEditWheel = (wheel) => {
    setEditingWheelId(wheel.id);
    const specs = Array.isArray(wheel.specifications) && wheel.specifications.length > 0
      ? wheel.specifications.map((s) => ({
          diameter: s.diameter ?? '',
          width: s.width ?? '',
          pcd: s.pcd ?? '',
          offset_range: s.offset_range ?? '',
          finish: s.finish ?? '',
          weight_kg: s.weight_kg ?? '',
          load_rating: s.load_rating ?? '',
        }))
      : [emptySpec()];

    setWheelForm({
      name: wheel.name || '',
      model: wheel.model || '',
      brand_id: wheel.brand_id ? String(wheel.brand_id) : '',
      category: wheel.category || 'Sport',
      construction_type: wheel.construction_type || 'Forged',
      material: wheel.material || '',
      description: wheel.description || '',
      price: wheel.price !== undefined ? String(wheel.price) : '45000000',
      stock: wheel.stock !== undefined ? String(wheel.stock) : '4',
      image_url: wheel.image_url || '',
      manufacturer_source_url: wheel.manufacturer_source_url || '',
      is_featured: Boolean(wheel.is_featured),
      specifications: specs,
    });
    setWheelFormOpen(true);
  };

  const handleSpecChange = (idx, field, value) => {
    setWheelForm((prev) => ({
      ...prev,
      specifications: prev.specifications.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    }));
  };

  const addSpecRow = () => {
    setWheelForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, emptySpec()],
    }));
  };

  const removeSpecRow = (idx) => {
    setWheelForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== idx),
    }));
  };

  const handleWheelImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setWheelForm((prev) => ({ ...prev, image_url: dataUrl }));
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleSaveWheel = async (e) => {
    e.preventDefault();
    if (!isOnline) {
      showNotice('error', 'Anda sedang offline, tidak bisa menyimpan ke database.');
      return;
    }
    if (!wheelForm.name.trim()) {
      showNotice('error', 'Nama velg wajib diisi.');
      return;
    }

    try {
      setSavingWheel(true);
      const payload = {
        ...wheelForm,
        brand_id: wheelForm.brand_id ? Number(wheelForm.brand_id) : null,
        price: Number(wheelForm.price) || 0,
        stock: Number(wheelForm.stock) || 0,
      };

      if (editingWheelId) {
        await productsApi.update(editingWheelId, payload);
        showNotice('success', `Velg "${wheelForm.name}" berhasil diperbarui.`);
      } else {
        await productsApi.create(payload);
        showNotice('success', `Velg "${wheelForm.name}" berhasil ditambahkan ke database.`);
      }
      setWheelFormOpen(false);
      await loadData();
    } catch (err) {
      showNotice('error', err.response?.data?.error || err.message || 'Gagal menyimpan velg.');
    } finally {
      setSavingWheel(false);
    }
  };

  const handleDeleteWheel = async (wheel) => {
    if (!isOnline) {
      showNotice('error', 'Anda sedang offline, tidak bisa menghapus data.');
      return;
    }
    if (!window.confirm(`Hapus velg "${wheel.name}" dari database?`)) return;

    try {
      await productsApi.remove(wheel.id);
      showNotice('success', `Velg "${wheel.name}" berhasil dihapus.`);
      await loadData();
    } catch (err) {
      showNotice('error', err.response?.data?.error || err.message || 'Gagal menghapus velg.');
    }
  };

  // ── Brand Handlers ──────────────────────────────────────────────────────────
  const openCreateBrand = () => {
    setEditingBrandId(null);
    setBrandForm(emptyBrandForm());
    setBrandFormOpen(true);
  };

  const openEditBrand = (brand) => {
    setEditingBrandId(brand.id);
    setBrandForm({
      name: brand.name || '',
      country: brand.country || '',
      founded_year: brand.founded_year ? String(brand.founded_year) : '',
      logo_url: brand.logo_url || '',
      website_url: brand.website_url || '',
      description: brand.description || '',
    });
    setBrandFormOpen(true);
  };

  const handleBrandImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setBrandForm((prev) => ({ ...prev, logo_url: dataUrl }));
    } catch (err) {
      showNotice('error', err.message);
    }
  };

  const handleSaveBrand = async (e) => {
    e.preventDefault();
    if (!isOnline) {
      showNotice('error', 'Anda sedang offline, tidak bisa menyimpan ke database.');
      return;
    }
    if (!brandForm.name.trim()) {
      showNotice('error', 'Nama brand wajib diisi.');
      return;
    }

    try {
      setSavingBrand(true);
      const payload = {
        ...brandForm,
        founded_year: brandForm.founded_year ? Number(brandForm.founded_year) : null,
      };

      if (editingBrandId) {
        await brandsApi.update(editingBrandId, payload);
        showNotice('success', `Brand "${brandForm.name}" berhasil diperbarui.`);
      } else {
        await brandsApi.create(payload);
        showNotice('success', `Brand "${brandForm.name}" berhasil ditambahkan ke database.`);
      }
      setBrandFormOpen(false);
      await loadData();
    } catch (err) {
      showNotice('error', err.response?.data?.error || err.message || 'Gagal menyimpan brand.');
    } finally {
      setSavingBrand(false);
    }
  };

  const handleDeleteBrand = async (brand) => {
    if (!isOnline) {
      showNotice('error', 'Anda sedang offline, tidak bisa menghapus data.');
      return;
    }
    if (!window.confirm(`Hapus brand "${brand.name}"? Semua velg di bawah brand ini juga dapat terpengaruh.`)) {
      return;
    }

    try {
      await brandsApi.remove(brand.id);
      showNotice('success', `Brand "${brand.name}" berhasil dihapus.`);
      await loadData();
    } catch (err) {
      showNotice('error', err.response?.data?.error || err.message || 'Gagal menghapus brand.');
    }
  };

  const q = search.trim().toLowerCase();
  const filteredProducts = products.filter(
    (p) =>
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.brand?.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.construction_type?.toLowerCase().includes(q)
  );
  const filteredBrands = brands.filter(
    (b) =>
      !q ||
      b.name?.toLowerCase().includes(q) ||
      b.country?.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-6">
      {/* Offline warning */}
      {!isOnline && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded">
          <WifiOff size={15} className="shrink-0" />
          <span>Anda sedang offline. Penambahan, edit, dan penghapusan data ke database dinonaktifkan sementara.</span>
        </div>
      )}

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`flex items-center justify-between gap-2 p-3 text-xs rounded border ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="hover:opacity-75">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vg-gray" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={mode === 'wheels' ? 'Cari nama velg, brand, kategori...' : 'Cari nama brand atau negara...'}
            className="w-full bg-vg-card border border-vg-border pl-10 pr-4 py-2.5 text-sm text-vg-white placeholder-vg-gray focus:outline-none focus:border-vg-white"
          />
        </div>
        <button
          onClick={mode === 'wheels' ? openCreateWheel : openCreateBrand}
          disabled={!isOnline}
          className="btn-primary flex items-center justify-center gap-2 text-xs py-2.5 px-4 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={15} />
          {mode === 'wheels' ? 'Tambah Velg Baru' : 'Tambah Brand Baru'}
        </button>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="card-base p-10 text-center text-sm text-vg-gray">
          Memuat data dari database...
        </div>
      ) : mode === 'wheels' ? (
        <div className="space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="card-base p-10 text-center space-y-2">
              <Disc size={28} className="mx-auto text-vg-gray" />
              <p className="text-sm text-vg-white font-semibold">Belum ada data velg</p>
              <p className="text-xs text-vg-gray">Klik &ldquo;Tambah Velg Baru&rdquo; untuk menambahkan ke katalog.</p>
            </div>
          ) : (
            filteredProducts.map((wheel) => (
              <div
                key={wheel.id}
                className="card-base p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 bg-vg-dark border border-vg-border rounded shrink-0 flex items-center justify-center p-1.5 overflow-hidden">
                    {wheel.image_url ? (
                      <img
                        src={wheel.image_url}
                        alt={wheel.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ImageIcon size={20} className="text-vg-gray" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] uppercase tracking-widest text-vg-gray">
                        {wheel.brand?.name || 'No Brand'}
                      </span>
                      {wheel.is_featured && (
                        <span className="text-[10px] bg-vg-white text-vg-black px-1.5 py-0.5 font-bold uppercase tracking-wider">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-vg-white truncate">{wheel.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-vg-gray">
                      <span className="text-vg-white font-semibold">{formatPrice(wheel.price || 0)}</span>
                      <span>·</span>
                      <span>Stok: {wheel.stock ?? 0}</span>
                      {wheel.category && (
                        <>
                          <span>·</span>
                          <span className="border border-vg-border px-1.5 py-0.5 text-[10px] uppercase">
                            {wheel.category}
                          </span>
                        </>
                      )}
                      {wheel.construction_type && (
                        <span className="border border-vg-border px-1.5 py-0.5 text-[10px] uppercase">
                          {wheel.construction_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditWheel(wheel)}
                    disabled={!isOnline}
                    className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteWheel(wheel)}
                    disabled={!isOnline}
                    className="border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs py-2 px-3 flex items-center gap-1.5 transition-colors disabled:opacity-40"
                  >
                    <Trash2 size={13} /> Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredBrands.length === 0 ? (
            <div className="md:col-span-2 card-base p-10 text-center space-y-2">
              <Tag size={28} className="mx-auto text-vg-gray" />
              <p className="text-sm text-vg-white font-semibold">Belum ada data brand</p>
              <p className="text-xs text-vg-gray">Klik &ldquo;Tambah Brand Baru&rdquo; untuk menambahkan.</p>
            </div>
          ) : (
            filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="card-base p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-14 h-14 bg-vg-dark border border-vg-border rounded shrink-0 flex items-center justify-center p-2 overflow-hidden">
                    {brand.logo_url ? (
                      <img
                        src={brand.logo_url}
                        alt={brand.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-lg font-black text-vg-white">{brand.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-vg-white truncate">{brand.name}</h3>
                    <p className="text-xs text-vg-gray truncate">
                      {brand.country || 'International'}
                      {brand.founded_year ? ` · Est. ${brand.founded_year}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEditBrand(brand)}
                    disabled={!isOnline}
                    className="btn-outline text-xs py-1.5 px-2.5 flex items-center gap-1 disabled:opacity-40"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBrand(brand)}
                    disabled={!isOnline}
                    className="border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs py-1.5 px-2.5 flex items-center gap-1 transition-colors disabled:opacity-40"
                  >
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Wheel Form Modal ──────────────────────────────────────────────────── */}
      {wheelFormOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setWheelFormOpen(false); }}
        >
          <div className="bg-vg-card border border-vg-border rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-vg-border shrink-0">
              <h2 className="text-sm font-black uppercase tracking-widest text-vg-white">
                {editingWheelId ? 'Edit Data Velg' : 'Tambah Velg Baru'}
              </h2>
              <button onClick={() => setWheelFormOpen(false)} className="text-vg-gray hover:text-vg-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveWheel} className="p-5 overflow-y-auto space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-vg-gray block mb-1">
                    Nama Velg *
                  </label>
                  <input
                    type="text"
                    required
                    value={wheelForm.name}
                    onChange={(e) => setWheelForm({ ...wheelForm, name: e.target.value })}
                    placeholder="Contoh: Volk Racing TE37 Saga"
                    className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white focus:outline-none focus:border-vg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-vg-gray block mb-1">
                    Brand *
                  </label>
                  <select
                    value={wheelForm.brand_id}
                    onChange={(e) => setWheelForm({ ...wheelForm, brand_id: e.target.value })}
                    className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white focus:outline-none focus:border-vg-white"
                  >
                    <option value="">-- Pilih Brand --</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-vg-gray block mb-1">
                    Model
                  </label>
                  <input
                    type="text"
                    value={wheelForm.model}
                    onChange={(e) => setWheelForm({ ...wheelForm, model: e.target.value })}
                    placeholder="TE37 Saga"
                    className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white focus:outline-none focus:border-vg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-vg-gray block mb-1">
                    Harga (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={wheelForm.price}
                    onChange={(e) => setWheelForm({ ...wheelForm, price: e.target.value })}
                    className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white focus:outline-none focus:border-vg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-vg-gray block mb-1">
                    Stok (Set)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={wheelForm.stock}
                    onChange={(e) => setWheelForm({ ...wheelForm, stock: e.target.value })}
                    className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white focus:outline-none focus:border-vg-white"
                  />
                </div>
              </div>

              {/* Filters / Classification */}
              <div className="p-3 bg-vg-dark/60 border border-vg-border rounded space-y-3">
                <p className="text-[11px] uppercase tracking-widest text-vg-white font-bold">
                  Penempatan Filter Katalog
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-vg-gray block mb-1">
                      Kategori Filter
                    </label>
                    <select
                      value={wheelForm.category}
                      onChange={(e) => setWheelForm({ ...wheelForm, category: e.target.value })}
                      className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white text-xs focus:outline-none focus:border-vg-white"
                    >
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-vg-gray block mb-1">
                      Tipe Konstruksi
                    </label>
                    <select
                      value={wheelForm.construction_type}
                      onChange={(e) => setWheelForm({ ...wheelForm, construction_type: e.target.value })}
                      className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white text-xs focus:outline-none focus:border-vg-white"
                    >
                      {CONSTRUCTION_OPTIONS.map((ct) => (
                        <option key={ct} value={ct}>{ct}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-vg-gray block mb-1">
                      Material
                    </label>
                    <input
                      type="text"
                      value={wheelForm.material}
                      onChange={(e) => setWheelForm({ ...wheelForm, material: e.target.value })}
                      placeholder="Forged aluminum"
                      className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white text-xs focus:outline-none focus:border-vg-white"
                    />
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 text-xs text-vg-gray cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wheelForm.is_featured}
                    onChange={(e) => setWheelForm({ ...wheelForm, is_featured: e.target.checked })}
                    className="accent-white"
                  />
                  <span>Tampilkan di Featured Collections (Beranda &amp; Filter Featured)</span>
                </label>
              </div>

              {/* Image URL or Upload */}
              <div>
                <label className="text-[11px] uppercase tracking-widest text-vg-gray block mb-1">
                  Gambar Velg (URL atau Upload File)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={wheelForm.image_url}
                    onChange={(e) => setWheelForm({ ...wheelForm, image_url: e.target.value })}
                    placeholder="https://... atau /assets/wheels/..."
                    className="flex-1 bg-vg-dark border border-vg-border px-3 py-2 text-vg-white text-xs focus:outline-none focus:border-vg-white"
                  />
                  <label className="btn-outline text-xs py-2 px-3 flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                    <Upload size={14} />
                    <span>Upload Gambar</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleWheelImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {wheelForm.image_url && (
                  <div className="mt-2 w-24 h-24 bg-vg-dark border border-vg-border rounded p-1.5 flex items-center justify-center">
                    <img src={wheelForm.image_url} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] uppercase tracking-widest text-vg-gray block mb-1">
                  Deskripsi Velg
                </label>
                <textarea
                  rows={3}
                  value={wheelForm.description}
                  onChange={(e) => setWheelForm({ ...wheelForm, description: e.target.value })}
                  placeholder="Deskripsi singkat tentang desain, keunggulan, dan peruntukan velg..."
                  className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white text-xs focus:outline-none focus:border-vg-white"
                />
              </div>

              {/* Specifications */}
              <div className="space-y-2 border-t border-vg-border pt-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-widest text-vg-white font-bold">
                    Spesifikasi / Fitment
                  </label>
                  <button
                    type="button"
                    onClick={addSpecRow}
                    className="text-xs text-vg-white hover:underline flex items-center gap-1"
                  >
                    <Plus size={13} /> Tambah Varian Spec
                  </button>
                </div>
                {wheelForm.specifications.map((spec, idx) => (
                  <div key={idx} className="p-3 bg-vg-dark border border-vg-border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest text-vg-gray">
                        Spec #{idx + 1}
                      </span>
                      {wheelForm.specifications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSpecRow(idx)}
                          className="text-red-400 text-[11px] hover:underline"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <input
                        type="number"
                        step="0.5"
                        placeholder="Diameter (18)"
                        value={spec.diameter}
                        onChange={(e) => handleSpecChange(idx, 'diameter', e.target.value)}
                        className="bg-vg-card border border-vg-border px-2.5 py-1.5 text-xs text-vg-white"
                      />
                      <input
                        type="number"
                        step="0.5"
                        placeholder="Lebar (8.5)"
                        value={spec.width}
                        onChange={(e) => handleSpecChange(idx, 'width', e.target.value)}
                        className="bg-vg-card border border-vg-border px-2.5 py-1.5 text-xs text-vg-white"
                      />
                      <input
                        type="text"
                        placeholder="PCD (5x114.3)"
                        value={spec.pcd}
                        onChange={(e) => handleSpecChange(idx, 'pcd', e.target.value)}
                        className="bg-vg-card border border-vg-border px-2.5 py-1.5 text-xs text-vg-white"
                      />
                      <input
                        type="text"
                        placeholder="Offset (+35)"
                        value={spec.offset_range}
                        onChange={(e) => handleSpecChange(idx, 'offset_range', e.target.value)}
                        className="bg-vg-card border border-vg-border px-2.5 py-1.5 text-xs text-vg-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Finish (Bronze / Gold)"
                        value={spec.finish}
                        onChange={(e) => handleSpecChange(idx, 'finish', e.target.value)}
                        className="bg-vg-card border border-vg-border px-2.5 py-1.5 text-xs text-vg-white"
                      />
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Berat kg (opsional)"
                        value={spec.weight_kg}
                        onChange={(e) => handleSpecChange(idx, 'weight_kg', e.target.value)}
                        className="bg-vg-card border border-vg-border px-2.5 py-1.5 text-xs text-vg-white"
                      />
                      <input
                        type="number"
                        placeholder="Load Rating kg (opsional)"
                        value={spec.load_rating}
                        onChange={(e) => handleSpecChange(idx, 'load_rating', e.target.value)}
                        className="bg-vg-card border border-vg-border px-2.5 py-1.5 text-xs text-vg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-vg-border">
                <button
                  type="button"
                  onClick={() => setWheelFormOpen(false)}
                  className="btn-outline text-xs py-2.5 px-4"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingWheel || !isOnline}
                  className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 disabled:opacity-40"
                >
                  <Save size={14} />
                  {savingWheel ? 'Menyimpan...' : editingWheelId ? 'Simpan Perubahan' : 'Simpan ke Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Brand Form Modal ──────────────────────────────────────────────────── */}
      {brandFormOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setBrandFormOpen(false); }}
        >
          <div className="bg-vg-card border border-vg-border rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-vg-border shrink-0">
              <h2 className="text-sm font-black uppercase tracking-widest text-vg-white">
                {editingBrandId ? 'Edit Brand' : 'Tambah Brand Baru'}
              </h2>
              <button onClick={() => setBrandFormOpen(false)} className="text-vg-gray hover:text-vg-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBrand} className="p-5 overflow-y-auto space-y-4 text-sm">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-vg-gray block mb-1">
                  Nama Brand *
                </label>
                <input
                  type="text"
                  required
                  value={brandForm.name}
                  onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                  placeholder="Contoh: HRE Wheels"
                  className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white focus:outline-none focus:border-vg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-vg-gray block mb-1">
                    Negara Asal
                  </label>
                  <input
                    type="text"
                    value={brandForm.country}
                    onChange={(e) => setBrandForm({ ...brandForm, country: e.target.value })}
                    placeholder="USA / Japan / Germany"
                    className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white focus:outline-none focus:border-vg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-vg-gray block mb-1">
                    Tahun Berdiri
                  </label>
                  <input
                    type="number"
                    value={brandForm.founded_year}
                    onChange={(e) => setBrandForm({ ...brandForm, founded_year: e.target.value })}
                    placeholder="1978"
                    className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white focus:outline-none focus:border-vg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-widest text-vg-gray block mb-1">
                  Logo Brand (URL atau Upload File)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={brandForm.logo_url}
                    onChange={(e) => setBrandForm({ ...brandForm, logo_url: e.target.value })}
                    placeholder="https://... atau /assets/brands/..."
                    className="flex-1 bg-vg-dark border border-vg-border px-3 py-2 text-vg-white text-xs focus:outline-none focus:border-vg-white"
                  />
                  <label className="btn-outline text-xs py-2 px-3 flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                    <Upload size={14} />
                    <span>Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBrandImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {brandForm.logo_url && (
                  <div className="mt-2 w-20 h-20 bg-vg-dark border border-vg-border rounded p-1.5 flex items-center justify-center">
                    <img src={brandForm.logo_url} alt="Logo preview" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-widest text-vg-gray block mb-1">
                  Website Resmi
                </label>
                <input
                  type="url"
                  value={brandForm.website_url}
                  onChange={(e) => setBrandForm({ ...brandForm, website_url: e.target.value })}
                  placeholder="https://www.hrewheels.com"
                  className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white text-xs focus:outline-none focus:border-vg-white"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-widest text-vg-gray block mb-1">
                  Deskripsi Brand
                </label>
                <textarea
                  rows={3}
                  value={brandForm.description}
                  onChange={(e) => setBrandForm({ ...brandForm, description: e.target.value })}
                  placeholder="Deskripsi singkat tentang brand..."
                  className="w-full bg-vg-dark border border-vg-border px-3 py-2 text-vg-white text-xs focus:outline-none focus:border-vg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-vg-border">
                <button
                  type="button"
                  onClick={() => setBrandFormOpen(false)}
                  className="btn-outline text-xs py-2.5 px-4"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingBrand || !isOnline}
                  className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 disabled:opacity-40"
                >
                  <Save size={14} />
                  {savingBrand ? 'Menyimpan...' : editingBrandId ? 'Simpan Perubahan' : 'Simpan ke Database'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
