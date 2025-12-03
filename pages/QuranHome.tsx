import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchChapters } from '../services/quranService';
import { getUserProgress } from '../services/storageService';
import { Surah, UserProgress, Bookmark as BookmarkType } from '../types';
import SurahCard from '../components/SurahCard';
import { Search, BookOpen, Star, Bookmark, Trash2 } from 'lucide-react';

const QuranHome: React.FC = () => {
  const [chapters, setChapters] = useState<Surah[]>([]);
  const [filteredChapters, setFilteredChapters] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [progress, setProgress] = useState<UserProgress>(getUserProgress());
  const [activeTab, setActiveTab] = useState<'surahs' | 'bookmarks'>('surahs');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchChapters();
      setChapters(data);
      setFilteredChapters(data);
      setLoading(false);
    };
    loadData();
    
    // Refresh progress when focusing on the tab or mounting
    const refreshProgress = () => {
        setProgress(getUserProgress());
    };
    refreshProgress();
    window.addEventListener('focus', refreshProgress);
    return () => window.removeEventListener('focus', refreshProgress);
  }, []);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = chapters.filter(c => 
      c.name_simple.toLowerCase().includes(lower) || 
      c.translated_name.name.toLowerCase().includes(lower) ||
      c.id.toString() === lower
    );
    setFilteredChapters(filtered);
  }, [searchTerm, chapters]);

  const lastReadSurah = chapters.find(c => c.id === progress.lastReadSurahId);

  return (
    <div className="pb-32 min-h-screen bg-slate-50">
      {/* Curved Header */}
      <div className="bg-gradient-to-br from-digri-500 to-digri-700 pb-20 pt-14 px-6 rounded-b-[3rem] shadow-xl shadow-digri-900/10 relative overflow-hidden transition-all duration-500">
        {/* Decorative Orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-digri-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] right-[10%] w-20 h-20 bg-digri-300/20 rounded-full blur-xl animate-pulse"></div>

        <div className="relative z-10 max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Quraan Kareem</h1>
              <p className="text-digri-100 text-sm font-medium">Read, Reflect, and Rise</p>
            </div>
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
              <BookOpen size={24} />
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="bg-white/20 p-1.5 rounded-2xl backdrop-blur-md flex mb-8">
              <button 
                onClick={() => setActiveTab('surahs')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'surahs' ? 'bg-white text-digri-600 shadow-lg' : 'text-white hover:bg-white/10'}`}
              >
                  <BookOpen size={16} /> Surahs
              </button>
              <button 
                onClick={() => setActiveTab('bookmarks')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'bookmarks' ? 'bg-white text-digri-600 shadow-lg' : 'text-white hover:bg-white/10'}`}
              >
                  <Bookmark size={16} /> Bookmarks
              </button>
          </div>

          {/* Search Bar - Floating (Only for Surahs) */}
          {activeTab === 'surahs' && (
            <div className="relative animate-in fade-in slide-in-from-bottom-2 mb-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-digri-700" />
                </div>
                <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 bg-white rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg shadow-digri-900/10 font-medium"
                placeholder="Search Surah, Verse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-6 relative z-20 space-y-8 max-w-xl mx-auto">
        
        {/* Last Read Card (Only on Surahs tab) */}
        {activeTab === 'surahs' && lastReadSurah && !searchTerm && (
          <div onClick={() => navigate(`/read/${lastReadSurah.id}`)} className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 cursor-pointer group active:scale-[0.99] transition-all">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-digri-100 text-digri-600 rounded-lg">
                 <Star size={16} fill="currentColor" />
               </div>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Continue Reading</span>
             </div>
             <div className="flex justify-between items-end">
               <div>
                 <h2 className="text-2xl font-bold text-slate-800 group-hover:text-digri-600 transition-colors">{lastReadSurah.name_simple}</h2>
                 <p className="text-sm text-slate-500 font-medium">Ayah {progress.lastReadAyahNumber || 1}</p>
               </div>
               <div className="w-12 h-12 rounded-full bg-digri-50 text-digri-600 flex items-center justify-center group-hover:bg-digri-500 group-hover:text-white transition-all shadow-sm">
                 <BookOpen size={20} />
               </div>
             </div>
          </div>
        )}

        {/* List Content */}
        {activeTab === 'surahs' ? (
             <div className="space-y-4">
                <div className="flex justify-between items-end px-2 pt-2">
                    <h3 className="font-bold text-slate-700 text-lg">Surah List</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">{filteredChapters.length} Chapters</span>
                </div>
                
                {loading ? (
                    <div className="text-center py-20">
                    <div className="w-10 h-10 border-4 border-digri-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400 text-sm">Loading Holy Quran...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredChapters.map(surah => (
                        <SurahCard 
                            key={surah.id} 
                            surah={surah} 
                            onClick={() => navigate(`/read/${surah.id}`)}
                            isLastRead={surah.id === progress.lastReadSurahId}
                        />
                        ))}
                    </div>
                )}
            </div>
        ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                 <div className="flex justify-between items-end px-2 pt-2">
                    <h3 className="font-bold text-slate-700 text-lg">Saved Verses</h3>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">{progress.bookmarks?.length || 0} Saved</span>
                </div>

                {(!progress.bookmarks || progress.bookmarks.length === 0) ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm mt-4">
                        <div className="w-16 h-16 bg-digri-50 text-digri-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bookmark size={32} />
                        </div>
                        <h3 className="font-bold text-slate-700 mb-1">No Bookmarks Yet</h3>
                        <p className="text-sm text-slate-400 max-w-xs mx-auto">Tap the bookmark icon while reading to save verses you want to reflect upon.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {progress.bookmarks.slice().reverse().map((bookmark, idx) => (
                            <div 
                            key={`${bookmark.verse_key}-${idx}`}
                            onClick={() => navigate(`/read/${bookmark.surah_id}#${bookmark.verse_key}`)}
                            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99] transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-16 h-16 bg-digri-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold bg-digri-100 text-digri-600 px-2.5 py-1 rounded-lg">Surah {bookmark.surah_name}</span>
                                            <span className="text-xs font-bold text-slate-400">Verse {bookmark.ayah_number}</span>
                                        </div>
                                    </div>
                                    <div className="p-2 text-digri-500 bg-white shadow-sm rounded-full group-hover:bg-digri-500 group-hover:text-white transition-colors">
                                        <Bookmark size={16} fill="currentColor" />
                                        </div>
                                </div>
                                <p className="text-center font-arabic text-2xl leading-[2.5] text-slate-800 line-clamp-3 dir-rtl" dir="rtl">
                                    {bookmark.text_uthmani}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default QuranHome;