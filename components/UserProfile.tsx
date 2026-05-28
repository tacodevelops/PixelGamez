'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  bannerUrl?: string;
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
  developerName: string;
}

interface UserProfileProps {
  profileUser: ProfileUser;
  submissions: Submission[];
}

export default function UserProfile({ profileUser, submissions }: UserProfileProps) {
  const { user, updateBio, uploadAvatar, openAuthModal } = useAuth();
  const { t } = useI18n();
  const isOwnProfile = user?.id === profileUser.id;

  const [displayUser, setDisplayUser] = useState<ProfileUser>(profileUser);
  const [editingAbout, setEditingAbout] = useState(false);
  const [editingWorking, setEditingWorking] = useState(false);
  const [aboutText, setAboutText] = useState(displayUser.aboutMe || '');
  const [workingText, setWorkingText] = useState(displayUser.workingOn || '');
  const [saving, setSaving] = useState(false);
  const [showBannerOptions, setShowBannerOptions] = useState(false);

  const [friendStatus, setFriendStatus] = useState<string>('none');
  const [friendsData, setFriendsData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'submissions' | 'favorites' | 'friends'>('submissions');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOwnProfile && displayUser.id && user) {
      fetch(`/api/friends/status/${displayUser.id}`)
        .then(res => res.json())
        .then(data => setFriendStatus(data.status))
        .catch(() => {});
    }
  }, [isOwnProfile, displayUser.id, user]);

  useEffect(() => {
    if (isOwnProfile && user) {
      fetch('/api/friends')
        .then(res => res.json())
        .then(data => setFriendsData(data))
        .catch(() => {});
    }
  }, [isOwnProfile, user]);

  const joinDate = new Date(displayUser.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  const daysSinceJoin = Math.floor((Date.now() - new Date(displayUser.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const memberLabel = daysSinceJoin < 1 ? 'Joined today' : daysSinceJoin === 1 ? 'Joined yesterday' : `Joined ${joinDate}`;

  const handleSaveAbout = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/auth/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aboutMe: aboutText, workingOn: workingText })
      });
      if (res.ok) {
        const data = await res.json();
        setDisplayUser(data.user);
        setEditingAbout(false);
        setEditingWorking(false);
      }
    } catch {}
    setSaving(false);
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
    const formData = new FormData();
    formData.append('banner', file);
    try {
      const res = await fetch('/api/auth/banner', { method: 'POST', body: formData });
      if (res.ok) window.location.reload();
    } catch {}
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
      if (res.ok) window.location.reload();
    } catch {}
    setShowBannerOptions(false);
  };

  const handleFriendAction = async (action: 'follow' | 'unfollow') => {
    if (!user) {
      openAuthModal();
      return;
    }
    try {
      if (action === 'follow') {
        const res = await fetch(`/api/friends/follow/${displayUser.id}`, { method: 'POST' });
        if (res.ok) {
          // If we followed them, we are now at least 'following'. If they already followed us, we are now 'friends'.
          if (friendStatus === 'follower') setFriendStatus('friends');
          else setFriendStatus('following');
        }
      } else {
        const res = await fetch(`/api/friends/unfollow/${displayUser.id}`, { method: 'POST' });
        if (res.ok) {
          // If we unfollowed them and we were friends, now we are just 'follower' (they still follow us).
          if (friendStatus === 'friends') setFriendStatus('follower');
          else setFriendStatus('none');
        }
      }
    } catch {}
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
      <div 
        className={`profile-banner ${displayUser.bannerUrl ? 'has-custom-banner' : ''}`}
        style={displayUser.bannerUrl ? { background: displayUser.bannerUrl.startsWith('/') || displayUser.bannerUrl.startsWith('http') ? `url(${displayUser.bannerUrl}) center/cover no-repeat` : displayUser.bannerUrl } : {}}
      >
        {!displayUser.bannerUrl && <div className="profile-banner__gradient" />}
        {isOwnProfile && (
          <div className="profile-banner__edit-container">
            <button className="profile-banner__edit-btn" onClick={() => setShowBannerOptions(!showBannerOptions)}>Edit Banner</button>
            {showBannerOptions && (
              <div className="profile-banner__options-menu">
                <div className="profile-banner__color-grid">
                  {presetGradients.map((grad, i) => (
                    <button key={i} className="profile-banner__color-btn" style={{ background: grad }} onClick={() => handleBannerColorChange(grad)} />
                  ))}
                </div>
                <button className="profile-banner__menu-btn" onClick={() => bannerInputRef.current?.click()}>Upload Image</button>
              </div>
            )}
          </div>
        )}
        <input type="file" ref={bannerInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleBannerChange} />
        
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
            
            {/* Friend Actions */}
            {!isOwnProfile && (
              <div style={{ marginTop: '16px' }}>
                {friendStatus === 'none' && (
                  <button className="game-card__btn" style={{ background: 'var(--accent-primary)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-sm)' }} onClick={() => handleFriendAction('follow')}>
                    Follow
                  </button>
                )}
                {friendStatus === 'follower' && (
                  <button className="game-card__btn" style={{ background: 'var(--accent-primary)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-sm)' }} onClick={() => handleFriendAction('follow')}>
                    Follow Back
                  </button>
                )}
                {friendStatus === 'following' && (
                  <button className="game-card__btn" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-dim)', padding: '8px 16px', borderRadius: 'var(--radius-sm)' }} onClick={() => handleFriendAction('unfollow')}>
                    Following
                  </button>
                )}
                {friendStatus === 'friends' && (
                  <button className="game-card__btn" style={{ background: '#ef4444', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-sm)' }} onClick={() => handleFriendAction('unfollow')}>
                    Unfriend
                  </button>
                )}
              </div>
            )}

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
                  <button className="profile-card__save-btn" onClick={handleSaveAbout} disabled={saving}>
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
          <div className="profile-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            <button className={`admin-tab ${activeTab === 'submissions' ? 'active' : ''}`} onClick={() => setActiveTab('submissions')} style={{ background: 'none', border: 'none', color: activeTab === 'submissions' ? 'var(--text)' : 'var(--text-dim)', fontWeight: activeTab === 'submissions' ? 'bold' : 'normal', cursor: 'pointer' }}>
              Submissions
            </button>
            <button className={`admin-tab ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')} style={{ background: 'none', border: 'none', color: activeTab === 'favorites' ? 'var(--text)' : 'var(--text-dim)', fontWeight: activeTab === 'favorites' ? 'bold' : 'normal', cursor: 'pointer' }}>
              Favorites
            </button>
            {isOwnProfile && (
              <button className={`admin-tab ${activeTab === 'friends' ? 'active' : ''}`} onClick={() => setActiveTab('friends')} style={{ background: 'none', border: 'none', color: activeTab === 'friends' ? 'var(--text)' : 'var(--text-dim)', fontWeight: activeTab === 'friends' ? 'bold' : 'normal', cursor: 'pointer' }}>
                Friends
                {friendsData?.pendingRequests?.length > 0 && <span style={{ marginLeft: '6px', background: '#ef4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '0.75rem' }}>{friendsData.pendingRequests.length}</span>}
              </button>
            )}
          </div>

          {activeTab === 'submissions' && (
            <div className="profile-card">
              <div className="profile-card__header">
                <h3 className="profile-card__title">Games by {displayUser.displayName}</h3>
              </div>
              <div className="profile-card__body">
                {submissions.length === 0 ? (
                  <p className="profile-card__empty">{displayUser.displayName} hasn't published any games yet.</p>
                ) : (
                  <div className="game-grid game-grid--profile">
                    {submissions.map(game => (
                      <div key={game.id} className="game-card">
                        <div className="game-card__thumb">
                          <img src={game.thumbnail || '/images/placeholder.jpg'} alt={game.title} />
                          <div className="game-card__overlay">
                            <button className="game-card__btn" onClick={() => window.location.href = `/game/${game.id}`}>Play</button>
                          </div>
                        </div>
                        <div className="game-card__info">
                          <h3 className="game-card__title" title={game.title}>{game.title}</h3>
                          <span className="game-card__developer">{game.developerName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="profile-card">
              <div className="profile-card__header">
                <h3 className="profile-card__title">Favorite Games</h3>
              </div>
              <div className="profile-card__body">
                {displayUser.favoriteGames?.length === 0 ? (
                  <p className="profile-card__empty">No favorite games yet.</p>
                ) : (
                  <div className="game-grid game-grid--profile">
                    {displayUser.favoriteGames?.map(gameId => (
                      <div key={gameId} className="game-card" onClick={() => window.location.href = `/game/${gameId}`} style={{ cursor: 'pointer' }}>
                        <div className="game-card__thumb">
                          <div style={{ width: '100%', height: '100%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '2rem' }}>🎮</span>
                          </div>
                        </div>
                        <div className="game-card__info">
                          <h3 className="game-card__title">Game ID: {gameId}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'friends' && isOwnProfile && friendsData && (
            <div className="profile-card">
              <div className="profile-card__header">
                <h3 className="profile-card__title">Friends & Requests</h3>
              </div>
              <div className="profile-card__body">
                {friendsData.friends?.length > 0 && (
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ color: 'var(--text-dim)', marginBottom: '12px' }}>Mutual Friends</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {friendsData.friends.map((friend: any) => (
                        <div key={friend.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.location.href = `/user/${friend.playerId || friend.id}`}>
                            {friend.avatarUrl ? <img src={friend.avatarUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} /> : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{friend.displayName.charAt(0)}</div>}
                            <span style={{ fontWeight: 'bold', color: '#10b981' }}>{friend.displayName} ✓</span>
                          </div>
                          <button onClick={async () => {
                            await fetch(`/api/friends/unfollow/${friend.id}`, { method: 'POST' });
                            fetch('/api/friends').then(r => r.json()).then(d => setFriendsData(d));
                          }} style={{ background: 'transparent', color: '#ef4444', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.9rem' }}>Unfriend</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <h4 style={{ color: 'var(--text-dim)', marginBottom: '12px' }}>Followers</h4>
                    {friendsData.followers?.length === 0 ? (
                      <p className="profile-card__empty" style={{ margin: 0 }}>No followers yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {friendsData.followers?.filter((f: any) => !friendsData.friends.find((fr: any) => fr.id === f.id)).map((follower: any) => (
                          <div key={follower.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.location.href = `/user/${follower.playerId || follower.id}`}>
                              {follower.avatarUrl ? <img src={follower.avatarUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} /> : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{follower.displayName.charAt(0)}</div>}
                              <span style={{ fontWeight: 'bold' }}>{follower.displayName}</span>
                            </div>
                            <button onClick={async () => {
                              await fetch(`/api/friends/follow/${follower.id}`, { method: 'POST' });
                              fetch('/api/friends').then(r => r.json()).then(d => setFriendsData(d));
                            }} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.9rem' }}>Follow Back</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-dim)', marginBottom: '12px' }}>Following</h4>
                    {friendsData.following?.length === 0 ? (
                      <p className="profile-card__empty" style={{ margin: 0 }}>Not following anyone.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {friendsData.following?.filter((f: any) => !friendsData.friends.find((fr: any) => fr.id === f.id)).map((following: any) => (
                          <div key={following.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.location.href = `/user/${following.playerId || following.id}`}>
                              {following.avatarUrl ? <img src={following.avatarUrl} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} /> : <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{following.displayName.charAt(0)}</div>}
                              <span style={{ fontWeight: 'bold' }}>{following.displayName}</span>
                            </div>
                            <button onClick={async () => {
                              await fetch(`/api/friends/unfollow/${following.id}`, { method: 'POST' });
                              fetch('/api/friends').then(r => r.json()).then(d => setFriendsData(d));
                            }} style={{ background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '0.9rem' }}>Unfollow</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-6)' }}>
        <AdSlot placement="profile" />
      </div>
    </div>
  );
}
