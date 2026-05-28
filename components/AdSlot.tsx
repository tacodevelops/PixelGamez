'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

interface Ad {
  id: string;
  imageUrl: string;
  linkUrl: string;
  placement: string;
  label: string;
}

interface AdSlotProps {
  placement: 'sidebar' | 'banner-home' | 'game-below' | 'game-side' | 'profile';
}

const AdSlot = React.memo(function AdSlot({ placement }: AdSlotProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const adSenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isAdSense = !!adSenseClientId;

  useEffect(() => {
    let mounted = true;
    
    if (isAdSense) {
      try {
        if (typeof window !== 'undefined' && !(window as any).adsbygoogle?.loaded) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        }
      } catch (e) {
        console.error('AdSense error', e);
      }
      return;
    }

    const fetchAd = async () => {
      try {
        const res = await fetch(`/api/ads/${placement}`);
        if (res.ok) {
          const ads: Ad[] = await res.json();
          if (ads.length > 0 && mounted) {
            const randomAd = ads[Math.floor(Math.random() * ads.length)];
            setAd(randomAd);
            fetch(`/api/ads/${randomAd.id}/impression`, { method: 'POST' }).catch(() => {});
          }
        }
      } catch {
        
      }
    };

    fetchAd();

    return () => {
      mounted = false;
    };
  }, [placement, isAdSense]);

  if (isAdSense) {
    
    return (
      <div className={`ad-slot ad-slot--${placement}`} style={{ border: 'none', background: 'transparent' }}>
        <ins 
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={adSenseClientId}
          data-ad-slot="" // Optional: Configure slot ID per placement if needed
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (!ad) return null;

  const handleClick = () => {
    fetch(`/api/ads/${ad.id}/click`, { method: 'POST' }).catch(() => {});
  };

  return (
    <div className={`ad-slot ad-slot--${placement}`}>
      <span className="ad-slot__badge">{ad.label || 'Ad'}</span>
      <Link href={ad.linkUrl} target="_blank" rel="noopener noreferrer" onClick={handleClick} className="ad-slot__link">
        <Image src={ad.imageUrl} alt="Advertisement" className="ad-slot__image" fill sizes="(max-width: 768px) 100vw, 300px" style={{ objectFit: 'cover' }} />
      </Link>
    </div>
  );
});

export default AdSlot;
