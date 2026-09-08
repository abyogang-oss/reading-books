import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, PlusCircle, Maximize, Minimize, Settings, Sparkles, ZoomIn, Pencil, Check, X, Cloud, Share2 } from 'lucide-react';
import { DisplayScale } from '../types';

interface HeaderProps {
  classNameTitle: string;
  totalBooks: number;
  totalStamps: number;
  displayScale: DisplayScale;
  syncStatus?: 'connected' | 'syncing' | 'offline';
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
  syncStatus = 'connected',
  onChangeScale,
  onOpenNewBook,
  onOpenSettings,
  onUpdateTitle,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(classNameTitle);
  const [copiedLink, setCopiedLink] = useState(false);
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

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }).catch(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <header id="classroom-header" className="bg-white/95 backdrop-blur-md border-b-4 border-amber-300 shadow-md sticky top-0 z-30 px-3 py-2.5 sm:px-6 sm:py-3.5 md:px-8 md:py-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 md:gap-4">
        
        {/* Left: Class Title, Live Sync Badge & Stats */}
        <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 min-w-0 max-w-full">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30 flex-shrink-0">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 md:w-9 md:h-9" />
          </div>
          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-1.5 sm:gap-2 py-0.5">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editTitleValue}
                  onChange={(e) => setEditTitleValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={30}
                  className="px-2.5 py-1 bg-white border-2 border-amber-500 rounded-xl font-black text-lg sm:text-2xl md:text-3xl text-stone-900 shadow-inner focus:outline-none focus:ring-4 focus:ring-amber-300 w-48 sm:w-64 md:w-80 max-w-full"
                  placeholder="학급 제목 입력..."
                />
                <button
                  id="header-save-title-btn"
                  onClick={handleSaveTitle}
                  className="p-2 min-h-[44px] min-w-[44px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-1 font-bold text-sm"
                  title="저장 (Enter)"
                >
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span className="hidden sm:inline">완료</span>
                </button>
                <button
                  id="header-cancel-title-btn"
                  onClick={handleCancelTitle}
                  className="p-2 min-h-[44px] min-w-[44px] bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl transition cursor-pointer flex items-center justify-center"
                  title="취소 (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 group flex-wrap">
                <h1
                  id="header-class-title"
                  onClick={() => setIsEditingTitle(true)}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-1.5 cursor-pointer hover:text-amber-700 transition-colors truncate"
                  title="클릭하여 제목 수정하기"
                >
                  <span className="truncate">{classNameTitle}</span>
                  <span className="text-amber-500 text-lg sm:text-xl md:text-2xl font-normal">💮</span>
                </h1>
                <button
                  id="header-edit-title-btn"
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-70 group-hover:opacity-100 hover:bg-amber-100 p-1.5 rounded-lg text-amber-700 hover:text-amber-900 transition cursor-pointer"
                  title="제목 수정하기"
                  aria-label="제목 수정하기"
                >
                  <Pencil className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>

                {/* Real-time Cloud Sync Badge */}
                <div
                  id="header-sync-badge"
                  className="hidden xs:inline-flex sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-300/80 rounded-full text-xs font-bold text-emerald-800 shadow-xs"
                  title="모든 기기(TV, 스마트폰, 태블릿)와 실시간 자동 동기화 중입니다."
                >
                  <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="hidden sm:inline">실시간 동기화됨</span>
                  <span className="sm:hidden">동기화됨</span>
                </div>
              </div>
            )}

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
              <span className="bg-amber-100/90 text-amber-950 px-2 py-0.5 rounded-md font-bold text-xs sm:text-sm md:text-base">
                📚 도서 <strong className="font-black text-amber-950">{totalBooks}</strong>권
              </span>
              <span className="bg-red-100/90 text-red-950 px-2 py-0.5 rounded-md font-bold text-xs sm:text-sm md:text-base">
                💮 도장 <strong className="font-black text-red-950">{totalStamps}</strong>개
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Main Action Buttons */}
        <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 md:gap-3 ml-auto">
          
          {/* Share / Copy URL button for students & mobile devices */}
          <button
            id="share-link-btn"
            onClick={handleCopyLink}
            className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              copiedLink
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
            }`}
            title="스마트폰에서 접속할 수 있는 링크 복사"
          >
            {copiedLink ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Share2 className="w-4 h-4" />}
            <span>{copiedLink ? '링크 복사됨!' : '기기 공유'}</span>
          </button>

          {/* TV Display Scale Selector - hidden on very small phones where scale is naturally compact */}
          <div className="hidden sm:flex bg-stone-100 p-1 rounded-xl items-center border border-stone-200" title="화면 글씨 크기 조절">
            <span className="text-stone-700 px-2 font-bold text-xs md:text-sm items-center gap-1 hidden lg:flex">
              <ZoomIn className="w-4 h-4 text-stone-700" /> 글씨
            </span>
            <button
              id="scale-normal-btn"
              onClick={() => onChangeScale('normal')}
              className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
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
              className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                displayScale === 'large'
                  ? 'bg-amber-500 text-white shadow-sm font-black'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              크게
            </button>
            <button
              id="scale-huge-btn"
              onClick={() => onChangeScale('huge')}
              className={`px-2.5 py-1.5 md:px-3 md:py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                displayScale === 'huge'
                  ? 'bg-red-500 text-white shadow-sm font-black'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              초대형
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            id="fullscreen-toggle-btn"
            onClick={toggleFullscreen}
            className="min-h-[44px] min-w-[44px] p-2.5 md:p-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all cursor-pointer border border-stone-200 flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm"
            title="대형 TV 전체화면 모드"
          >
            {isFullscreen ? <Minimize className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />}
            <span className="hidden md:inline">{isFullscreen ? '화면 복귀' : '전체화면'}</span>
          </button>

          {/* Settings / Reset Button */}
          <button
            id="settings-open-btn"
            onClick={onOpenSettings}
            className="min-h-[44px] min-w-[44px] p-2.5 md:p-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-all cursor-pointer border border-stone-200 font-bold flex items-center justify-center"
            title="학급 설정 및 관리"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Big New Book Button */}
          <button
            id="new-book-top-btn"
            onClick={onOpenNewBook}
            className="min-h-[44px] flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black px-3.5 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3.5 rounded-2xl shadow-lg shadow-emerald-700/25 active:scale-95 transition-all text-sm sm:text-base md:text-xl cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            <span>새 책 추천</span>
            <Sparkles className="w-4 h-4 text-emerald-200 hidden lg:inline" />
          </button>

        </div>
      </div>
    </header>
  );
};
