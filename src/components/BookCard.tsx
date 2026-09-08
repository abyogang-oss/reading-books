import React from 'react';
import { Book, Stamp, DisplayScale } from '../types';
import { StampBadge } from './StampBadge';
import { MessageSquare, Stamp as StampIcon, Trash2, Award } from 'lucide-react';

interface BookCardProps {
  book: Book;
  stamps: Stamp[];
  displayScale: DisplayScale;
  onStampClick: (book: Book) => void;
  onDeleteBook: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  stamps,
  displayScale,
  onStampClick,
  onDeleteBook,
}) => {
  // Theme color styling
  const themeStyles = {
    amber: {
      border: 'border-amber-300',
      headerBg: 'bg-amber-100/80',
      headerText: 'text-amber-900',
      badgeBg: 'bg-amber-600 text-white',
      accentColor: 'text-amber-600',
      bubbleBg: 'bg-amber-50/90 border-amber-200',
      stampButton: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-700/25',
    },
    blue: {
      border: 'border-sky-300',
      headerBg: 'bg-sky-100/80',
      headerText: 'text-sky-900',
      badgeBg: 'bg-sky-600 text-white',
      accentColor: 'text-sky-600',
      bubbleBg: 'bg-sky-50/90 border-sky-200',
      stampButton: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-700/25',
    },
    emerald: {
      border: 'border-emerald-300',
      headerBg: 'bg-emerald-100/80',
      headerText: 'text-emerald-900',
      badgeBg: 'bg-emerald-600 text-white',
      accentColor: 'text-emerald-600',
      bubbleBg: 'bg-emerald-50/90 border-emerald-200',
      stampButton: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-700/25',
    },
    rose: {
      border: 'border-rose-300',
      headerBg: 'bg-rose-100/80',
      headerText: 'text-rose-900',
      badgeBg: 'bg-rose-600 text-white',
      accentColor: 'text-rose-600',
      bubbleBg: 'bg-rose-50/90 border-rose-200',
      stampButton: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-700/25',
    },
    purple: {
      border: 'border-purple-300',
      headerBg: 'bg-purple-100/80',
      headerText: 'text-purple-900',
      badgeBg: 'bg-purple-600 text-white',
      accentColor: 'text-purple-600',
      bubbleBg: 'bg-purple-50/90 border-purple-200',
      stampButton: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-700/25',
    },
    orange: {
      border: 'border-orange-300',
      headerBg: 'bg-orange-100/80',
      headerText: 'text-orange-900',
      badgeBg: 'bg-orange-600 text-white',
      accentColor: 'text-orange-600',
      bubbleBg: 'bg-orange-50/90 border-orange-200',
      stampButton: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-700/25',
    },
  }[book.colorTheme || 'amber'];

  // Scale styles with mobile-first fluidity
  const scaleSizes = {
    normal: {
      title: 'text-xl sm:text-2xl md:text-3xl font-black',
      badge: 'text-xs sm:text-sm font-bold px-2.5 py-1',
      intro: 'text-sm sm:text-base',
      bubbleNum: 'text-xs sm:text-base font-black px-2 py-0.5',
      bubbleText: 'text-sm sm:text-base md:text-lg',
      stampBadgeSize: 'md' as const,
      btnPadding: 'min-h-[48px] py-3 text-base sm:text-lg md:text-xl',
    },
    large: {
      title: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black',
      badge: 'text-xs sm:text-base md:text-lg font-black px-3 py-1 sm:px-4 sm:py-1.5',
      intro: 'text-sm sm:text-lg md:text-xl',
      bubbleNum: 'text-sm sm:text-lg md:text-xl font-black px-2.5 py-0.5 sm:px-3 sm:py-1',
      bubbleText: 'text-base sm:text-xl md:text-2xl',
      stampBadgeSize: 'lg' as const,
      btnPadding: 'min-h-[52px] py-3.5 sm:py-4 text-lg sm:text-xl md:text-2xl lg:text-3xl',
    },
    huge: {
      title: 'text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black',
      badge: 'text-xs sm:text-lg md:text-xl font-black px-3 py-1 sm:px-5 sm:py-2',
      intro: 'text-base sm:text-xl md:text-2xl',
      bubbleNum: 'text-sm sm:text-xl md:text-2xl font-black px-2.5 py-0.5 sm:px-4 sm:py-1.5',
      bubbleText: 'text-lg sm:text-2xl md:text-3xl font-bold',
      stampBadgeSize: 'lg' as const,
      btnPadding: 'min-h-[56px] py-4 sm:py-5 text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    },
  }[displayScale];

  const recommenderLabel =
    book.recommenderType === 'teacher'
      ? '🏫 선생님 추천'
      : `⭐️ ${book.recommenderNumber}번 학생 추천`;

  return (
    <article
      id={`book-card-${book.id}`}
      className={`bg-white rounded-3xl border-4 ${themeStyles.border} shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden relative`}
    >
      {/* Header section with Title & Recommender */}
      <div className={`p-4 sm:p-5 md:p-7 ${themeStyles.headerBg} border-b-2 ${themeStyles.border} flex flex-col gap-2.5 sm:gap-3 relative`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3">
            <span
              id={`book-recommender-${book.id}`}
              className={`rounded-xl shadow-xs ${themeStyles.badgeBg} ${scaleSizes.badge}`}
            >
              {recommenderLabel}
            </span>
            <span className="bg-white/80 text-stone-700 rounded-xl px-2.5 py-1 text-xs sm:text-sm md:text-base font-black border border-stone-200 shadow-xs flex items-center gap-1">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
              <span>도장 <strong>{stamps.length}</strong>개</span>
            </span>
          </div>

          {/* Delete book button with confirmation */}
          <button
            id={`book-delete-btn-${book.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`'${book.title}' 책을 도장판에서 삭제할까요?`)) {
                onDeleteBook(book.id);
              }
            }}
            className="min-h-[44px] min-w-[44px] text-stone-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
            title="책 삭제하기"
            aria-label="책 삭제하기"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Book Title */}
        <h2 className={`${scaleSizes.title} text-stone-900 tracking-tight leading-tight mt-0.5`}>
          📖 {book.title}
        </h2>

        {/* Book short description if present */}
        {book.intro && (
          <p className={`${scaleSizes.intro} text-stone-700 font-medium leading-relaxed`}>
            {book.intro}
          </p>
        )}
      </div>

      {/* Stamp Collection Area (The Stamp Board!) */}
      <div className="p-4 sm:p-5 md:p-7 border-b-2 border-stone-100 bg-stone-50/40">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="text-sm sm:text-base md:text-xl font-black text-stone-800 flex items-center gap-1.5 sm:gap-2">
            <StampIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-600" />
            <span>찍힌 번호 도장들</span>
            <span className="text-xs sm:text-sm md:text-base font-normal text-stone-600">
              ({stamps.length}명)
            </span>
          </h3>
        </div>

        {stamps.length === 0 ? (
          <div className="border-2 border-dashed border-stone-300 rounded-2xl p-4 sm:p-6 text-center bg-white/70">
            <p className="text-stone-700 font-bold text-sm sm:text-base md:text-xl">
              💮 아직 찍힌 도장이 없어요!
            </p>
            <p className="text-stone-600 font-medium text-xs sm:text-sm md:text-base mt-1">
              아래 버튼을 눌러 첫 번째 도장을 쾅! 찍어보세요.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 bg-white rounded-2xl border border-stone-200/80 shadow-inner min-h-[80px] sm:min-h-[100px]">
            {stamps.map((stamp) => (
              <div
                key={stamp.id}
                className="transform transition hover:scale-110 cursor-pointer"
                title={`${stamp.studentNumber}번: "${stamp.comment}"`}
              >
                <StampBadge
                  stamp={stamp}
                  size={scaleSizes.stampBadgeSize}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Student Reviews / 한줄평 말풍선 목록 */}
      <div className="p-4 sm:p-5 md:p-7 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-base md:text-xl font-black text-stone-800 flex items-center gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
            <span>친구들의 한줄평 말풍선</span>
            <span className="text-xs sm:text-sm md:text-base font-normal text-stone-600">
              ({stamps.length}개)
            </span>
          </h3>

          {stamps.length === 0 ? (
            <div className="bg-stone-50 rounded-2xl p-3.5 sm:p-4 text-center border border-stone-200">
              <p className="text-stone-600 text-xs sm:text-sm md:text-base font-bold">
                첫 번째 한줄평을 남겨보세요! ✨
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3 max-h-60 sm:max-h-80 overflow-y-auto pr-1">
              {stamps.map((s) => (
                <div
                  key={`review-${s.id}`}
                  className={`p-2.5 sm:p-3.5 md:p-4 rounded-2xl border shadow-xs transition-all ${themeStyles.bubbleBg} flex items-start gap-2 sm:gap-3`}
                >
                  {/* Student Number pill */}
                  <span
                    className={`inline-flex items-center justify-center rounded-xl bg-stone-900 text-white flex-shrink-0 shadow-xs ${scaleSizes.bubbleNum}`}
                  >
                    {s.studentNumber}번
                  </span>

                  {/* Comment text */}
                  <div className="flex-1 min-w-0">
                    <p className={`${scaleSizes.bubbleText} font-bold text-stone-900 leading-snug break-words`}>
                      "{s.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Big Action Button: [도장 찍기 & 한줄평 남기기] */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t-2 border-stone-100">
          <button
            id={`stamp-action-btn-${book.id}`}
            onClick={() => onStampClick(book)}
            className={`w-full text-white font-black rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer ${themeStyles.stampButton} ${scaleSizes.btnPadding}`}
          >
            <StampIcon className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 stroke-[2.5]" />
            <span>도장 쾅! 찍기 & 한줄평</span>
          </button>
        </div>
      </div>
    </article>
  );
};
