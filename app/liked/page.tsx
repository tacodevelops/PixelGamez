'use client';

import { useState, useEffect } from 'react';
import { Game, getAllGames } from '../../lib/data';
import GameGrid from '../../components/GameGrid';
import { Icon } from '../../components/Icons';
import { useAuth } from '../../components/AuthContext';

export default function LikedGamesPage() {
  const { user, isLoggedIn, loading } = useAuth();
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);

  useEffect(() => {
    if (loading) return;

    const allGames = getAllGames();
    let matches: Game[] = [];

    if (isLoggedIn && user?.favoriteGames) {
      matches = allGames.filter(g => user.favoriteGames.includes(g.id));
    } else {
      allGames.forEach(game => {
        if (localStorage.getItem(`vote_${game.id}`) === 'like') {
          matches.push(game);
        }
      });
    }

    setFavoriteGames(matches);
  }, [user, isLoggedIn, loading]);

  if (loading) {
    return <div className="animate-fade-in" style={{ padding: '2rem' }}>Loading your favorites...</div>;
  }

  return (
    <div className="liked-page animate-fade-in">
      <div className="category-header">
        <span className="category-header__icon"><Icon name="heart" size={32} /></span>
        <div>
          <h1 className="category-header__title">Your Favorites</h1>
          <div className="category-header__count">{favoriteGames.length} games you've enjoyed</div>
        </div>
      </div>

      {favoriteGames.length > 0 ? (
        <GameGrid title="" games={favoriteGames} />
      ) : (
        <div className="liked-empty">
          <div className="liked-empty__icon"><Icon name="heart" size={64} style={{ opacity: 0.5 }} /></div>
          <h2>No favorite games yet</h2>
          <p>Explore the catalog and click the favorite button on games you enjoy to see them here.</p>
        </div>
      )}
    </div>
  );
}
