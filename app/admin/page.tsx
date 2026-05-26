'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../components/AuthContext';

interface Submission {
  id: string;
  title: string;
  description: string;
  category: string;
  gameType: string;
  embedUrl: string;
  developerName: string;
  submittedAt: string;
  status: string;
}

interface Ad {
  id: string;
  imageUrl: string;
  linkUrl: string;
  placement: string;
  label: string;
  active: boolean;
  clicks: number;
  impressions: number;
  createdAt: string;
}

export default function AdminPage() {
  const { isLoggedIn, isOwner, isModerator, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'submissions' | 'ads' | 'notices' | 'analytics'>('submissions');
  
  
  const [pending, setPending] = useState<Submission[]>([]);
  const [fetchingSubmissions, setFetchingSubmissions] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  
  const [ads, setAds] = useState<Ad[]>([]);
  const [fetchingAds, setFetchingAds] = useState(true);
  const [adForm, setAdForm] = useState({ linkUrl: '', placement: 'sidebar', label: 'Advertisement' });
  const [adImage, setAdImage] = useState<File | null>(null);
  const [uploadingAd, setUploadingAd] = useState(false);
  const adImageInputRef = useRef<HTMLInputElement>(null);

  
  const [notices, setNotices] = useState<any[]>([]);
  const [fetchingNotices, setFetchingNotices] = useState(false);
  const [noticeForm, setNoticeForm] = useState({ title: '', message: '' });
  const [creatingNotice, setCreatingNotice] = useState(false);

  // Analytics State
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [fetchingAnalytics, setFetchingAnalytics] = useState(false);

  useEffect(() => {
    if (!loading && (isOwner || isModerator)) {
      if (activeTab === 'submissions') fetchPending();
      if (activeTab === 'ads' && isOwner) fetchAds();
      if (activeTab === 'notices') fetchNotices();
      if (activeTab === 'analytics' && isOwner) fetchAnalytics();
    } else {
      setFetchingSubmissions(false);
      setFetchingAds(false);
      setFetchingNotices(false);
    }
  }, [loading, isOwner, isModerator, activeTab]);

  async function fetchNotices() {
    setFetchingNotices(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) setNotices(await res.json());
    } catch {} finally { setFetchingNotices(false); }
  }

  async function fetchAnalytics() {
    setFetchingAnalytics(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) setAnalytics(await res.json());
    } catch {} finally { setFetchingAnalytics(false); }
  }

  async function handleNoticeSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.message) return;
    setCreatingNotice(true);
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noticeForm)
      });
      if (res.ok) {
        const n = await res.json();
        setNotices(prev => [n, ...prev]);
        setNoticeForm({ title: '', message: '' });
      }
    } catch {} finally { setCreatingNotice(false); }
  }

  async function handleDeleteNotice(id: string) {
    if (!confirm('Delete this notice?')) return;
    try {
      const res = await fetch(`/api/admin/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) setNotices(prev => prev.filter(n => n.id !== id));
    } catch {}
  }

  async function fetchPending() {
    setFetchingSubmissions(true);
    try {
      const res = await fetch('/api/admin/pending');
      if (res.ok) {
        setPending(await res.json());
      }
    } catch {
      
    } finally {
      setFetchingSubmissions(false);
    }
  }

  async function handleAction(id: string, action: 'approve' | 'reject') {
    setActionInProgress(id);
    try {
      const res = await fetch(`/api/admin/${action}/${id}`, { method: 'POST' });
      if (res.ok) {
        setPending(prev => prev.filter(s => s.id !== id));
      }
    } catch {
      
    } finally {
      setActionInProgress(null);
    }
  }

  async function fetchAds() {
    setFetchingAds(true);
    try {
      const res = await fetch('/api/admin/ads');
      if (res.ok) {
        setAds(await res.json());
      }
    } catch {
      
    } finally {
      setFetchingAds(false);
    }
  }

  async function handleAdSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!adImage || !adForm.linkUrl || !adForm.placement) return;
    
    setUploadingAd(true);
    const formData = new FormData();
    formData.append('image', adImage);
    formData.append('linkUrl', adForm.linkUrl);
    formData.append('placement', adForm.placement);
    formData.append('label', adForm.label);

    try {
      const res = await fetch('/api/admin/ads', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const newAd = await res.json();
        setAds(prev => [...prev, newAd]);
        setAdForm({ linkUrl: '', placement: 'sidebar', label: 'Advertisement' });
        setAdImage(null);
        if (adImageInputRef.current) adImageInputRef.current.value = '';
      }
    } catch {
      // ignore
    } finally {
      setUploadingAd(false);
    }
  }

  async function handleToggleAd(id: string) {
    try {
      const res = await fetch(`/api/admin/ads/${id}/toggle`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        setAds(prev => prev.map(a => a.id === id ? updated : a));
      }
    } catch {
      
    }
  }

  async function handleDeleteAd(id: string) {
    if (!confirm('Are you sure you want to delete this ad?')) return;
    try {
      const res = await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAds(prev => prev.filter(a => a.id !== id));
      }
    } catch {
      
    }
  }

  if (loading) return <div className="admin-page">Loading...</div>;
  if (!isLoggedIn || (!isOwner && !isModerator)) return <div className="admin-page">Access denied.</div>;

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-header">
        <h1>{isOwner ? 'Owner Dashboard' : 'Moderator Dashboard'}</h1>
        <div className="admin-tabs">
          <button className={`admin-tab ${activeTab === 'submissions' ? 'active' : ''}`} onClick={() => setActiveTab('submissions')}>
            Pending Submissions
          </button>
          {isOwner && (
            <>
              <button className={`admin-tab ${activeTab === 'ads' ? 'active' : ''}`} onClick={() => setActiveTab('ads')}>
                Ad Management
              </button>
              <button className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
                Game Analytics
              </button>
            </>
          )}
          <button className={`admin-tab ${activeTab === 'notices' ? 'active' : ''}`} onClick={() => setActiveTab('notices')}>
            Notices & Inbox
          </button>
        </div>
      </div>

      {activeTab === 'submissions' && (
        <div className="admin-section">
          <p className="admin-section-desc">Review and approve community game submissions.</p>
          {fetchingSubmissions ? (
            <div className="admin-loading">Loading submissions...</div>
          ) : pending.length === 0 ? (
            <div className="admin-empty">
              <h3>All clear</h3>
              <p>No pending submissions to review.</p>
            </div>
          ) : (
            <div className="admin-list">
              <div className="admin-list__count">{pending.length} pending submission{pending.length !== 1 ? 's' : ''}</div>
              {pending.map(sub => (
                <div key={sub.id} className="admin-card">
                  <div className="admin-card__body">
                    <div className="admin-card__top">
                      <h3 className="admin-card__title">{sub.title}</h3>
                      <span className="admin-card__type">{sub.gameType}</span>
                    </div>
                    <p className="admin-card__desc">{sub.description}</p>
                    <div className="admin-card__meta">
                      <span>By <strong>{sub.developerName}</strong></span>
                      <span>Category: {sub.category}</span>
                      <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                    </div>
                    {sub.embedUrl && (
                      <div className="admin-card__url">
                        URL: <code>{sub.embedUrl}</code>
                      </div>
                    )}
                  </div>
                  <div className="admin-card__actions">
                    <button
                      className="admin-card__btn admin-card__btn--approve"
                      onClick={() => handleAction(sub.id, 'approve')}
                      disabled={actionInProgress === sub.id}
                    >
                      {actionInProgress === sub.id ? '...' : '✓ Approve'}
                    </button>
                    <button
                      className="admin-card__btn admin-card__btn--reject"
                      onClick={() => handleAction(sub.id, 'reject')}
                      disabled={actionInProgress === sub.id}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="admin-section">
          <p className="admin-section-desc">Manage self-serve advertisements across the site.</p>
          
          <div className="admin-card">
            <div className="admin-card__body">
              <h3 className="admin-card__title" style={{ marginBottom: '16px' }}>Create New Ad</h3>
              <form onSubmit={handleAdSubmit} className="admin-form">
                <div className="admin-form__group">
                  <label>Ad Image</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setAdImage(e.target.files?.[0] || null)}
                    ref={adImageInputRef}
                    required 
                  />
                </div>
                <div className="admin-form__group">
                  <label>Destination URL</label>
                  <input 
                    type="url" 
                    value={adForm.linkUrl} 
                    onChange={e => setAdForm({...adForm, linkUrl: e.target.value})} 
                    placeholder="https://example.com"
                    required 
                  />
                </div>
                <div className="admin-form__row">
                  <div className="admin-form__group">
                    <label>Placement</label>
                    <select 
                      value={adForm.placement} 
                      onChange={e => setAdForm({...adForm, placement: e.target.value})}
                    >
                      <option value="sidebar">Sidebar (160x600 or 160x300)</option>
                      <option value="banner-home">Home Page Banner (728x90)</option>
                      <option value="game-below">Below Game (728x90)</option>
                      <option value="game-side">Beside Game (300x250)</option>
                      <option value="profile">User Profile (728x90)</option>
                    </select>
                  </div>
                  <div className="admin-form__group">
                    <label>Label</label>
                    <input 
                      type="text" 
                      value={adForm.label} 
                      onChange={e => setAdForm({...adForm, label: e.target.value})} 
                    />
                  </div>
                </div>
                <button type="submit" className="admin-form__submit" disabled={uploadingAd || !adImage || !adForm.linkUrl}>
                  {uploadingAd ? 'Uploading...' : 'Create Ad'}
                </button>
              </form>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <h3 className="admin-card__title" style={{ marginBottom: '16px' }}>Active & Past Ads</h3>
            {fetchingAds ? (
              <div className="admin-loading">Loading ads...</div>
            ) : ads.length === 0 ? (
              <div className="admin-empty">
                <p>No ads have been created yet.</p>
              </div>
            ) : (
              <div className="admin-ad-grid">
                {ads.map(ad => (
                  <div key={ad.id} className={`admin-ad-card ${!ad.active ? 'admin-ad-card--inactive' : ''}`}>
                    <img src={ad.imageUrl} alt="Ad preview" className="admin-ad-card__img" />
                    <div className="admin-ad-card__info">
                      <div className="admin-ad-card__meta">
                        <span className="admin-ad-card__placement">{ad.placement}</span>
                        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="admin-ad-card__link">
                          {new URL(ad.linkUrl).hostname}
                        </a>
                      </div>
                      <div className="admin-ad-card__stats">
                        <div className="admin-ad-card__stat">
                          <span className="admin-ad-card__stat-val">{ad.impressions}</span>
                          <span className="admin-ad-card__stat-lbl">Views</span>
                        </div>
                        <div className="admin-ad-card__stat">
                          <span className="admin-ad-card__stat-val">{ad.clicks}</span>
                          <span className="admin-ad-card__stat-lbl">Clicks</span>
                        </div>
                        <div className="admin-ad-card__stat">
                          <span className="admin-ad-card__stat-val">
                            {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0'}%
                          </span>
                          <span className="admin-ad-card__stat-lbl">CTR</span>
                        </div>
                      </div>
                      <div className="admin-ad-card__actions">
                        <button 
                          className={`admin-ad-btn ${ad.active ? 'admin-ad-btn--pause' : 'admin-ad-btn--resume'}`}
                          onClick={() => handleToggleAd(ad.id)}
                        >
                          {ad.active ? 'Pause' : 'Resume'}
                        </button>
                        <button 
                          className="admin-ad-btn admin-ad-btn--delete"
                          onClick={() => handleDeleteAd(ad.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && isOwner && (
        <div className="admin-section">
          <p className="admin-section-desc">View stats and analytics for all games.</p>
          {fetchingAnalytics ? (
            <div className="admin-loading">Loading analytics...</div>
          ) : (
            <div className="admin-card" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-dim)' }}>
                    <th style={{ padding: '12px' }}>Game</th>
                    <th style={{ padding: '12px' }}>Plays</th>
                    <th style={{ padding: '12px' }}>Rating</th>
                    <th style={{ padding: '12px' }}>Favorites</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((game: any) => (
                    <tr key={game.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{game.title}</td>
                      <td style={{ padding: '12px', color: 'var(--accent-primary)' }}>{game.plays.toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>{game.rating.toFixed(1)} ⭐</td>
                      <td style={{ padding: '12px' }}>{game._count?.favoritedBy || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'notices' && (
        <div className="admin-section">
          <p className="admin-section-desc">Send announcements to all users.</p>
          <div className="admin-card" style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Create Notice</h3>
            <form onSubmit={handleNoticeSubmit}>
              <div className="admin-form__group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={noticeForm.title} 
                  onChange={e => setNoticeForm({...noticeForm, title: e.target.value})} 
                  style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}
                  required 
                />
              </div>
              <div className="admin-form__group">
                <label>Message</label>
                <textarea 
                  value={noticeForm.message} 
                  onChange={e => setNoticeForm({...noticeForm, message: e.target.value})} 
                  rows={3} 
                  style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: 'var(--bg-surface)', color: 'var(--text-primary)', marginBottom: 'var(--space-4)' }}
                  required 
                />
              </div>
              <button type="submit" className="admin-btn admin-btn--approve" disabled={creatingNotice}>
                {creatingNotice ? 'Sending...' : 'Send Notice'}
              </button>
            </form>
          </div>

          <div style={{ marginTop: 'var(--space-8)' }}>
            <h3 className="admin-card__title" style={{ marginBottom: 'var(--space-4)' }}>Past Notices</h3>
            {fetchingNotices ? (
              <div className="admin-loading">Loading notices...</div>
            ) : notices.length === 0 ? (
              <div className="admin-empty">No notices sent.</div>
            ) : (
              <div className="admin-list">
                {notices.map(n => (
                  <div key={n.id} className="admin-card">
                    <div className="admin-card__body">
                      <h4 style={{ margin: '0 0 var(--space-2) 0' }}>{n.title}</h4>
                      <p style={{ margin: '0 0 var(--space-2) 0', color: 'var(--text-secondary)' }}>{n.message}</p>
                      <small style={{ color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleString()}</small>
                    </div>
                    <div className="admin-card__actions" style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-default)' }}>
                      <button className="admin-btn admin-btn--reject" onClick={() => handleDeleteNotice(n.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
