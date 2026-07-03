'use client';

import { useState, useEffect, useCallback } from 'react';
import { Game } from '../lib/data';
import { useAuth } from './AuthContext';
import { useI18n } from './I18nContext';
import { usePlays } from './usePlays';
import AdSlot from './AdSlot';

interface GamePlayerProps {
  game: Game;
}

export default function GamePlayer({ game }: GamePlayerProps) {
  const { user, isLoggedIn, openAuthModal, toggleFavorite, addRecentGame } = useAuth();
  const { t } = useI18n();
  const plays = usePlays(game.id);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [isFaving, setIsFaving] = useState(false);

  const isFavorited = user?.favoriteGames?.includes(game.id) ?? false;

  useEffect(() => {
    if (isLoggedIn) {
      addRecentGame(game.id).catch(() => {});
    }
  }, [game.id, isLoggedIn, addRecentGame]);

  const handleFavorite = async () => {
    if (!isLoggedIn) { openAuthModal(); return; }
    if (isFaving) return;
    setIsFaving(true);
    await toggleFavorite(game.id, isFavorited ? 'remove' : 'add');
    setIsFaving(false);
  };

  const fetchVotes = useCallback(async () => {
    try {
      const res = await fetch(`/api/votes/${game.id}`);
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setDislikes(data.dislikes);
      }
    } catch {
      
    }
  }, [game.id]);

  useEffect(() => {
    fetchVotes();
    const storedVote = localStorage.getItem(`vote_${game.id}`);
    if (storedVote) setUserVote(storedVote as 'like' | 'dislike');
    
    
    fetch(`/api/games/${game.id}/play`, { method: 'POST' }).catch(() => {});
  }, [game.id, fetchVotes]);

  const handleVote = async (type: 'like' | 'dislike') => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    if (isVoting) return;
    setIsVoting(true);

    try {
      if (userVote === type) {
        const res = await fetch(`/api/votes/${game.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, action: 'remove' }),
        });
        if (res.ok) {
          const data = await res.json();
          setLikes(data.likes);
          setDislikes(data.dislikes);
          setUserVote(null);
          localStorage.removeItem(`vote_${game.id}`);
        }
      } else {
        if (userVote) {
          await fetch(`/api/votes/${game.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: userVote, action: 'remove' }),
          });
        }
        const res = await fetch(`/api/votes/${game.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, action: 'add' }),
        });
        if (res.ok) {
          const data = await res.json();
          setLikes(data.likes);
          setDislikes(data.dislikes);
          setUserVote(type);
          localStorage.setItem(`vote_${game.id}`, type);
        }
      }
    } catch {
      
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="game-player animate-scale-in">
      <div className="game-player__embed-wrapper" style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <iframe
            id="game-iframe"
            className="game-player__iframe"
            src={game.embedUrl.includes('itch.zone') ? `/api/proxy-game?url=${encodeURIComponent(game.embedUrl)}` : game.embedUrl}
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            referrerPolicy="no-referrer"
            sandbox={game.embedUrl.includes('itch.io') || game.embedUrl.includes('itch.zone') ? "allow-scripts allow-same-origin allow-popups allow-forms allow-pointer-lock allow-downloads" : undefined}
            style={{ width: '100%', height: '100%' }}
          ></iframe>
      </div>

      <div className="game-player__controls">
        <div className="game-player__info">
          <h1 className="game-player__title">
            {(() => {
              const translated = t(`game_${game.id}_title`);
              return translated === `game_${game.id}_title` ? game.title : translated;
            })()}
          </h1>
            <div className="game-player__tags" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="game-player__plays" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: '#94a3b8', fontWeight: 500 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                {new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 }).format(plays ?? 0)} Plays
              </span>
              {game.tags.map(tag => (
                <span key={tag} className={`game-player__tag game-player__tag--${tag}`}>{t(tag) || tag}</span>
              ))}
            </div>
        </div>

        <div className="game-player__actions">
          <div className="game-player__votes">
            <button
              className={`game-player__btn game-player__btn--vote ${userVote === 'like' ? 'active' : ''}`}
              onClick={() => handleVote('like')}
              disabled={isVoting}
              title={!isLoggedIn ? 'Sign in to vote' : undefined}
            >
              <span className="icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg></span> {likes}
            </button>
            <button
              className={`game-player__btn game-player__btn--vote ${userVote === 'dislike' ? 'active' : ''}`}
              onClick={() => handleVote('dislike')}
              disabled={isVoting}
              title={!isLoggedIn ? 'Sign in to vote' : undefined}
            >
              <span className="icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg></span> {dislikes}
            </button>
          </div>
          <button
            className={`game-player__btn game-player__btn--fav ${isFavorited ? 'active' : ''}`}
            onClick={handleFavorite}
            disabled={isFaving}
            title={!isLoggedIn ? 'Sign in to favorite' : isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className="icon">
              {isFavorited ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#ef4444" stroke="#ef4444" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              )}
            </span> {isFavorited ? 'Favorited' : 'Favorite'}
          </button>
        </div>
      </div>

      <div className="game-player__description-card">
        <h3>
          {t('about') || 'About'} {(() => {
            const translated = t(`game_${game.id}_title`);
            return translated === `game_${game.id}_title` ? game.title : translated;
          })()}
        </h3>
        <p>
          {(() => {
            const translated = t(`game_${game.id}_desc`);
            return translated === `game_${game.id}_desc` ? game.description : translated;
          })()}
        </p>
        
        {(game.discordUrl || game.steamUrl || game.developerLink) && (
          <div className="game-player__links" style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {game.discordUrl && (
              <a href={game.discordUrl} target="_blank" rel="noopener noreferrer" className="game-player__btn" style={{ textDecoration: 'none' }}>
                <span className="icon">💬</span> Discord
              </a>
            )}
            {game.steamUrl && (
              <a href={game.steamUrl} target="_blank" rel="noopener noreferrer" className="game-player__btn" style={{ textDecoration: 'none' }}>
                <span className="icon">🎮</span> Steam
              </a>
            )}
            {game.developerLink && (
              <a href={game.developerLink} target="_blank" rel="noopener noreferrer" className="game-player__btn" style={{ textDecoration: 'none', backgroundColor: '#6D28D9', color: '#fff' }}>
                <span className="icon">💖</span> Support Creator
              </a>
            )}
          </div>
        )}
      </div>
      
      <AdSlot placement="game-below" />
    </div>
  );
}
