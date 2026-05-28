'use client';

import Link from 'next/link';
import { Game } from '../lib/data';
import { useI18n } from './I18nContext';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const { t } = useI18n();

  return (
    <Link href={`/game/${game.id}`} className="game-card">
      <img src={game.thumbnail} alt="" className="game-card__image" loading="lazy" />
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
}
