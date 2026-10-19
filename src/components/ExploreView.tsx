import React, { useState, useEffect, useMemo } from 'react';
import { Tip, CategoryKey } from '../types';

interface ExploreViewProps {
  tips: Tip[];
  onSelectTip: (tip: Tip) => void;
  onToggleBookmark: (tipId: string) => void;
  onOpenTesterModal: () => void;
  showToast: (msg: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  tips,
  onSelectTip,
  onToggleBookmark,
  onOpenTesterModal,
  showToast,
}) => {
  // Ticker animation
  const tickerItems = [
    '여름철 초파리 트랩 설치 100% 박멸 비법 🪰',
    '장마철 빨래 꿉꿉한 냄새 제거 구연산 팁 👕',
    '남은 양파 싹 안 나게 알루미늄 호일 보관법 🧅',
    '원룸 싱크대 배수구 기름 슬러지 녹이기 🚿',
  ];
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerFade, setTickerFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerFade(false);
      setTimeout(() => {
        setTickerIndex((prev) => (prev + 1) % tickerItems.length);
        setTickerFade(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [problemTypes, setProblemTypes] = useState<{ [key: string]: boolean }>({
    clean: true,
    kitchen: false,
    storage: false,
    economy: false,
  });
  const [timeFilter, setTimeFilter] = useState<string>('cut3'); // under1, cut3, cut5, over10, all
  const [difficultyFilter, setDifficultyFilter] = useState<'easy' | 'medium' | 'hard' | 'all'>('easy');
  const [sortOrder, setSortOrder] = useState<'success' | 'popular' | 'latest'>('success');

  // Tools in user's room
  const [activeTools, setActiveTools] = useState<string[]>(['전자레인지', '베이킹소다', '식초']);
  const availableToolsToAdd = [
    '에어프라이어',
    '주방 랩/호일',
    '구연산',
    '매직블럭',
    '고무장갑',
    '과탄산소다',
    '키친타월',
  ].filter((t) => !activeTools.includes(t));

  // Voice Search Simulation
  const [isListeningVoice, setIsListeningVoice] = useState(false);

  const handleVoiceSearch = () => {
    setIsListeningVoice(true);
    showToast('음성 인식을 시작합니다. 살림 고민을 말씀해주세요 🎙️');
    setTimeout(() => {
      setSearchQuery('초파리 트랩');
      setIsListeningVoice(false);
      showToast('음성 인식 완료: "초파리 트랩"');
    }, 2000);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setProblemTypes({
      clean: true,
      kitchen: false,
      storage: false,
      economy: false,
    });
    setTimeFilter('cut3');
    setDifficultyFilter('easy');
    setActiveTools(['전자레인지', '베이킹소다', '식초']);
    setSortOrder('success');
    showToast('필터가 기본 상태로 초기화되었습니다.');
  };

  const removeTool = (tool: string) => {
    setActiveTools(activeTools.filter((t) => t !== tool));
  };

  const addTool = (tool: string) => {
    setActiveTools([...activeTools, tool]);
  };

  // Visible tips count (Load more)
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter Logic
  const filteredTips = useMemo(() => {
    let result = [...tips];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (tip) =>
          tip.title.toLowerCase().includes(q) ||
          tip.description.toLowerCase().includes(q) ||
          tip.categoryLabel.toLowerCase().includes(q) ||
          tip.subcategory.toLowerCase().includes(q) ||
          tip.tools.some((tool) => tool.toLowerCase().includes(q))
      );
    }

    // Category dropdown
    if (selectedCategory !== 'all') {
      result = result.filter((tip) => tip.category === selectedCategory);
    }

    // Sort
    if (sortOrder === 'success') {
      result.sort((a, b) => b.successRate - a.successRate);
    } else if (sortOrder === 'popular') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortOrder === 'latest') {
      result.sort((a, b) => b.saves - a.saves);
    }

    return result;
  }, [tips, searchQuery, selectedCategory, sortOrder]);

  const displayedTips = filteredTips.slice(0, visibleCount);

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Interactive & Search Notification Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 pt-4">
        <div className="relative overflow-hidden rounded-xl bg-surface-container-high px-4 sm:px-6 py-2.5 flex items-center justify-between text-on-surface border border-outline-variant/20 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-primary text-on-primary text-[0.6875rem] font-bold shrink-0">
              HOT
            </span>
            <span className="text-[0.75rem] sm:text-[0.8125rem] text-primary font-bold whitespace-nowrap">
              지금 자취러 급상승 고민:
            </span>
            <span
              className={`text-[0.8125rem] text-on-surface truncate transition-opacity duration-300 ${
                tickerFade ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {tickerItems[tickerIndex]}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0 text-on-surface-variant text-[0.6875rem] lg:text-[0.75rem]">
            <span>
              실시간 살림 해결률 <strong className="text-primary font-bold">98.4%</strong>
            </span>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span>
              등록된 꿀팁 <strong className="text-on-surface font-bold">14,290개</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Hero Search Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-5 py-6">
        <div className="relative rounded-2xl bg-surface-container-lowest p-6 sm:p-10 shadow-sm border border-surface-container overflow-hidden">
          {/* Decorative Backdrop Geometry */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-surface-container blur-3xl pointer-events-none opacity-60"></div>
          <div className="absolute -left-12 -bottom-12 w-64 h-64 rounded-full bg-secondary-fixed/30 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-primary text-[0.75rem] font-bold mb-3 shadow-2xs">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              1인 가구 빅데이터 기반 해결 솔루션
            </div>

            <h2 className="font-display text-[1.75rem] sm:text-[2rem] font-bold text-on-surface tracking-tight mb-2">
              어떤 살림 고민이 있나요? ✨
            </h2>
            <p className="text-[0.9375rem] sm:text-[1rem] text-on-surface-variant mb-6">
              3초 만에 검증된 현실 자취 팁과 실패 없는 청소·요리 노하우를 찾아드려요.
            </p>

            {/* Big Search Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast(`'${searchQuery || '전체'}' 솔루션 검색 완료`);
              }}
              className="w-full bg-surface-container-low rounded-2xl p-1.5 shadow-xs flex flex-col md:flex-row items-center gap-1.5 border border-outline-variant/30"
            >
              {/* Category Selector Dropdown */}
              <div className="relative w-full md:w-44 shrink-0">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface font-semibold text-[0.875rem] py-3.5 pl-4 pr-8 rounded-xl appearance-none outline-none cursor-pointer border border-transparent focus:border-primary shadow-xs"
                >
                  <option value="all">전체 카테고리</option>
                  <option value="kitchen">주방·요리</option>
                  <option value="clean">청소·위생</option>
                  <option value="laundry">세탁·의류</option>
                  <option value="storage">식재료·수납</option>
                  <option value="economy">자취 절약·행정</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                  expand_more
                </span>
              </div>

              {/* Input Bar with Voice & Search */}
              <div className="relative flex-1 w-full flex items-center bg-surface-container-lowest rounded-xl px-3 border border-transparent focus-within:border-primary shadow-xs">
                <span className="material-symbols-outlined text-outline text-[22px] shrink-0">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="예: 탄 냄비 베이킹소다, 날파리 퇴치, 대파 오래 보관하기"
                  className="w-full py-3.5 px-2 bg-transparent outline-none text-[0.875rem] text-on-surface placeholder:text-outline"
                />
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  title="음성 검색"
                  className={`p-1.5 transition-colors shrink-0 rounded-full hover:bg-surface-container ${
                    isListeningVoice ? 'text-primary animate-pulse bg-primary/10' : 'text-outline hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-[0.875rem] flex items-center justify-center gap-1.5 shrink-0 shadow-sm hover:bg-primary-container transition-all active:scale-95 cursor-pointer"
              >
                <span>솔루션 찾기</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>

            {/* Quick Trending Tags */}
            <div className="flex items-center gap-1.5 mt-4 flex-wrap justify-center">
              <span className="text-[0.6875rem] text-outline flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> 추천 태그
              </span>
              {[
                '#원룸자취',
                '#날파리퇴치',
                '#초간편자취요리',
                '#탄냄비복구',
                '#배수구청소',
                '#양파싹방지',
              ].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    const cleanWord = tag.replace('#', '');
                    setSearchQuery(cleanWord);
                    showToast(`태그 '${tag}' 검색 적용됨`);
                  }}
                  className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-[0.6875rem] text-primary font-medium transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Desktop Explorer Layout */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-5 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT COLUMN: Sticky Filter Sidebar (col-span-3) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-4">
            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container space-y-5">
              {/* Filter Header */}
              <div className="flex items-center justify-between pb-1 border-b border-surface-container">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                  <h3 className="font-display text-[1rem] text-on-surface font-bold">정밀 맞춤 필터</h3>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[0.6875rem] text-outline hover:text-primary transition-colors flex items-center gap-0.5 cursor-pointer font-medium"
                >
                  <span className="material-symbols-outlined text-[14px]">refresh</span> 초기화
                </button>
              </div>

              {/* Section 1: 문제 유형 */}
              <div className="space-y-1.5">
                <span className="text-[0.75rem] text-on-surface-variant font-bold tracking-wider block">
                  문제 유형
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={problemTypes.clean}
                      onChange={(e) =>
                        setProblemTypes({ ...problemTypes, clean: e.target.checked })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`p-2.5 rounded-xl text-[0.75rem] font-semibold flex items-center justify-between transition-colors ${
                        problemTypes.clean
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span>🧹 청소·위생</span>
                      <span className="material-symbols-outlined text-[16px]">
                        {problemTypes.clean ? 'check' : ''}
                      </span>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={problemTypes.kitchen}
                      onChange={(e) =>
                        setProblemTypes({ ...problemTypes, kitchen: e.target.checked })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`p-2.5 rounded-xl text-[0.75rem] font-semibold flex items-center justify-between transition-colors ${
                        problemTypes.kitchen
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span>🍳 요리·주방</span>
                      <span className="material-symbols-outlined text-[16px]">
                        {problemTypes.kitchen ? 'check' : ''}
                      </span>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={problemTypes.storage}
                      onChange={(e) =>
                        setProblemTypes({ ...problemTypes, storage: e.target.checked })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`p-2.5 rounded-xl text-[0.75rem] font-semibold flex items-center justify-between transition-colors ${
                        problemTypes.storage
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span>📦 보관·수납</span>
                      <span className="material-symbols-outlined text-[16px]">
                        {problemTypes.storage ? 'check' : ''}
                      </span>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={problemTypes.economy}
                      onChange={(e) =>
                        setProblemTypes({ ...problemTypes, economy: e.target.checked })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`p-2.5 rounded-xl text-[0.75rem] font-semibold flex items-center justify-between transition-colors ${
                        problemTypes.economy
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span>💡 절약·생활</span>
                      <span className="material-symbols-outlined text-[16px]">
                        {problemTypes.economy ? 'check' : ''}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 2: 소요 시간 */}
              <div className="space-y-1.5">
                <span className="text-[0.75rem] text-on-surface-variant font-bold tracking-wider block">
                  소요 시간
                </span>
                <div className="space-y-1 text-[0.8125rem]">
                  {[
                    { key: 'under1', label: '⚡ 1분 미만 (초스피드)', count: '18개' },
                    { key: 'cut3', label: '⏱️ 3분 컷 (자취 표준)', count: '84개' },
                    { key: 'cut5', label: '⏳ 5분 컷', count: '52개' },
                    { key: 'over10', label: '🕒 10분 이상 정밀 해결', count: '31개' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        timeFilter === item.key
                          ? 'bg-surface-container font-semibold text-primary'
                          : 'hover:bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="time"
                          checked={timeFilter === item.key}
                          onChange={() => setTimeFilter(item.key)}
                          className="accent-primary"
                        />
                        <span>{item.label}</span>
                      </span>
                      <span className="text-[0.6875rem] text-outline">{item.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Section 3: 난이도 */}
              <div className="space-y-1.5">
                <span className="text-[0.75rem] text-on-surface-variant font-bold tracking-wider block">
                  난이도
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDifficultyFilter('easy')}
                    className={`py-2 rounded-xl text-[0.75rem] font-bold flex flex-col items-center transition-colors cursor-pointer ${
                      difficultyFilter === 'easy'
                        ? 'bg-surface-container text-primary ring-1 ring-primary/30'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span>★☆☆</span>
                    <span className="text-[11px] mt-0.5">초보</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficultyFilter('medium')}
                    className={`py-2 rounded-xl text-[0.75rem] font-medium flex flex-col items-center transition-colors cursor-pointer ${
                      difficultyFilter === 'medium'
                        ? 'bg-surface-container text-primary ring-1 ring-primary/30 font-bold'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span>★★☆</span>
                    <span className="text-[11px] mt-0.5">중급</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDifficultyFilter('hard')}
                    className={`py-2 rounded-xl text-[0.75rem] font-medium flex flex-col items-center transition-colors cursor-pointer ${
                      difficultyFilter === 'hard'
                        ? 'bg-surface-container text-primary ring-1 ring-primary/30 font-bold'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span>★★★</span>
                    <span className="text-[11px] mt-0.5">고급</span>
                  </button>
                </div>
              </div>

              {/* Section 4: 내 자취방 도구 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[0.75rem] text-on-surface-variant font-bold tracking-wider">
                    내 자취방 도구
                  </span>
                  <span className="text-[0.6875rem] text-primary font-semibold">
                    {activeTools.length}개 선택됨
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeTools.map((tool) => (
                    <span
                      key={tool}
                      onClick={() => removeTool(tool)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-primary text-[0.75rem] font-semibold cursor-pointer hover:bg-surface-container-high transition-colors"
                      title="클릭하여 제거"
                    >
                      {tool}
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </span>
                  ))}
                  {availableToolsToAdd.map((tool) => (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => addTool(tool)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface text-[0.75rem] transition-colors cursor-pointer"
                    >
                      + {tool}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Tip Banner inside sidebar */}
              <div className="rounded-xl bg-surface-container-high p-4 text-on-surface relative overflow-hidden border border-primary/10">
                <span className="text-[0.6875rem] text-primary uppercase font-bold tracking-wider">
                  1인 가구 SOS
                </span>
                <h4 className="font-display text-[0.9375rem] font-bold text-on-surface mt-1 leading-snug">
                  급한 배수구 막힘?
                </h4>
                <p className="text-[0.75rem] text-on-surface-variant mt-1 leading-relaxed">
                  뜨거운 물과 과탄산소다 한 컵이면 3분 만에 뚫립니다.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const drainTip = tips.find((t) => t.id === 'tip-clogged-drain');
                    if (drainTip) onSelectTip(drainTip);
                  }}
                  className="inline-flex items-center gap-0.5 text-[0.75rem] text-primary font-bold mt-2.5 hover:underline cursor-pointer"
                >
                  긴급 해결 가이드 보기 <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN AREA: Categorized Grid, Trends, and Cards (col-span-9) */}
          <div className="lg:col-span-9 space-y-6">
            {/* 4 Large Situation Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Card 1: 주방·설거지 */}
              <div
                onClick={() => {
                  setSelectedCategory('kitchen');
                  showToast('카테고리: 주방·설거지 필터 적용');
                }}
                className="group relative rounded-2xl bg-surface-container-lowest overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-52 border border-surface-container"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center brightness-90 group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqRzk1HZdRr0FTP-AViX7fX_3ImnkimiQ79dTQa4G0aIuI9hTFl-MlLQ3gaJaHuFpgCJHEvl2SPjFBN-sVliGNpcNnP4Gw_eOr3s1A6TtvRR5PBpclbIH0U99ok4P46gsXBdNbeu_vmOTKls6-HXWvqJuO1nvQgFS2kCN61qxok4_kz69FhIV2ByiAbzbrT9w5ax6q_JOGGTiQ3Ombx8RLlbqUmZFiQu_PcxlJyl1wzq38svYgxCwm')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                <div className="relative z-10 p-3.5 flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-primary text-[0.6875rem] font-bold">
                    주방 SOS
                  </span>
                  <span className="material-symbols-outlined text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[18px]">
                    arrow_outward
                  </span>
                </div>
                <div className="relative z-10 p-3.5 text-white">
                  <h4 className="font-display text-[1rem] font-bold">주방 · 설거지</h4>
                  <p className="text-[0.75rem] text-slate-200 mt-0.5 line-clamp-1">
                    기름때, 탄 냄비 광내기, 싱크대
                  </p>
                  <div className="mt-1.5 flex items-center gap-1 text-[0.6875rem] text-cyan-200 font-medium">
                    <span>342개 해결책</span>
                  </div>
                </div>
              </div>

              {/* Card 2: 욕실·청소 */}
              <div
                onClick={() => {
                  setSelectedCategory('clean');
                  showToast('카테고리: 욕실·청소 필터 적용');
                }}
                className="group relative rounded-2xl bg-surface-container-lowest overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-52 border border-surface-container"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center brightness-90 group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAHzSfViq6q7RIqZxNOFe2y1fvJtf3xssnnBd4kIDzys1vXQu7bDJ6F-Jm6R_IPnkWpZCvnR5E7IH5UXhuPYMSwZpneJ5cDwOW4cDZ_FBYRGKQ9D9f8ROVcH73sgXMdjedqss8ZnFNqXQNyO74rVXvMpVNkVmWq4rKPDCGvf5EWaFzSdSG-MRGS2sphExurmHZblXxZhvqQWeQMboASzoaUhN44H4O_DY3uENIwKz041QPAenAr9-wc')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                <div className="relative z-10 p-3.5 flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-secondary text-[0.6875rem] font-bold">
                    악취 차단
                  </span>
                  <span className="material-symbols-outlined text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[18px]">
                    arrow_outward
                  </span>
                </div>
                <div className="relative z-10 p-3.5 text-white">
                  <h4 className="font-display text-[1rem] font-bold">욕실 · 청소</h4>
                  <p className="text-[0.75rem] text-slate-200 mt-0.5 line-clamp-1">
                    타일 곰팡이, 하수구 악취, 거울 물때
                  </p>
                  <div className="mt-1.5 flex items-center gap-1 text-[0.6875rem] text-cyan-200 font-medium">
                    <span>219개 해결책</span>
                  </div>
                </div>
              </div>

              {/* Card 3: 세탁·의류 */}
              <div
                onClick={() => {
                  setSelectedCategory('laundry');
                  showToast('카테고리: 세탁·의류 필터 적용');
                }}
                className="group relative rounded-2xl bg-surface-container-lowest overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-52 border border-surface-container"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center brightness-90 group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDkouKWD0WusuAgTeKCXC90fMj1McUohx-JWUZdlI0T2EG_pZXbap0SEdesyBM3Pgwj8er_smHXbkc3Blm9SG5iZqHUfgfC2rMwsLoZDQQfkiZR0BIb-Nl8Qvh1BjPUupKt777F9SYgxNhuX1PqMtoIZl34Mrdgoz35OAVpoIF5uXRRRs0SmBI5lxcBgOitfczFFpSDunRXwKLkbxQYjI2ZRzyxeQUdWdjrIdG5UzWT-p55VOg0wd5L')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                <div className="relative z-10 p-3.5 flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-tertiary text-[0.6875rem] font-bold">
                    의류 관리
                  </span>
                  <span className="material-symbols-outlined text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[18px]">
                    arrow_outward
                  </span>
                </div>
                <div className="relative z-10 p-3.5 text-white">
                  <h4 className="font-display text-[1rem] font-bold">세탁 · 의류</h4>
                  <p className="text-[0.75rem] text-slate-200 mt-0.5 line-clamp-1">
                    누런 때 표백, 니트 보풀, 냄새 제거
                  </p>
                  <div className="mt-1.5 flex items-center gap-1 text-[0.6875rem] text-cyan-200 font-medium">
                    <span>188개 해결책</span>
                  </div>
                </div>
              </div>

              {/* Card 4: 식재료 보관 */}
              <div
                onClick={() => {
                  setSelectedCategory('storage');
                  showToast('카테고리: 식재료 보관 필터 적용');
                }}
                className="group relative rounded-2xl bg-surface-container-lowest overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-52 border border-surface-container"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center brightness-90 group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJq0VmacXNV4hfXYjLSohPq8ebhpWfh9_zCNBegmTBfKjhFcZLnq5zTcPFOXJChqS3kMa2n221KF509lfnvppcLtD3FIc2LBk_WaS9CSgdB5TePMK-5HZB4xSn6tZpN4nDQLKuOhso3W_oa9_5XITrKEfW_TiGTjKYueSYLX3TodbwPLujU9d-xdIGZ2aCYaJ0xz6tQ9vezLfvbTOZGWsYxtDwd83uRvpNy5-j9oj_lQA2osdkkN7v')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
                <div className="relative z-10 p-3.5 flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-primary text-[0.6875rem] font-bold">
                    신선 연장
                  </span>
                  <span className="material-symbols-outlined text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[18px]">
                    arrow_outward
                  </span>
                </div>
                <div className="relative z-10 p-3.5 text-white">
                  <h4 className="font-display text-[1rem] font-bold">식재료 보관</h4>
                  <p className="text-[0.75rem] text-slate-200 mt-0.5 line-clamp-1">
                    대파 한달 보관, 양파 싹 방지, 냉동분할
                  </p>
                  <div className="mt-1.5 flex items-center gap-1 text-[0.6875rem] text-cyan-200 font-medium">
                    <span>275개 해결책</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-Time Trend Ranking Bar & Sort Tabs */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container">
              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
                <span className="font-display text-[1rem] text-on-surface font-bold">
                  검증된 꿀팁 피드
                </span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-[0.6875rem] text-primary font-bold">
                  총 {filteredTips.length}개 솔루션
                </span>
              </div>

              {/* Sorting Controls */}
              <div className="flex items-center justify-between w-full md:w-auto gap-3">
                <div className="flex items-center bg-surface-container-low p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setSortOrder('success')}
                    className={`px-3 py-1.5 rounded-lg text-[0.75rem] transition-all cursor-pointer ${
                      sortOrder === 'success'
                        ? 'bg-surface-container-lowest shadow-xs text-primary font-bold'
                        : 'text-on-surface-variant hover:text-on-surface font-medium'
                    }`}
                  >
                    성공률순
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortOrder('popular')}
                    className={`px-3 py-1.5 rounded-lg text-[0.75rem] transition-all cursor-pointer ${
                      sortOrder === 'popular'
                        ? 'bg-surface-container-lowest shadow-xs text-primary font-bold'
                        : 'text-on-surface-variant hover:text-on-surface font-medium'
                    }`}
                  >
                    인기순
                  </button>
                  <button
                    type="button"
                    onClick={() => setSortOrder('latest')}
                    className={`px-3 py-1.5 rounded-lg text-[0.75rem] transition-all cursor-pointer ${
                      sortOrder === 'latest'
                        ? 'bg-surface-container-lowest shadow-xs text-primary font-bold'
                        : 'text-on-surface-variant hover:text-on-surface font-medium'
                    }`}
                  >
                    최신순
                  </button>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant text-[0.6875rem]">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">verified</span>
                  <span>100% 자취러 직접 검증됨</span>
                </div>
              </div>
            </div>

            {/* Tip Results Grid (6 bespoke cards matching image 1) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {displayedTips.map((tip) => (
                <article
                  key={tip.id}
                  onClick={() => onSelectTip(tip)}
                  className="bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group border border-surface-container cursor-pointer"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-surface-container">
                    <img
                      src={tip.imageUrl}
                      alt={tip.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-on-surface/70 backdrop-blur-md text-on-primary text-[0.6875rem] font-medium shadow-xs">
                      ⏱️ {tip.durationText}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(tip.id);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center transition-colors shadow-xs ${
                        tip.isSaved ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                      }`}
                      title={tip.isSaved ? '북마크 해제' : '북마크 추가'}
                    >
                      <span
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: tip.isSaved ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        bookmark
                      </span>
                    </button>
                    <div className="absolute bottom-2 left-3 flex items-center gap-1 px-2 py-0.5 rounded bg-primary text-on-primary text-[0.6875rem] font-semibold shadow-xs">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      <span>성공률 {tip.successRate}%</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-on-surface-variant text-[0.6875rem] mb-1">
                        <span className="text-primary font-bold">{tip.subcategory || tip.categoryLabel}</span>
                        <span>•</span>
                        <span>총 {tip.steps.length || 2}단계 절차</span>
                      </div>
                      <h3 className="font-display text-[0.9375rem] text-on-surface font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {tip.title}
                      </h3>
                      <p className="text-[0.8125rem] text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">
                        {tip.description}
                      </p>
                    </div>

                    {/* Footer Author & Counts */}
                    <div className="pt-3 mt-3 flex items-center justify-between border-t border-surface-container/60">
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-primary text-[0.6875rem] font-bold">
                          {tip.author.avatarInitial}
                        </div>
                        <span className="text-[0.6875rem] text-on-surface font-medium truncate max-w-[90px]">
                          {tip.author.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-on-surface-variant text-[0.6875rem]">
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                          {tip.likes > 1000 ? `${(tip.likes / 1000).toFixed(1)}k` : tip.likes}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[14px]">bookmark</span>
                          {tip.saves > 1000 ? `${(tip.saves / 1000).toFixed(1)}k` : tip.saves}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination & Load More */}
            <div className="flex flex-col items-center justify-center pt-4 gap-2">
              {visibleCount < filteredTips.length ? (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  className="px-6 py-3 bg-surface-container text-primary font-semibold text-[0.875rem] rounded-xl hover:bg-surface-container-high transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <span>더 많은 검증 팁 불러오기 ({filteredTips.length - visibleCount}개 남음)</span>
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>
              ) : (
                <div className="px-4 py-2 bg-surface-container-low rounded-xl text-[0.75rem] text-outline font-medium">
                  모든 검증 팁을 불러왔습니다
                </div>
              )}
              <span className="text-[0.6875rem] text-outline">
                1인 가구 살림 빅데이터 팁 {Math.min(visibleCount, filteredTips.length)} / {filteredTips.length} 표시 중
              </span>
            </div>

            {/* Verification Guarantee Bento Banner */}
            <div className="rounded-2xl bg-surface-container-low p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-outline-variant/30">
              <div className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[28px]">shield</span>
                </div>
                <div>
                  <h4 className="font-display text-[1rem] font-bold text-on-surface">LifeTip 검증 마크란?</h4>
                  <p className="text-[0.8125rem] text-on-surface-variant mt-0.5 leading-relaxed">
                    실제 원룸/오피스텔 환경에서 50명 이상의 자취러가 직접 테스트하여 95% 이상 성공한 현실적인 꿀팁만 선정합니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenTesterModal}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-surface-container-lowest text-primary font-semibold text-[0.75rem] hover:bg-surface-container-high transition-colors shadow-xs cursor-pointer border border-outline-variant/20 active:scale-95"
              >
                검증단 신청하기
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
