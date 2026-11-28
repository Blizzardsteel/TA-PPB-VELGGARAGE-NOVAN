import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'velggarage_auth';
const USERS_KEY   = 'velggarage_users';

// ── Dummy account siap pakai untuk testing ────────────────────
const DUMMY_USERS = [
  {
    id: 'dummy-1',
    name: 'Kevin Novan',
    email: 'kevin@velggarage.com',
    password: 'velg1234',
    phone: '081234567890',
    address: '',
    carDetails: '',
    bio: '',
    avatar: 'KN',
    profilePicture: '',
    role: 'user',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'dummy-2',
    name: 'Admin VelgGarage',
    email: 'admin@velggarage.com',
    password: 'admin123',
    phone: '082100000000',
    address: 'VelgGarage HQ, Jakarta',
    carDetails: '',
    bio: 'Official VelgGarage Administrator',
    avatar: 'AD',
    profilePicture: '',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

function loadUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    const savedUsers = stored ? JSON.parse(stored) : [];
    const savedByEmail = new Map(savedUsers.map((u) => [u.email.toLowerCase(), u]));

    // Ensure dummy users exist and keep their role if missing in older localStorage entries
    const mergedDummies = DUMMY_USERS.map((d) => {
      const existing = savedByEmail.get(d.email.toLowerCase());
      return existing ? { ...d, ...existing, role: d.role } : d;
    });

    const dummyEmails = new Set(DUMMY_USERS.map((d) => d.email.toLowerCase()));
    const otherUsers = savedUsers
      .filter((u) => !dummyEmails.has(u.email.toLowerCase()))
      .map((u) => ({ role: 'user', ...u }));

    return [...mergedDummies, ...otherUsers];
  } catch {
    return DUMMY_USERS;
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState(loadUsers);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  const getInitials = (name = '') => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.trim().slice(0, 2).toUpperCase() || 'U';
  };

  /**
   * Login dengan email + password
   * Returns: { success: boolean, error?: string }
   */
  const login = (email, password) => {
    const allUsers = loadUsers();
    const found = allUsers.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );
    if (!found) {
      return { success: false, error: 'Email atau password salah.' };
    }
    // Strip password from stored session
    const { password: _pw, ...safeUser } = found;
    setCurrentUser(safeUser);
    return { success: true };
  };

  /**
   * Register akun baru
   * Returns: { success: boolean, error?: string }
   */
  const register = (name, email, password, phone = '') => {
    const allUsers = loadUsers();
    if (allUsers.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { success: false, error: 'Email sudah terdaftar. Silakan login.' };
    }
    if (name.trim().length < 2) {
      return { success: false, error: 'Nama minimal 2 karakter.' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Password minimal 6 karakter.' };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim(),
      address: '',
      carDetails: '',
      bio: '',
      avatar: getInitials(name),
      profilePicture: '',
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);

    // Auto login setelah register
    const { password: _pw, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    return { success: true };
  };

  /**
   * Update profil pengguna (display name, profile picture, phone, address, carDetails, bio)
   */
  const updateProfile = (updates) => {
    if (!currentUser) {
      return { success: false, error: 'Anda harus login terlebih dahulu.' };
    }
    const nextName = updates.name !== undefined ? updates.name.trim() : currentUser.name;
    if (nextName.length < 2) {
      return { success: false, error: 'Display name minimal 2 karakter.' };
    }

    const sanitizedUpdates = {
      ...updates,
      name: nextName,
      avatar: getInitials(nextName),
      phone: updates.phone !== undefined ? updates.phone.trim() : currentUser.phone || '',
      address: updates.address !== undefined ? updates.address.trim() : currentUser.address || '',
      carDetails: updates.carDetails !== undefined ? updates.carDetails.trim() : currentUser.carDetails || '',
      bio: updates.bio !== undefined ? updates.bio.trim() : currentUser.bio || '',
    };

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...sanitizedUpdates } : u))
    );
    setCurrentUser((prev) => (prev ? { ...prev, ...sanitizedUpdates } : prev));
    return { success: true };
  };

  /**
   * Ubah password pengguna
   */
  const changePassword = (currentPassword, newPassword) => {
    if (!currentUser) {
      return { success: false, error: 'Anda harus login terlebih dahulu.' };
    }
    const allUsers = loadUsers();
    const target = allUsers.find((u) => u.id === currentUser.id);
    if (!target || target.password !== currentPassword) {
      return { success: false, error: 'Password saat ini tidak sesuai.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'Password baru minimal 6 karakter.' };
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, password: newPassword } : u))
    );
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isLoggedIn = !!currentUser;
  const isAdmin =
    currentUser?.role === 'admin' ||
    currentUser?.email?.toLowerCase() === 'admin@velggarage.com';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        isAdmin,
        login,
        register,
        updateProfile,
        changePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
