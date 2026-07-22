import { useState, useEffect } from 'react';

let cachedPlays: Record<string, number> | null = null;
if (typeof window !== 'undefined') {
  const ls = localStorage.getItem('pixelgamez_plays');
  if (ls) {
    try { cachedPlays = JSON.parse(ls); } catch {}
  }
}
let fetchPromise: Promise<Record<string, number>> | null = null;

export function usePlays(gameId: string) {
  const [plays, setPlays] = useState<number | null>(cachedPlays ? (cachedPlays[gameId] ?? 0) : null);

  useEffect(() => {
    if (!fetchPromise) {
      fetchPromise = fetch('/api/games/plays')
        .then(res => res.json())
        .then(data => {
          cachedPlays = data;
          if (typeof window !== 'undefined') {
            localStorage.setItem('pixelgamez_plays', JSON.stringify(data));
          }
          return data;
        })
        .catch(() => {
          return {};
        });
    }

    fetchPromise.then(data => {
      setPlays(data[gameId] ?? 0);
    });
  }, [gameId]);

  return plays;
}
