import React, { useState } from 'react';
import { Tip, Folder, CategoryKey } from '../types';
import confetti from 'canvas-confetti';

// 1. Write Tip Modal
interface WriteTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTip: Partial<Tip>) => void;
}

export const WriteTipModal: React.FC<WriteTipModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryKey>('kitchen');
  const [subcategory, setSubcategory] = useState('주방·설거지');
  const [durationText, setDurationText] = useState('3분 컷');
  const [description, setDescription] = useState('');
  const [tools, setTools] = useState('베이킹소다, 주방세제');
  const [step1, setStep1] = useState('');
  const [step2, setStep2] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit({
      id: `tip-user-${Date.now()}`,
      title,
      description,
      category,
      categoryLabel:
        category === 'kitchen'
          ? '주방·설거지'
          : category === 'clean'
          ? '욕실·청소'
          : category === 'laundry'
          ? '세탁·의류'
          : category === 'storage'
          ? '식재료 보관'
          : '절약/공과금',
      subcategory: subcategory || '1인 가구 살림법',
      durationText,
      durationCategory: 'cut3',
      difficulty: 'easy',
      difficultyLabel: '초보',
      difficultyStars: 1,
      successRate: 98,
      views: '1',
      likes: 1,
      saves: 1,
      cost: '0원',
      tools: tools.split(',').map((s) => s.trim()).filter(Boolean),
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBmB_mhe9_zA5cfyCSkau5RJe_OQYmx9fGgamDDS9jGEq-4fZTKiAKQvaS2m2rUrLGieDubAFSSAEvjl-u5MO0M4wC3zmXUCpJXQPABn6UUT0OdLfPaU7Chd16UhDyZ3k7lP3sy-mG_4wE13YpF1H8LPvlptHl1Lo6cj2s4OwPJJtLu6s6It2liHEcGNel4Oi9FUetslO-v5kZuyCuL5izLvANzAo0lqNXeJW7gf8-0lr3QfwxzIUoe',
      imageAlt: title,
      checklist: [
        { id: 'u-1', label: '기본 살림 재료 준비', badge: '필수', checked: false },
        { id: 'u-2', label: '물기 또는 용기 세팅', badge: '준비', checked: false },
      ],
      steps: [
        {
          stepNumber: 1,
          durationText: '소요시간 1분',
          instruction: step1 || description,
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCxUKopFznmiZ3f9628WErxnYJ-QK5SQ3xwH8VkhL8RT8d_pk-2Xmu3bAOJPDipJCGN2-wcRZYO-2gK_LOh9o1UpbJjTpdZWxcolalrQ3081qy8eox7gGKiX0toh1R52A-aKNYx9JpowX7YPbFyPKcvoFKnaQaWzWGHAvKZAzVoistxtPnMlscROgSjMZ9AHmm7dJ2fVUzaZs3iItYkNe0URGtxGyEyGAJnbe5Sptg7sqxMqfjMUshQ',
          imageAlt: '1단계',
        },
        {
          stepNumber: 2,
          durationText: '소요시간 2분',
          instruction: step2 || '마무리 후 정리합니다.',
          imageUrl:
            'https://lh3.googleusercontent.com/aida-public/AB6AXuADy0IjG9xHqdyhyH-rqtuAdPHmw53qwAmMyy1-GvcsN8Vk3rbVIRsJWBfoMvHiJwGp9uho7dk9w27HTUyoZR-YEaVLUGUHJ5n6QyylI8XtYl7wAO3VQlXiwq-u_352hepsGJRYL4mGnxVTGnIQEE4u3fu135OeCIZE_GCF2DPzZ2jjHOw4Fxx7CsyxD18W4pxxWizPoMgdZsT5CvCsZge9FjlKB-RwUonLK2gpVTq7Djdzbi0r0yxL',
          imageAlt: '2단계',
        },
      ],
      author: {
        name: '김라이프 (나)',
        roleTitle: '자취 3년차',
        avatarInitial: '김',
        verified: true,
        experience: '원룸 생활 노하우 공유자',
      },
      isVerified: true,
      isSaved: true,
      savedAtText: '방금 등록됨',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-surface-container flex flex-col gap-4 text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">edit_note</span>
            <h2 className="font-display text-[1.125rem] font-bold text-on-surface">나만의 살림 꿀팁 공유</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full text-outline hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-[0.8125rem]">
          <div>
            <label className="block text-[0.75rem] font-bold text-on-surface-variant mb-1">
              꿀팁 제목 (직관적이고 매력적으로)
            </label>
            <input
              type="text"
              required
              placeholder="예: 과탄산소다로 싱크대 거름망 1분 만에 반짝이게 닦는 법"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface outline-none focus:border-primary focus:bg-surface-container-lowest"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[0.75rem] font-bold text-on-surface-variant mb-1">
                카테고리
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryKey)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface outline-none cursor-pointer focus:border-primary"
              >
                <option value="kitchen">주방·설거지</option>
                <option value="clean">욕실·청소</option>
                <option value="laundry">세탁·의류</option>
                <option value="storage">식재료 보관</option>
                <option value="economy">절약/공과금</option>
              </select>
            </div>
            <div>
              <label className="block text-[0.75rem] font-bold text-on-surface-variant mb-1">
                소요 시간
              </label>
              <select
                value={durationText}
                onChange={(e) => setDurationText(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface outline-none cursor-pointer focus:border-primary"
              >
                <option value="1분 미만">1분 미만 (초스피드)</option>
                <option value="3분 컷">3분 컷</option>
                <option value="5분 컷">5분 컷</option>
                <option value="10분 이상">10분 이상</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[0.75rem] font-bold text-on-surface-variant mb-1">
              핵심 요약 설명
            </label>
            <textarea
              required
              rows={2}
              placeholder="자취생들이 따라 할 수 있도록 실패 없는 핵심 포인트를 적어주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface outline-none focus:border-primary focus:bg-surface-container-lowest"
            ></textarea>
          </div>

          <div>
            <label className="block text-[0.75rem] font-bold text-on-surface-variant mb-1">
              필요한 자취 도구/재료 (쉼표로 구분)
            </label>
            <input
              type="text"
              placeholder="예: 베이킹소다, 식초, 매직블럭"
              value={tools}
              onChange={(e) => setTools(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface outline-none focus:border-primary focus:bg-surface-container-lowest"
            />
          </div>

          <div>
            <label className="block text-[0.75rem] font-bold text-on-surface-variant mb-1">
              STEP 1 핵심 절차
            </label>
            <input
              type="text"
              placeholder="1단계 행동 요령을 입력하세요."
              value={step1}
              onChange={(e) => setStep1(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface outline-none focus:border-primary focus:bg-surface-container-lowest"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container shadow-sm cursor-pointer"
            >
              꿀팁 등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. Verification / Certification Modal
interface VerificationModalProps {
  isOpen: boolean;
  tip: Tip | null;
  onClose: () => void;
  onConfirm: (tipId: string, review: string) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  tip,
  onClose,
  onConfirm,
}) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [photoSelected, setPhotoSelected] = useState(true);

  if (!isOpen || !tip) return null;

  const handleVerify = () => {
    onConfirm(tip.id, review);
    try {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 shadow-2xl border border-surface-container flex flex-col gap-4 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
            <h2 className="font-display text-[1.125rem] font-bold text-on-surface">
              직접 해봤어요! 실천 인증
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full text-outline hover:text-on-surface hover:bg-surface-container flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
          <span className="text-[0.6875rem] text-primary font-bold">{tip.categoryLabel}</span>
          <p className="font-bold text-[0.875rem] text-on-surface line-clamp-1 mt-0.5">{tip.title}</p>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-[0.75rem] font-bold text-on-surface-variant mb-1">
            실제 만족도 평가
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-[28px] text-amber-400 hover:scale-110 transition-transform cursor-pointer"
              >
                ★
              </button>
            ))}
            <span className="text-[0.75rem] text-on-surface-variant font-bold ml-2">
              {rating === 5 ? '대만족! 완전 신세계 ✨' : `${rating}점 / 5점`}
            </span>
          </div>
        </div>

        {/* Photo Upload Simulator */}
        <div>
          <label className="block text-[0.75rem] font-bold text-on-surface-variant mb-1">
            인증 사진 첨부
          </label>
          <div
            onClick={() => setPhotoSelected(!photoSelected)}
            className="h-28 rounded-xl border-2 border-dashed border-primary/40 bg-surface flex flex-col items-center justify-center p-3 cursor-pointer hover:bg-surface-container-low transition-colors"
          >
            {photoSelected ? (
              <div className="flex items-center gap-3">
                <img
                  src={tip.imageUrl}
                  alt="인증 프리뷰"
                  className="w-16 h-16 rounded-lg object-cover shadow-2xs"
                />
                <div className="text-left">
                  <span className="text-[0.75rem] font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    자취방 인증 사진 업로드됨
                  </span>
                  <p className="text-[0.6875rem] text-outline mt-0.5">클릭 시 다른 사진으로 변경</p>
                </div>
              </div>
            ) : (
              <>
                <span className="material-symbols-outlined text-[28px] text-primary">add_a_photo</span>
                <span className="text-[0.75rem] text-on-surface font-semibold mt-1">
                  사진 촬영 또는 갤러리에서 선택
                </span>
              </>
            )}
          </div>
        </div>

        {/* Review */}
        <div>
          <label className="block text-[0.75rem] font-bold text-on-surface-variant mb-1">
            현실적인 한 줄 후기
          </label>
          <textarea
            rows={2}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="예: 락스 냄새 없이 3분 만에 진짜 뚫렸어요! 다이소 지퍼백 필수네요."
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface outline-none focus:border-primary text-[0.8125rem]"
          ></textarea>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface-container">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container cursor-pointer text-[0.8125rem]"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handleVerify}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container shadow-sm cursor-pointer text-[0.8125rem] flex items-center gap-1.5"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            인증 완료하고 배지 받기
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. New Folder Modal
interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string, icon: string) => void;
}

export const NewFolderModal: React.FC<NewFolderModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('folder');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), icon);
    onClose();
  };

  const icons = [
    { id: 'cleaning_services', label: '청소' },
    { id: 'skillet', label: '요리' },
    { id: 'receipt_long', label: '공과금' },
    { id: 'bed', label: '인테리어' },
    { id: 'local_laundry_service', label: '세탁' },
    { id: 'inventory_2', label: '수납' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-surface-container flex flex-col gap-4 text-left">
        <div className="flex items-center justify-between pb-2 border-b border-surface-container">
          <h2 className="font-display text-[1.125rem] font-bold text-on-surface">새 살림 폴더 만들기</h2>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full text-outline hover:text-on-surface hover:bg-surface-container flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-4 text-[0.8125rem]">
          <div>
            <label className="block text-[0.75rem] font-bold text-on-surface-variant mb-1">
              폴더 이름
            </label>
            <input
              type="text"
              required
              placeholder="예: 장마철 습기 방어, 다이소 살림템"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-[0.75rem] font-bold text-on-surface-variant mb-1">
              아이콘 선택
            </label>
            <div className="grid grid-cols-3 gap-2">
              {icons.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIcon(item.id)}
                  className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-colors cursor-pointer border ${
                    icon === item.id
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]">{item.id}</span>
                  <span className="text-[0.6875rem] font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container shadow-sm cursor-pointer"
            >
              폴더 추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. Memo Edit Modal
interface MemoModalProps {
  isOpen: boolean;
  tip: Tip | null;
  onClose: () => void;
  onSave: (tipId: string, memo: string) => void;
}

export const MemoModal: React.FC<MemoModalProps> = ({ isOpen, tip, onClose, onSave }) => {
  const [memo, setMemo] = useState(tip?.userMemo || '');

  React.useEffect(() => {
    if (tip) setMemo(tip.userMemo || '');
  }, [tip]);

  if (!isOpen || !tip) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(tip.id, memo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 shadow-2xl border border-surface-container flex flex-col gap-4 text-left">
        <div className="flex items-center justify-between pb-2 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">sticky_note_2</span>
            <h2 className="font-display text-[1.125rem] font-bold text-on-surface">내 살림 메모 편집</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full text-outline hover:text-on-surface hover:bg-surface-container flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="text-[0.75rem] text-on-surface-variant line-clamp-1 font-semibold">
          {tip.title}
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <textarea
            rows={4}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="예: 다이소 1,000원 스프레이 공병 구매 완료! 비율 1:20 맞추니 딱 좋음"
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface outline-none focus:border-primary text-[0.8125rem] leading-relaxed"
          ></textarea>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container cursor-pointer text-[0.75rem]"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container shadow-sm cursor-pointer text-[0.75rem]"
            >
              메모 저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 5. Tester Apply Modal
interface TesterApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
}

export const TesterApplyModal: React.FC<TesterApplyModalProps> = ({ isOpen, onClose, showToast }) => {
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 shadow-2xl border border-surface-container flex flex-col gap-4 text-left">
        <div className="flex items-center justify-between pb-2 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">shield</span>
            </div>
            <h2 className="font-display text-[1.125rem] font-bold text-on-surface">LifeTip 검증단 신청</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full text-outline hover:text-on-surface hover:bg-surface-container flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {applied ? (
          <div className="py-6 flex flex-col items-center text-center gap-2">
            <div className="w-14 h-14 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-[32px]">task_alt</span>
            </div>
            <h3 className="font-display text-[1.125rem] font-bold text-on-surface">검증단 신청이 완료되었습니다!</h3>
            <p className="text-[0.8125rem] text-on-surface-variant max-w-xs">
              이번 주 금요일 개별 알림으로 살림 키트 배송지 입력 링크가 발송됩니다.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-[0.8125rem]"
            >
              확인
            </button>
          </div>
        ) : (
          <>
            <p className="text-[0.8125rem] text-on-surface-variant leading-relaxed">
              원룸/오피스텔 환경에서 직접 팁을 실행하고 현실적인 피드백을 전달해주실 살림 테스터를 모집합니다.
            </p>

            <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 space-y-2 text-[0.75rem]">
              <div className="flex items-center gap-2 font-bold text-on-surface">
                <span className="material-symbols-outlined text-primary text-[18px]">featured_seasonal_and_gifts</span>
                활동 혜택
              </div>
              <ul className="list-disc pl-5 text-on-surface-variant space-y-1">
                <li>매월 살림 필수 키트 (베이킹소다, 구연산, 매직블럭 등) 무료 발송</li>
                <li>성공 인증 시 네이버페이 5,000P 즉시 지급</li>
                <li>LifeTip 공식 '살림 인증관' 배지 수여</li>
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface-container">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-semibold hover:bg-surface-container cursor-pointer text-[0.75rem]"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => {
                  setApplied(true);
                  showToast('LifeTip 검증단 신청이 접수되었습니다! 🛡️');
                  try {
                    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
                  } catch (e) {}
                }}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary-container shadow-sm cursor-pointer text-[0.75rem]"
              >
                검증단 지원하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// 6. Search Palette Modal (Ctrl+K)
interface SearchPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  tips: Tip[];
  onSelectTip: (tip: Tip) => void;
}

export const SearchPaletteModal: React.FC<SearchPaletteModalProps> = ({
  isOpen,
  onClose,
  tips,
  onSelectTip,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = tips.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.categoryLabel.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-container-lowest rounded-2xl w-full max-w-xl shadow-2xl border border-surface-container overflow-hidden flex flex-col text-left"
      >
        <div className="p-4 border-b border-surface-container flex items-center gap-3">
          <span className="material-symbols-outlined text-outline text-[22px]">search</span>
          <input
            autoFocus
            type="text"
            placeholder="살림 고민, 재료, 요리 검색... (예: 베이킹소다, 대파, 하수구)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-[0.9375rem] text-on-surface placeholder:text-outline"
          />
          <kbd className="text-[0.6875rem] text-outline px-2 py-0.5 rounded bg-surface-container border border-outline-variant/30">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((tip) => (
              <div
                key={tip.id}
                onClick={() => {
                  onSelectTip(tip);
                  onClose();
                }}
                className="p-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={tip.imageUrl}
                    alt={tip.title}
                    className="w-10 h-10 rounded-lg object-cover shadow-2xs shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-[0.875rem] text-on-surface truncate">{tip.title}</p>
                    <span className="text-[0.6875rem] text-on-surface-variant">
                      {tip.categoryLabel} • {tip.durationText}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-[18px]">arrow_forward</span>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-outline text-[0.8125rem]">
              일치하는 살림 팁이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
