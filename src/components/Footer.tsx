import React from 'react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'explore' | 'saved-drawer') => void;
  onOpenNotice?: () => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenNotice, onOpenTerms }) => {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.02)] py-8 mt-12 border-t border-[#e5eeff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand statement */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-1.5 text-primary font-display text-[1.125rem] font-bold">
            <span className="material-symbols-outlined text-[20px]">lightbulb</span>
            LifeTip
          </div>
          <p className="text-[0.8125rem] text-on-surface-variant mt-1">
            1인 가구 초보 살림러를 위한 생활 밀착형 꿀팁 아카이브
          </p>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('explore')}
            className="text-[0.6875rem] sm:text-[0.75rem] text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            type="button"
          >
            카테고리 탐색
          </button>
          <button
            onClick={() => onNavigate('saved-drawer')}
            className="text-[0.6875rem] sm:text-[0.75rem] text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            type="button"
          >
            마이 서랍
          </button>
          <button
            onClick={onOpenNotice}
            className="text-[0.6875rem] sm:text-[0.75rem] text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            type="button"
          >
            공지사항
          </button>
          <button
            onClick={onOpenTerms}
            className="text-[0.6875rem] sm:text-[0.75rem] text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            type="button"
          >
            이용약관
          </button>
        </div>

        {/* Copyright */}
        <p className="text-[0.6875rem] sm:text-[0.75rem] text-outline">
          © 2025 LifeTip Corp. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
