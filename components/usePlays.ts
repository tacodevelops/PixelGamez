import { useState, useEffect } from 'react';

let cachedPlays: Record<string, number> | null = null;
let fetchPromise: Promise<Record<string, number>> | null = null;

export function usePlays(gameId: string) {
  const [plays, setPlays] = useState<number | null>(null);

  useEffect(() => {
    if (cachedPlays) {
      setPlays(cachedPlays[gameId] ?? 0);
      return;
    }
    
    if (!fetchPromise) {
      fetchPromise = fetch('/api/games/plays')
        .then(res => res.json())
        .then(data => {
          cachedPlays = data;
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
