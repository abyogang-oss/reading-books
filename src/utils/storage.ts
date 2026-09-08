import { Book, Stamp, ClassConfig, DisplayScale } from '../types';

const STORAGE_KEYS = {
  BOOKS: 'reading_board_books_v1',
  STAMPS: 'reading_board_stamps_v1',
  CONFIG: 'reading_board_config_v1',
  SCALE: 'reading_board_scale_v1',
};

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    title: '마당을 나온 암탉',
    recommenderType: 'teacher',
    intro: '자유를 찾아 양계장을 탈출한 잎싹이의 가슴 벅찬 모험 이야기',
    colorTheme: 'amber',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'book-2',
    title: '자전거 도둑',
    recommenderType: 'teacher',
    intro: '도시에서 살아가는 수남이의 정직함과 양심을 다룬 우리 문학',
    colorTheme: 'blue',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'book-3',
    title: '틀려도 괜찮아',
    recommenderType: 'student',
    recommenderNumber: 12,
    intro: '교실에서 자신감 있게 발표할 수 있는 용기를 주는 따뜻한 그림책',
    colorTheme: 'emerald',
    createdAt: Date.now() - 86400000 * 1,
  },
];

export const INITIAL_STAMPS: Stamp[] = [
  {
    id: 'stamp-1',
    bookId: 'book-1',
    studentNumber: 7,
    stampType: 'touching',
    comment: '잎싹이의 위대한 사랑과 용기에 눈물이 핑 돌았어요!',
    createdAt: Date.now() - 3600000 * 4,
    rotation: -4,
  },
  {
    id: 'stamp-2',
    bookId: 'book-1',
    studentNumber: 14,
    stampType: 'praise',
    comment: '스스로 꿈을 찾아 떠나는 모습이 정말 멋져요.',
    createdAt: Date.now() - 3600000 * 2,
    rotation: 6,
  },
  {
    id: 'stamp-3',
    bookId: 'book-2',
    studentNumber: 3,
    stampType: 'best',
    comment: '양심을 지키는 것이 얼마나 중요한지 생각하게 되었어요.',
    createdAt: Date.now() - 3600000 * 3,
    rotation: 3,
  },
  {
    id: 'stamp-4',
    bookId: 'book-3',
    studentNumber: 12,
    stampType: 'recommend',
    comment: '우리 반 친구들 모두가 수업 전에 꼭 읽어봤으면 좋겠어요!',
    createdAt: Date.now() - 3600000 * 5,
    rotation: -5,
  },
  {
    id: 'stamp-5',
    bookId: 'book-3',
    studentNumber: 21,
    stampType: 'fun',
    comment: '틀려도 주눅 들지 않고 손 번쩍 들 수 있게 되었어요!',
    createdAt: Date.now() - 3600000 * 1,
    rotation: 5,
  },
];

export const INITIAL_CONFIG: ClassConfig = {
  className: '3학년 2반 독서 도장판',
  studentCount: 28,
};

export function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (!raw) return INITIAL_BOOKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BOOKS;
  } catch {
    return INITIAL_BOOKS;
  }
}

export function saveBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error('Failed to save books', e);
  }
}

export function loadStamps(): Stamp[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STAMPS);
    if (!raw) return INITIAL_STAMPS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_STAMPS;
  } catch {
    return INITIAL_STAMPS;
  }
}

export function saveStamps(stamps: Stamp[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STAMPS, JSON.stringify(stamps));
  } catch (e) {
    console.error('Failed to save stamps', e);
  }
}

export function loadConfig(): ClassConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!raw) return INITIAL_CONFIG;
    return { ...INITIAL_CONFIG, ...JSON.parse(raw) };
  } catch {
    return INITIAL_CONFIG;
  }
}

export function saveConfig(config: ClassConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save config', e);
  }
}

export function loadScale(): DisplayScale {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCALE) as DisplayScale;
    if (raw === 'normal' || raw === 'large' || raw === 'huge') {
      return raw;
    }
    return 'large'; // Default to large for classroom TV visibility!
  } catch {
    return 'large';
  }
}

export function saveScale(scale: DisplayScale): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCALE, scale);
  } catch (e) {
    console.error('Failed to save scale', e);
  }
}
