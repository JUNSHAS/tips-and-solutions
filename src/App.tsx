/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tip, Folder, UserStats } from './types';
import { INITIAL_TIPS, INITIAL_FOLDERS, INITIAL_USER_STATS } from './data/initialTips';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { SavedDrawerView } from './components/SavedDrawerView';
import { TipDetailView } from './components/TipDetailView';
import {
  WriteTipModal,
  VerificationModal,
  NewFolderModal,
  MemoModal,
  TesterApplyModal,
  SearchPaletteModal,
} from './components/Modals';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'explore' | 'saved-drawer' | 'detail'>('explore');
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

  // Tips Database (with localStorage persistence)
  const [tips, setTips] = useState<Tip[]>(() => {
    try {
      const saved = localStorage.getItem('lifetip_tips');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_TIPS;
  });

  // Folders Database
  const [folders, setFolders] = useState<Folder[]>(() => {
    try {
      const saved = localStorage.getItem('lifetip_folders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_FOLDERS;
  });

  // User Stats
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('lifetip_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_USER_STATS;
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lifetip_tips', JSON.stringify(tips));
    } catch (e) {}
  }, [tips]);

  useEffect(() => {
    try {
      localStorage.setItem('lifetip_folders', JSON.stringify(folders));
    } catch (e) {}
  }, [folders]);

  useEffect(() => {
    try {
      localStorage.setItem('lifetip_stats', JSON.stringify(stats));
    } catch (e) {}
  }, [stats]);

  // Toast Notification System
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Modals Visibility
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verifyingTip, setVerifyingTip] = useState<Tip | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [memoEditingTip, setMemoEditingTip] = useState<Tip | null>(null);
  const [isTesterModalOpen, setIsTesterModalOpen] = useState(false);
  const [isSearchPaletteOpen, setIsSearchPaletteOpen] = useState(false);

  // Quick Bookmarks slideover preview
  const [isQuickBookmarkOpen, setIsQuickBookmarkOpen] = useState(false);

  // Handlers
  const handleToggleBookmark = (tipId: string) => {
    setTips((prev) =>
      prev.map((t) => {
        if (t.id === tipId) {
          const nextSaved = !t.isSaved;
          showToast(
            nextSaved
              ? `'${t.title.slice(0, 16)}...' 꿀팁 서랍에 저장되었습니다 📁`
              : '꿀팁 서랍에서 제거되었습니다.'
          );
          return {
            ...t,
            isSaved: nextSaved,
            saves: nextSaved ? t.saves + 1 : Math.max(0, t.saves - 1),
            savedAtText: nextSaved ? '오늘 저장됨' : undefined,
            savedFolderId: nextSaved ? t.savedFolderId || 'folder-clean' : undefined,
          };
        }
        return t;
      })
    );

    // If currently viewing details, update selectedTip too
    if (selectedTip && selectedTip.id === tipId) {
      setSelectedTip((prev) =>
        prev ? { ...prev, isSaved: !prev.isSaved, saves: !prev.isSaved ? prev.saves + 1 : prev.saves - 1 } : null
      );
    }
  };

  const handleSelectTip = (tip: Tip) => {
    setSelectedTip(tip);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDetail = () => {
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddTip = (newTipData: Partial<Tip>) => {
    const newTip = {
      ...newTipData,
      isSaved: true,
      saves: 1,
      likes: 1,
    } as Tip;

    setTips([newTip, ...tips]);
    showToast('새 꿀팁이 등록되어 서랍에 저장되었습니다! 🎉');
  };

  const handleOpenVerification = (tip: Tip) => {
    setVerifyingTip(tip);
    setIsVerificationModalOpen(true);
  };

  const handleConfirmVerification = (tipId: string, review: string) => {
    setTips((prev) =>
      prev.map((t) => {
        if (t.id === tipId) {
          return {
            ...t,
            isCompleted: true,
            userMemo: review ? review : t.userMemo || '직접 실천 완료!',
          };
        }
        return t;
      })
    );

    setStats((prev) => ({
      ...prev,
      completedCount: prev.completedCount + 1,
    }));

    if (selectedTip && selectedTip.id === tipId) {
      setSelectedTip((prev) =>
        prev ? { ...prev, isCompleted: true, userMemo: review || prev.userMemo } : null
      );
    }

    showToast('후기 인증이 완료되어 살림 레벨이 상승했습니다! 🏆');
  };

  const handleCreateFolder = (name: string, icon: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      icon,
      count: 0,
      completedCount: 0,
      accentColor: '#004ac6',
    };
    setFolders([...folders, newFolder]);
    showToast(`새 폴더 '${name}'이 생성되었습니다 📁`);
  };

  const handleOpenMemoModal = (tip: Tip) => {
    setMemoEditingTip(tip);
    setIsMemoModalOpen(true);
  };

  const handleSaveMemo = (tipId: string, memo: string) => {
    setTips((prev) =>
      prev.map((t) => (t.id === tipId ? { ...t, userMemo: memo } : t))
    );
    if (selectedTip && selectedTip.id === tipId) {
      setSelectedTip((prev) => (prev ? { ...prev, userMemo: memo } : null));
    }
    showToast('살림 메모가 저장되었습니다 📝');
  };

  const savedCount = tips.filter((t) => t.isSaved).length;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Global Top Header (Hidden on TipDetailView if user wants clean mobile stack) */}
      {currentView !== 'detail' ? (
        <Header
          activeTab={currentView as 'home' | 'explore' | 'saved-drawer'}
          onNavigate={(tab) => {
            setCurrentView(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenWriteTip={() => setIsWriteModalOpen(true)}
          onOpenSearchPalette={() => setIsSearchPaletteOpen(true)}
          onOpenBookmarks={() => setIsQuickBookmarkOpen(true)}
          savedCount={savedCount}
        />
      ) : null}

      {/* Main View Router */}
      <main className={currentView !== 'detail' ? 'w-full pt-20 flex-1' : 'w-full flex-1'}>
        {currentView === 'explore' && (
          <ExploreView
            tips={tips}
            onSelectTip={handleSelectTip}
            onToggleBookmark={handleToggleBookmark}
            onOpenTesterModal={() => setIsTesterModalOpen(true)}
            showToast={showToast}
          />
        )}

        {currentView === 'home' && (
          <HomeView
            tips={tips}
            onSelectTip={handleSelectTip}
            onToggleBookmark={handleToggleBookmark}
            onNavigateToExplore={(category, query) => {
              setCurrentView('explore');
            }}
            onOpenWriteTip={() => setIsWriteModalOpen(true)}
            showToast={showToast}
          />
        )}

        {currentView === 'saved-drawer' && (
          <SavedDrawerView
            tips={tips}
            folders={folders}
            stats={stats}
            onSelectTip={handleSelectTip}
            onToggleBookmark={handleToggleBookmark}
            onOpenNewFolderModal={() => setIsFolderModalOpen(true)}
            onOpenMemoModal={handleOpenMemoModal}
            showToast={showToast}
          />
        )}

        {currentView === 'detail' && selectedTip && (
          <TipDetailView
            tip={selectedTip}
            onBack={handleBackFromDetail}
            onToggleBookmark={handleToggleBookmark}
            onOpenVerificationModal={handleOpenVerification}
            showToast={showToast}
          />
        )}
      </main>

      {/* Global Footer (shown on main tabs) */}
      {currentView !== 'detail' && (
        <Footer
          onNavigate={(tab) => {
            setCurrentView(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenNotice={() => showToast('공지: 1인 가구 꿀팁 빅데이터 2.4 버전 업데이트 완료')}
          onOpenTerms={() => showToast('LifeTip 이용약관: 비상업적 개인 자취 가이드')}
        />
      )}

      {/* Quick Bookmarks Slide-over Drawer */}
      {isQuickBookmarkOpen && (
        <div
          onClick={() => setIsQuickBookmarkOpen(false)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-surface-container-lowest h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto text-left"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">bookmark</span>
                  <h3 className="font-display text-[1.125rem] font-bold text-on-surface">
                    저장된 꿀팁 ({savedCount})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQuickBookmarkOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="space-y-3 pt-4">
                {tips
                  .filter((t) => t.isSaved)
                  .map((tip) => (
                    <div
                      key={tip.id}
                      onClick={() => {
                        handleSelectTip(tip);
                        setIsQuickBookmarkOpen(false);
                      }}
                      className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer flex items-center gap-3 border border-outline-variant/15"
                    >
                      <img
                        src={tip.imageUrl}
                        alt={tip.title}
                        className="w-12 h-12 rounded-lg object-cover shadow-2xs shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[0.8125rem] text-on-surface truncate">
                          {tip.title}
                        </p>
                        <span className="text-[0.6875rem] text-primary font-semibold">
                          {tip.categoryLabel} • {tip.durationText}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsQuickBookmarkOpen(false);
                setCurrentView('saved-drawer');
              }}
              className="w-full py-3 rounded-xl bg-primary text-white font-bold text-[0.875rem] shadow-sm hover:bg-primary-container transition-all cursor-pointer mt-4"
            >
              내 서랍 전체 보기
            </button>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <WriteTipModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSubmit={handleAddTip}
      />

      <VerificationModal
        isOpen={isVerificationModalOpen}
        tip={verifyingTip}
        onClose={() => {
          setIsVerificationModalOpen(false);
          setVerifyingTip(null);
        }}
        onConfirm={handleConfirmVerification}
      />

      <NewFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => setIsFolderModalOpen(false)}
        onCreate={handleCreateFolder}
      />

      <MemoModal
        isOpen={isMemoModalOpen}
        tip={memoEditingTip}
        onClose={() => {
          setIsMemoModalOpen(false);
          setMemoEditingTip(null);
        }}
        onSave={handleSaveMemo}
      />

      <TesterApplyModal
        isOpen={isTesterModalOpen}
        onClose={() => setIsTesterModalOpen(false)}
        showToast={showToast}
      />

      <SearchPaletteModal
        isOpen={isSearchPaletteOpen}
        onClose={() => setIsSearchPaletteOpen(false)}
        tips={tips}
        onSelectTip={handleSelectTip}
      />

      {/* Bottom Floating Toast Notification */}
      <div
        className={`fixed bottom-20 sm:bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#213145] text-[#eaf1ff] px-5 py-3 rounded-full shadow-xl text-[0.8125rem] flex items-center gap-2.5 transition-all duration-300 pointer-events-none border border-white/10 ${
          toastMessage ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
        }`}
      >
        <span
          className="material-symbols-outlined text-[18px] text-[#89f5e7]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          task_alt
        </span>
        <span className="font-medium whitespace-nowrap">{toastMessage}</span>
      </div>
    </div>
  );
}
