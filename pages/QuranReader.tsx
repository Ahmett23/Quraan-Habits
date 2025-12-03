import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchVerses, fetchChapters } from '../services/quranService';
import { saveUserProgress, getUserProgress } from '../services/storageService';
import { Ayah, Surah, UserProgress } from '../types';
import { ArrowLeft, Moon, Sun, Bookmark, Languages } from 'lucide-react';

const QuranReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [verses, setVerses] = useState<Ayah[]>([]);
  const [surahInfo, setSurahInfo] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false); // Default false for "Kitab" view
  const [userProgress, setUserProgress] = useState<UserProgress>(getUserProgress());
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadContent = async () => {
      if (!id) return;
      setLoading(true);
      
      const chapterId = parseInt(id);
      
      const chapters = await fetchChapters();
      const currentSurah = chapters.find(c => c.id === chapterId);
      setSurahInfo(currentSurah || null);

      const fetchedVerses = await fetchVerses(chapterId);
      setVerses(fetchedVerses);
      
      const progress = getUserProgress();
      progress.lastReadSurahId = chapterId;
      saveUserProgress(progress);
      setUserProgress(progress);

      setLoading(false);
    };

    loadContent();
  }, [id]);

  useEffect(() => {
    // Scroll to hash if present after loading
    if (!loading && window.location.hash) {
      const elementId = window.location.hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (showTranslation) {
             element.classList.add('ring-2', 'ring-digri-500', 'ring-offset-4');
             setTimeout(() => element.classList.remove('ring-2', 'ring-digri-500', 'ring-offset-4'), 2000);
          } else {
             element.classList.add('bg-digri-100/50');
             setTimeout(() => element.classList.remove('bg-digri-100/50'), 2000);
          }
        }, 500);
      }
    }
  }, [loading, showTranslation]);

  const toggleMode = () => setIsDarkMode(!isDarkMode);

  const handleToggleBookmark = (ayah: Ayah, index: number) => {
    if (!surahInfo) return;

    const newProgress = { ...userProgress };
    const bookmarkIndex = newProgress.bookmarks.findIndex(b => b.verse_key === ayah.verse_key);

    if (bookmarkIndex > -1) {
      // Remove
      newProgress.bookmarks.splice(bookmarkIndex, 1);
    } else {
      // Add
      newProgress.bookmarks.push({
        verse_key: ayah.verse_key,
        surah_id: surahInfo.id,
        surah_name: surahInfo.name_simple,
        ayah_number: index + 1,
        text_uthmani: ayah.text_uthmani,
        timestamp: Date.now()
      });
    }

    setUserProgress(newProgress);
    saveUserProgress(newProgress);
  };

  const isBookmarked = (verseKey: string) => {
    return userProgress.bookmarks.some(b => b.verse_key === verseKey);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 text-digri-600">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-digri-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-medium">Opening Quran...</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#121212] text-slate-100' : 'bg-[#fffcf7] text-slate-900'}`}>
      
      {/* Floating Header */}
      <div className={`fixed top-0 left-0 right-0 z-40 px-4 py-4 transition-all duration-300 ${isDarkMode ? 'bg-[#121212]/90 border-b border-slate-800' : 'bg-[#fffcf7]/90 border-b border-stone-100'} backdrop-blur-md`}>
         <div className="max-w-3xl mx-auto flex items-center justify-between">
            <button onClick={() => navigate('/')} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-stone-100 text-slate-600 hover:text-digri-600'}`}>
              <ArrowLeft size={22} />
            </button>
            
            <div className="text-center">
              <h2 className="font-bold text-lg leading-tight">{surahInfo?.name_simple}</h2>
              <p className={`text-[10px] uppercase tracking-widest font-bold ${isDarkMode ? 'text-slate-500' : 'text-stone-400'}`}>{surahInfo?.translated_name.name}</p>
            </div>
            
            <div className="flex gap-2">
                <button 
                  onClick={() => setShowTranslation(!showTranslation)} 
                  className={`p-2 rounded-full transition-colors ${showTranslation ? 'bg-digri-500 text-white shadow-lg shadow-digri-500/30' : isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-stone-400 hover:bg-stone-100'}`}
                  title="Toggle Translation"
                >
                  <Languages size={20} />
                </button>
                <button onClick={toggleMode} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-amber-400' : 'hover:bg-stone-100 text-slate-400 hover:text-digri-500'}`}>
                  {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
         </div>
      </div>

      <div ref={containerRef} className="pt-28 pb-24 px-3 md:px-6 max-w-3xl mx-auto">
        
        {surahInfo?.id !== 1 && surahInfo?.id !== 9 && (
          <div className="text-center mb-8 mt-4 font-arabic text-3xl opacity-80 select-none">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
        )}

        {showTranslation ? (
          // --- List View with Translations ---
          <div className="space-y-6">
            {verses.map((ayah, index) => {
              const bookmarked = isBookmarked(ayah.verse_key);
              return (
                <div 
                    key={ayah.id} 
                    id={ayah.verse_key}
                    className={`p-5 rounded-3xl transition-all duration-300 ${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-white hover:bg-white shadow-sm hover:shadow-md border border-slate-50'} ${bookmarked ? isDarkMode ? 'ring-1 ring-digri-500/50' : 'ring-1 ring-digri-200 shadow-digri-100' : ''}`}
                >
                    <div className="flex justify-between items-center mb-6">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                        {surahInfo?.id}:{index + 1}
                    </span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleBookmark(ayah, index); }}
                        className={`transition-all active:scale-90 p-2 rounded-full ${bookmarked ? 'text-digri-500' : 'text-slate-300 hover:text-digri-400 hover:bg-slate-50'}`}
                    >
                        <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
                    </button>
                    </div>

                    <p className="text-right font-arabic text-4xl leading-[2.4] mb-6" dir="rtl">
                    {ayah.text_uthmani}
                    </p>

                    <p className={`text-lg leading-relaxed font-serif ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {ayah.translations?.[0]?.text?.replace(/<sup.*?<\/sup>/g, '') || 'Translation not available'}
                    </p>
                </div>
              );
            })}
          </div>
        ) : (
          // --- Mushaf Page View (Continuous Text) ---
          <div className={`p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-sm border transition-colors duration-500 ${isDarkMode ? 'bg-[#1a1a1a] border-slate-800' : 'bg-white border-[#f0e6d2]'} `}>
            <div 
                className={`font-arabic text-[26px] md:text-[34px] leading-[2.2] md:leading-[2.1] text-justify ${isDarkMode ? 'text-[#e0e0e0]' : 'text-[#2d2d2d]'}`} 
                dir="rtl"
                style={{ textAlignLast: 'center' }}
            >
               {verses.map((ayah, index) => {
                  const bookmarked = isBookmarked(ayah.verse_key);
                  return (
                    <React.Fragment key={ayah.id}>
                      <span 
                          id={ayah.verse_key}
                          onClick={() => handleToggleBookmark(ayah, index)}
                          className={`cursor-pointer hover:text-digri-600 transition-colors duration-200 decoration-digri-300 decoration-2 ${bookmarked ? 'text-digri-600 bg-digri-50/10 rounded px-1' : ''}`}
                      >
                         {ayah.text_uthmani}
                      </span>
                      {/* Inline Ayah Marker */}
                      <span className={`inline-flex items-center justify-center w-[30px] h-[30px] mx-1.5 align-middle select-none font-sans text-[10px] font-bold border rounded-full relative top-1 ${isDarkMode ? 'border-slate-600 text-slate-500' : 'border-slate-300 text-slate-400'}`}>
                         {index + 1}
                      </span>
                    </React.Fragment>
                  );
               })}
            </div>
          </div>
        )}

        <div className="mt-20 text-center">
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-digri-600 text-white rounded-full font-bold shadow-xl shadow-digri-500/30 hover:bg-digri-500 transition-all active:scale-95"
          >
            Finish Reading
          </button>
        </div>

      </div>
    </div>
  );
};

export default QuranReader;