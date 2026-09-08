import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, PlusCircle, Maximize, Minimize, Settings, Sparkles, ZoomIn, Pencil, Check, X } from 'lucide-react';
import { DisplayScale } from '../types';

interface HeaderProps {
  classNameTitle: string;
  totalBooks: number;
  totalStamps: number;
  displayScale: DisplayScale;
  onChangeScale: (scale: DisplayScale) => void;
  onOpenNewBook: () => void;
  onOpenSettings: () => void;
  onUpdateTitle: (newTitle: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  classNameTitle,
  totalBooks,
  totalStamps,
  displayScale,
  onChangeScale,
  onOpenNewBook,
  onOpenSettings,
  onUpdateTitle,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(classNameTitle);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditTitleValue(classNameTitle);
  }, [classNameTitle]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  const handleSaveTitle = () => {
    const trimmed = editTitleValue.trim();
    if (trimmed) {
      onUpdateTitle(trimmed);
    } else {
      setEditTitleValue(classNameTitle);
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    setEditTitleValue(classNameTitle);
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelTitle();
    }
  };

  return (
    <header id="classroom-header" className="bg-white/90 backdrop-blur-md border-b-4 border-amber-300 shadow-md sticky top-0 z-30 px-4 py-3 md:px-8 md:py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Class Title and Stats */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 flex-shrink-0">
            <BookOpen className="w-7 h-7 md:w-9 md:h-9" />
          </div>
          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 py-0.5">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editTitleValue}
                  onChange={(e) => setEditTitleValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={30}
                  className="px-3 py-1 bg-white border-2 border-amber-500 rounded-xl font-black text-xl md:text-3xl text-stone-900 shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-300 w-64 md:w-80 lg:w-96"
                  placeholder="학급 제목 입력..."
                />
                <button
                  id="header-save-title-btn"
                  onClick={handleSaveTitle}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition cursor-pointer flex items-center gap-1 font-bold text-sm md:text-base"
                  title="저장 (Enter)"
                >
                  <Check className="w-5 h-5 md:w-6 md:h-6 stroke-[2.5]" />
                  <span className="hidden sm:inline">완료</span>
                </button>
                <button
                  id="header-cancel-title-btn"
                  onClick={handleCancelTitle}
                  className="p-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl transition cursor-pointer"
                  title="취소 (Esc)"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h1
                  id="header-class-title"
                  onClick={() => setIsEditingTitle(true)}
                  className="text-2xl md:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-2 cursor-pointer hover:text-amber-700 transition-colors"
                  title="클릭하여 제목 수정하기"
                >
                  <span>{classNameTitle}</span>
                  <span className="text-amber-500 text-xl md:text-2xl font-normal hidden sm:inline">💮</span>
                </h1>
                <button
                  id="header-edit-title-btn"
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-70 group-hover:opacity-100 hover:bg-amber-100 p-1.5 rounded-lg text-amber-700 hover:text-amber-900 transition cursor-pointer"
                  title="제목 수정하기"
                  aria-label="제목 수정하기"
                >
                  <Pencil className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            )}
            <p className="text-stone-700 font-bold text-sm md:text-base lg:text-lg flex items-center gap-2 mt-0.5">
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-bold">
                📚 추천 도서 <strong className="text-amber-950 font-black">{totalBooks}</strong>권
              </span>
              <span className="bg-red-100 text-red-900 px-2 py-0.5 rounded-md font-bold">
                💮 찍힌 도장 <strong className="text-red-950 font-black">{totalStamps}</strong>개
              </span>
            </p>
          </div>
        </div>

        {/* Right: Controls & Main Action Button */}
        <div className="flex items-center flex-wrap gap-2 md:gap-3">
          {/* TV Display Scale Selector */}
          <div className="bg-stone-100 p-1 rounded-xl flex items-center border border-stone-200" title="TV 화면 글씨 크기 조절">
            <span className="text-stone-700 px-2 font-bold text-xs md:text-sm flex items-center gap-1 hidden lg:flex">
              <ZoomIn className="w-4 h-4 text-stone-700" /> 글씨
            </span>
            <button
              id="scale-normal-btn"
              onClick={() => onChangeScale('normal')}
              className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-base font-bold transition-all cursor-pointer ${
                displayScale === 'normal'
                  ? 'bg-white text-stone-900 shadow-sm font-black'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              보통
            </button>
            <button
              id="scale-large-btn"
              onClick={() => onChangeScale('large')}
              className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-base font-bold transition-all cursor-pointer ${
                displayScale === 'large'
                  ? 'bg-amber-500 text-white shadow-sm font-black'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              크게(추천)
            </button>
            <button
              id="scale-huge-btn"
              onClick={() => onChangeScale('huge')}
              className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-base font-bold transition-all cursor-pointer ${
                displayScale === 'huge'
                  ? 'bg-red-500 text-white shadow-sm font-black'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              초대형 TV
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            id="fullscreen-toggle-btn"
            onClick={toggleFullscreen}
            className="p-2.5 md:p-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all cursor-pointer border border-stone-200 flex items-center gap-1.5 font-bold text-sm md:text-base"
            title="대형 TV 전체화면 모드"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            <span className="hidden sm:inline">{isFullscreen ? '화면 복귀' : '전체화면'}</span>
          </button>

          {/* Settings / Reset Button */}
          <button
            id="settings-open-btn"
            onClick={onOpenSettings}
            className="p-2.5 md:p-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all cursor-pointer border border-stone-200 font-bold"
            title="학급 설정 및 관리"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Big New Book Button */}
          <button
            id="new-book-top-btn"
            onClick={onOpenNewBook}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black px-4 py-2.5 md:px-6 md:py-3.5 rounded-2xl shadow-lg shadow-emerald-700/25 active:scale-95 transition-all text-base md:text-xl lg:text-2xl cursor-pointer"
          >
            <PlusCircle className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
            <span>새 책 추천하기</span>
            <Sparkles className="w-4 h-4 text-emerald-200 hidden md:inline" />
          </button>

        </div>
      </div>
    </header>
  );
};
