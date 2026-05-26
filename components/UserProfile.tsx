'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import BioText from './BioText';
import AdSlot from './AdSlot';
import { useAuth } from './AuthContext';
import { useI18n } from './I18nContext';
import { games as allGames } from '../lib/data';

interface ProfileUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  avatarUrl: string;
  createdAt: string;
  aboutMe: string;
  workingOn: string;
  country: string;
  favoriteGames: string[];
}

interface Submission {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  status: string;
  submittedAt: string;
  plays: number;
  rating: number;
}

interface UserProfileProps {
  profileUser: ProfileUser;
  submissions: Submission[];
}

export default function UserProfile({ profileUser, submissions }: UserProfileProps) {
  const { user: authUser, updateBio, uploadAvatar } = useAuth();
  const { t } = useI18n();
  const isOwnProfile = authUser?.id === profileUser.id;

  
  const displayUser = isOwnProfile && authUser ? { ...profileUser, ...authUser } : profileUser;

  const [editingAbout, setEditingAbout] = useState(false);
  const [editingWorking, setEditingWorking] = useState(false);
  const [aboutText, setAboutText] = useState(displayUser.aboutMe || '');
  const [workingText, setWorkingText] = useState(displayUser.workingOn || '');
  const [saving, setSaving] = useState(false);
  const [showBannerOptions, setShowBannerOptions] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const joinDate = new Date(displayUser.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  const daysSinceJoin = Math.floor((Date.now() - new Date(displayUser.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const memberLabel = daysSinceJoin < 1 ? 'Joined today' : daysSinceJoin === 1 ? 'Joined yesterday' : `Joined ${joinDate}`;

  
  const favoriteGames = (displayUser.favoriteGames || [])
    .map(id => allGames.find(g => g.id === id))
    .filter(Boolean);

  const handleSaveAbout = async () => {
    setSaving(true);
    await updateBio({ aboutMe: aboutText });
    setSaving(false);
    setEditingAbout(false);
  };

  const handleSaveWorking = async () => {
    setSaving(true);
    await updateBio({ workingOn: workingText });
    setSaving(false);
    setEditingWorking(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAvatar(file);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // We need a new function in AuthContext to upload banner, or we can just fetch it here.
    // For now we'll do the fetch here and reload, or ideally add uploadBanner to useAuth.
    const formData = new FormData();
    formData.append('banner', file);
    
    try {
      const res = await fetch('/api/auth/banner', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        window.location.reload(); 
      }
    } catch {
      
    }
    
    if (bannerInputRef.current) bannerInputRef.current.value = '';
    setShowBannerOptions(false);
  };

  const handleBannerColorChange = async (color: string) => {
    try {
      const res = await fetch('/api/auth/banner-color', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color })
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch {
      
    }
    setShowBannerOptions(false);
  };

  const presetGradients = [
    'linear-gradient(to right, #ec4899, #8b5cf6)',
    'linear-gradient(to right, #3b82f6, #2dd4bf)',
    'linear-gradient(to right, #f59e0b, #ef4444)',
    'linear-gradient(to right, #10b981, #3b82f6)',
    'linear-gradient(to right, #6366f1, #d946ef)',
    '#1e293b', 
  ];

  return (
    <div className="profile-page">
      {}
      <div 
        className={`profile-banner ${displayUser.bannerUrl ? 'has-custom-banner' : ''}`}
        style={displayUser.bannerUrl ? { background: displayUser.bannerUrl.startsWith('/') || displayUser.bannerUrl.startsWith('http') ? `url(${displayUser.bannerUrl}) center/cover no-repeat` : displayUser.bannerUrl } : {}}
      >
        {!displayUser.bannerUrl && <div className="profile-banner__gradient" />}
        {isOwnProfile && (
          <div className="profile-banner__edit-container">
            <button 
              className="profile-banner__edit-btn"
              onClick={() => setShowBannerOptions(!showBannerOptions)}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Edit Banner
            </button>
            {showBannerOptions && (
              <div className="profile-banner__options-menu">
                <div className="profile-banner__color-grid">
                  {presetGradients.map((grad, i) => (
                    <button 
                      key={i} 
                      className="profile-banner__color-btn" 
                      style={{ background: grad }}
                      onClick={() => handleBannerColorChange(grad)}
                      title="Select Color"
                    />
                  ))}
                </div>
                <div className="profile-banner__menu-divider" />
                <button className="profile-banner__menu-btn" onClick={() => bannerInputRef.current?.click()}>
                  Upload Custom Image
                </button>
              </div>
            )}
          </div>
        )}
        <input 
          type="file" 
          ref={bannerInputRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          onChange={handleBannerChange} 
        />
        <div className="profile-banner__content">
          <div className="profile-avatar-wrapper" onClick={() => isOwnProfile && avatarInputRef.current?.click()}>
            {displayUser.avatarUrl ? (
              <img src={displayUser.avatarUrl} alt={displayUser.displayName} className="profile-avatar__img" />
            ) : (
              <div className="profile-avatar__placeholder">
                {displayUser.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            {isOwnProfile && (
              <div className="profile-avatar__overlay">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            )}
            {isOwnProfile && (
              <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            )}
          </div>
          <div className="profile-banner__info">
            <div className="profile-banner__name-row">
              <h1 className="profile-banner__name">{displayUser.displayName}</h1>
              {displayUser.role === 'owner' && (
                <span className="profile-banner__badge">Owner</span>
              )}
              {displayUser.role === 'moderator' && (
                <span className="profile-banner__badge">Moderator</span>
              )}
            </div>
            <div className="profile-banner__meta">
              <span className="profile-banner__meta-item">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {memberLabel}
              </span>
              {displayUser.country && (
                <span className="profile-banner__meta-item">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  {displayUser.country}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="profile-body">

        {}
        <div className="profile-col profile-col--left">
          {}
          <div className="profile-card">
            <div className="profile-card__header">
              <h3 className="profile-card__title">{t('about_me')}</h3>
              {isOwnProfile && !editingAbout && (
                <button className="profile-card__edit-btn" onClick={() => { setEditingAbout(true); setAboutText(displayUser.aboutMe || ''); }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              )}
            </div>
            {editingAbout ? (
              <div className="profile-card__edit-area">
                <textarea
                  className="profile-card__textarea"
                  value={aboutText}
                  onChange={e => setAboutText(e.target.value)}
                  maxLength={500}
                  placeholder="Tell others about yourself..."
                  rows={4}
                  autoFocus
                />
                <div className="profile-card__edit-actions">
                  <span className="profile-card__char-count">{aboutText.length}/500</span>
                  <button className="profile-card__cancel-btn" onClick={() => setEditingAbout(false)}>Cancel</button>
                  <button className="profile-card__save-btn" onClick={handleSaveAbout} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="profile-card__text">
                {displayUser.aboutMe ? <BioText text={displayUser.aboutMe} /> : (isOwnProfile ? 'Click edit to tell others about yourself.' : 'This user hasn\'t written anything yet.')}
              </p>
            )}
          </div>

          {}
          <div className="profile-card">
            <div className="profile-card__header">
              <h3 className="profile-card__title">{t('working_on')}</h3>
              {isOwnProfile && !editingWorking && (
                <button className="profile-card__edit-btn" onClick={() => { setEditingWorking(true); setWorkingText(displayUser.workingOn || ''); }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              )}
            </div>
            {editingWorking ? (
              <div className="profile-card__edit-area">
                <textarea
                  className="profile-card__textarea"
                  value={workingText}
                  onChange={e => setWorkingText(e.target.value)}
                  maxLength={500}
                  placeholder="Describe what you're working on..."
                  rows={4}
                  autoFocus
                />
                <div className="profile-card__edit-actions">
                  <span className="profile-card__char-count">{workingText.length}/500</span>
                  <button className="profile-card__cancel-btn" onClick={() => setEditingWorking(false)}>Cancel</button>
                  <button className="profile-card__save-btn" onClick={handleSaveWorking} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="profile-card__text">
                {displayUser.workingOn ? <BioText text={displayUser.workingOn} /> : (isOwnProfile ? 'Describe what you\'re working on.' : 'Nothing shared yet.')}
              </p>
            )}
          </div>
        </div>

        {}
        <div className="profile-col profile-col--right">
          {}
          <div className="profile-card">
            <h3 className="profile-card__title">What I&apos;ve been doing</h3>
            <div className="profile-activity">
              {submissions.length > 0 ? (
                submissions.slice(0, 5).map(sub => (
                  <div key={sub.id} className="profile-activity__item">
                    <div className="profile-activity__icon">🎮</div>
                    <div className="profile-activity__content">
                      <span className="profile-activity__user">{displayUser.displayName}</span>
                      {' shared the project '}
                      <span className="profile-activity__link">{sub.title}</span>
                    </div>
                    <span className="profile-activity__time">
                      {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="profile-activity__empty">
                  <span>No recent activity</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {}

      {}
      <div className="profile-section">
        <div className="profile-section__header">
          <h3 className="profile-section__title">
            Shared Projects
            <span className="profile-section__count">({submissions.length})</span>
          </h3>
        </div>
        {submissions.length > 0 ? (
          <div className="profile-games-row">
            {submissions.map(sub => (
              <Link key={sub.id} href={`/game/${sub.id}`} className="profile-game-card">
                {sub.thumbnail ? (
                  <img src={sub.thumbnail} alt={sub.title} className="profile-game-card__img" />
                ) : (
                  <div className="profile-game-card__placeholder">🎮</div>
                )}
                <div className="profile-game-card__overlay">
                  <span className="profile-game-card__title">{sub.title}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="profile-section__empty">
            <p>{isOwnProfile ? 'You haven\'t shared any projects yet.' : 'No shared projects yet.'}</p>
            {isOwnProfile && (
              <Link href="/developer" className="profile-section__cta">Submit a Game</Link>
            )}
          </div>
        )}
      </div>

      {}
      <div className="profile-section">
        <div className="profile-section__header">
          <h3 className="profile-section__title">
            {t('favorite_games')}
            <span className="profile-section__count">({favoriteGames.length})</span>
          </h3>
        </div>
        {favoriteGames.length > 0 ? (
          <div className="profile-games-row">
            {favoriteGames.slice(0, 8).map(game => game && (
              <Link key={game.id} href={`/game/${game.id}`} className="profile-game-card">
                <img src={game.thumbnail} alt={game.title} className="profile-game-card__img" />
                <div className="profile-game-card__overlay">
                  <span className="profile-game-card__title">{game.title}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="profile-section__empty">
            <p>{isOwnProfile ? 'Explore games and add them to your favorites!' : 'No favorite games yet.'}</p>
            {isOwnProfile && (
              <Link href="/" className="profile-section__cta">Browse Games</Link>
            )}
          </div>
        )}
      </div>

      {}
      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat__value">{submissions.length}</span>
          <span className="profile-stat__label">Projects</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat__value">{favoriteGames.length}</span>
          <span className="profile-stat__label">Favorites</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat__value">{daysSinceJoin}</span>
          <span className="profile-stat__label">Days</span>
        </div>
      </div>
      
      <div style={{ marginTop: 'var(--space-6)' }}>
        <AdSlot placement="profile" />
      </div>
    </div>
  );
}
