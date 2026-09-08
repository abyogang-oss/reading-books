import { useState, useEffect } from 'react';
import { Book, Stamp, ClassConfig, DisplayScale, StampType, BookColorTheme } from './types';
import {
  loadBooks,
  saveBooks,
  loadStamps,
  saveStamps,
  loadConfig,
  saveConfig,
  loadScale,
  saveScale,
  INITIAL_BOOKS,
  INITIAL_STAMPS,
  INITIAL_CONFIG,
} from './utils/storage';
import {
  subscribeBooks,
  subscribeStamps,
  subscribeConfig,
  addBook,
  deleteBook,
  addStamp,
  updateConfig,
  clearAllStamps,
  resetToDemo,
  seedInitialDataIfEmpty,
  testConnection,
} from './services/dbService';
import { Header } from './components/Header';
import { BookCard } from './components/BookCard';
import { StampModal } from './components/StampModal';
import { NewBookModal } from './components/NewBookModal';
import { StampEffect } from './components/StampEffect';
import { SettingsModal } from './components/SettingsModal';
import { BookOpen, PlusCircle } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState<Book[]>(loadBooks);
  const [stamps, setStamps] = useState<Stamp[]>(loadStamps);
  const [config, setConfig] = useState<ClassConfig>(loadConfig);
  const [displayScale, setDisplayScale] = useState<DisplayScale>(loadScale);
  const [syncStatus, setSyncStatus] = useState<'connected' | 'syncing' | 'offline'>('syncing');

  // Modals state
  const [activeStampBook, setActiveStampBook] = useState<Book | null>(null);
  const [isNewBookOpen, setIsNewBookOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [stampEffect, setStampEffect] = useState<{
    studentNumber: number;
    stampType: StampType;
  } | null>(null);

  // Initialize and subscribe to Firestore realtime updates
  useEffect(() => {
    let isMounted = true;

    async function initFirestore() {
      try {
        setSyncStatus('syncing');
        await testConnection();
        // Seed if Firestore has no books yet, preserving any local modifications
        await seedInitialDataIfEmpty(loadBooks(), loadStamps(), loadConfig());
        if (isMounted) {
          setSyncStatus('connected');
        }
      } catch (err) {
        console.warn('Firestore initial check warning:', err);
        if (isMounted) {
          setSyncStatus('offline');
        }
      }
    }

    initFirestore();

    // 1. Realtime books subscription
    const unsubBooks = subscribeBooks(
      (updatedBooks) => {
        if (!isMounted) return;
        setBooks(updatedBooks);
        saveBooks(updatedBooks);
        setSyncStatus('connected');
      },
      () => {
        if (isMounted) setSyncStatus('offline');
      }
    );

    // 2. Realtime stamps subscription
    const unsubStamps = subscribeStamps(
      (updatedStamps) => {
        if (!isMounted) return;
        setStamps(updatedStamps);
        saveStamps(updatedStamps);
        setSyncStatus('connected');
      },
      () => {
        if (isMounted) setSyncStatus('offline');
      }
    );

    // 3. Realtime config subscription (Title, student count)
    const unsubConfig = subscribeConfig(
      (updatedConfig) => {
        if (!isMounted) return;
        setConfig(updatedConfig);
        saveConfig(updatedConfig);
        setSyncStatus('connected');
      },
      () => {
        if (isMounted) setSyncStatus('offline');
      }
    );

    return () => {
      isMounted = false;
      unsubBooks();
      unsubStamps();
      unsubConfig();
    };
  }, []);

  // Save UI scale preference locally
  useEffect(() => {
    saveScale(displayScale);
  }, [displayScale]);

  // Actions
  const handleAddBook = async (
    title: string,
    recommenderType: 'teacher' | 'student',
    recommenderNumber?: number,
    intro?: string,
    colorTheme?: BookColorTheme
  ) => {
    setIsNewBookOpen(false);
    try {
      await addBook(title, recommenderType, recommenderNumber, intro, colorTheme);
    } catch (err) {
      console.error('Failed to add book to cloud:', err);
      // Fallback local addition
      const newBook: Book = {
        id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title,
        recommenderType,
        recommenderNumber,
        intro,
        colorTheme: colorTheme || 'amber',
        createdAt: Date.now(),
      };
      setBooks((prev) => [newBook, ...prev]);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      await deleteBook(bookId, stamps);
    } catch (err) {
      console.error('Failed to delete book in cloud:', err);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      setStamps((prev) => prev.filter((s) => s.bookId !== bookId));
    }
  };

  const handleAddStamp = async (
    bookId: string,
    studentNumber: number,
    stampType: StampType,
    comment: string
  ) => {
    setActiveStampBook(null);

    // Trigger visual slam effect immediately
    setStampEffect({ studentNumber, stampType });

    try {
      await addStamp(bookId, studentNumber, stampType, comment);
    } catch (err) {
      console.error('Failed to add stamp to cloud:', err);
      const randomTilt = Math.floor(Math.random() * 13) - 6;
      const newStamp: Stamp = {
        id: `stamp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        bookId,
        studentNumber,
        stampType,
        comment,
        createdAt: Date.now(),
        rotation: randomTilt,
      };
      setStamps((prev) => [newStamp, ...prev]);
    }
  };

  const handleUpdateTitle = async (newTitle: string) => {
    const updated = { ...config, className: newTitle };
    setConfig(updated);
    saveConfig(updated);
    try {
      await updateConfig(updated);
    } catch (err) {
      console.error('Failed to sync title to cloud:', err);
    }
  };

  const handleUpdateConfig = async (newConfig: ClassConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
    try {
      await updateConfig(newConfig);
    } catch (err) {
      console.error('Failed to sync config to cloud:', err);
    }
  };

  // Reset actions
  const handleClearTodayStamps = async () => {
    setIsSettingsOpen(false);
    try {
      await clearAllStamps(stamps);
    } catch (err) {
      console.error('Failed to clear stamps:', err);
      setStamps([]);
    }
  };

  const handleResetToDemo = async () => {
    setIsSettingsOpen(false);
    try {
      await resetToDemo(books, stamps);
    } catch (err) {
      console.error('Failed to reset to demo:', err);
      setBooks(INITIAL_BOOKS);
      setStamps(INITIAL_STAMPS);
      setConfig(INITIAL_CONFIG);
    }
  };

  // Export / Import backup file
  const handleExportData = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      config,
      books,
      stamps,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `독서도장판_백업_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.books && Array.isArray(parsed.books)) {
          setBooks(parsed.books);
        }
        if (parsed.stamps && Array.isArray(parsed.stamps)) {
          setStamps(parsed.stamps);
        }
        if (parsed.config) {
          setConfig(parsed.config);
          await handleUpdateConfig(parsed.config);
        }
        setIsSettingsOpen(false);
        alert('백업 데이터를 성공적으로 불러왔습니다!');
      } catch (err) {
        alert('파일을 읽는 중 오류가 발생했습니다. 올바른 백업 JSON 파일인지 확인해주세요.');
      }
    };
    reader.readAsText(file);
  };

  // TV root layout sizing class
  const scaleContainerClass = {
    normal: '',
    large: 'text-[1.125rem]',
    huge: 'text-[1.25rem]',
  }[displayScale];

  return (
    <div className={`min-h-screen flex flex-col bg-amber-50/50 pb-16 ${scaleContainerClass}`}>
      {/* Top Navigation & TV Controls */}
      <Header
        classNameTitle={config.className}
        totalBooks={books.length}
        totalStamps={stamps.length}
        displayScale={displayScale}
        syncStatus={syncStatus}
        onChangeScale={setDisplayScale}
        onOpenNewBook={() => setIsNewBookOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onUpdateTitle={handleUpdateTitle}
      />

      {/* Main Board Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
        {books.length === 0 ? (
          <div className="bg-white rounded-3xl border-4 border-dashed border-stone-300 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm my-8 sm:my-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 mb-2">
              등록된 추천 도서가 없습니다
            </h2>
            <p className="text-stone-600 font-bold text-sm sm:text-base md:text-lg mb-6">
              선생님과 학생들이 함께 읽을 책을 추천하고 도장판을 시작해보세요!
            </p>
            <button
              id="empty-add-book-btn"
              onClick={() => setIsNewBookOpen(true)}
              className="min-h-[44px] inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl text-base sm:text-xl shadow-lg transition cursor-pointer active:scale-98"
            >
              <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>첫 번째 책 추천하기</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                stamps={stamps.filter((s) => s.bookId === book.id)}
                displayScale={displayScale}
                onStampClick={(targetBook) => setActiveStampBook(targetBook)}
                onDeleteBook={handleDeleteBook}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer Banner */}
      <footer className="text-center py-4 px-4 text-stone-500 text-xs sm:text-sm md:text-base font-bold">
        <span>💡 교실 TV & 스마트폰 안내: 번호로만 안전하게 기록되며, 모든 기기에서 실시간 자동 동기화됩니다.</span>
      </footer>

      {/* Modals */}
      {activeStampBook && (
        <StampModal
          book={activeStampBook}
          studentCount={config.studentCount}
          displayScale={displayScale}
          onClose={() => setActiveStampBook(null)}
          onSubmitStamp={handleAddStamp}
        />
      )}

      {isNewBookOpen && (
        <NewBookModal
          studentCount={config.studentCount}
          onClose={() => setIsNewBookOpen(false)}
          onSubmitBook={handleAddBook}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          config={config}
          onClose={() => setIsSettingsOpen(false)}
          onUpdateConfig={handleUpdateConfig}
          onClearTodayStamps={handleClearTodayStamps}
          onResetToDemo={handleResetToDemo}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />
      )}

      {stampEffect && (
        <StampEffect
          studentNumber={stampEffect.studentNumber}
          stampType={stampEffect.stampType}
          onComplete={() => setStampEffect(null)}
        />
      )}
    </div>
  );
}
