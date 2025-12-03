import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchVerses, fetchChapters } from '../services/quranService';
import { persistUserProgress, fetchUserProgress } from '../services/storageService';
import { Ayah, Surah, UserProgress } from '../types';
import { ArrowLeft, Moon, Sun, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';

const QuranReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Data State
  const [verses, setVerses] = useState<Ayah[]>([]);
  const [pagesData, setPagesData] = useState<Record<number, Ayah[]>>({});
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [surahInfo, setSurahInfo] = useState<Surah | null>(null);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(0);
  
  // User Data
  const [userProgress, setUserProgress] = useState<UserProgress>({
    lastReadSurahId: null,
    lastReadAyahNumber: null,
    bookmarks: [],
    theme: 'light'
  });

  // Initialization
  useEffect(() => {
    const loadContent = async () => {
      if (!id) return;
      setLoading(true);
      
      const chapterId = parseInt(id);
      
      // 1. Fetch Surah Info
      const chapters = await fetchChapters();
      const currentSurah = chapters.find(c => c.id === chapterId);
      setSurahInfo(currentSurah || null);

      // 2. Fetch Verses
      const fetchedVerses = await fetchVerses(chapterId);
      setVerses(fetchedVerses);
      
      // 3. Group by Page (Madani Mushaf Standard)
      const groupedPages: Record<number, Ayah[]> = {};
      const pNums: number[] = [];
      
      fetchedVerses.forEach(verse => {
          const p = verse.page_number;
          if (!groupedPages[p]) {
              groupedPages[p] = [];
              pNums.push(p);
          }
          groupedPages[p].push(verse);
      });
      
      setPagesData(groupedPages);
      setPageNumbers(pNums.sort((a, b) => a - b));

      // 4. Load User Progress & Determine Start Page
      const loadedProgress = await fetchUserProgress();
      setUserProgress(loadedProgress);

      const queryPage = searchParams.get('page');
      let startPage = pNums[0];

      if (queryPage) {
          const qp = parseInt(queryPage);
          if (pNums.includes(qp)) startPage = qp;
      } else {
           if(loadedProgress.lastReadSurahId === chapterId && loadedProgress.lastReadPageNumber && pNums.includes(loadedProgress.lastReadPageNumber)) {
               startPage = loadedProgress.lastReadPageNumber;
           }
      }
      
      setCurrentPage(startPage);
      setLoading(false);
    };

    loadContent();
  }, [id]);

  // Save Progress on Page Change
  useEffect(() => {
      const saveProgress = async () => {
        if (currentPage && surahInfo) {
            // Need to fetch fresh or use current? Use state.
            // But we need to update state then save.
            const updatedProgress = { ...userProgress };
            updatedProgress.lastReadSurahId = surahInfo.id;
            updatedProgress.lastReadPageNumber = currentPage;
            
            setUserProgress(updatedProgress);
            await persistUserProgress(updatedProgress);
        }
      };
      
      if (!loading && surahInfo) {
          saveProgress();
      }
  }, [currentPage, surahInfo, loading]); // Added logic to prevent save on initial load before progress loaded

  const toggleMode = () => setIsDarkMode(!isDarkMode);

  // --- Navigation Helpers ---
  const goToNextPage = () => {
      const idx = pageNumbers.indexOf(currentPage);
      if (idx < pageNumbers.length - 1) {
          setCurrentPage(pageNumbers[idx + 1]);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const goToPrevPage = () => {
      const idx = pageNumbers.indexOf(currentPage);
      if (idx > 0) {
          setCurrentPage(pageNumbers[idx - 1]);
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  // --- Bookmarking Logic ---
  const togglePageBookmark = async () => {
      if (!surahInfo || !currentPage) return;
      
      const pageVerses = pagesData[currentPage];
      if (!pageVerses || pageVerses.length === 0) return;

      const firstVerse = pageVerses[0];
      const newProgress = { ...userProgress };
      const existingIdx = newProgress.bookmarks.findIndex(b => b.page_number === currentPage && b.surah_id === surahInfo.id);

      if (existingIdx > -1) {
          newProgress.bookmarks.splice(existingIdx, 1);
      } else {
          newProgress.bookmarks.push({
              verse_key: firstVerse.verse_key,
              surah_id: surahInfo.id,
              surah_name: surahInfo.name_simple,
              ayah_number: firstVerse.id,
              text_uthmani: firstVerse.text_uthmani.substring(0, 50) + '...',
              page_number: currentPage,
              timestamp: Date.now()
          });
      }
      setUserProgress(newProgress);
      await persistUserProgress(newProgress);
  };

  const isPageBookmarked = () => {
      return userProgress.bookmarks.some(b => b.page_number === currentPage && b.surah_id === surahInfo?.id);
  };

  // --- Keyboard Support ---
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'ArrowLeft') goToNextPage();
          if (e.key === 'ArrowRight') goToPrevPage();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pageNumbers]);


  // --- Renderers ---

  const renderSinglePage = (pageNum: number) => {
      const pageVerses = pagesData[pageNum];
      if (!pageVerses) return null;
      
      const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

      return (
          <div className={`relative w-full max-w-4xl mx-auto flex flex-col min-h-[70vh] transition-all duration-300 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>
              
              <div className="flex-1 px-4 py-8 sm:px-6 flex flex-col relative z-0">
                  {/* Content: Justified Arabic Text */}
                  <div className="flex-1 text-center">
                     <div 
                        className={`w-full font-arabic text-justify text-[28px] md:text-[36px] leading-[2.1] md:leading-[2.4]`}
                        dir="rtl"
                        style={{ textAlignLast: 'center' }}
                     >
                         {pageVerses.map((ayah, i) => {
                             const isSurahStart = ayah.verse_key.endsWith(':1');
                             const surahId = parseInt(ayah.verse_key.split(':')[0]);
                             // Show Bismillah if start of surah, unless Fatiha(1) or Tawbah(9)
                             const showBismillah = isSurahStart && surahId !== 1 && surahId !== 9;

                             return (
                                 <React.Fragment key={ayah.id}>
                                     {showBismillah && (
                                        <div className="w-full text-center my-10 select-none">
                                            <span className={`font-arabic text-3xl opacity-80 block ${isDarkMode ? 'text-digri-400' : 'text-digri-600'}`}>
                                                {BISMILLAH}
                                            </span>
                                        </div>
                                     )}
                                     <span className="hover:text-digri-600 transition-colors cursor-pointer">{ayah.text_uthmani}</span>
                                     <span className={`inline-flex items-center justify-center w-[30px] h-[30px] mx-1.5 align-middle select-none font-sans text-[12px] font-bold border rounded-full opacity-60 ${isDarkMode ? 'border-slate-700 text-slate-500 bg-slate-800' : 'border-slate-200 text-slate-400 bg-slate-50'}`}>
                                         {ayah.verse_key.split(':')[1]}
                                     </span>
                                 </React.Fragment>
                             );
                         })}
                     </div>
                  </div>

                  {/* Footer: Page Number */}
                  <div className="mt-12 text-center">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'}`}>
                        {pageNum}
                      </span>
                  </div>
              </div>
          </div>
      );
  };


  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white text-digri-600">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-digri-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Opening Book...</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-white'}`}>
      
      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 z-40 px-4 py-3 transition-all duration-300 ${isDarkMode ? 'bg-[#0f0f0f]/90 border-b border-slate-800' : 'bg-white/90 border-b border-slate-50'} backdrop-blur-xl`}>
         <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button onClick={() => navigate('/app')} className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-600 hover:text-digri-600'}`}>
              <ArrowLeft size={20} />
              <span className="hidden sm:inline font-bold text-sm">Library</span>
            </button>
            
            <div className="flex flex-col items-center">
                <span className={`font-bold text-sm ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{surahInfo?.name_simple}</span>
            </div>
            
            <div className="flex gap-2">
                <button 
                  onClick={togglePageBookmark}
                  className={`p-2 rounded-full transition-colors ${isPageBookmarked() ? 'text-digri-500 bg-digri-50' : isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-400 hover:bg-slate-100'}`}
                  title="Bookmark Page"
                >
                  <Bookmark size={20} fill={isPageBookmarked() ? "currentColor" : "none"} />
                </button>
                <button onClick={toggleMode} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-amber-400' : 'hover:bg-slate-100 text-slate-400 hover:text-digri-500'}`}>
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
         </div>
      </div>

      {/* Main Reading Area */}
      <div className="flex-1 pt-20 pb-24 px-0 sm:px-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
         
         <div className="w-full max-w-7xl flex items-center justify-center gap-4 lg:gap-8">
            
            {/* Prev Button (Visually Left, logically Next Page because RTL Book) */}
            <button 
                onClick={goToNextPage}
                disabled={pageNumbers.indexOf(currentPage) >= pageNumbers.length - 1}
                className={`hidden md:flex p-4 rounded-full transition-all disabled:opacity-20 disabled:cursor-not-allowed ${isDarkMode ? 'bg-slate-800 text-white hover:bg-digri-600' : 'bg-slate-50 text-slate-400 hover:bg-digri-600 hover:text-white'}`}
            >
                <ChevronLeft size={32} />
            </button>

            {/* Book Layout */}
            <div className="flex-1 flex justify-center w-full">
                {/* Desktop: Double Page View (If screen wide enough) */}
                <div className="hidden xl:flex gap-16 w-full justify-center">
                     {/* Left Page (Even Number) */}
                     {pageNumbers.includes(currentPage + 1) ? (
                        <div className="flex-1 border-l border-slate-100 pl-16">
                            {renderSinglePage(currentPage + 1)}
                        </div>
                     ) : <div className="flex-1"></div>}
                     
                     {/* Right Page (Current/Odd) */}
                     <div className="flex-1">
                        {renderSinglePage(currentPage)}
                     </div>
                </div>

                {/* Mobile/Tablet: Single Page View */}
                <div className="xl:hidden w-full">
                    {renderSinglePage(currentPage)}
                </div>
            </div>

            {/* Next Button (Visually Right, logically Prev Page) */}
             <button 
                onClick={goToPrevPage}
                disabled={pageNumbers.indexOf(currentPage) <= 0}
                className={`hidden md:flex p-4 rounded-full transition-all disabled:opacity-20 disabled:cursor-not-allowed ${isDarkMode ? 'bg-slate-800 text-white hover:bg-digri-600' : 'bg-slate-50 text-slate-400 hover:bg-digri-600 hover:text-white'}`}
            >
                <ChevronRight size={32} />
            </button>

         </div>
      </div>

      {/* Mobile Controls Bottom */}
      <div className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 rounded-full shadow-2xl border z-50 ${isDarkMode ? 'bg-slate-800 border-slate-700 shadow-black/50' : 'bg-white/90 backdrop-blur-md border-slate-100 shadow-slate-200/50'}`}>
          <button 
            onClick={goToNextPage} 
            disabled={pageNumbers.indexOf(currentPage) >= pageNumbers.length - 1}
            className={`p-2 rounded-full ${isDarkMode ? 'text-slate-300' : 'text-slate-400'}`}
          >
              <ChevronLeft size={24} />
          </button>
          
          <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              Page {currentPage}
          </span>

          <button 
            onClick={goToPrevPage}
            disabled={pageNumbers.indexOf(currentPage) <= 0}
            className={`p-2 rounded-full ${isDarkMode ? 'text-slate-300' : 'text-slate-400'}`}
          >
              <ChevronRight size={24} />
          </button>
      </div>

    </div>
  );
};

export default QuranReader;