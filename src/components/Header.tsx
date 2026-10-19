import React, { useState, useEffect } from 'react';

interface HeaderProps {
  activeTab: 'home' | 'explore' | 'saved-drawer';
  onNavigate: (tab: 'home' | 'explore' | 'saved-drawer') => void;
  onOpenWriteTip: () => void;
  onOpenSearchPalette: () => void;
  onOpenBookmarks: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  onOpenWriteTip,
  onOpenSearchPalette,
  onOpenBookmarks,
  savedCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);

  // Close popups on click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearchPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearchPalette]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#ffffff]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e5eeff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 flex items-center justify-between h-20 gap-4">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left transition-transform active:scale-95"
            type="button"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:bg-primary-container transition-colors">
              <span className="material-symbols-outlined text-[24px]">lightbulb</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-[1.25rem] text-primary tracking-tight font-bold leading-none">
                LifeTip
              </span>
              <span className="text-[0.6875rem] text-on-surface-variant font-medium mt-1 leading-none">
                스마트한 1인 가구 살림 팁
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-2 rounded-lg text-[0.875rem] transition-colors ${
                activeTab === 'home'
                  ? 'bg-surface-container text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-semibold'
              }`}
              type="button"
            >
              홈
            </button>
            <button
              onClick={() => onNavigate('explore')}
              className={`px-4 py-2 rounded-lg text-[0.875rem] transition-colors ${
                activeTab === 'explore'
                  ? 'bg-surface-container text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-semibold'
              }`}
              type="button"
            >
              탐색·검색
            </button>
            <button
              onClick={() => onNavigate('saved-drawer')}
              className={`px-4 py-2 rounded-lg text-[0.875rem] transition-colors flex items-center gap-1.5 ${
                activeTab === 'saved-drawer'
                  ? 'bg-surface-container text-primary font-bold shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-semibold'
              }`}
              type="button"
            >
              <span>꿀팁 서랍</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-primary/10 text-primary font-bold">
                  {savedCount}
                </span>
              )}
            </button>
            <button
              onClick={onOpenWriteTip}
              className="px-4 py-2 rounded-lg text-[0.875rem] text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors font-semibold flex items-center gap-1"
              type="button"
            >
              <span>팁 작성</span>
              <span className="material-symbols-outlined text-[16px] text-primary">add_circle</span>
            </button>
          </nav>
        </div>

        {/* Global Search Input with Ctrl+K */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-3">
          <button
            onClick={onOpenSearchPalette}
            className="w-full flex items-center justify-between gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl text-on-surface-variant hover:bg-surface-container focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all text-left cursor-text border border-transparent hover:border-[#c3c6d7]/40"
            type="button"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="material-symbols-outlined text-outline text-[20px] shrink-0">search</span>
              <span className="text-[0.8125rem] text-outline truncate">
                청소, 보관, 분리수거, 자취 요리 검색...
              </span>
            </div>
            <kbd className="shrink-0 hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container text-[0.6875rem] font-medium text-on-surface-variant border border-outline-variant/30">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right Action Icons & User Profile */}
        <div className="flex items-center gap-2 shrink-0 relative">
          {/* Notifications Button */}
          <div className="relative">
            <button
              aria-label="알림"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
                setHasUnreadNotification(false);
              }}
              className="relative p-2.5 rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {hasUnreadNotification && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container-lowest animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/20 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-surface-container pb-2 mb-2">
                  <span className="font-bold text-[0.875rem] text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">notifications_active</span>
                    실시간 알림
                  </span>
                  <span className="text-[0.6875rem] text-primary font-semibold">새 소식 3건</span>
                </div>
                <div className="space-y-1.5 text-left">
                  <div className="p-2.5 rounded-xl bg-surface-container-low/70 hover:bg-surface-container transition-colors cursor-pointer">
                    <div className="flex items-center gap-1.5 text-primary text-[0.75rem] font-bold">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      인기 급상승 팁
                    </div>
                    <p className="text-[0.8125rem] text-on-surface font-semibold mt-0.5">
                      '초파리 무덤 트랩' 팁이 실시간 2위로 올라섰습니다! 🪰
                    </p>
                    <span className="text-[0.6875rem] text-outline mt-1 block">10분 전</span>
                  </div>
                  <div className="p-2.5 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
                    <div className="flex items-center gap-1.5 text-tertiary text-[0.75rem] font-bold">
                      <span className="material-symbols-outlined text-[14px]">savings</span>
                      살림 절약 리포트
                    </div>
                    <p className="text-[0.8125rem] text-on-surface mt-0.5">
                      이번 달 꿀팁 실천으로 약 42,000원의 고정지출을 절약했어요.
                    </p>
                    <span className="text-[0.6875rem] text-outline mt-1 block">1시간 전</span>
                  </div>
                  <div className="p-2.5 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
                    <div className="flex items-center gap-1.5 text-secondary text-[0.75rem] font-bold">
                      <span className="material-symbols-outlined text-[14px]">military_tech</span>
                      레벨업 안내
                    </div>
                    <p className="text-[0.8125rem] text-on-surface mt-0.5">
                      후기 1개를 더 인증하면 'Lv.5 살림 마스터'로 승급합니다! 🏆
                    </p>
                    <span className="text-[0.6875rem] text-outline mt-1 block">어제</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bookmarks Quick Drawer Button */}
          <button
            aria-label="북마크 빠른보기"
            onClick={onOpenBookmarks}
            className="p-2.5 rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">bookmark</span>
          </button>

          {/* User Profile Chip */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 pl-1 py-1 pr-3 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer border border-transparent hover:border-outline-variant/30"
              type="button"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-[0.75rem] text-on-surface font-semibold leading-tight">김라이프</span>
                <span className="text-[0.6875rem] text-primary leading-none font-medium">자취 3년차</span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-outline hidden xl:inline">
                expand_more
              </span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-64 bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/20 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-surface-container mb-2 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm">
                      김
                    </div>
                    <div>
                      <p className="font-bold text-[0.875rem] text-on-surface">김라이프 님</p>
                      <p className="text-[0.6875rem] text-primary font-semibold">Lv.4 베테랑 살림러</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-left text-[0.8125rem]">
                  <button
                    onClick={() => {
                      onNavigate('saved-drawer');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-surface-container-low flex items-center gap-2 text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">folder_special</span>
                    나의 꿀팁 보관함 ({savedCount})
                  </button>
                  <button
                    onClick={() => {
                      onOpenWriteTip();
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-surface-container-low flex items-center gap-2 text-on-surface transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">edit_note</span>
                    새 살림 노하우 공유하기
                  </button>
                  <div className="border-t border-surface-container my-1"></div>
                  <div className="px-3 py-1.5 text-[0.6875rem] text-outline">
                    1인 가구 빅데이터 버전 2.4 (오프라인 지원)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
