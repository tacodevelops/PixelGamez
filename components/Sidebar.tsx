'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { categories, getGameCountByCategory, games } from '../lib/data';
import { Icon, IconName } from './Icons';
import { useAuth } from './AuthContext';
import { useI18n } from './I18nContext';
import AdSlot from './AdSlot';

export default function Sidebar() {
  const pathname = usePathname();
  const { isOwner, isModerator, user } = useAuth();
  const { t } = useI18n();

  return (
    <nav className="sidebar">
      <Link href="/" className={`sidebar__link ${pathname === '/' ? 'active' : ''}`}>
        <span className="sidebar__icon"><Icon name="home" /></span>
        <span className="sidebar__label">{t('home')}</span>
      </Link>
      <Link href="/trending" className={`sidebar__link ${pathname === '/trending' ? 'active' : ''}`}>
        <span className="sidebar__icon"><Icon name="trending" /></span>
        <span className="sidebar__label">{t('trending')}</span>
      </Link>
      <Link href="/new" className={`sidebar__link ${pathname === '/new' ? 'active' : ''}`}>
        <span className="sidebar__icon"><Icon name="new" /></span>
        <span className="sidebar__label">{t('new')}</span>
      </Link>
      <Link href="/popular" className={`sidebar__link ${pathname === '/popular' ? 'active' : ''}`}>
        <span className="sidebar__icon"><Icon name="fire" /></span>
        <span className="sidebar__label">{t('popular')}</span>
      </Link>
      <Link href="/up-and-coming" className={`sidebar__link ${pathname === '/up-and-coming' ? 'active' : ''}`}>
        <span className="sidebar__icon"><Icon name="rocket" /></span>
        <span className="sidebar__label">{t('up_and_coming')}</span>
      </Link>
      <Link href="/most-visited" className={`sidebar__link ${pathname === '/most-visited' ? 'active' : ''}`}>
        <span className="sidebar__icon"><Icon name="eye" /></span>
        <span className="sidebar__label">{t('most_visited')}</span>
      </Link>
      <Link href="/recommended" className={`sidebar__link ${pathname === '/recommended' ? 'active' : ''}`}>
        <span className="sidebar__icon"><Icon name="star" /></span>
        <span className="sidebar__label">{t('recommended')}</span>
      </Link>


      <div className="sidebar__divider"></div>

      <Link href="/developer" className={`sidebar__link ${pathname === '/developer' ? 'active' : ''}`}>
        <span className="sidebar__icon"><Icon name="code" /></span>
        <span className="sidebar__label">{t('developer')}</span>
      </Link>
      <Link href="/brand-integration" className={`sidebar__link ${pathname === '/brand-integration' ? 'active' : ''}`}>
        <span className="sidebar__icon">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </span>
        <span className="sidebar__label">Brand Integration</span>
      </Link>
      {isOwner || isModerator ? (
        <Link href="/admin" className={`sidebar__link ${pathname === '/admin' ? 'active' : ''}`}>
          <span className="sidebar__icon"><Icon name="star" /></span>
          <span className="sidebar__label">{isOwner ? t('owner_panel') : t('moderator_panel')}</span>
        </Link>
      ) : null}
      
      <div className="sidebar__divider"></div>
      <AdSlot placement="sidebar" />
    </nav>
  );
}
