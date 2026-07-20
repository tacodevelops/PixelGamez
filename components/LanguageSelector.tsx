'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useI18n } from './I18nContext';
import { LanguageCode } from '../lib/translations';

const getFlagCode = (lang: string) => {
  const map: Record<string, string> = {
    'en': 'us',
    'ja': 'jp',
    'ko': 'kr',
    'zh': 'cn',
    'uk': 'ua',
    'da': 'dk',
    'el': 'gr',
    'cs': 'cz',
    'ar': 'sa',
    'hi': 'in',
    'ms': 'my',
    'vi': 'vn',
    'tl': 'ph',
    'sv': 'se',
    'pt': 'br'
  };
  return map[lang] || lang;
};

export default function LanguageSelector() {
  const { language, setLanguage, supportedLanguages } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const currentLang = supportedLanguages.find(l => l.code === language);

  return (
    <div className="language-selector-container">
      <button 
        className="language-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select Language"
        title="Select Language"
      >
        <Image 
          src={`https://flagcdn.com/w40/${getFlagCode(currentLang?.code || 'en')}.png`}
          alt="Language"
          width={20}
          height={15}
          className="language-flag-icon"
          unoptimized
        />
        <span className="language-label-text">{currentLang?.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="language-selector-overlay">
          <div className="language-selector-modal" ref={modalRef}>
            <div className="language-selector-modal__header">
              <h3>Select Language</h3>
              <button className="language-selector-modal__close" onClick={() => setIsOpen(false)} aria-label="Close language selector">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="language-selector-modal__grid">
              {supportedLanguages.map(lang => (
                <button
                  key={lang.code}
                  className={`language-selector-modal__item ${lang.code === language ? 'active' : ''}`}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                >
                  <Image 
                    src={`https://flagcdn.com/w40/${getFlagCode(lang.code)}.png`}
                    alt={lang.name}
                    width={20}
                    height={15}
                    className="language-flag-icon"
                    unoptimized
                  />
                  <span className="lang-name">{lang.name}</span>
                  <span className="lang-code">{lang.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
