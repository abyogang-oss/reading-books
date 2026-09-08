import React, { useState, useEffect } from 'react';
import { ClassConfig } from '../types';
import { X, Settings, RotateCcw, Download, Upload, ShieldCheck, Check } from 'lucide-react';

interface SettingsModalProps {
  config: ClassConfig;
  onClose: () => void;
  onUpdateConfig: (newConfig: ClassConfig) => void;
  onClearTodayStamps: () => void;
  onResetToDemo: () => void;
  onExportData: () => void;
  onImportData: (file: File) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  config,
  onClose,
  onUpdateConfig,
  onClearTodayStamps,
  onResetToDemo,
  onExportData,
  onImportData,
}) => {
  const [className, setClassName] = useState(config.className);
  const [studentCount, setStudentCount] = useState(config.studentCount);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setClassName(config.className);
    setStudentCount(config.studentCount);
  }, [config]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      className: className.trim() || '학급 독서 도장판',
      studentCount: Math.max(5, Math.min(50, studentCount)),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (window.confirm('선택한 백업 파일의 데이터로 교체하시겠습니까?')) {
        onImportData(file);
      }
    }
  };

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="settings-modal-card"
        className="bg-white rounded-3xl border-4 border-stone-400 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-800 text-white p-4 sm:p-5 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black">학급 환경 및 데이터 관리</h2>
              <p className="text-xs sm:text-sm text-stone-300">실시간 기기 간 동기화 & 브라우저 자동 저장</p>
            </div>
          </div>
          <button
            id="settings-close-btn"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          
          {/* 1. Class Name & Student count */}
          <form onSubmit={handleSaveConfig} className="bg-stone-50 p-3.5 sm:p-4 rounded-2xl border border-stone-200 space-y-3 sm:space-y-4">
            <h3 className="font-black text-stone-800 text-base sm:text-lg flex items-center gap-2">
              <span>🏫 학급 기본 설정</span>
            </h3>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1">
                화면 상단 학급 명칭
              </label>
              <input
                id="settings-class-name-input"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="예: 3학년 2반 독서 도장판"
                className="w-full p-2.5 bg-white rounded-xl border border-stone-300 font-bold text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-stone-700 mb-1">
                우리 반 학생 수 (1번 ~ N번 버튼 생성)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="settings-student-count-input"
                  type="number"
                  min={10}
                  max={50}
                  value={studentCount}
                  onChange={(e) => setStudentCount(parseInt(e.target.value, 10) || 25)}
                  className="w-24 p-2.5 bg-white rounded-xl border border-stone-300 font-bold text-base text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
                />
                <span className="text-stone-600 font-medium text-xs sm:text-sm">명 (1~{studentCount}번 버튼 생성)</span>
              </div>
            </div>

            <button
              id="settings-save-config-btn"
              type="submit"
              className="min-h-[44px] w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-black text-sm sm:text-base transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {savedSuccess ? <Check className="w-5 h-5 text-emerald-400" /> : null}
              <span>{savedSuccess ? '설정이 저장되었습니다!' : '설정 저장하기'}</span>
            </button>
          </form>

          {/* 2. Realtime Sync & Privacy Info */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-900">
              <p className="font-black text-emerald-950 mb-1">
                실시간 기기 간 동기화 & 개인정보 보호
              </p>
              <p className="leading-relaxed">
                • <strong>실시간 연동:</strong> TV, 교사용 PC, 학생 스마트폰 등 모든 기기에서 동일 링크 접속 시 도장과 한줄평이 실시간으로 공유됩니다.<br/>
                • <strong>개인정보 보호:</strong> 학생의 이름이나 개인정보를 전혀 수집하지 않으며, 오직 '출석 번호'로만 안전하게 기록됩니다.
              </p>
            </div>
          </div>

          {/* 3. Session & Data Reset Options */}
          <div className="space-y-2.5 sm:space-y-3">
            <h3 className="font-black text-stone-800 text-base sm:text-lg">데이터 관리 및 초기화</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                id="settings-clear-today-btn"
                type="button"
                onClick={() => {
                  if (window.confirm('책 목록은 유지하고, 지금까지 찍힌 도장과 한줄평만 모두 지우시겠습니까? (새 차시 수업 시작용)')) {
                    onClearTodayStamps();
                  }
                }}
                className="min-h-[50px] p-3 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl font-bold text-sm text-left transition flex items-center gap-2.5 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <div className="font-black">오늘 도장만 비우기</div>
                  <div className="text-xs text-amber-700">책은 남기고 도장/한줄평만 초기화</div>
                </div>
              </button>

              <button
                id="settings-reset-demo-btn"
                type="button"
                onClick={() => {
                  if (window.confirm('기본 추천 도서 3권이 포함된 처음 상태로 되돌릴까요?')) {
                    onResetToDemo();
                  }
                }}
                className="min-h-[50px] p-3 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 rounded-xl font-bold text-sm text-left transition flex items-center gap-2.5 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 text-stone-600 flex-shrink-0" />
                <div>
                  <div className="font-black">기본 샘플로 초기화</div>
                  <div className="text-xs text-stone-600">추천도서 3권 기본값으로 복원</div>
                </div>
              </button>
            </div>
          </div>

          {/* 4. Backup & Restore (USB export/import) */}
          <div className="p-3.5 sm:p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-black text-stone-800">
              💾 데이터 백업 및 복원 (파일 보관용)
            </h4>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                id="settings-export-btn"
                type="button"
                onClick={onExportData}
                className="min-h-[44px] flex-1 py-2.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl font-bold text-xs sm:text-sm text-stone-800 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>백업 파일 다운로드</span>
              </button>

              <label className="min-h-[44px] flex-1 py-2.5 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl font-bold text-xs sm:text-sm text-stone-800 flex items-center justify-center gap-2 transition cursor-pointer text-center">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>백업 파일 불러오기</span>
                <input
                  id="settings-import-file-input"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
