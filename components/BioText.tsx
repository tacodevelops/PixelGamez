'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface BioTextProps {
  text: string;
}

export default function BioText({ text }: BioTextProps) {
  const [resolvedMentions, setResolvedMentions] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (!text) return;

    
    const mentions = Array.from(text.matchAll(/@([a-zA-Z0-9_]+)/g)).map(m => m[1]);
    const uniqueMentions = Array.from(new Set(mentions));

    uniqueMentions.forEach(async (username) => {
      
      if (resolvedMentions[username] !== undefined) return;

      try {
        const res = await fetch(`/api/users/lookup/${username}`);
        if (res.ok) {
          const data = await res.json();
          setResolvedMentions(prev => ({ ...prev, [username]: data.playerId || data.id }));
        } else {
          setResolvedMentions(prev => ({ ...prev, [username]: null }));
        }
      } catch {
        setResolvedMentions(prev => ({ ...prev, [username]: null }));
      }
    });
  }, [text, resolvedMentions]);

  if (!text) return null;

  
  const parts = text.split(/(@[a-zA-Z0-9_]+)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('@')) {
          const username = part.slice(1);
          const userId = resolvedMentions[username];
          
          if (userId) {
            return (
              <Link key={i} href={`/user/${userId}`} className="bio-mention">
                {part}
              </Link>
            );
          } else {
            return <span key={i}>{part}</span>;
          }
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
