
import React from 'react';
import { Surah } from '../types';

interface Props {
  surah: Surah;
  onClick: () => void;
  isLastRead?: boolean;
}

const SurahCard: React.FC<Props> = ({ surah, onClick, isLastRead }) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative p-4 rounded-2xl transition-all duration-300 cursor-pointer active:scale-[0.98] mb-2 overflow-hidden ${
        isLastRead 
          ? 'bg-digri-50 ring-1 ring-digri-100' 
          : 'bg-white hover:bg-slate-50'
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
              ? 'bg-digri-500 text-white shadow-sm shadow-digri-500/30' 
              : 'bg-slate-50 text-slate-500 group-hover:bg-digri-100 group-hover:text-digri-600'
          }`}>
            {surah.id}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg group-hover:text-digri-600 transition-colors">{surah.name_simple}</h3>
            <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <span className="uppercase">{surah.revelation_place}</span> • {surah.verses_count} Ayahs
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
           <span className="font-arabic text-2xl text-slate-800 opacity-20 group-hover:opacity-100 transition-opacity duration-300 group-hover:text-digri-500">{surah.name_arabic}</span>
        </div>
      </div>
    </div>
  );
};

export default SurahCard;
