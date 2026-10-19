import React, { useState, useEffect } from 'react';
import { Tip } from '../types';
import confetti from 'canvas-confetti';

interface TipDetailViewProps {
  tip: Tip;
  onBack: () => void;
  onToggleBookmark: (tipId: string) => void;
  onOpenVerificationModal: (tip: Tip) => void;
  showToast: (msg: string) => void;
}

export const TipDetailView: React.FC<TipDetailViewProps> = ({
  tip,
  onBack,
  onToggleBookmark,
  onOpenVerificationModal,
  showToast,
}) => {
  // Checklist local state
  const [checklist, setChecklist] = useState(
    tip.checklist || [
      { id: 'item-1', label: '주방세제 2회 펌핑', badge: '필수', checked: true },
      { id: 'item-2', label: '따뜻한 미온수 (용기 1/3)', badge: '온수 추천', checked: true },
      { id: 'item-3', label: '키친타월 1~2장', badge: '핵심 꿀팁', badgeType: 'tertiary' as const, checked: false },
    ]
  );

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likesCount, setLikesCount] = useState(tip.likes || 1280);
  const [isLiked, setIsLiked] = useState(tip.isLiked || false);

  // 20s Shake Timer in Step 3
  const [isShaking, setIsShaking] = useState(false);
  const [shakeTimer, setShakeTimer] = useState(20);

  useEffect(() => {
    let interval: any = null;
    if (isShaking && shakeTimer > 0) {
      interval = setInterval(() => {
        setShakeTimer((prev) => prev - 1);
      }, 1000);
    } else if (shakeTimer === 0 && isShaking) {
      setIsShaking(false);
      setShakeTimer(20);
      showToast('20초 쉐킷 완료! 기름때가 모두 흡착되었습니다 🧼');
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    }
    return () => clearInterval(interval);
  }, [isShaking, shakeTimer, showToast]);

  const toggleChecklistItem = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);

    const checkedTotal = updated.filter((i) => i.checked).length;
    if (checkedTotal === updated.length) {
      showToast('준비물이 모두 갖춰졌어요! 1단계를 시작해보세요 🎉');
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const checkedCount = checklist.filter((i) => i.checked).length;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('꿀팁 링크가 클립보드에 복사되었습니다 🔗');
    } else {
      showToast('공유 링크가 생성되었습니다 🔗');
    }
  };

  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
      showToast('이 팁을 추천하셨습니다 ❤️');
      try {
        confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
      } catch (e) {}
    }
  };

  return (
    <div className="flex flex-col relative w-full bg-[#f8f9ff] min-h-screen">
      {/* Top Header */}
      <header className="sticky top-0 inset-x-0 z-50 bg-[#ffffff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e5eeff]">
        <div className="max-w-2xl mx-auto h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center -ml-2 rounded-full text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
            </button>
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-on-primary shadow-xs">
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
            </div>
            <h1 className="font-display text-[1.125rem] font-bold text-on-surface truncate">
              Tip Detail
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[0.8125rem] ring-2 ring-primary/20">
              김
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto w-full pb-36 text-left">
        {/* Cover Hero Banner */}
        <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-surface-container">
          <img
            src={tip.imageUrl}
            alt={tip.imageAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9ff] via-[#f8f9ff]/40 to-transparent"></div>

          {/* Top Floating Badge & Bookmark */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs text-primary text-[0.75rem] font-bold">
              <span
                className="material-symbols-outlined text-[16px] text-tertiary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                eco
              </span>
              {tip.subcategory || tip.categoryLabel}
            </span>

            <button
              type="button"
              onClick={() => onToggleBookmark(tip.id)}
              className="w-10 h-10 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-xs flex items-center justify-center text-on-surface hover:text-primary transition-all active:scale-90 cursor-pointer"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{
                  fontVariationSettings: tip.isSaved ? "'FILL' 1" : "'FILL' 0",
                  color: tip.isSaved ? '#004ac6' : undefined,
                }}
              >
                bookmark
              </span>
            </button>
          </div>

          {/* Bottom Title & Stats */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary text-on-primary text-[0.6875rem] font-bold shadow-2xs">
                조회수 {tip.views}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[0.6875rem] font-bold">
                성공률 {tip.successRate}%
              </span>
            </div>
            <h2 className="font-display text-[1.25rem] sm:text-[1.5rem] font-bold text-on-surface leading-tight break-keep">
              {tip.title}
            </h2>
          </div>
        </div>

        {/* Content Body Container */}
        <div className="px-4 sm:px-5 pt-3 flex flex-col gap-6">
          {/* Author Card */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container">
            <div className="flex items-center gap-3">
              <div className="relative">
                {tip.author.avatarUrl ? (
                  <img
                    src={tip.author.avatarUrl}
                    alt={tip.author.name}
                    className="w-11 h-11 rounded-full object-cover shadow-2xs"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-lg">
                    {tip.author.avatarInitial}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs">
                  <span
                    className="material-symbols-outlined text-[13px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[0.875rem] font-bold text-on-surface">{tip.author.name}</span>
                  <span className="px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant text-[0.6875rem] font-bold">
                    {tip.author.roleTitle}
                  </span>
                </div>
                <span className="text-[0.75rem] text-on-surface-variant">
                  {tip.author.experience}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSubscribed(!isSubscribed);
                showToast(isSubscribed ? '구독이 취소되었습니다.' : '구독했습니다! 새 팁 알림을 받습니다 🔔');
              }}
              className={`px-3 py-1.5 rounded-full text-[0.75rem] font-semibold active:scale-95 transition-all cursor-pointer ${
                isSubscribed
                  ? 'bg-surface-container text-on-surface-variant border border-outline-variant/30'
                  : 'bg-surface-container-high text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {isSubscribed ? '구독중 ✓' : '+ 구독'}
            </button>
          </div>

          {/* Quick 3-Metric Boxes */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl bg-surface-container-low p-4 border border-outline-variant/20">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-primary mb-1 text-[22px]">speed</span>
              <span className="text-[0.6875rem] text-on-surface-variant">난이도</span>
              <div className="flex items-center gap-0.5 mt-0.5">
                <span
                  className="material-symbols-outlined text-[14px] text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span className="material-symbols-outlined text-[14px] text-outline-variant">star</span>
                <span className="material-symbols-outlined text-[14px] text-outline-variant">star</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center border-x border-outline-variant/20">
              <span className="material-symbols-outlined text-secondary mb-1 text-[22px]">timer</span>
              <span className="text-[0.6875rem] text-on-surface-variant">소요시간</span>
              <span className="font-bold text-[0.875rem] text-on-surface mt-0.5">
                {tip.durationText}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-tertiary mb-1 text-[22px]">savings</span>
              <span className="text-[0.6875rem] text-on-surface-variant">예상비용</span>
              <span className="font-bold text-[0.875rem] text-on-surface mt-0.5">
                {tip.cost}
              </span>
            </div>
          </div>

          {/* Section: 준비물 체크리스트 */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <h3 className="font-display text-[1rem] font-bold text-on-surface">준비물 체크리스트</h3>
              </div>
              <span className="text-[0.75rem] font-bold text-primary bg-primary-fixed px-2.5 py-0.5 rounded-full">
                {checkedCount}/{checklist.length} 준비완료
              </span>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-xs border border-surface-container flex flex-col gap-2.5">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer transition-all active:scale-[0.99] select-none hover:bg-surface-container border border-outline-variant/20"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        item.checked
                          ? 'bg-primary text-white shadow-2xs'
                          : 'bg-surface-container-highest text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </div>
                    <span
                      className={`text-[0.875rem] select-none transition-all ${
                        item.checked ? 'text-on-surface-variant line-through' : 'text-on-surface font-medium'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  <span
                    className={`text-[0.6875rem] px-2 py-0.5 rounded font-semibold ${
                      item.badgeType === 'tertiary'
                        ? 'text-tertiary bg-tertiary-fixed/40'
                        : 'text-primary bg-primary-fixed/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {/* Section: 순서대로 따라하기 */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                <h3 className="font-display text-[1rem] font-bold text-on-surface">순서대로 따라하기</h3>
              </div>
              <span className="text-[0.75rem] text-on-surface-variant font-medium">
                총 {tip.steps.length}개 단계
              </span>
            </div>

            <div className="flex flex-col gap-5">
              {tip.steps.map((step) => (
                <article
                  key={step.stepNumber}
                  className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-xs border border-surface-container flex flex-col"
                >
                  {/* Step Image */}
                  <div className="relative w-full h-48 bg-surface-container">
                    <img
                      src={step.imageUrl}
                      alt={step.imageAlt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-on-primary font-display text-[0.875rem] font-bold shadow-md">
                      0{step.stepNumber}
                    </div>

                    {step.badgeText && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[0.6875rem] font-bold shadow-sm flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">timer</span>
                        {step.badgeText}
                      </div>
                    )}
                  </div>

                  {/* Step Instruction & Note Callout */}
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.75rem] font-bold text-primary">
                        STEP {step.stepNumber}
                      </span>
                      <span className="text-[0.6875rem] text-on-surface-variant font-medium">
                        · {step.durationText}
                      </span>
                    </div>

                    <p className="text-[0.9375rem] text-on-surface font-semibold leading-snug">
                      {step.instruction}
                    </p>

                    {/* Step 3: Interactive Shake Timer */}
                    {step.stepNumber === 3 && (
                      <div className="mt-1 p-3 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`material-symbols-outlined text-primary text-[24px] ${
                              isShaking ? 'animate-bounce' : ''
                            }`}
                          >
                            vibration
                          </span>
                          <div className="text-left">
                            <p className="text-[0.8125rem] font-bold text-primary">
                              20초 쉐킷 타이머 &amp; 진동 체험
                            </p>
                            <p className="text-[0.6875rem] text-on-surface-variant">
                              남은 시간: <span className="font-bold text-primary">{shakeTimer}초</span>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!isShaking) {
                              setIsShaking(true);
                              showToast('20초간 용기를 위아래로 신나게 흔들어주세요! 🌪️');
                            } else {
                              setIsShaking(false);
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-[0.75rem] font-bold shadow-xs hover:bg-primary-container transition-all cursor-pointer active:scale-95"
                        >
                          {isShaking ? '타이머 멈춤' : '쉐킷 시작! ⚡'}
                        </button>
                      </div>
                    )}

                    {step.tipNote && (
                      <p className="text-[0.75rem] text-on-surface-variant bg-surface-container-low p-3 rounded-xl leading-relaxed border border-outline-variant/15">
                        💡 <span className="font-bold text-on-surface">작은 팁:</span> {step.tipNote}
                      </p>
                    )}

                    {step.warningNote && (
                      <p className="text-[0.75rem] text-on-surface-variant bg-surface-container-low p-3 rounded-xl leading-relaxed border border-outline-variant/15">
                        ⚠️ <span className="font-bold text-on-surface">주의:</span> {step.warningNote}
                      </p>
                    )}

                    {step.scienceNote && (
                      <p className="text-[0.75rem] text-on-surface-variant bg-surface-container-low p-3 rounded-xl leading-relaxed border border-outline-variant/15">
                        ✨ <span className="font-bold text-on-surface">과학적 원리:</span> {step.scienceNote}
                      </p>
                    )}

                    {step.recycleNote && (
                      <p className="text-[0.75rem] text-on-surface-variant bg-surface-container-low p-3 rounded-xl leading-relaxed border border-outline-variant/15">
                        ♻️ <span className="font-bold text-on-surface">분리배출 팁:</span> {step.recycleNote}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Helpful Reaction & Share Card */}
          <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
            <div className="flex flex-col">
              <span className="font-display text-[0.9375rem] font-bold text-on-surface">
                도움이 되셨나요?
              </span>
              <span className="text-[0.75rem] text-on-surface-variant mt-0.5">
                자취방 친구들에게 이 꿀팁을 선물해보세요
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleLike}
                title="좋아요"
                className={`w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer border border-outline-variant/20 ${
                  isLiked ? 'text-error' : 'text-on-surface hover:text-error'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                title="공유"
                className="w-10 h-10 rounded-full bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-xs active:scale-95 transition-all cursor-pointer border border-outline-variant/20 hover:text-primary"
              >
                <span className="material-symbols-outlined text-[20px]">share</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action Bar */}
      <aside className="fixed bottom-0 inset-x-0 z-40 bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#e5eeff] shadow-[0_-8px_20px_rgba(0,0,0,0.06)] px-4 py-3 pb-safe">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          {/* Scrap to drawer button */}
          <button
            type="button"
            onClick={() => {
              onToggleBookmark(tip.id);
            }}
            className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all active:scale-95 cursor-pointer border border-outline-variant/20 ${
              tip.isSaved
                ? 'bg-primary/10 text-primary font-bold'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: tip.isSaved ? "'FILL' 1" : "'FILL' 0" }}
            >
              {tip.isSaved ? 'folder_special' : 'inbox'}
            </span>
            <span className="text-[0.6875rem] mt-0.5">
              {tip.isSaved ? '보관됨' : '서랍 저장'}
            </span>
          </button>

          {/* Share button */}
          <button
            type="button"
            onClick={handleShare}
            className="flex flex-col items-center justify-center w-16 h-12 rounded-xl bg-surface-container-low text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all cursor-pointer border border-outline-variant/20"
          >
            <span className="material-symbols-outlined text-[22px]">ios_share</span>
            <span className="text-[0.6875rem] mt-0.5">공유하기</span>
          </button>

          {/* Verify / Complete button */}
          <button
            type="button"
            onClick={() => onOpenVerificationModal(tip)}
            className="flex-1 h-12 rounded-xl bg-primary text-on-primary font-display text-[0.9375rem] font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span>직접 해봤어요! 후기 인증</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
