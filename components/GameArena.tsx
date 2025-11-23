import React from 'react';
import { Champion, MoveType, GameResult } from '../types';
import { CHAMPIONS } from '../constants';
import ChampionCard from './ChampionCard';
import { Swords } from 'lucide-react';

interface GameArenaProps {
  playerMove: MoveType | null;
  cpuMove: MoveType | null;
  result: GameResult | null;
  isThinking: boolean;
  onReset: () => void;
}

const GameArena: React.FC<GameArenaProps> = ({ 
  playerMove, 
  cpuMove, 
  result, 
  isThinking,
  onReset 
}) => {
  if (!playerMove) return null;

  const resultColor = 
    result === GameResult.VICTORY ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 
    result === GameResult.DEFEAT ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 
    'text-slate-200';

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Arena Header */}
      <div className="mb-8 text-center">
        <h2 className={`text-5xl font-bold uppercase tracking-widest ${result ? resultColor : 'text-slate-100'}`}>
          {result || "VERSUS"}
        </h2>
      </div>

      {/* The Fight */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full">
        
        {/* Player */}
        <div className="relative">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-cyan-400 font-bold tracking-wider text-sm">
            SUMMONER
          </div>
          <ChampionCard 
            champion={CHAMPIONS[playerMove]} 
            selected={true} 
            isResult={true}
          />
          {result === GameResult.VICTORY && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-cyan-400 text-sm font-bold animate-bounce">
              WINNER
            </div>
          )}
        </div>

        {/* VS Icon */}
        <div className="relative flex flex-col items-center justify-center z-20">
          <div className={`p-4 rounded-full bg-slate-800 border-2 border-slate-600 shadow-2xl ${isThinking ? 'animate-spin' : ''}`}>
            <Swords className="w-8 h-8 text-slate-400" />
          </div>
        </div>

        {/* CPU */}
        <div className="relative">
           <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-400 font-bold tracking-wider text-sm">
            NOXUS AI
          </div>
          {cpuMove ? (
            <>
              <ChampionCard 
                champion={CHAMPIONS[cpuMove]} 
                selected={true}
                isResult={true}
                disabled // Remove hover effects
              />
               {result === GameResult.DEFEAT && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-red-500 text-sm font-bold animate-bounce">
                  WINNER
                </div>
              )}
            </>
          ) : (
            // Mystery Card
            <div className="w-[200px] h-[300px] bg-slate-900 border-2 border-slate-700 border-dashed rounded-xl flex items-center justify-center animate-pulse">
               <span className="text-slate-600 font-bold text-2xl">?</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-12">
        {result && (
          <button
            onClick={onReset}
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold uppercase tracking-widest rounded border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all active:scale-95"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};

export default GameArena;