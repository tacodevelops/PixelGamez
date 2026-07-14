'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../components/AuthContext';
import { games as validGames } from '../../lib/data';

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
  const [activeTab, setActiveTab] = useState<'submissions' | 'ads' | 'notices' | 'analytics' | 'users' | 'inquiries'>('submissions');
  
  
  const [pending, setPending] = useState<Submission[]>([]);
  const [fetchingSubmissions, setFetchingSubmissions] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [fetchingInquiries, setFetchingInquiries] = useState(true);

  
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
  const [analyticsSearch, setAnalyticsSearch] = useState('');

  // Users State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  useEffect(() => {
    if (!loading && (isOwner || isModerator)) {
      if (activeTab === 'submissions') fetchPending();
      if (activeTab === 'ads' && isOwner) fetchAds();
      if (activeTab === 'notices') fetchNotices();
      if (activeTab === 'analytics' && isOwner) fetchAnalytics();
      if (activeTab === 'users' && (isOwner || isModerator)) fetchUsers();
      if (activeTab === 'inquiries' && isOwner) fetchInquiries();
    } else {
      setFetchingSubmissions(false);
      setFetchingAds(false);
      setFetchingNotices(false);
      setFetchingInquiries(false);
    }
  }, [loading, isOwner, isModerator, activeTab]);

  async function fetchInquiries() {
    setFetchingInquiries(true);
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) {
        setInquiries(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
    setFetchingInquiries(false);
  }

  async function markInquiryRead(id: string) {
    try {
      const res = await fetch(`/api/admin/inquiries/${id}/read`, { method: 'POST' });
      if (res.ok) {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: 'read' } : i));
      }
    } catch (e) {
      console.error(e);
    }
  }

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

  async function fetchUsers() {
    setFetchingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) setUsersList(await res.json());
    } catch {} finally { setFetchingUsers(false); }
  }

  async function handleRoleChange(id: string, newRole: string) {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsersList(prev => prev.map(u => u.id === id ? { ...u, role: newRole } : u));
      } else {
        alert('Failed to change role');
      }
    } catch {
      alert('Error changing role');
    }
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
              <button className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                Users
              </button>
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
          {isOwner && (
            <button className={`admin-tab ${activeTab === 'inquiries' ? 'active' : ''}`} onClick={() => setActiveTab('inquiries')}>
              Brand Inquiries {inquiries.filter(i => i.status === 'unread').length > 0 && <span style={{ background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.8rem', marginLeft: '6px' }}>{inquiries.filter(i => i.status === 'unread').length}</span>}
            </button>
          )}
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
          <p className="admin-section-desc">View platform-wide developer statistics and engagement metrics.</p>
          {fetchingAnalytics ? (
            <div className="admin-loading">Loading developer stats...</div>
          ) : (
            <div className="analytics-dashboard">
              {}
              <div className="analytics-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                {(() => {
                  const validAnalytics = analytics.filter(g => validGames.some(vg => vg.id === g.id));
                  return (
                    <>
                      <div className="admin-card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Global Plays</div>
                        <div style={{ color: 'var(--accent-primary)', fontSize: '2rem', fontWeight: 'bold' }}>
                          {validAnalytics.reduce((acc, g) => acc + g.plays, 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="admin-card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Favorites</div>
                        <div style={{ color: '#ef4444', fontSize: '2rem', fontWeight: 'bold' }}>
                          {validAnalytics.reduce((acc, g) => acc + (g._count?.favoritedBy || 0), 0).toLocaleString()}
                        </div>
                      </div>
                      <div className="admin-card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '8px' }}>Active Games</div>
                        <div style={{ color: 'var(--text)', fontSize: '2rem', fontWeight: 'bold' }}>
                          {validAnalytics.length}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              {}
              <div className="admin-card" style={{ overflowX: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-4)', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ margin: 0 }}>Game Engagement</h3>
                  <input
                    type="text"
                    placeholder="Search by game name..."
                    value={analyticsSearch}
                    onChange={(e) => setAnalyticsSearch(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text)',
                      width: '250px'
                    }}
                  />
                </div>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                      <th style={{ padding: '16px' }}>Game Name</th>
                      <th style={{ padding: '16px' }}>Total Plays</th>
                      <th style={{ padding: '16px' }}>Rating Ratio</th>
                      <th style={{ padding: '16px' }}>Favorites</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.filter(g => validGames.some(vg => vg.id === g.id) && g.title.toLowerCase().includes(analyticsSearch.toLowerCase())).map((game: any) => {
                      const likes = game.votes?.filter((v: any) => v.type === 'like').length || 0;
                      const dislikes = game.votes?.filter((v: any) => v.type === 'dislike').length || 0;
                      const totalVotes = likes + dislikes;
                      const likeRatio = totalVotes > 0 ? (likes / totalVotes) * 100 : 0;
                      
                      return (
                        <tr key={game.id} onClick={() => window.location.href = `/admin/analytics/${game.id}`} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} className="analytics-row-hover">
                          <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--text)' }}>{game.title}</td>
                          <td style={{ padding: '16px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>{game.plays.toLocaleString()}</td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ minWidth: '40px', fontSize: '0.85rem' }}>{likeRatio.toFixed(0)}%</span>
                              <div style={{ width: '100px', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: likeRatio >= 70 ? '#10b981' : likeRatio >= 40 ? '#f59e0b' : '#ef4444', width: `${likeRatio}%` }} />
                              </div>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>({totalVotes} votes)</span>
                            </div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444' }}>
                              ♥ {game._count?.favoritedBy || 0}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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

      {activeTab === 'users' && (
        <div className="admin-section">
          <p className="admin-section-desc">Manage user roles and permissions.</p>
          {fetchingUsers ? (
            <div className="admin-loading">Loading users...</div>
          ) : usersList.length === 0 ? (
            <div className="admin-empty">No users found.</div>
          ) : (
            <div className="admin-list" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <th style={{ padding: 'var(--space-3)' }}>#</th>
                    <th style={{ padding: 'var(--space-3)' }}>User</th>
                    <th style={{ padding: 'var(--space-3)' }}>Email</th>
                    <th style={{ padding: 'var(--space-3)' }}>Joined</th>
                    <th style={{ padding: 'var(--space-3)' }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                      <td style={{ padding: 'var(--space-3)', color: 'var(--text-muted)' }}>{u.playerId}</td>
                      <td style={{ padding: 'var(--space-3)' }}>{u.displayName}</td>
                      <td style={{ padding: 'var(--space-3)', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: 'var(--space-3)', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: 'var(--space-3)' }}>
                        <select 
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }}
                          disabled={u.role === 'owner'}
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="owner">Owner</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'inquiries' && isOwner && (
        <div className="admin-section">
          <p className="admin-section-desc">Manage incoming brand integration requests.</p>
          {fetchingInquiries ? (
            <div className="admin-loading">Loading inquiries...</div>
          ) : inquiries.length === 0 ? (
            <div className="admin-card" style={{ padding: 'var(--space-5)', textAlign: 'center', color: 'var(--text-dim)' }}>
              No brand inquiries yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {inquiries.map(inquiry => (
                <div key={inquiry.id} className="admin-card" style={{ padding: '20px', borderLeft: inquiry.status === 'unread' ? '4px solid var(--accent-primary)' : '4px solid transparent', opacity: inquiry.status === 'read' ? 0.7 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {inquiry.name} 
                        {inquiry.status === 'unread' && <span style={{ background: 'var(--accent-primary)', color: 'var(--bg-primary)', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>New</span>}
                      </h3>
                      <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', display: 'flex', gap: '16px' }}>
                        <span>Email: <a href={`mailto:${inquiry.email}`} style={{ color: 'var(--accent-primary)' }}>{inquiry.email}</a></span>
                        {inquiry.company && <span>Company: {inquiry.company}</span>}
                        {inquiry.budget && <span>Budget: {inquiry.budget}</span>}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{new Date(inquiry.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                    {inquiry.message}
                  </div>
                  {inquiry.status === 'unread' && (
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => markInquiryRead(inquiry.id)} style={{ background: 'var(--accent-primary)', color: 'var(--bg-primary)', border: 'none', padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', cursor: 'pointer' }}>
                        Mark as Read
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
