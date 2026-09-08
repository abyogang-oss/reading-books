export type StampType = 'praise' | 'best' | 'touching' | 'fun' | 'recommend';

export interface StampMeta {
  type: StampType;
  label: string;
  subLabel: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  emoji: string;
}

export const STAMP_TYPES: Record<StampType, StampMeta> = {
  praise: {
    type: 'praise',
    label: '참 잘했어요',
    subLabel: '독서 우수',
    colorClass: 'text-red-600',
    bgClass: 'bg-red-50',
    borderClass: 'border-red-600',
    textClass: 'text-red-700',
    emoji: '💮',
  },
  best: {
    type: 'best',
    label: '최고예요!',
    subLabel: '적극 추천',
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-600',
    textClass: 'text-amber-700',
    emoji: '👑',
  },
  touching: {
    type: 'touching',
    label: '감동이에요',
    subLabel: '마음 뭉클',
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-600',
    textClass: 'text-rose-700',
    emoji: '💖',
  },
  fun: {
    type: 'fun',
    label: '재미있어요',
    subLabel: '꿀잼 보장',
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-600',
    textClass: 'text-emerald-700',
    emoji: '😄',
  },
  recommend: {
    type: 'recommend',
    label: '꼭 읽어봐!',
    subLabel: '친구 추천',
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50',
    borderClass: 'border-indigo-600',
    textClass: 'text-indigo-700',
    emoji: '👍',
  },
};

export interface Stamp {
  id: string;
  bookId: string;
  studentNumber: number;
  stampType: StampType;
  comment: string;
  createdAt: number;
  rotation: number;
}

export type BookColorTheme = 'amber' | 'blue' | 'emerald' | 'rose' | 'purple' | 'orange';

export interface Book {
  id: string;
  title: string;
  recommenderType: 'teacher' | 'student';
  recommenderNumber?: number;
  intro?: string;
  colorTheme: BookColorTheme;
  createdAt: number;
}

export type DisplayScale = 'normal' | 'large' | 'huge';

export interface ClassConfig {
  className: string;
  studentCount: number;
}
