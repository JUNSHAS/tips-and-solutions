import React, { useState } from 'react';
import { Tip, CategoryKey } from '../types';

interface HomeViewProps {
  tips: Tip[];
  onSelectTip: (tip: Tip) => void;
  onToggleBookmark: (tipId: string) => void;
  onNavigateToExplore: (category?: string, query?: string) => void;
  onOpenWriteTip: () => void;
  showToast: (msg: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  tips,
  onSelectTip,
  onToggleBookmark,
  onNavigateToExplore,
  onOpenWriteTip,
  showToast,
}) => {
  // Category Filter State
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Ingredient Matcher Form State
  const [matcherIngredients, setMatcherIngredients] = useState<{ [key: string]: boolean }>({
    bakingSoda: true,
    percarbonate: true,
    vinegar: false,
    dishSoap: false,
  });
  const [showMatcherResult, setShowMatcherResult] = useState(false);

  const handleMatcherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMatcherResult(true);
    showToast("✨ '베이킹소다 + 과탄산소다' 맞춤 꿀팁 42건 매칭 완료!");
  };

  // Recipe horizontal carousel scroll / index
  const [recipeOffset, setRecipeOffset] = useState(0);

  // Filtered popular tips for the 4-card grid
  const popularTips = tips.filter((t) => {
    if (activeCategory === 'all') return true;
    return t.category === activeCategory;
  });

  // Featured Hero Tip
  const heroTip = tips.find((t) => t.id === 'tip-laundry-vinegar') || tips[0];

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 py-6 flex flex-col gap-8">
        {/* Top Hero & Quick Matcher Split Bento */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Featured Curation Banner (8 cols) */}
          <article className="lg:col-span-8 relative rounded-2xl overflow-hidden bg-surface-container-lowest shadow-md flex flex-col justify-between group min-h-[380px] lg:min-h-[420px] border border-surface-container">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{
                backgroundImage: `url('${heroTip.imageUrl}')`,
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent"></div>

            {/* Top Overlay Meta */}
            <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary text-[0.75rem] font-bold shadow-xs">
                  <span
                    className="material-symbols-outlined text-[16px] text-tertiary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  에디터 강력추천
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[0.75rem] font-medium">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  소요시간 3분컷
                </span>
              </div>
              <button
                aria-label="오늘의 팁 북마크"
                onClick={() => onToggleBookmark(heroTip.id)}
                className="w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    heroTip.isSaved ? 'text-primary' : ''
                  }`}
                  style={{ fontVariationSettings: heroTip.isSaved ? "'FILL' 1" : "'FILL' 0" }}
                >
                  bookmark
                </span>
              </button>
            </div>

            {/* Bottom Overlay Content */}
            <div className="relative z-10 p-5 sm:p-6 flex flex-col gap-2 text-white text-left">
              <div className="flex items-center gap-1.5 text-cyan-200 text-[0.75rem] font-medium">
                <span className="material-symbols-outlined text-[16px]">cloud</span>
                오늘처럼 습한 비 오는 날 필수 살림 루틴
              </div>
              <h2 className="font-display text-[1.375rem] sm:text-[1.625rem] font-bold tracking-tight max-w-2xl leading-snug">
                {heroTip.title}
              </h2>
              <p className="text-[0.875rem] sm:text-[0.9375rem] text-slate-200/90 max-w-xl line-clamp-2 leading-relaxed">
                {heroTip.description}
              </p>

              <div className="flex items-center justify-between pt-2 mt-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-cyan-200 flex items-center justify-center text-slate-900 text-[0.75rem] font-bold">
                    {heroTip.author.avatarInitial}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-100 text-[0.75rem]">
                    <span className="font-semibold">{heroTip.author.name}</span>
                    <span>•</span>
                    <span className="text-slate-300">저장 14,892회</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTip(heroTip)}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary-container text-white text-[0.875rem] font-semibold hover:bg-primary transition-colors shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>바로 읽기</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </article>

          {/* Right Widget Sidebar (4 cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-4 justify-between">
            {/* Tool Matcher Widget */}
            <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-surface-container flex flex-col gap-2.5 text-left">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[22px]">auto_fix_high</span>
                  <h3 className="font-display text-[1rem] text-on-surface font-bold">집에 있는 재료로 해결</h3>
                </div>
                <span className="text-[0.6875rem] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                  초간단 매칭
                </span>
              </div>
              <p className="text-[0.75rem] text-on-surface-variant leading-relaxed">
                지금 자취방에 있는 청소·살림 재료를 골라보세요. 맞춤 솔루션을 찾아드립니다.
              </p>

              <form onSubmit={handleMatcherSubmit} className="flex flex-col gap-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-surface hover:bg-surface-container-low cursor-pointer transition-colors border border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={matcherIngredients.bakingSoda}
                      onChange={(e) =>
                        setMatcherIngredients({ ...matcherIngredients, bakingSoda: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                    />
                    <span className="text-[0.75rem] font-semibold text-on-surface">베이킹소다</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-surface hover:bg-surface-container-low cursor-pointer transition-colors border border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={matcherIngredients.percarbonate}
                      onChange={(e) =>
                        setMatcherIngredients({ ...matcherIngredients, percarbonate: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                    />
                    <span className="text-[0.75rem] font-semibold text-on-surface">과탄산소다</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-surface hover:bg-surface-container-low cursor-pointer transition-colors border border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={matcherIngredients.vinegar}
                      onChange={(e) =>
                        setMatcherIngredients({ ...matcherIngredients, vinegar: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                    />
                    <span className="text-[0.75rem] font-semibold text-on-surface">식초</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-xl bg-surface hover:bg-surface-container-low cursor-pointer transition-colors border border-outline-variant/20">
                    <input
                      type="checkbox"
                      checked={matcherIngredients.dishSoap}
                      onChange={(e) =>
                        setMatcherIngredients({ ...matcherIngredients, dishSoap: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                    />
                    <span className="text-[0.75rem] font-semibold text-on-surface">주방세제</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 mt-1 rounded-xl bg-primary text-on-primary font-semibold text-[0.8125rem] hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">search_check</span>
                  맞춤 해결 팁 찾기 (42건)
                </button>
              </form>

              {showMatcherResult && (
                <div
                  onClick={() => onNavigateToExplore('clean', '베이킹소다')}
                  className="p-2.5 bg-surface-container-low rounded-xl text-center text-[0.6875rem] text-primary font-semibold border border-primary/20 animate-in fade-in duration-200 cursor-pointer hover:bg-surface-container"
                >
                  ✨ '베이킹소다 + 과탄산소다' 조합: 배수구 악취/탄 냄비 세척 팁 매칭 완료! (결과 보기 →)
                </div>
              )}
            </div>

            {/* Realtime Trending Keywords */}
            <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container flex flex-col gap-1.5 text-left">
              <div className="flex items-center justify-between pb-1.5 border-b border-surface-container">
                <h3 className="text-[0.875rem] text-on-surface font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-error text-[18px]">trending_up</span>
                  실시간 급상승 살림 고민
                </h3>
                <span className="text-[0.6875rem] text-outline">15:00 기준</span>
              </div>

              <ol className="flex flex-col gap-1 pt-1 text-[0.8125rem]">
                {[
                  { rank: 1, text: '에어컨 송풍 곰팡이 냄새', icon: 'arrow_drop_up', iconColor: 'text-error' },
                  { rank: 2, text: '싱크대 초파리 트랩 만들기', icon: 'arrow_drop_up', iconColor: 'text-error', tipId: 'tip-fruit-fly' },
                  { rank: 3, text: '자취방 침대 매트리스 얼룩 제거', icon: 'horizontal_rule', iconColor: 'text-outline' },
                  { rank: 4, text: '남은 양배추 반통 신선 보관', icon: 'arrow_drop_up', iconColor: 'text-error' },
                  { rank: 5, text: '원룸 가스비 절약 밸브 각도', icon: 'arrow_drop_down', iconColor: 'text-tertiary', tipId: 'tip-utility-discount' },
                ].map((item) => (
                  <li
                    key={item.rank}
                    onClick={() => {
                      if (item.tipId) {
                        const target = tips.find((t) => t.id === item.tipId);
                        if (target) onSelectTip(target);
                      } else {
                        onNavigateToExplore(undefined, item.text);
                      }
                    }}
                    className="flex items-center justify-between p-1.5 px-2 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[0.75rem] font-bold text-primary w-4">{item.rank}</span>
                      <span className="text-on-surface group-hover:text-primary transition-colors text-[0.8125rem]">
                        {item.text}
                      </span>
                    </div>
                    <span className={`material-symbols-outlined text-[16px] ${item.iconColor}`}>
                      {item.icon}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Community Tip Reward Banner */}
            <button
              type="button"
              onClick={onOpenWriteTip}
              className="group text-left block rounded-2xl bg-gradient-to-r from-primary to-primary-container p-3.5 text-on-primary shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[24px] text-white">paid</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[0.6875rem] text-cyan-200 font-bold">네이버페이 3,000P 지급</span>
                  <p className="text-[0.8125rem] font-bold text-white truncate group-hover:underline">
                    나만의 자취 꿀팁 공유하고 리워드 받기
                  </p>
                </div>
                <span className="material-symbols-outlined text-[20px] ml-auto text-white/80 group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </div>
            </button>
          </aside>
        </section>

        {/* Category Filter Chips Row */}
        <section className="flex items-center justify-between gap-4 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { id: 'all', label: '전체' },
              { id: 'kitchen', label: '🍳 주방·설거지' },
              { id: 'clean', label: '🚿 욕실·청소' },
              { id: 'laundry', label: '🧺 세탁·의류' },
              { id: 'storage', label: '🥑 식재료 보관' },
              { id: 'interior', label: '🛋️ 원룸 인테리어' },
              { id: 'economy', label: '💡 절약/공과금' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  showToast(`카테고리 '${cat.label}' 선택됨`);
                }}
                className={`px-4 py-2 rounded-full text-[0.75rem] transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-primary text-on-primary font-bold shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container border border-surface-container font-medium'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1 text-outline text-[0.6875rem] shrink-0 font-medium">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>인기순 정렬</span>
          </div>
        </section>

        {/* Main Feed: 실시간 검증 완료 인기 꿀팁 (4-Column Grid) */}
        <section className="flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h2 className="font-display text-[1.25rem] sm:text-[1.375rem] text-on-surface font-bold tracking-tight">
                실시간 검증 완료 인기꿀팁
              </h2>
              <span className="text-[0.75rem] text-primary font-semibold hidden sm:inline">
                자취러 10,000명이 따라 한 검증 팁
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToExplore()}
              className="text-[0.75rem] text-on-surface-variant hover:text-primary font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              더보기
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTips.slice(0, 4).map((tip) => (
              <article
                key={tip.id}
                onClick={() => onSelectTip(tip)}
                className="flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-surface-container cursor-pointer"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-container">
                  <img
                    src={tip.imageUrl}
                    alt={tip.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary text-[0.6875rem] font-bold flex items-center gap-0.5 shadow-xs">
                    <span
                      className="material-symbols-outlined text-[14px] text-tertiary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                    검증 완료 ✓
                  </span>
                  <button
                    aria-label="스크랩"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(tip.id);
                    }}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center transition-colors shadow-xs ${
                      tip.isSaved ? 'text-primary' : 'text-on-surface hover:text-primary'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: tip.isSaved ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      bookmark
                    </span>
                  </button>
                </div>

                <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-outline text-[0.6875rem]">
                      <span>{tip.categoryLabel}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px]">timer</span> {tip.durationText}
                      </span>
                      <span>•</span>
                      <span className="text-tertiary font-semibold">
                        난이도 {tip.difficultyLabel}
                      </span>
                    </div>
                    <h3 className="font-display text-[0.875rem] text-on-surface font-bold leading-snug group-hover:text-primary transition-colors line-clamp-1">
                      {tip.title}
                    </h3>
                    <p className="text-[0.75rem] text-on-surface-variant line-clamp-2 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-outline text-[0.6875rem] border-t border-surface-container/60">
                    <span className="text-on-surface-variant font-medium truncate max-w-[80px]">
                      {tip.author.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">visibility</span> {tip.views}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">bookmark</span> {tip.saves}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Secondary Section: 초간단 5분 컷 자취 레시피 & 보관법 */}
        <section className="flex flex-col gap-4 rounded-2xl bg-surface-container-low p-5 sm:p-6 border border-outline-variant/20 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-tertiary-container flex items-center justify-center text-on-tertiary shadow-xs">
                <span className="material-symbols-outlined text-[20px]">restaurant</span>
              </div>
              <div>
                <h2 className="font-display text-[1rem] sm:text-[1.125rem] text-on-surface font-bold">
                  초간단 5분 컷 자취 레시피 &amp; 보관법
                </h2>
                <p className="text-[0.75rem] text-on-surface-variant">
                  배달 음식 질릴 때, 최소한의 설거지로 끝내는 든든한 꿀팁
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setRecipeOffset((prev) => Math.max(0, prev - 1))}
                aria-label="이전 카드"
                className="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors shadow-xs cursor-pointer disabled:opacity-40"
                disabled={recipeOffset === 0}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => setRecipeOffset((prev) => Math.min(1, prev + 1))}
                aria-label="다음 카드"
                className="w-8 h-8 rounded-full bg-surface-container-lowest text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors shadow-xs cursor-pointer disabled:opacity-40"
                disabled={recipeOffset >= 1}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* 3 Recipe Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'tip-soft-tofu-soup',
                tag: '초간단 국물',
                title: '전자레인지 순두부 계란탕',
                desc: '참치액 1스푼과 물 100ml 넣고 3분만 돌리면 완성',
                meta: '설거지 그릇 1개 • 저장 4.2K',
                time: '5분',
                image:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuAHC72o51wcaUqEnWFBOCgomrbFjUyF2-7rEfNNRC40fvWk8ospX1ekIOayenxatOTGHUZLEZL86-F1SeJqBEkdvJDmT-eaKmd2sBhh3RXfiIwKhoiInxb5nN8N00V1iz9uVWzYTs8_THca35G9A7oFIhnfXDS2QHmVw-YO8t4RenI55pmcvYBxvfsfToPeqLtbCtlPwOrhW-Iqh7ad84UrC6SOfqY0syQ_OKuqSE0yfPuh8X8SqHu2',
              },
              {
                id: 'tip-frozen-bread',
                tag: '빵 보관/해동',
                title: '남은 식빵 갓 구운 맛으로 얼리기',
                desc: '한 장씩 종이호일로 랩핑해 냉동하면 수분 보존 100%',
                meta: '유통기한 걱정 끝 • 저장 6.8K',
                time: '3분',
                image:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuAIRtXZocCvuaSBbACWm455z5Sc4Nfy1s5QM_bVxKhY9DtNpqr3lQCgqoWKGHzOljHI-dxI-UBsnCD1Nn03XAnvZTgfsMRsNicVCsJMui432UiSYbsOWCKrMUgIC41BixdH-krG_d9s0bQAC-nltALBwbISZQPB94uPqr1IW6heIDJ8o2E9px52ktF3tNquWnl13LC_mG40IhRs8CXB7HBTzA9rWpQdjjsdoY8Ah9UFcMqDnERHp8N1',
              },
              {
                id: 'tip-one-pan-kimchi-rice',
                tag: '원팬 요리',
                title: '가위로 끝내는 원팬 김치볶음밥',
                desc: '도마 쓸 필요 없이 팬 안에서 김치 자르고 굴소스 톡!',
                meta: '자취생 최애 한끼 • 저장 11.3K',
                time: '7분',
                image:
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuALXptJ4QcMuagStiAmAoDGu57WdQME0o8yyNZVq88vcWfvyVEiwXjjQNOCrzAALCCXMsPTdMt27NViNly6lOBRLSMbYqpmbpz03vqMIyvuqvn2LGZFc4zlblTXSMxCz2mzWPYqgPN7z00M6adka2YRWApfOiyfS0IPmfFgmWlwjDKISUtoS1gb9fhIzpAJj2GFXboI5ITaiIdrsGpyuoTVClVUnL4QqSQEJMaGdFifUm7DHT7U8SNY',
              },
            ].map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => {
                  const target = tips.find((t) => t.id === recipe.id);
                  if (target) onSelectTip(target);
                }}
                className="flex items-center gap-3.5 p-2.5 bg-surface-container-lowest rounded-xl shadow-xs hover:shadow-md transition-all group cursor-pointer border border-surface-container"
              >
                <div className="relative w-22 h-22 rounded-lg overflow-hidden shrink-0 bg-surface-container">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 px-1 rounded bg-black/75 text-white text-[0.625rem] font-bold">
                    {recipe.time}
                  </span>
                </div>
                <div className="flex flex-col justify-center min-w-0 flex-1 text-left">
                  <span className="text-[0.6875rem] text-tertiary font-bold">{recipe.tag}</span>
                  <h3 className="font-display text-[0.875rem] text-on-surface font-bold truncate group-hover:text-primary transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-[0.75rem] text-on-surface-variant truncate mt-0.5">
                    {recipe.desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-outline text-[0.6875rem] mt-1">
                    <span className="text-primary font-medium">{recipe.meta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Interactive Tip Contribution CTA Banner */}
        <section className="rounded-2xl bg-surface-container p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs border border-surface-container-high text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[26px]">edit_note</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-display text-[1rem] text-on-surface font-bold">
                혼자만 알고 있기 아까운 살림 노하우가 있나요?
              </h3>
              <p className="text-[0.8125rem] text-on-surface-variant mt-0.5">
                원룸 자취생들에게 직접 검증된 팁을 등록하면 매주 베스트 살림러 상금을 드려요.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={onOpenWriteTip}
              className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-primary text-on-primary text-[0.875rem] font-bold hover:bg-primary-container transition-colors text-center shadow-sm cursor-pointer active:scale-95"
            >
              꿀팁 등록하러 가기
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
