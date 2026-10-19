import React, { useState, useMemo } from 'react';
import { Tip, Folder, UserStats } from '../types';

interface SavedDrawerViewProps {
  tips: Tip[];
  folders: Folder[];
  stats: UserStats;
  onSelectTip: (tip: Tip) => void;
  onToggleBookmark: (tipId: string) => void;
  onOpenNewFolderModal: () => void;
  onOpenMemoModal: (tip: Tip) => void;
  showToast: (msg: string) => void;
}

export const SavedDrawerView: React.FC<SavedDrawerViewProps> = ({
  tips,
  folders,
  stats,
  onSelectTip,
  onToggleBookmark,
  onOpenNewFolderModal,
  onOpenMemoModal,
  showToast,
}) => {
  // Navigation Sub-tabs
  const [subTab, setSubTab] = useState<'folders' | 'history' | 'verified' | 'offline'>('folders');

  // Selected Folder
  const [selectedFolderId, setSelectedFolderId] = useState<string>('folder-clean');

  // Drawer Search & Filters
  const [drawerSearch, setDrawerSearch] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'completed' | 'hasMemo' | 'fast5'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'easy' | 'short' | 'reviews'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Filter saved tips
  const savedTips = useMemo(() => {
    let result = tips.filter((t) => t.isSaved || t.savedFolderId);

    // If folder is selected and not in 'all' view
    if (selectedFolderId && subTab === 'folders') {
      result = result.filter((t) => t.savedFolderId === selectedFolderId || t.isSaved);
    }

    if (subTab === 'verified') {
      result = result.filter((t) => t.isCompleted);
    }

    // Search query
    if (drawerSearch.trim()) {
      const q = drawerSearch.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.userMemo && t.userMemo.toLowerCase().includes(q))
      );
    }

    // Filter Mode
    if (filterMode === 'completed') {
      result = result.filter((t) => t.isCompleted);
    } else if (filterMode === 'hasMemo') {
      result = result.filter((t) => !!t.userMemo);
    } else if (filterMode === 'fast5') {
      result = result.filter(
        (t) => t.durationCategory === 'under1' || t.durationCategory === 'cut3' || t.durationCategory === 'cut5'
      );
    }

    // Sorting
    if (sortBy === 'newest') {
      // default
    } else if (sortBy === 'easy') {
      result.sort((a, b) => a.difficultyStars - b.difficultyStars);
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [tips, selectedFolderId, subTab, drawerSearch, filterMode, sortBy]);

  const totalItems = savedTips.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedTips = savedTips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export to Excel / CSV / PDF
  const handleExport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      '제목,카테고리,소요시간,난이도,성공률,개인메모\n' +
      savedTips
        .map(
          (t) =>
            `"${t.title.replace(/"/g, '""')}","${t.categoryLabel}","${t.durationText}","${
              t.difficultyLabel
            }","${t.successRate}%","${(t.userMemo || '').replace(/"/g, '""')}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LifeTip_나의살림서랍_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('나의 살림 서랍 파일이 성공적으로 다운로드되었습니다! 📥');
  };

  const handleSyncOffline = () => {
    showToast('오프라인 패키지 25개 팁 캐시 동기화 완료! (14.2 MB)');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-5 py-6 w-full flex flex-col gap-8">
        {/* Top Stats Banner: Achievement & Value Dashboard */}
        <section className="relative overflow-hidden rounded-2xl bg-surface-container-low p-6 sm:p-8 shadow-sm border border-surface-container">
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 left-1/3 w-64 h-64 rounded-full bg-secondary-container/10 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 text-left">
            {/* Title & Subtitle block */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on-primary shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[32px]">folder_special</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-[0.6875rem] text-primary font-bold shadow-2xs">
                    {stats.level}
                  </span>
                  <span className="text-[0.75rem] text-on-surface-variant">
                    {stats.userName} 님의 전용 서랍
                  </span>
                </div>
                <h1 className="font-display text-[1.5rem] sm:text-[1.75rem] font-bold text-on-surface tracking-tight mt-1">
                  자취 생활 레벨업 중! 🏆
                </h1>
                <p className="text-[0.8125rem] text-on-surface-variant mt-0.5">
                  나만의 살림 노하우를 차곡차곡 모아 실제 자취 비용과 시간을 아끼고 있어요.
                </p>
              </div>
            </div>

            {/* 4 Metric Cards Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-surface-container flex flex-col min-w-[130px]">
                <div className="flex items-center justify-between text-on-surface-variant mb-1">
                  <span className="text-[0.6875rem] font-medium">절약한 시간</span>
                  <span className="material-symbols-outlined text-[18px] text-tertiary">schedule</span>
                </div>
                <div className="font-display text-[1.125rem] font-bold text-on-surface">
                  {stats.hoursSaved}
                </div>
                <span className="text-[0.6875rem] text-tertiary font-medium mt-1">가사 노동 단축</span>
              </div>

              <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-surface-container flex flex-col min-w-[130px]">
                <div className="flex items-center justify-between text-on-surface-variant mb-1">
                  <span className="text-[0.6875rem] font-medium">예상 절약 비용</span>
                  <span className="material-symbols-outlined text-[18px] text-primary">savings</span>
                </div>
                <div className="font-display text-[1.125rem] font-bold text-primary">
                  {stats.moneySaved}
                </div>
                <span className="text-[0.6875rem] text-on-surface-variant mt-1">
                  {stats.monthlyAverage}
                </span>
              </div>

              <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-surface-container flex flex-col min-w-[130px]">
                <div className="flex items-center justify-between text-on-surface-variant mb-1">
                  <span className="text-[0.6875rem] font-medium">보관한 꿀팁</span>
                  <span className="material-symbols-outlined text-[18px] text-secondary">bookmark</span>
                </div>
                <div className="font-display text-[1.125rem] font-bold text-on-surface">
                  {stats.savedCount}개
                </div>
                <span className="text-[0.6875rem] text-on-surface-variant mt-1">
                  {folders.length}개 카테고리 폴더
                </span>
              </div>

              <div className="bg-surface-container-lowest p-3.5 rounded-xl shadow-xs border border-surface-container flex flex-col min-w-[130px]">
                <div className="flex items-center justify-between text-on-surface-variant mb-1">
                  <span className="text-[0.6875rem] font-medium">직접 성공한 팁</span>
                  <span
                    className="material-symbols-outlined text-[18px] text-tertiary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
                <div className="font-display text-[1.125rem] font-bold text-tertiary-container">
                  {stats.completedCount}개
                </div>
                <span className="text-[0.6875rem] text-tertiary font-medium mt-1">
                  {stats.completionRate}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Global Navigation Tabs & Storage State */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl self-start overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setSubTab('folders')}
              className={`px-3.5 py-2 rounded-lg text-[0.8125rem] font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'folders'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">folder</span>
              내 저장 폴더
              <span className="px-1.5 py-0.2 rounded-full bg-primary/10 text-primary text-[0.6875rem]">
                {stats.savedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSubTab('history');
                showToast('최근 조회한 꿀팁 목록으로 전환되었습니다.');
              }}
              className={`px-3.5 py-2 rounded-lg text-[0.8125rem] font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'history'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              최근 본 팁
              <span className="px-1.5 py-0.2 rounded-full bg-surface-container text-on-surface-variant text-[0.6875rem]">
                40
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSubTab('verified');
                showToast('직접 실천 완료한 팁 목록으로 전환되었습니다.');
              }}
              className={`px-3.5 py-2 rounded-lg text-[0.8125rem] font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'verified'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              직접 해본 팁 &amp; 후기
              <span className="px-1.5 py-0.2 rounded-full bg-tertiary/10 text-tertiary text-[0.6875rem] font-bold">
                {stats.completedCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSubTab('offline');
                showToast('오프라인 동기화 관리 패널을 확인합니다.');
              }}
              className={`px-3.5 py-2 rounded-lg text-[0.8125rem] font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'offline'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">cloud_sync</span>
              오프라인 동기화 관리
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary/10 text-tertiary text-[0.6875rem] font-medium">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              오프라인 보관함 최신 상태
            </div>
            <button
              type="button"
              onClick={() => {
                showToast('서랍 데이터가 최신 상태로 새로고침되었습니다 🔄');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-[0.75rem] font-semibold text-on-surface flex items-center gap-1 transition-colors cursor-pointer border border-outline-variant/20"
            >
              <span className="material-symbols-outlined text-[18px]">sync</span>
              지금 수동 새로고침
            </button>
          </div>
        </div>

        {/* Folder Management Grid */}
        <section className="flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h2 className="font-display text-[1.125rem] text-on-surface font-bold">
                나의 살림 폴더
              </h2>
              <span className="text-[0.75rem] text-on-surface-variant">
                자주 찾는 분야별로 분류되어 있어요
              </span>
            </div>
            <button
              type="button"
              onClick={() => showToast('폴더 드래그 앤 드롭 정렬 모드가 활성화되었습니다.')}
              className="text-[0.75rem] text-primary font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              폴더 순서 편집
              <span className="material-symbols-outlined text-[16px]">tune</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Action Card: Create New Folder */}
            <button
              type="button"
              onClick={onOpenNewFolderModal}
              className="group h-40 rounded-2xl bg-surface-container-lowest p-4 flex flex-col items-center justify-center gap-1 text-center shadow-xs hover:shadow-md transition-all text-on-surface-variant hover:text-primary border border-dashed border-outline-variant/60 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container-low group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[26px]">create_new_folder</span>
              </div>
              <span className="font-bold text-[0.875rem] mt-1">+ 새 폴더 만들기</span>
              <span className="text-[0.6875rem] text-outline">최대 20개 생성 가능</span>
            </button>

            {/* Dynamic Folders */}
            {folders.map((folder) => {
              const isSelected = selectedFolderId === folder.id;
              return (
                <div
                  key={folder.id}
                  onClick={() => {
                    setSelectedFolderId(folder.id);
                    showToast(`'${folder.name}' 폴더를 선택했습니다.`);
                  }}
                  className={`h-40 rounded-2xl bg-surface-container-lowest p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative overflow-hidden group cursor-pointer border ${
                    isSelected ? 'border-primary shadow-sm' : 'border-surface-container'
                  }`}
                >
                  {isSelected && <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>}
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[22px]">{folder.icon}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded text-[0.6875rem] bg-primary/10 text-primary font-bold">
                          선택됨
                        </span>
                      )}
                      <button
                        type="button"
                        aria-label="폴더 옵션"
                        onClick={(e) => {
                          e.stopPropagation();
                          showToast(`'${folder.name}' 폴더 관리 메뉴`);
                        }}
                        className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">more_vert</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-[0.9375rem] text-on-surface font-bold group-hover:text-primary transition-colors">
                      {folder.name}
                    </div>
                    <p className="text-[0.75rem] text-on-surface-variant mt-0.5">
                      {folder.count}개 저장 • {folder.completedCount}개 실행완료
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Filter, Search, and Action Bar */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Left: Search inside drawer & Filter Chips */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative min-w-[220px] max-w-xs flex-1">
              <span className="material-symbols-outlined text-outline text-[18px] absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                value={drawerSearch}
                onChange={(e) => setDrawerSearch(e.target.value)}
                placeholder="내 서랍에서 검색..."
                className="w-full bg-surface-container-low pl-9 pr-4 py-2 rounded-xl text-on-surface text-[0.8125rem] outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary border border-transparent focus:border-primary transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-xl text-[0.75rem] font-semibold transition-colors cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                전체 보기
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('completed')}
                className={`px-3 py-1.5 rounded-xl text-[0.75rem] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  filterMode === 'completed'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                성공 완료 팁 (12)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('hasMemo')}
                className={`px-3 py-1.5 rounded-xl text-[0.75rem] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  filterMode === 'hasMemo'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] text-primary">edit_note</span>
                메모 있는 팁 (9)
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('fast5')}
                className={`px-3 py-1.5 rounded-xl text-[0.75rem] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  filterMode === 'fast5'
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">timer</span>
                5분 이내 초간편
              </button>
            </div>
          </div>

          {/* Right: Sort options & View Mode Toggle */}
          <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0">
            <div className="flex items-center gap-1.5 text-on-surface-variant text-[0.75rem]">
              <span>정렬:</span>
              <div className="relative inline-block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-surface-container-low text-on-surface font-semibold text-[0.75rem] px-3 py-2 rounded-xl outline-none cursor-pointer pr-7 appearance-none focus:ring-2 focus:ring-primary border border-outline-variant/20"
                >
                  <option value="newest">최신 저장순</option>
                  <option value="easy">난이도 낮은순 (초보자)</option>
                  <option value="reviews">직접 후기 많은순</option>
                </select>
                <span className="material-symbols-outlined text-[16px] text-outline absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-outline hover:text-on-surface'
                }`}
                title="그리드 뷰"
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-outline hover:text-on-surface'
                }`}
                title="리스트 뷰"
              >
                <span className="material-symbols-outlined text-[18px]">view_list</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Saved Tips Grid (2 Bespoke Cards per row on desktop matching Image 5) */}
        <section
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-5 text-left'
              : 'flex flex-col gap-4 text-left'
          }
        >
          {paginatedTips.map((tip) => (
            <article
              key={tip.id}
              onClick={() => onSelectTip(tip)}
              className="bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group border border-surface-container cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row h-full">
                {/* Thumbnail & Badges Area */}
                <div className="relative sm:w-5/12 h-52 sm:h-auto shrink-0 bg-surface-container overflow-hidden">
                  <img
                    src={tip.imageUrl}
                    alt={tip.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Offline Sync Pill */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-surface-container-lowest/90 backdrop-blur-md px-2 py-0.5 rounded-full shadow-xs">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">offline_pin</span>
                    <span className="text-[0.6875rem] text-on-surface font-semibold">오프라인 보관</span>
                  </div>

                  {/* Stamp Badge */}
                  {tip.isCompleted ? (
                    <div className="absolute bottom-3 left-3 bg-tertiary/95 text-on-tertiary px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                      <span
                        className="material-symbols-outlined text-[15px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      <span className="text-[0.6875rem] font-bold">성공했어요!</span>
                    </div>
                  ) : tip.id === 'tip-utility-discount' ? (
                    <div className="absolute bottom-3 left-3 bg-primary text-on-primary px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-[15px]">savings</span>
                      <span className="text-[0.6875rem] font-bold">연 36만원 절감</span>
                    </div>
                  ) : (
                    <div className="absolute bottom-3 left-3 bg-surface-container-lowest/95 backdrop-blur-md text-on-surface px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-[15px] text-secondary">flash_on</span>
                      <span className="text-[0.6875rem] font-bold text-secondary">
                        {tip.durationText}
                      </span>
                    </div>
                  )}

                  {/* Quick Bookmark Toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(tip.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 text-primary flex items-center justify-center shadow-xs hover:scale-110 transition-transform"
                    title="보관함에서 토글"
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: tip.isSaved ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      bookmark
                    </span>
                  </button>
                </div>

                {/* Content Details */}
                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-secondary-fixed/50 text-secondary text-[0.6875rem] font-semibold">
                        {tip.subcategory || tip.categoryLabel}
                      </span>
                      <span className="text-[0.6875rem] text-outline">{tip.savedAtText || '최근 저장됨'}</span>
                    </div>

                    <h3 className="font-display text-[0.9375rem] text-on-surface font-bold group-hover:text-primary transition-colors line-clamp-1">
                      {tip.title}
                    </h3>
                    <p className="text-[0.75rem] text-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                      {tip.description}
                    </p>

                    {/* Personal Memo Box */}
                    {tip.userMemo ? (
                      <div className="mt-3 p-2.5 rounded-xl bg-surface-container-low flex items-start gap-2 border border-outline-variant/20">
                        <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
                          sticky_note_2
                        </span>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-[0.6875rem] text-on-surface font-bold">내 살림 메모</span>
                          <p className="text-[0.75rem] text-on-surface-variant line-clamp-2 italic">
                            "{tip.userMemo}"
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenMemoModal(tip);
                          }}
                          className="text-outline hover:text-primary p-1 rounded-lg transition-colors cursor-pointer"
                          title="메모 수정"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 p-2 rounded-xl bg-surface-container-low flex items-center justify-between gap-2 border border-outline-variant/20">
                        <div className="flex items-center gap-1.5 text-on-surface-variant text-[0.75rem]">
                          <span className="material-symbols-outlined text-[16px] text-outline">edit_note</span>
                          <span>아직 작성된 개인 메모가 없습니다</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenMemoModal(tip);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-[0.6875rem] text-primary font-bold shadow-2xs transition-colors cursor-pointer"
                        >
                          + 메모 쓰기
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Footer Meta */}
                  <div className="flex items-center justify-between pt-2 border-t border-surface-container/60 text-on-surface-variant text-[0.6875rem]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-tertiary">timer</span>
                        {tip.durationText}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-primary">thumb_up</span>
                        {tip.likes}명 성공
                      </span>
                    </div>
                    <span className="text-primary font-bold hover:underline flex items-center gap-0.5">
                      팁 상세보기
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Bottom Pagination & Export */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container gap-4">
          <span className="text-[0.75rem] text-on-surface-variant">
            총 {totalItems}개 중{' '}
            <strong className="text-on-surface font-semibold">
              {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)}개
            </strong>{' '}
            표시 중
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-lg bg-surface-container-low text-outline flex items-center justify-center hover:text-on-surface disabled:opacity-40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-8 h-8 rounded-lg text-[0.75rem] font-bold flex items-center justify-center cursor-pointer transition-colors ${
                  currentPage === idx + 1
                    ? 'bg-primary text-on-primary'
                    : 'hover:bg-surface-container-low text-on-surface'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-lg bg-surface-container-low text-on-surface flex items-center justify-center hover:bg-surface-container cursor-pointer disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="text-[0.75rem] text-primary font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            서랍 내보내기 (PDF/Excel)
            <span className="material-symbols-outlined text-[16px]">file_download</span>
          </button>
        </div>

        {/* Bottom Alert Bar: Offline Auto Sync Status */}
        <aside className="w-full bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-sm border border-surface-container flex flex-col md:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-tertiary-container/10 flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-[24px]">cloud_done</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-[0.9375rem] text-on-surface font-bold">
                  모든 팁 오프라인 자동 동기화 활성화됨
                </span>
                <span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary text-[0.6875rem] font-bold">
                  동기화 완료
                </span>
              </div>
              <p className="text-[0.75rem] text-on-surface-variant mt-0.5 leading-relaxed">
                지하철, 화장실, 캠핑장 등 데이터 연결이 불안정한 환경에서도 저장된 레시피와 살림법을 언제든 즉시 열람할 수 있습니다. (캐시 용량: 14.2 MB)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => showToast('동기화 주기: 자동 (Wi-Fi 연결 시 최신 팁 패키지 즉시 다운로드)')}
              className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-[0.75rem] font-semibold transition-colors cursor-pointer border border-outline-variant/20"
            >
              동기화 설정
            </button>
            <button
              type="button"
              onClick={handleSyncOffline}
              className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-container text-[0.75rem] font-bold shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              전체 오프라인 패키지 저장
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
