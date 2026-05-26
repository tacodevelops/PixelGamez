'use client';

import Link from 'next/link';
import { useState, FormEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchGames, Game } from '../lib/data';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import { useI18n } from './I18nContext';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Game[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLFormElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoggedIn, isOwner, isModerator, openAuthModal, logout, uploadAvatar } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  useEffect(() => {
    if (search.trim()) {
      const found = searchGames(search).slice(0, 6);
      setResults(found);
      setIsDropdownOpen(true);
    } else {
      setResults([]);
      setIsDropdownOpen(false);
    }
  }, [search]);

  useEffect(() => {
    fetch('/api/notifications')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch notifications');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data);
          const lastRead = localStorage.getItem('lastReadNotificationAt');
          if (!lastRead) {
            setUnreadCount(data.length);
          } else {
            const unread = data.filter(n => new Date(n.createdAt) > new Date(lastRead)).length;
            setUnreadCount(unread);
          }
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
        setIsEditingProfile(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setIsDropdownOpen(false);
      router.push(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  const handleResultClick = () => { setIsDropdownOpen(false); setSearch(''); };
  const handleLogout = async () => { setIsUserMenuOpen(false); await logout(); };
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAvatar(file);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const handleNotifClick = () => {
    setIsNotifOpen(!isNotifOpen);
    setIsUserMenuOpen(false);
    if (unreadCount > 0) {
      setUnreadCount(0);
      localStorage.setItem('lastReadNotificationAt', new Date().toISOString());
    }
  };

  return (
    <header className="header">
      <div className="header__left">
        <Link href="/" className="header__logo">
          <img src="/images/logo.png" alt="PixelGamez Logo" className="header__logo-icon" />
          <span className="header__logo-text">PixelGamez</span>
        </Link>
      </div>

      <form ref={dropdownRef} className="header__search" onSubmit={handleSearch}>
        <svg className="header__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          className="header__search-input"
          placeholder={t('search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => { if (search.trim()) setIsDropdownOpen(true); }}
        />
        {search && (
          <button type="button" className="header__search-clear" onClick={() => { setSearch(''); setIsDropdownOpen(false); }}>
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        {isDropdownOpen && search.trim() && (
          <div className="search-dropdown">
            {results.length > 0 ? (
              <>
                {results.map(game => (
                  <Link key={game.id} href={`/game/${game.id}`} className="search-dropdown__item" onClick={handleResultClick}>
                    <img src={game.thumbnail} alt={game.title} className="search-dropdown__thumb" />
                    <div className="search-dropdown__info">
                      <div className="search-dropdown__title">{game.title}</div>
                      <div className="search-dropdown__category">{game.category === 'io' ? '.io' : game.category}</div>
                    </div>
                  </Link>
                ))}
                <div className="search-dropdown__footer" onClick={() => { setIsDropdownOpen(false); router.push(`/search?q=${encodeURIComponent(search)}`); }}>
                  See all results for &quot;{search}&quot;
                </div>
              </>
            ) : (
              <div className="search-dropdown__empty">No games found for &quot;{search}&quot;</div>
            )}
          </div>
        )}
      </form>

      <div className="header__right">
        <LanguageSelector />
        
        <button className="header__theme-btn" onClick={toggleTheme} aria-label="Toggle theme" title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>

        {isLoggedIn && user ? (
          <>
            <div className="header__notif" ref={notifMenuRef}>
              <button className="header__notif-btn" onClick={handleNotifClick}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && <span className="header__notif-badge">{unreadCount}</span>}
              </button>
              {isNotifOpen && (
                <div className="header__notif-menu">
                  <div className="header__notif-header">
                    <h4>Notices & Inbox</h4>
                  </div>
                  <div className="header__notif-list">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div key={n.id} className="header__notif-item">
                          <h5>{n.title}</h5>
                          <p>{n.message}</p>
                          <small>{new Date(n.createdAt).toLocaleDateString()}</small>
                        </div>
                      ))
                    ) : (
                      <div className="header__notif-empty">No new notices.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="header__user" ref={userMenuRef}>
              <button className="header__avatar" onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsEditingProfile(false); }} aria-label="User menu">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.displayName} className="header__avatar-img" />
                ) : (
                  user.displayName.charAt(0).toUpperCase()
                )}
              </button>
            {isUserMenuOpen && (
              <div className="header__user-menu">
                {!isEditingProfile ? (
                  <>
                    <div className="header__user-info">
                      <div className="header__user-avatar-row">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="" className="header__user-avatar-large" />
                        ) : (
                          <div className="header__user-avatar-placeholder">{user.displayName.charAt(0).toUpperCase()}</div>
                        )}
                        <div>
                          <div className="header__user-name">{user.displayName}</div>
                          <div className="header__user-email">{user.email}</div>
                          {isOwner && <span className="header__user-badge">Owner</span>}
                          {!isOwner && isModerator && <span className="header__user-badge">Moderator</span>}
                        </div>
                      </div>
                    </div>
                    <div className="header__user-divider"></div>
                    <Link href={`/user/${user.id}`} className="header__user-link" onClick={() => setIsUserMenuOpen(false)}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      {t('profile')}
                    </Link>
                    <button className="header__user-link" onClick={() => setIsEditingProfile(true)}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      {t('edit_profile')}
                    </button>
                    {(isOwner || isModerator) && (
                      <Link href="/admin" className="header__user-link" onClick={() => setIsUserMenuOpen(false)}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
                        {isOwner ? t('owner_panel') : t('moderator_panel')}
                      </Link>
                    )}
                    <Link href="/developer" className="header__user-link" onClick={() => setIsUserMenuOpen(false)}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                      {t('developer')}
                    </Link>
                    <button className="header__user-link header__user-link--logout" onClick={handleLogout}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="header__profile-edit">
                    <div className="header__profile-edit-header">
                      <button className="header__profile-back" onClick={() => setIsEditingProfile(false)}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      <span>Edit Profile</span>
                    </div>
                    <div className="header__profile-avatar-section">
                      <div className="header__profile-avatar-wrapper" onClick={() => avatarInputRef.current?.click()}>
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="" className="header__profile-avatar-img" />
                        ) : (
                          <div className="header__profile-avatar-default">{user.displayName.charAt(0).toUpperCase()}</div>
                        )}
                        <div className="header__profile-avatar-overlay">
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        </div>
                      </div>
                      <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
                      <p className="header__profile-avatar-hint">Click to change photo</p>
                    </div>
                    <div className="header__profile-info">
                      <div className="header__profile-field"><label>Display Name</label><span>{user.displayName}</span></div>
                      <div className="header__profile-field"><label>Email</label><span>{user.email}</span></div>
                      <div className="header__profile-field"><label>Role</label><span className={user.role === 'admin' ? 'header__profile-role--admin' : ''}>{user.role}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          </>
        ) : (
          <button className="header__signin-btn" onClick={openAuthModal}>{t('sign_in')}</button>
        )}
      </div>
    </header>
  );
}
