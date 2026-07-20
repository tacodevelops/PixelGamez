'use client';

import React, { useEffect, useState } from 'react';

import { getFeaturedGames, getNewGames, getPopularGames, categories, getGamesByCategory, getTrendingGames, getUpAndComingGames, getMostVisitedGames, getRecommendedGames, games } from '../lib/data';
import GameCarousel from '../components/GameCarousel';
import GameGrid from '../components/GameGrid';
import AdSlot from '../components/AdSlot';
import Link from 'next/link';
import { useI18n } from '../components/I18nContext';
import { useAuth } from '../components/AuthContext';

export default function Home() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [playsMap, setPlaysMap] = useState<Record<string, number> | undefined>(undefined);

  useEffect(() => {
    let active = true;
    const fetchPlays = async () => {
      try {
        const res = await fetch('/api/games/plays');
        if (res.ok) {
          const data = await res.json();
          if (active) setPlaysMap(data);
        }
      } catch (err) {
        console.error('Failed to fetch plays', err);
      }
    };
    fetchPlays();
    const interval = setInterval(fetchPlays, 15 * 60 * 1000); // 15 mins
    return () => { active = false; clearInterval(interval); };
  }, []);

  const featuredGames = getFeaturedGames();
  const newGames = getNewGames();
  const popularGames = getPopularGames(playsMap);
  const trendingGames = getTrendingGames(playsMap);
  const upAndComingGames = getUpAndComingGames(playsMap);
  const mostVisitedGames = getMostVisitedGames(playsMap);
  const recommendedGames = getRecommendedGames();

  let topPicks: typeof games = [];
  if (user && user.recentGames && user.recentGames.length > 0) {
    const recentCategories = user.recentGames
      .map(id => games.find(g => g.id === id)?.category)
      .filter(Boolean);
    
    if (recentCategories.length > 0) {
      const preferredCategories = [...new Set(recentCategories)];
      topPicks = recommendedGames.filter(g => preferredCategories.includes(g.category));
    }
  }
  
  const favoriteGames = user?.favoriteGames
    ? games.filter(g => user.favoriteGames.includes(g.id))
    : [];

  const heroGames = featuredGames.slice(0, 4);

  return (
    <div className="home-page animate-fade-in">

      {heroGames.length >= 3 && (
        <section className="hero-banner">
          <Link href={`/game/${heroGames[0].id}`} className="hero-card hero-card--large">
            <img src={heroGames[0].thumbnail} alt="" className="hero-card__image" />
            <div className="hero-card__overlay">
              <span className="hero-card__badge hero-card__badge--featured">Featured</span>
              <h2 className="hero-card__title">{heroGames[0].title}</h2>
            </div>
          </Link>
          <div className="hero-card__side">
            {heroGames.slice(1, 4).map((game) => (
              <Link key={game.id} href={`/game/${game.id}`} className="hero-card hero-card--small">
                <img src={game.thumbnail} alt="" className="hero-card__image" />
                <div className="hero-card__overlay">
                  <span className="hero-card__title">{game.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {favoriteGames.length > 0 && (
        <GameGrid title="Your Favorites" games={favoriteGames.slice(0, 12)} viewMoreLink="/liked" />
      )}

      {topPicks.length > 0 && (
        <GameGrid title={t('top_picks')} games={topPicks.slice(0, 12)} viewMoreLink="/recommended" />
      )}

      <GameGrid title={t('trending')} games={trendingGames.slice(0, 18)} viewMoreLink="/trending" />
      
      <div style={{ margin: '32px 0' }}>
        <AdSlot placement="banner-home" />
      </div>

      <GameGrid title={t('new')} games={newGames.slice(0, 18)} viewMoreLink="/new" />
      
      <div style={{ margin: '32px 0' }}>
        <AdSlot placement="banner-home" />
      </div>

      <GameCarousel title={t('most_visited')} games={mostVisitedGames.slice(0, 14)} viewMoreLink="/most-visited" />
      <GameCarousel title={t('up_and_coming')} games={upAndComingGames.slice(0, 14)} viewMoreLink="/up-and-coming" />
      
      <div style={{ margin: '32px 0' }}>
        <AdSlot placement="banner-home" />
      </div>
      
      <GameGrid title={t('popular')} games={popularGames.slice(0, 18)} viewMoreLink="/popular" />

      {categories.map(category => {
        const games = getGamesByCategory(category.id);
        if (games.length === 0) return null;
        return (
          <React.Fragment key={category.id}>
            <GameCarousel
              title={t(category.id) || category.name}
              games={games.slice(0, 14)}
              viewMoreLink={`/category/${category.id}`}
            />
            {['action', 'simulation'].includes(category.id) && (
              <div style={{ margin: '32px 0' }}>
                <AdSlot placement="banner-home" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
