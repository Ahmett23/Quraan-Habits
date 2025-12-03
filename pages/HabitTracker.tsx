import React, { useState, useEffect, useRef } from 'react';
import { getChallenges, saveChallenges } from '../services/storageService';
import { fetchChapters } from '../services/quranService';
import { Challenge, ChallengeType, Surah } from '../types';
import { TOTAL_QURAN_PAGES } from '../constants';
import { Plus, Minus, Check, X, ArrowLeft, BookOpen, User, Trash2, ChevronRight, RefreshCw, Layers, Sparkles, Target, Lock, Star, Trophy, Calendar, Flag, MapPin, Zap, Play } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const HabitTracker: React.FC = () => {
  // --- STATE ---
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [chapters, setChapters] = useState<Surah[]>([]);
  
  // Navigation State
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [activeTab, setActiveTab] = useState<'quran' | 'duco' | 'habit'>('quran');
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [createType, setCreateType] = useState<ChallengeType>('quran');
  
  // Create Form State
  const [formData, setFormData] = useState({
    title: '',
    duration: 30,
    quranMode: 'whole' as 'whole' | 'surah',
    selectedSurah: null as Surah | null,
    duaText: '',
    duaCount: '100', // Default target
    habitInput: '',
    habitList: [] as string[],
    surahSearch: ''
  });

  // Detail View State
  const [progressInput, setProgressInput] = useState<number>(0);
  const currentDayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChallenges(getChallenges());
    fetchChapters().then(setChapters);
  }, []);

  // Auto-scroll to current day when detail view opens
  useEffect(() => {
    if (view === 'detail' && currentDayRef.current) {
        setTimeout(() => {
            currentDayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
  }, [view, selectedChallengeId, challenges]); 

  const activeChallenge = challenges.find(c => c.id === selectedChallengeId);

  // --- HELPERS ---
  const getFormattedDate = (date: Date) => {
    try {
      return date.toISOString().split('T')[0];
    } catch (e) {
      // Fallback for invalid dates to prevent crash
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
  };
  
  const getDateForDayIndex = (startDateStr: string, index: number) => {
      let date = new Date(startDateStr);
      // Check for Invalid Date
      if (isNaN(date.getTime())) {
          date = new Date(); // Fallback to today
      }
      date.setDate(date.getDate() + index);
      return getFormattedDate(date);
  };

  const updateChallenges = (newChallenges: Challenge[]) => {
    setChallenges(newChallenges);
    saveChallenges(newChallenges);
  };

  const calculateQuranDailyTarget = (c: Challenge) => {
    const total = c.quranConfig?.totalUnits || 0;
    const days = c.durationDays || 1;
    return Math.ceil(total / days);
  };

  // --- ACTIONS ---

  const handleCreateStart = (type: ChallengeType) => {
    setCreateType(type);
    setFormData({
      title: '',
      duration: 30,
      quranMode: 'whole',
      selectedSurah: null,
      duaText: '',
      duaCount: '100',
      habitInput: '',
      habitList: [],
      surahSearch: ''
    });
    setView('create');
  };

  const handleCreateSubmit = () => {
    if (!formData.title) return alert('Please enter a title');

    const newChallenge: Challenge = {
      id: uuidv4(),
      type: createType,
      title: formData.title,
      createdAt: new Date().toISOString(),
      startDate: new Date().toISOString(),
      durationDays: createType === 'duco' ? 0 : formData.duration,
      currentDayIndex: 0,
      completed: false,
      logs: {},
    };

    if (createType === 'quran') {
      let totalUnits = TOTAL_QURAN_PAGES;
      let unitType: 'pages' | 'ayahs' = 'pages';
      let surahId = undefined;
      let surahName = undefined;

      if (formData.quranMode === 'surah') {
        if (!formData.selectedSurah) return alert('Select a Surah');
        totalUnits = formData.selectedSurah.verses_count;
        unitType = 'ayahs';
        surahId = formData.selectedSurah.id;
        surahName = formData.selectedSurah.name_simple;
      }

      newChallenge.quranConfig = {
        mode: formData.quranMode,
        surahId,
        surahName,
        totalUnits,
        unitType,
        unitsCompleted: 0
      };
    } else if (createType === 'duco') {
      newChallenge.duaConfig = {
        targetCountPerDay: parseInt(formData.duaCount) || 33,
        text: formData.duaText,
        totalLifetimeCount: 0
      };
    } else if (createType === 'habit') {
      if (formData.habitList.length === 0) return alert('Add at least one habit');
      newChallenge.habitConfig = {
        habits: formData.habitList
      };
    }

    updateChallenges([...challenges, newChallenge]);
    setView('list');
  };

  const deleteChallenge = (id: string) => {
    if (confirm('Delete this challenge?')) {
      updateChallenges(challenges.filter(c => c.id !== id));
      if (selectedChallengeId === id) {
        setView('list');
        setSelectedChallengeId(null);
      }
    }
  };

  const advanceDay = (challengeId: string) => {
    const updatedList = challenges.map(c => {
      if (c.id === challengeId) {
        const newIndex = c.currentDayIndex + 1;
        const isFinished = newIndex >= c.durationDays;
        return { ...c, currentDayIndex: newIndex, completed: isFinished };
      }
      return c;
    });
    updateChallenges(updatedList);
    setProgressInput(0);
  };

  // --- RENDER FORMS ---

  const renderCreateForm = () => {
    const isQuran = createType === 'quran';
    const ThemeIcon = isQuran ? BookOpen : createType === 'duco' ? Sparkles : Layers;

    return (
      <div className="min-h-screen bg-slate-50 pb-40">
        <div className={`bg-digri-500 p-6 pb-12 rounded-b-[2.5rem] shadow-lg relative overflow-hidden transition-all duration-500`}>
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
           <div className="relative z-10">
             <button onClick={() => setView('list')} className="p-2 bg-white/20 rounded-full hover:bg-white/30 text-white backdrop-blur-md mb-4 transition-colors">
               <ArrowLeft size={20} />
             </button>
             <div className="flex items-center gap-3 text-white">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                   <ThemeIcon size={28} />
                </div>
                <div>
                   <h2 className="text-2xl font-bold">New {isQuran ? 'Reading' : createType === 'duco' ? 'Dhikr' : 'Habit'}</h2>
                   <p className="opacity-90 text-sm">Setup your journey</p>
                </div>
             </div>
           </div>
        </div>

        <div className="px-6 -mt-8 relative z-20 space-y-5">
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Goal Title</label>
             <input 
               type="text" 
               placeholder="e.g. Ramadan Goal" 
               value={formData.title}
               onChange={e => setFormData({...formData, title: e.target.value})}
               className="w-full text-lg font-bold border-b-2 border-slate-100 focus:border-digri-500 outline-none py-2 bg-transparent transition-colors placeholder:text-slate-300"
             />
           </div>

           {createType !== 'duco' && (
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                   <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</label>
                   <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded-md text-slate-600">{formData.duration} Days</span>
                </div>
                <div className="flex gap-2">
                    {[7, 14, 30].map(d => (
                        <button 
                          key={d} 
                          onClick={() => setFormData({...formData, duration: d})} 
                          className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${formData.duration === d ? `border-digri-500 bg-digri-50 text-digri-600` : 'border-slate-100 bg-slate-50 text-slate-400'}`}
                        >
                        {d} Days
                        </button>
                    ))}
                </div>
                <div className="mt-3 relative">
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Days</span>
                     <input 
                       type="number"
                       value={formData.duration}
                       onChange={e => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
                       className="w-full bg-slate-50 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-digri-200"
                     />
                </div>
             </div>
           )}

           {isQuran && (
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4">
                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Reading Mode</label>
                 <div className="flex gap-2 mb-4">
                    <button 
                      onClick={() => setFormData({...formData, quranMode: 'whole'})}
                      className={`flex-1 p-3 rounded-xl border-2 text-sm font-bold flex flex-col items-center gap-1 transition-all ${formData.quranMode === 'whole' ? `border-digri-500 bg-digri-50 text-digri-700` : 'border-slate-100 text-slate-400'}`}
                    >
                      <BookOpen size={20} /> Whole Quran
                    </button>
                    <button 
                      onClick={() => setFormData({...formData, quranMode: 'surah'})}
                      className={`flex-1 p-3 rounded-xl border-2 text-sm font-bold flex flex-col items-center gap-1 transition-all ${formData.quranMode === 'surah' ? `border-digri-500 bg-digri-50 text-digri-700` : 'border-slate-100 text-slate-400'}`}
                    >
                      <Layers size={20} /> Specific Surah
                    </button>
                 </div>
                 
                 {formData.quranMode === 'surah' && (
                   <div className="animate-in fade-in">
                      <input 
                        type="text" 
                        placeholder="Search Surah..." 
                        value={formData.surahSearch}
                        onChange={e => setFormData({...formData, surahSearch: e.target.value})}
                        className="w-full p-3 bg-slate-50 rounded-xl text-sm font-bold mb-2 outline-none border border-slate-200 focus:border-digri-500"
                      />
                      <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50/50 p-1">
                        {chapters.filter(c => c.name_simple.toLowerCase().includes(formData.surahSearch.toLowerCase())).map(c => (
                          <button key={c.id} onClick={() => setFormData({...formData, selectedSurah: c})} className={`w-full text-left p-3 rounded-lg text-sm mb-1 font-medium transition-colors ${formData.selectedSurah?.id === c.id ? `bg-digri-500 text-white` : 'hover:bg-slate-100 text-slate-600'}`}>
                            {c.id}. {c.name_simple}
                          </button>
                        ))}
                      </div>
                   </div>
                 )}
             </div>
           )}

           {createType === 'habit' && (
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Your Daily Habits</label>
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    placeholder="e.g. Read 5 pages..." 
                    value={formData.habitInput}
                    onChange={e => setFormData({...formData, habitInput: e.target.value})}
                    className="flex-1 p-3 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-digri-200 border border-slate-200"
                  />
                  <button onClick={() => {if(formData.habitInput) setFormData({...formData, habitList: [...formData.habitList, formData.habitInput], habitInput: ''})}} className={`bg-digri-500 text-white p-3 rounded-xl shadow-lg shadow-digri-500/20 active:scale-95`}>
                    <Plus />
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.habitList.map((h, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-700">{h}</span>
                      <button onClick={() => setFormData({...formData, habitList: formData.habitList.filter((_, idx) => idx !== i)})} className="text-red-400"><X size={16}/></button>
                    </div>
                  ))}
                  {formData.habitList.length === 0 && <p className="text-center text-slate-300 text-sm py-2">No habits added yet</p>}
                </div>
             </div>
           )}

           {createType === 'duco' && (
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Count</label>
                    <input 
                      type="number" 
                      value={formData.duaCount}
                      onChange={e => setFormData({...formData, duaCount: e.target.value})}
                      className={`w-full text-center text-3xl font-bold p-3 bg-slate-50 rounded-xl text-digri-500 outline-none`}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dua Text</label>
                    <textarea 
                      rows={3}
                      placeholder="Enter text..."
                      value={formData.duaText}
                      onChange={e => setFormData({...formData, duaText: e.target.value})}
                      className="w-full p-3 bg-slate-50 rounded-xl outline-none text-sm border border-slate-200 focus:border-digri-500"
                    />
                 </div>
             </div>
           )}

           <button 
             onClick={handleCreateSubmit}
             className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transform active:scale-[0.98] transition-all bg-digri-500 shadow-digri-500/30 flex items-center justify-center gap-2 mb-10`}
           >
             <Flag size={20} /> Start Journey
           </button>
        </div>
      </div>
    );
  };

  // --- RENDER DETAIL VIEW ---

  const renderDetailView = () => {
    if (!activeChallenge) return null;

    const todayStr = getFormattedDate(new Date());
    const dayIndexStr = activeChallenge.currentDayIndex.toString();
    const isHabit = activeChallenge.type === 'habit';
    const isQuran = activeChallenge.type === 'quran';
    const isDuco = activeChallenge.type === 'duco';

    const logHabit = (dateStr: string, habitIdx: number) => {
      const logs = activeChallenge.logs || {};
      const currentLogs = (logs[dateStr] as number[]) || [];
      let newLogs = currentLogs.includes(habitIdx) 
        ? currentLogs.filter(i => i !== habitIdx) 
        : [...currentLogs, habitIdx];
      const updated = { ...activeChallenge, logs: { ...logs, [dateStr]: newLogs } };
      updateChallenges(challenges.map(c => c.id === activeChallenge.id ? updated : c));
    };

    const logDuco = (amount: number) => {
        const logs = activeChallenge.logs || {};
        const val = activeChallenge.logs?.[todayStr];
        const todayCount = typeof val === 'number' ? val : 0;
        const duaConfig = activeChallenge.duaConfig || { targetCountPerDay: 0, text: '', totalLifetimeCount: 0 };
        const totalLifetime = (duaConfig.totalLifetimeCount || 0) + amount;
        
        if (amount === -1) { // Reset
            updateChallenges(challenges.map(c => c.id === activeChallenge.id ? { ...c, logs: { ...logs, [todayStr]: 0 } } : c));
            return;
        }
        updateChallenges(challenges.map(c => c.id === activeChallenge.id ? { ...c, logs: { ...logs, [todayStr]: todayCount + amount }, duaConfig: { ...duaConfig, totalLifetimeCount: totalLifetime } } : c));
    };

    const logQuran = (amount: number) => {
        const logs = activeChallenge.logs || {};
        const updated = { ...activeChallenge, logs: { ...logs, [dayIndexStr]: amount } };
        updateChallenges(challenges.map(c => c.id === activeChallenge.id ? updated : c));
    };

    const finishQuranDay = (amount: number) => {
        logQuran(amount);
        advanceDay(activeChallenge.id);
    }

    let stats = { target: 0, completed: 0, percentage: 0 };
    if (isDuco) {
        stats.target = activeChallenge.duaConfig?.targetCountPerDay || 0;
        const logVal = activeChallenge.logs?.[todayStr];
        stats.completed = typeof logVal === 'number' ? logVal : 0;
        stats.percentage = stats.target > 0 ? Math.min(100, (stats.completed / stats.target) * 100) : 0;
    } else if (isQuran) {
        stats.target = activeChallenge.quranConfig?.totalUnits || 0;
        // Fix TS error and add safety for logs
        stats.completed = Object.values(activeChallenge.logs || {}).reduce<number>((a, b) => (typeof b === 'number' ? a + b : a), 0);
        stats.percentage = stats.target > 0 ? Math.min(100, (stats.completed / stats.target) * 100) : 0;
    }

    const renderGameMap = () => {
        const totalDays = activeChallenge.durationDays || 30;
        const currentIdx = activeChallenge.currentDayIndex;

        return (
            <div className="relative pb-40 pt-6 px-4">
                <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-slate-200"></div>
                
                <div className="space-y-8 relative">
                    {Array.from({ length: totalDays }).map((_, index) => {
                        const isCurrent = index === currentIdx;
                        const isPast = index < currentIdx;
                        
                        // Safe date generation
                        const dateStr = getDateForDayIndex(activeChallenge.startDate, index);
                        const habitLogs = (activeChallenge.logs?.[dateStr] as number[]) || [];
                        const habitTotal = activeChallenge.habitConfig?.habits.length || 0;
                        const habitProgress = habitTotal > 0 ? (habitLogs.length / habitTotal) * 100 : 0;

                        const quranTarget = calculateQuranDailyTarget(activeChallenge);
                        const quranLogged = (activeChallenge.logs?.[index.toString()] as number) || 0;
                        const displayProgress = progressInput || quranLogged;

                        if (!isCurrent) {
                            return (
                                <div key={index} className="flex items-center gap-6 relative">
                                    <div className={`w-8 h-8 rounded-full z-10 flex items-center justify-center border-2 bg-white transition-colors duration-300 ${isPast ? `border-digri-500 text-digri-500` : 'border-slate-300 text-slate-300'}`}>
                                        {isPast ? <Check size={14} strokeWidth={3} /> : <Lock size={12} />}
                                    </div>
                                    <div className={`text-sm font-bold ${isPast ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-300'}`}>
                                        Day {index + 1}
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={index} ref={currentDayRef} className="relative animate-in slide-in-from-left-4 fade-in duration-500">
                                <div className={`absolute -left-[3px] top-6 w-10 h-0.5 bg-digri-500`}></div>
                                <div className="ml-10">
                                    <div className={`bg-white rounded-[2rem] p-6 shadow-xl shadow-digri-500/10 border border-digri-100 relative overflow-hidden`}>
                                        <div className={`absolute -right-10 -top-10 w-32 h-32 bg-digri-50 rounded-full blur-3xl animate-pulse`}></div>
                                        
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-center mb-6">
                                                <div>
                                                    <span className={`text-xs font-bold text-digri-500 uppercase tracking-widest bg-digri-50 px-2 py-1 rounded-md`}>Current Mission</span>
                                                    <h3 className="text-2xl font-bold text-slate-800 mt-2">Day {index + 1}</h3>
                                                </div>
                                                <div className={`w-12 h-12 bg-gradient-to-br from-digri-400 to-digri-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-digri-500/30`}>
                                                    {isQuran ? <BookOpen size={24}/> : <Layers size={24}/>}
                                                </div>
                                            </div>

                                            {isQuran && (
                                                <div className="space-y-6">
                                                    <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center border border-slate-100">
                                                        <span className="text-xs font-bold text-slate-400 uppercase">Daily Goal</span>
                                                        <span className={`text-3xl font-bold text-digri-600`}>{quranTarget} <span className="text-sm font-medium text-slate-400">{activeChallenge.quranConfig?.unitType}</span></span>
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={() => finishQuranDay(quranTarget)}
                                                        className={`w-full py-4 bg-gradient-to-r from-digri-500 to-digri-500 text-white rounded-2xl font-bold active:scale-95 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2`}
                                                    >
                                                        <Check size={20} strokeWidth={3} />
                                                        I Read {quranTarget} {activeChallenge.quranConfig?.unitType}
                                                    </button>

                                                    <div className="relative py-4">
                                                        <div className="absolute inset-0 flex items-center">
                                                            <div className="w-full border-t border-slate-200"></div>
                                                        </div>
                                                        <div className="relative flex justify-center text-xs uppercase">
                                                            <span className="bg-white px-2 text-slate-400 font-bold">Or specify exact amount</span>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="flex justify-between items-center font-bold text-slate-600">
                                                            <span>Read: {displayProgress}</span>
                                                        </div>
                                                        <input 
                                                          type="range" 
                                                          min="0" 
                                                          max={Math.max(quranTarget * 2, 50)} 
                                                          value={displayProgress} 
                                                          onChange={(e) => {
                                                              const val = parseInt(e.target.value);
                                                              setProgressInput(val);
                                                              logQuran(val);
                                                          }}
                                                          className={`w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-digri-500`}
                                                        />
                                                        {displayProgress >= quranTarget && (
                                                            <button 
                                                                onClick={() => advanceDay(activeChallenge.id)} 
                                                                className={`w-full py-3 bg-digri-100 text-digri-700 rounded-xl font-bold text-sm`}
                                                            >
                                                                Mark Day Complete
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {isHabit && (
                                                <div className="space-y-3">
                                                    {activeChallenge.habitConfig?.habits.map((habit, hIdx) => {
                                                        const isChecked = habitLogs.includes(hIdx);
                                                        return (
                                                            <div 
                                                                key={hIdx} 
                                                                onClick={() => logHabit(dateStr, hIdx)}
                                                                className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all active:scale-[0.98] ${isChecked ? `bg-digri-50 border-digri-500/20` : 'bg-white border-slate-100'}`}
                                                            >
                                                                <span className={`font-bold ${isChecked ? `text-digri-700` : 'text-slate-600'}`}>{habit}</span>
                                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isChecked ? `bg-digri-500 border-digri-500 text-white` : 'border-slate-200'}`}>
                                                                    {isChecked && <Check size={14} strokeWidth={4} />}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                    
                                                    <div className="mt-6">
                                                        <button 
                                                            onClick={() => advanceDay(activeChallenge.id)}
                                                            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${habitProgress === 100 ? `bg-gradient-to-r from-digri-400 to-digri-500 shadow-digri-500/30` : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
                                                            disabled={habitProgress < 100}
                                                        >
                                                            {habitProgress === 100 ? (
                                                                <>Complete Day <ArrowLeft size={18} className="rotate-180"/></>
                                                            ) : (
                                                                `${Math.round(habitProgress)}% Complete`
                                                            )}
                                                        </button>
                                                        {habitProgress < 100 && (
                                                            <p className="text-center text-xs text-slate-400 mt-2">Complete all habits to unlock next day</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderDucoCard = () => (
         <div className="px-6 -mt-10 relative z-20 pb-40">
            <div className={`bg-white rounded-[2.5rem] p-8 shadow-xl shadow-digri-500/10 border border-digri-100 flex flex-col items-center text-center`}>
                 <div className="mb-8">
                    <span className={`text-xs font-bold text-digri-400 uppercase tracking-widest mb-2 block`}>Current Streak</span>
                    <h3 className="text-5xl font-bold text-slate-800">{stats.completed}</h3>
                    <p className="text-sm text-slate-400 font-medium mt-1">out of {stats.target}</p>
                 </div>

                 <button 
                   onClick={() => logDuco(1)}
                   className={`w-48 h-48 rounded-full bg-gradient-to-br from-digri-400 to-digri-600 text-white shadow-2xl shadow-digri-500/40 flex flex-col items-center justify-center gap-2 active:scale-90 transition-all duration-150 mb-8 border-4 border-digri-200`}
                 >
                    <Sparkles size={40} fill="currentColor" className="opacity-80" />
                    <span className="text-2xl font-bold tracking-wider">TAP</span>
                 </button>

                 <div className="flex w-full gap-4">
                     <button onClick={() => logDuco(-1)} className="flex-1 py-3 bg-slate-50 text-slate-500 font-bold rounded-xl text-sm active:scale-95">Reset Day</button>
                 </div>
            </div>
         </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
             <div className={`bg-gradient-to-br from-digri-400 to-digri-600 pt-12 pb-20 px-6 rounded-b-[3rem] shadow-lg relative overflow-hidden transition-all`}>
                 <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <button onClick={() => setView('list')} className="p-2 bg-white/20 rounded-full text-white backdrop-blur-sm hover:bg-white/30 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <button onClick={() => deleteChallenge(activeChallenge.id)} className="p-2 bg-white/20 rounded-full text-white backdrop-blur-sm hover:bg-red-500/50 transition-colors">
                            <Trash2 size={20} />
                        </button>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-white mb-2">{activeChallenge.title}</h1>
                    <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-6">
                        {isQuran && <BookOpen size={16} />}
                        {isDuco && <Sparkles size={16} />}
                        {isHabit && <Layers size={16} />}
                        <span>{isDuco ? 'Daily Dhikr' : `${activeChallenge.durationDays} Days Challenge`}</span>
                    </div>

                    <div className="bg-black/20 rounded-full h-2 w-full overflow-hidden backdrop-blur-sm">
                        <div className="bg-white h-full transition-all duration-1000 ease-out" style={{ width: `${stats.percentage}%` }}></div>
                    </div>
                 </div>
             </div>

             {(isQuran || isHabit) ? renderGameMap() : renderDucoCard()}
        </div>
    );
  };

  // --- RENDER LIST VIEW ---

  const renderListView = () => {
    const tabs = [
        { id: 'quran', label: 'Quran', icon: BookOpen },
        { id: 'duco', label: 'Dhikr', icon: Sparkles },
        { id: 'habit', label: 'Habits', icon: Layers },
    ];

    const filteredChallenges = challenges.filter(c => c.type === activeTab);
    const activeTabData = tabs.find(t => t.id === activeTab);
    const ActiveIcon = activeTabData?.icon || Target;

    return (
        <div className="min-h-screen bg-slate-50 pb-28">
            {/* Header */}
            <div className={`bg-gradient-to-br from-digri-500 to-digri-700 pb-12 pt-12 px-6 rounded-b-[3rem] shadow-xl shadow-digri-900/10 relative overflow-hidden transition-all duration-500`}>
                <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                        <h1 className="text-3xl font-bold text-white mb-1">My Challenges</h1>
                        <p className="text-white/70 text-sm font-medium">Track your spiritual growth</p>
                        </div>
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20">
                            <Target size={24} />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-black/20 p-1 rounded-2xl backdrop-blur-md">
                        {tabs.map(tab => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            return (
                                <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-white text-slate-800 shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                                >
                                <Icon size={16} />
                                {tab.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="px-4 -mt-4 relative z-20 space-y-4">
                {filteredChallenges.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 mx-2">
                        <div className={`w-20 h-20 bg-digri-50 rounded-full flex items-center justify-center mx-auto mb-4 text-digri-200`}>
                             <ActiveIcon size={32} />
                        </div>
                        <p className="text-slate-400 font-medium">No active {activeTabData?.label} challenges</p>
                        <p className="text-slate-300 text-xs mt-1">Tap + to start a new journey</p>
                    </div>
                ) : (
                    filteredChallenges.map(c => {
                        let progress = 0;
                        if (c.type === 'quran') {
                            const total = c.quranConfig?.totalUnits || 1;
                            // Safe reduce with check for logs existence and type check
                            const current = Object.values(c.logs || {}).reduce<number>((a, b) => {
                                 if (typeof b === 'number') return a + b;
                                 return a;
                            }, 0);
                            progress = Math.min(100, (current / total) * 100);
                        } else if (c.type === 'duco') {
                             const logVal = c.logs?.[getFormattedDate(new Date())];
                             const today = typeof logVal === 'number' ? logVal : 0;
                             const target = c.duaConfig?.targetCountPerDay || 1;
                             progress = Math.min(100, (today / target) * 100);
                        } else {
                            const loggedDays = Object.keys(c.logs || {}).length;
                            const duration = c.durationDays || 1;
                            progress = (loggedDays / duration) * 100;
                        }

                        return (
                            <div 
                              key={c.id} 
                              onClick={() => { setSelectedChallengeId(c.id); setView('detail'); }}
                              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-[0.99] cursor-pointer relative overflow-hidden group"
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-digri-500`}></div>
                                
                                <div className="flex justify-between items-start mb-3 pl-3">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg">{c.title}</h3>
                                        <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-wide">
                                            {c.type === 'quran' && c.quranConfig?.mode === 'surah' ? `Surah ${c.quranConfig.surahName}` : c.type === 'quran' ? 'Whole Quran' : c.type === 'duco' ? 'Daily Target' : 'Daily Habits'}
                                        </p>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full bg-digri-50 text-digri-500 flex items-center justify-center`}>
                                        <ChevronRight size={18} />
                                    </div>
                                </div>

                                <div className="pl-3">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
                                        <span>Progress</span>
                                        <span className={`text-digri-600`}>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full bg-digri-500 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* FAB */}
            <button 
              onClick={() => handleCreateStart(activeTab)}
              className={`fixed bottom-28 right-6 w-14 h-14 bg-digri-600 text-white rounded-full shadow-xl shadow-digri-600/30 flex items-center justify-center active:scale-90 transition-all hover:bg-digri-500 z-50`}
            >
                <Plus size={28} />
            </button>
        </div>
    );
  };

  return (
    <>
      {view === 'list' && renderListView()}
      {view === 'create' && renderCreateForm()}
      {view === 'detail' && renderDetailView()}
    </>
  );
};

export default HabitTracker;