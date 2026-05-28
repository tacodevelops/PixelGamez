'use client';

import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { Game } from '../lib/data';
import { useI18n } from './I18nContext';

interface GameCardProps {
  game: Game;
}

const GameCard = React.memo(function GameCard({ game }: GameCardProps) {
  const { t } = useI18n();

  return (
    <Link href={`/game/${game.id}`} className="game-card">
      <Image src={game.thumbnail} alt="" className="game-card__image" fill sizes="(max-width: 768px) 50vw, 25vw" loading="lazy" style={{ objectFit: 'cover' }} />
      <div className="game-card__overlay">
        <span className="game-card__title">
          {(() => {
            const translated = t(`game_${game.id}_title`);
            return translated === `game_${game.id}_title` ? game.title : translated;
          })()}
        </span>
      </div>
      {game.tags.length > 0 && (
        <div className="game-card__badges">
          {game.tags.slice(0, 1).map(tag => (
            <span key={tag} className={`game-card__badge game-card__badge--${tag}`}>
              {t(tag) || tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
});

export default GameCard;
