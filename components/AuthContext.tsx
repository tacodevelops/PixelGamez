'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'moderator' | 'owner';
  avatarUrl: string;
  aboutMe: string;
  workingOn: string;
  country: string;
  favoriteGames: string[];
  recentGames: string[];
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isModerator: boolean;
  isOwner: boolean;
  loading: boolean;
  showAuthModal: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  loginWithGoogle: (credential: string) => Promise<{ error?: string; isNewUser?: boolean }>;
  register: (email: string, password: string, displayName: string, code: string) => Promise<{ error?: string }>;
  requestOTP: (email: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<{ error?: string }>;
  updateBio: (data: { aboutMe?: string; workingOn?: string; country?: string }) => Promise<{ error?: string }>;
  toggleFavorite: (gameId: string, action: 'add' | 'remove') => Promise<{ error?: string }>;
  addRecentGame: (gameId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Login failed.' };
    setUser(data.user);
    return { success: true };
  };

  const loginWithGoogle = async (credential: string) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Google login failed.' };
    setUser(data.user);
    return { success: true, isNewUser: data.isNewUser };
  };

  const requestOTP = async (email: string) => {
    const res = await fetch('/api/auth/register-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Failed to send OTP.' };
    return {};
  };

  const register = async (email: string, password: string, displayName: string, code: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName, code }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Registration failed.' };
    setUser(data.user);
    return { success: true };
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await fetch('/api/auth/avatar', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Upload failed.' };
    setUser(data.user);
    return {};
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const updateBio = async (data: { aboutMe?: string; workingOn?: string; country?: string }) => {
    const res = await fetch('/api/auth/bio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || 'Update failed.' };
    setUser(result.user);
    return {};
  };

  const updateDisplayName = async (displayName: string) => {
    const res = await fetch('/api/auth/display-name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName }),
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || 'Update failed.' };
    setUser(result.user);
    return {};
  };

  const toggleFavorite = async (gameId: string, action: 'add' | 'remove') => {
    const res = await fetch(`/api/auth/favorite/${gameId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    const result = await res.json();
    if (!res.ok) return { error: result.error || 'Failed.' };
    setUser(result.user);
    return {};
  };

  const addRecentGame = async (gameId: string) => {
    if (!user) return;
    const res = await fetch('/api/user/recent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId })
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      isModerator: user?.role === 'moderator' || user?.role === 'owner',
      isOwner: user?.role === 'owner',
      loading,
      showAuthModal,
      openAuthModal: () => setShowAuthModal(true),
      closeAuthModal: () => setShowAuthModal(false),
      login,
      loginWithGoogle,
      register,
      requestOTP,
      logout,
      uploadAvatar,
      updateBio,
      toggleFavorite,
      addRecentGame,
      refreshUser,
      updateDisplayName,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
