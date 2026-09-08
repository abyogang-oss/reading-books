import React, { useState } from 'react';
import { BookColorTheme } from '../types';
import { playPopSound } from '../utils/sound';
import { X, BookPlus, AlertCircle } from 'lucide-react';

interface NewBookModalProps {
  studentCount: number;
  onClose: () => void;
  onSubmitBook: (
    title: string,
    recommenderType: 'teacher' | 'student',
    recommenderNumber?: number,
    intro?: string,
    colorTheme?: BookColorTheme
  ) => void;
}

const COLOR_OPTIONS: { id: BookColorTheme; name: string; bgClass: string; borderClass: string }[] = [
  { id: 'amber', name: '따뜻한 노랑', bgClass: 'bg-amber-100', borderClass: 'border-amber-400' },
  { id: 'blue', name: '시원한 파랑', bgClass: 'bg-sky-100', borderClass: 'border-sky-400' },
  { id: 'emerald', name: '싱그러운 초록', bgClass: 'bg-emerald-100', borderClass: 'border-emerald-400' },
  { id: 'rose', name: '포근한 분홍', bgClass: 'bg-rose-100', borderClass: 'border-rose-400' },
  { id: 'purple', name: '차분한 보라', bgClass: 'bg-purple-100', borderClass: 'border-purple-400' },
  { id: 'orange', name: '활기찬 주황', bgClass: 'bg-orange-100', borderClass: 'border-orange-400' },
];

export const NewBookModal: React.FC<NewBookModalProps> = ({
  studentCount,
  onClose,
  onSubmitBook,
}) => {
  const [title, setTitle] = useState('');
  const [recommenderType, setRecommenderType] = useState<'teacher' | 'student'>('student');
  const [selectedStudentNumber, setSelectedStudentNumber] = useState<number | null>(null);
  const [customStudentNumber, setCustomStudentNumber] = useState<string>('');
  const [intro, setIntro] = useState('');
  const [colorTheme, setColorTheme] = useState<BookColorTheme>('amber');
  const [errorMessage, setErrorMessage] = useState('');

  const finalStudentNumber = selectedStudentNumber || (customStudentNumber ? parseInt(customStudentNumber, 10) : undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage('책 제목을 입력해주세요!');
      return;
    }

    if (recommenderType === 'student' && (!finalStudentNumber || finalStudentNumber <= 0)) {
      setErrorMessage('추천하는 학생 번호를 선택해주세요!');
      return;
    }

    playPopSound();
    onSubmitBook(
      title.trim(),
      recommenderType,
      recommenderType === 'student' ? finalStudentNumber : undefined,
      intro.trim() || undefined,
      colorTheme
    );
  };

  return (
    <div
      id="new-book-modal-overlay"
      className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="new-book-modal-card"
        className="bg-white rounded-3xl border-4 border-emerald-500 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-emerald-600 text-white p-5 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <BookPlus className="w-7 h-7" />
            </div>
            <div>
              <span className="text-emerald-200 text-xs md:text-sm font-bold uppercase tracking-wider">
                독서 도장판
              </span>
              <h2 className="text-xl md:text-3xl font-black tracking-tight leading-tight">
                새 책 추천하기
              </h2>
            </div>
          </div>
          <button
            id="new-book-close-btn"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6 overflow-y-auto flex-1">
          {/* 1. Book Title */}
          <div>
            <label className="text-lg md:text-2xl font-black text-stone-900 flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white text-base flex items-center justify-center font-black">1</span>
              <span>추천할 책 제목</span>
            </label>
            <input
              id="new-book-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorMessage('');
              }}
              placeholder="예: 샬롯의 거미줄, 아몬드, 몽실 언니"
              className="w-full p-4 rounded-2xl border-2 border-stone-300 text-lg md:text-2xl font-bold focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-stone-900"
              maxLength={40}
            />
          </div>

          {/* 2. Recommender (Teacher or Student Number) */}
          <div>
            <label className="text-lg md:text-2xl font-black text-stone-900 flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white text-base flex items-center justify-center font-black">2</span>
              <span>추천자 (선생님 또는 학생 번호)</span>
            </label>

            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => {
                  setRecommenderType('student');
                  playPopSound();
                }}
                className={`flex-1 py-2.5 rounded-xl font-black text-base md:text-lg border-2 transition cursor-pointer ${
                  recommenderType === 'student'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                    : 'border-stone-200 bg-stone-50 text-stone-700'
                }`}
              >
                ⭐️ 학생 번호로 추천
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecommenderType('teacher');
                  playPopSound();
                }}
                className={`flex-1 py-2.5 rounded-xl font-black text-base md:text-lg border-2 transition cursor-pointer ${
                  recommenderType === 'teacher'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm'
                    : 'border-stone-200 bg-stone-50 text-stone-700'
                }`}
              >
                🏫 선생님 추천 도서
              </button>
            </div>

            {recommenderType === 'student' && (
              <div className="bg-stone-50 p-3 rounded-2xl border-2 border-stone-200">
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 max-h-36 overflow-y-auto p-1">
                  {Array.from({ length: studentCount }, (_, i) => i + 1).map((num) => {
                    const isSelected = selectedStudentNumber === num;
                    return (
                      <button
                        key={`rec-num-${num}`}
                        type="button"
                        onClick={() => {
                          setSelectedStudentNumber(num);
                          setCustomStudentNumber('');
                          setErrorMessage('');
                          playPopSound();
                        }}
                        className={`h-10 rounded-xl font-black text-sm md:text-base transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-md scale-105 ring-2 ring-emerald-400'
                            : 'bg-white text-stone-800 hover:bg-stone-200 border border-stone-300'
                        }`}
                      >
                        {num}번
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 pt-2 border-t border-stone-200 flex items-center gap-2">
                  <span className="text-xs text-stone-700 font-bold">직접 입력:</span>
                  <input
                    type="number"
                    placeholder="번호"
                    value={customStudentNumber}
                    onChange={(e) => {
                      setCustomStudentNumber(e.target.value.replace(/[^0-9]/g, ''));
                      setSelectedStudentNumber(null);
                    }}
                    className="w-20 px-2 py-1 bg-white border border-stone-300 rounded-lg text-sm font-bold text-stone-800"
                  />
                  <span className="text-xs text-stone-700">번</span>
                </div>
              </div>
            )}
          </div>

          {/* 3. Short Intro / Why Recommended */}
          <div>
            <label className="text-lg md:text-2xl font-black text-stone-900 flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full bg-emerald-600 text-white text-base flex items-center justify-center font-black">3</span>
              <span>책 소개 또는 추천 이유 (선택)</span>
            </label>
            <input
              id="new-book-intro-input"
              type="text"
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="예: 읽고 나면 친구를 더 소중하게 생각하게 돼요!"
              className="w-full p-3.5 rounded-2xl border-2 border-stone-300 text-base md:text-lg font-medium focus:outline-none focus:border-emerald-500 text-stone-900"
              maxLength={80}
            />
          </div>

          {/* 4. Color Theme */}
          <div>
            <label className="text-sm md:text-base font-black text-stone-700 block mb-2">
              카드 색상 테마
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setColorTheme(c.id);
                    playPopSound();
                  }}
                  className={`p-2 rounded-xl border-2 text-xs md:text-sm font-black transition cursor-pointer flex flex-col items-center gap-1 ${c.bgClass} ${
                    colorTheme === c.id ? `${c.borderClass} ring-2 ring-emerald-400 scale-105` : 'border-transparent opacity-75'
                  }`}
                >
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl font-bold flex items-center gap-2 text-sm md:text-base">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit */}
          <button
            id="new-book-submit-btn"
            type="submit"
            className="w-full py-4 md:py-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xl md:text-2xl rounded-2xl shadow-xl shadow-emerald-700/25 active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <BookPlus className="w-7 h-7 stroke-[2.5]" />
            <span>새 책 카드 등록하기</span>
          </button>
        </form>
      </div>
    </div>
  );
};
