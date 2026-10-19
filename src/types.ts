export type CategoryKey = 'kitchen' | 'clean' | 'laundry' | 'storage' | 'economy' | 'interior';

export interface Author {
  name: string;
  roleTitle: string;
  avatarInitial: string;
  avatarUrl?: string;
  verified: boolean;
  experience: string;
  isSubscribed?: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  badge: string;
  badgeType?: 'primary' | 'secondary' | 'tertiary';
  checked: boolean;
}

export interface StepItem {
  stepNumber: number;
  durationText: string;
  badgeText?: string;
  title?: string;
  instruction: string;
  tipNote?: string;
  warningNote?: string;
  scienceNote?: string;
  recycleNote?: string;
  imageUrl: string;
  imageAlt: string;
}

export interface Tip {
  id: string;
  title: string;
  description: string;
  category: CategoryKey;
  categoryLabel: string;
  subcategory: string;
  durationText: string;
  durationCategory: 'under1' | 'cut3' | 'cut5' | 'over10';
  difficulty: 'easy' | 'medium' | 'hard';
  difficultyLabel: '초보' | '중급' | '고급';
  difficultyStars: number;
  successRate: number;
  views: string;
  likes: number;
  isLiked?: boolean;
  saves: number;
  isSaved?: boolean;
  author: Author;
  imageUrl: string;
  imageAlt: string;
  cost: string;
  tools: string[];
  checklist: ChecklistItem[];
  steps: StepItem[];
  isVerified: boolean;
  isEditorPick?: boolean;
  isTrending?: boolean;
  isCompleted?: boolean;
  userMemo?: string;
  savedFolderId?: string;
  savedAtText?: string;
  dishCountText?: string;
  recipeType?: string;
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  count: number;
  completedCount: number;
  accentColor: string;
}

export interface UserStats {
  hoursSaved: string;
  moneySaved: string;
  monthlyAverage: string;
  savedCount: number;
  completedCount: number;
  completionRate: string;
  level: string;
  userName: string;
  experienceYear: string;
}
