import React from 'react';
import { Champion, MoveType } from '../types';
import { Mountain, FileText, Scissors } from 'lucide-react';

interface ChampionCardProps {
  champion: Champion;
  onClick?: (move: MoveType) => void;
  selected?: boolean;
  disabled?: boolean;
  isResult?: boolean;
}

const ChampionCard: React.FC<ChampionCardProps> = ({ 
  champion, 
  onClick, 
  selected, 
  disabled,
  isResult 
}) => {
  
  const Icon = () => {
    if (champion.id === MoveType.ROCK) return <Mountain className="w-8 h-8 mb-2 text-slate-200" />;
    if (champion.id === MoveType.PAPER) return <FileText className="w-8 h-8 mb-2 text-amber-100" />;
    return <Scissors className="w-8 h-8 mb-2 text-cyan-100" />;
  };

  return (
    <button
      onClick={() => !disabled && onClick && onClick(champion.id)}
      disabled={disabled}
      className={`
        relative group flex flex-col items-center justify-between
        w-full max-w-[200px] h-[300px] p-4
        bg-opacity-20 backdrop-blur-sm
        border-2 transition-all duration-300 ease-out
        ${selected ? `scale-105 ${champion.borderColor} bg-slate-800 shadow-2xl ring-2 ring-offset-2 ring-offset-slate-900 ${champion.borderColor}` : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-500 hover:scale-105'}
        ${disabled && !selected ? 'opacity-50 grayscale cursor-not-allowed' : ''}
        ${isResult ? 'scale-110 z-10' : ''}
        rounded-xl overflow-hidden
      `}
    >
      {/* Background Image simulation */}
      <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity">
        <img 
          src={champion.imageUrl} 
          alt={champion.name} 
          className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500" 
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent mix-blend-multiply`} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center h-full justify-end pb-4">
        <div className={`
          p-3 rounded-full mb-auto mt-4 shadow-lg
          ${champion.color}
        `}>
          <Icon />
        </div>
        
        <h3 className="text-xl font-bold text-white uppercase tracking-wider hextech-text">
          {champion.name}
        </h3>
        <p className="text-xs text-slate-300 font-semibold tracking-widest mb-2">
          {champion.title}
        </p>
        <p className="text-xs text-slate-400 italic">
          "{champion.description}"
        </p>
      </div>
      
      {/* Active Border Glow */}
      {selected && (
        <div className={`absolute inset-0 border-4 ${champion.borderColor} opacity-50 rounded-xl pointer-events-none animate-pulse`} />
      )}
    </button>
  );
};

export default ChampionCard;