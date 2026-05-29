'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Game } from '../lib/data';
import GameCard from './GameCard';
import Link from 'next/link';

interface GameCarouselProps {
  title: string;
  games: Game[];
  viewMoreLink?: string;
}

export default function GameCarousel({ title, games, viewMoreLink }: GameCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Default to true so they render immediately
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      // Very simple logic: if we have more than 5 games, ALWAYS show the right arrow just to be safe.
      // We will only hide the left arrow if we are exactly at 0.
      setCanScrollLeft(el.scrollLeft > 5);
      
      const isAtEnd = Math.ceil(el.scrollLeft) >= el.scrollWidth - el.clientWidth - 5;
      
      // If we have 6 or more games, always show the right arrow (unless we are definitely at the end)
      // If the browser thinks we are at the end, but we have 6+ games, we STILL show it just in case!
      setCanScrollRight(!isAtEnd || games.length > 5);
    }
  }, [games.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    // Initial check
    checkScroll();
    
    // Check on scroll and resize
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    
    // Try to trigger a check after images might have loaded
    const timeout = setTimeout(checkScroll, 500);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timeout);
    };
  }, [checkScroll]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = Math.max(el.clientWidth * 0.8, 300);
      el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  }, []);

  if (games.length === 0) return null;

  return (
    <section className="carousel-section">
      <div className="carousel-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 className="carousel-title" style={{ margin: 0 }}>{title}</h2>
        {viewMoreLink && (
          <Link href={viewMoreLink} style={{ color: '#f43f5e', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px', display: 'block' }}>
            View all &rarr;
          </Link>
        )}
      </div>

      <div className="carousel-wrapper" style={{ position: 'relative' }}>
        {canScrollLeft && (
          <button 
            className="carousel-arrow carousel-arrow--left" 
            onClick={() => scroll('left')} 
            aria-label="Scroll left"
            style={{ display: 'flex', position: 'absolute', left: '8px', zIndex: 100 }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        )}
        
        <div className="carousel-track" ref={scrollRef}>
          {games.map((game, index) => (
            <div key={`${game.id}-${index}`} className="carousel-item">
              <GameCard game={game} />
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button 
            className="carousel-arrow carousel-arrow--right" 
            onClick={() => scroll('right')} 
            aria-label="Scroll right"
            style={{ display: 'flex', position: 'absolute', right: '8px', zIndex: 100 }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        )}
      </div>
    </section>
  );
}
