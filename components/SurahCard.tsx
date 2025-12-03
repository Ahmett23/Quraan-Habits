import React from 'react';
import { Surah } from '../types';
import { Play, BookOpen } from 'lucide-react';

interface Props {
  surah: Surah;
  onClick: () => void;
  isLastRead?: boolean;
}

const SurahCard: React.FC<Props> = ({ surah, onClick, isLastRead }) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative bg-white p-5 rounded-2xl border transition-all duration-300 cursor-pointer active:scale-[0.98] mb-3 overflow-hidden ${
        isLastRead 
          ? 'border-digri-500/30 shadow-lg shadow-digri-500/10 ring-1 ring-digri-500/20' 
          : 'border-slate-100 shadow-sm hover:shadow-md hover:border-digri-500/20'
      }`}
    >
      {isLastRead && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-digri-500 rounded-bl-xl text-[10px] font-bold text-white uppercase tracking-wider">
          Continue
        </div>
      )}
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            isLastRead 
              ? 'bg-digri-500 text-white shadow-md shadow-digri-500/30' 
              : 'bg-slate-50 text-slate-500 group-hover:bg-digri-500/10 group-hover:text-digri-500'
          }`}>
            {surah.id}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg group-hover:text-digri-500 transition-colors">{surah.name_simple}</h3>
            <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <span className="uppercase">{surah.revelation_place}</span> • {surah.verses_count} Ayahs
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
           <span className="font-arabic text-2xl text-slate-800 opacity-20 group-hover:opacity-100 transition-opacity duration-300 text-digri-500">{surah.name_arabic}</span>
        </div>
      </div>
    </div>
  );
};

export default SurahCard;