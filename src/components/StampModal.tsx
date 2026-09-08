import React, { useState } from 'react';
import { Book, StampType, STAMP_TYPES, DisplayScale } from '../types';
import { StampBadge } from './StampBadge';
import { playStampSound, playPopSound } from '../utils/sound';
import { X, Stamp as StampIcon, Sparkles, AlertCircle } from 'lucide-react';

interface StampModalProps {
  book: Book;
  studentCount: number;
  displayScale: DisplayScale;
  onClose: () => void;
  onSubmitStamp: (bookId: string, studentNumber: number, stampType: StampType, comment: string) => void;
}

const QUICK_COMMENTS = [
  '너무 감동적이고 눈물이 핑 돌았어요! 😭',
  '진짜 꿀잼! 시간 가는 줄 모르고 읽었어요! ⏱️',
  '주인공의 용기가 정말 멋있었어요! 🦸',
  '우리 반 친구들 모두에게 꼭 추천해요! 👍',
  '마음이 따뜻해지고 깊은 생각을 하게 되었어요! 💭',
  '결말이 반전이라 끝까지 손을 못 뗐어요! 😲',
];

export const StampModal: React.FC<StampModalProps> = ({
  book,
  studentCount,
  onClose,
  onSubmitStamp,
}) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [customNumber, setCustomNumber] = useState<string>('');
  const [selectedType, setSelectedType] = useState<StampType>('praise');
  const [comment, setComment] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const currentNumber = selectedNumber || (customNumber ? parseInt(customNumber, 10) : null);

  const handleSelectNumber = (num: number) => {
    setSelectedNumber(num);
    setCustomNumber('');
    setErrorMessage('');
    playPopSound();
  };

  const handleCustomNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomNumber(val);
    if (val) {
      setSelectedNumber(null);
    }
    setErrorMessage('');
  };

  const handleSelectQuickComment = (text: string) => {
    setComment(text);
    setErrorMessage('');
    playPopSound();
  };

  const handleStampSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const num = currentNumber;
    if (!num || num <= 0) {
      setErrorMessage('학생 번호를 선택하거나 입력해주세요!');
      return;
    }

    if (!comment.trim()) {
      setErrorMessage('한줄평을 1문장 남겨주세요!');
      return;
    }

    playStampSound();
    onSubmitStamp(book.id, num, selectedType, comment.trim());
  };

  return (
    <div
      id="stamp-modal-overlay"
      className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="stamp-modal-card"
        className="bg-white rounded-3xl border-4 border-red-500 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-red-600 text-white p-5 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <StampIcon className="w-7 h-7" />
            </div>
            <div>
              <span className="text-red-200 text-xs md:text-sm font-bold uppercase tracking-wider">
                독서 도장 찍기
              </span>
              <h2 className="text-xl md:text-3xl font-black tracking-tight leading-tight">
                {book.title}
              </h2>
            </div>
          </div>
          <button
            id="stamp-modal-close-btn"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleStampSubmit} className="p-5 md:p-8 space-y-6 overflow-y-auto flex-1">
          
          {/* 1. Student Number Selection (Touch-friendly 1~N Pad) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-lg md:text-2xl font-black text-stone-900 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-red-600 text-white text-base flex items-center justify-center font-black">1</span>
                <span>내 번호 선택하기</span>
              </label>
              {currentNumber && (
                <span className="text-base md:text-lg font-black text-red-600 bg-red-50 px-3 py-1 rounded-xl border border-red-200">
                  선택됨: <strong>{currentNumber}번</strong>
                </span>
              )}
            </div>

            {/* Quick Number Grid */}
            <div className="bg-stone-50 p-3 rounded-2xl border-2 border-stone-200">
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 max-h-40 overflow-y-auto p-1">
                {Array.from({ length: studentCount }, (_, i) => i + 1).map((num) => {
                  const isSelected = selectedNumber === num;
                  return (
                    <button
                      key={`num-btn-${num}`}
                      type="button"
                      onClick={() => handleSelectNumber(num)}
                      className={`h-11 rounded-xl font-black text-base md:text-lg transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-red-600 text-white shadow-md scale-105 ring-2 ring-red-400'
                          : 'bg-white text-stone-800 hover:bg-stone-200 border border-stone-300'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              {/* Direct input fallback for extra numbers */}
              <div className="mt-3 pt-2 border-t border-stone-200 flex items-center gap-2">
                <span className="text-xs md:text-sm font-bold text-stone-700 whitespace-nowrap">
                  직접 입력:
                </span>
                <input
                  id="stamp-custom-num-input"
                  type="number"
                  placeholder="예: 31"
                  value={customNumber}
                  onChange={handleCustomNumberChange}
                  className="w-24 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-sm md:text-base font-bold text-stone-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <span className="text-xs text-stone-700">번 (30번 이상일 때)</span>
              </div>
            </div>
          </div>

          {/* 2. Stamp Design Selection & Live Preview */}
          <div>
            <label className="text-lg md:text-2xl font-black text-stone-900 flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-full bg-red-600 text-white text-base flex items-center justify-center font-black">2</span>
              <span>도장 문구 고르기</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 md:gap-3">
              {(Object.keys(STAMP_TYPES) as StampType[]).map((typeKey) => {
                const meta = STAMP_TYPES[typeKey];
                const isSelected = selectedType === typeKey;
                return (
                  <button
                    key={typeKey}
                    type="button"
                    onClick={() => {
                      setSelectedType(typeKey);
                      playPopSound();
                    }}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition cursor-pointer ${
                      isSelected
                        ? `${meta.borderClass} ${meta.bgClass} shadow-md ring-2 ring-red-400 scale-102`
                        : 'border-stone-200 bg-white hover:bg-stone-50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{meta.emoji}</span>
                    <span className="font-black text-sm md:text-base text-stone-900 leading-tight">
                      {meta.label}
                    </span>
                    <span className="text-[11px] text-stone-700 mt-0.5 font-bold">
                      {meta.subLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. One-line Review (한줄평) */}
          <div>
            <label className="text-lg md:text-2xl font-black text-stone-900 flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full bg-red-600 text-white text-base flex items-center justify-center font-black">3</span>
              <span>한줄평 남기기 (1문장)</span>
            </label>

            {/* Quick Comment Suggestions for Elementary Students */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs font-bold text-stone-700 self-center">빠른 선택:</span>
              {QUICK_COMMENTS.map((qc, idx) => (
                <button
                  key={`qc-${idx}`}
                  type="button"
                  onClick={() => handleSelectQuickComment(qc)}
                  className="bg-amber-100/70 hover:bg-amber-200 text-amber-900 px-2.5 py-1 rounded-xl text-xs md:text-sm font-bold border border-amber-300/60 transition cursor-pointer active:scale-95"
                >
                  {qc}
                </button>
              ))}
            </div>

            {/* Input textarea */}
            <textarea
              id="stamp-comment-textarea"
              rows={2}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setErrorMessage('');
              }}
              placeholder="친구들에게 들려주고 싶은 생각을 솔직하게 적어보세요! (예: 주인공의 용기가 멋졌어요)"
              className="w-full p-4 rounded-2xl border-2 border-stone-300 text-lg md:text-xl font-medium focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 leading-relaxed text-stone-900"
              maxLength={100}
            />
            <div className="flex justify-between items-center text-xs text-stone-700 mt-1 px-1">
              <span>개인정보(이름 등)는 적지 마세요. 번호로만 등록됩니다.</span>
              <span>{comment.length} / 100자</span>
            </div>
          </div>

          {/* Live Stamp Preview Bar */}
          <div className="bg-stone-50 rounded-2xl p-4 border-2 border-dashed border-stone-300 flex items-center justify-center gap-6">
            <span className="text-sm md:text-base font-bold text-stone-700">
              내 도장 미리보기 👉
            </span>
            <StampBadge
              studentNumber={currentNumber || 1}
              stampType={selectedType}
              size="lg"
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl font-bold flex items-center gap-2 text-sm md:text-base">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Big Stamp Button */}
          <button
            id="stamp-submit-btn"
            type="submit"
            className="w-full py-4 md:py-5 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xl md:text-3xl rounded-2xl shadow-xl shadow-red-700/30 active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <StampIcon className="w-8 h-8 md:w-9 md:h-9 stroke-[2.5]" />
            <span>도장 쾅! 찍고 등록하기</span>
            <Sparkles className="w-6 h-6 text-red-200" />
          </button>
        </form>
      </div>
    </div>
  );
};
