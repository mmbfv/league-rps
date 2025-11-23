import React, { useState, useCallback, useEffect, useRef } from 'react';
import { MoveType, GameResult, GameState } from './types';
import { CHAMPIONS, WINNING_MOVES, SOUND_EFFECTS } from './constants';
import ChampionCard from './components/ChampionCard';
import GameArena from './components/GameArena';
import { generateCommentary } from './services/geminiService';
import { Trophy, Skull, Minus, Sparkles, Volume2, VolumeX } from 'lucide-react';

const App: React.FC = () => {
  // Game State
  const [playerMove, setPlayerMove] = useState<MoveType | null>(null);
  const [cpuMove, setCpuMove] = useState<MoveType | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [commentary, setCommentary] = useState<string>("");
  const [isCommentaryLoading, setIsCommentaryLoading] = useState(false);
  
  // Sound State
  const [isMuted, setIsMuted] = useState(false);
  
  // Score State
  const [stats, setStats] = useState<GameState>({
    playerScore: 0,
    cpuScore: 0,
    matches: 0
  });

  const commentaryRef = useRef<HTMLDivElement>(null);

  const playSound = useCallback((soundUrl: string) => {
    if (isMuted) return;
    try {
      const audio = new Audio(soundUrl);
      audio.volume = 0.4; // Set a reasonable volume
      audio.play().catch(e => console.warn("Audio playback prevented:", e));
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }, [isMuted]);

  const determineWinner = (pMove: MoveType, cMove: MoveType): GameResult => {
    if (pMove === cMove) return GameResult.DRAW;
    if (WINNING_MOVES[pMove] === cMove) return GameResult.VICTORY;
    return GameResult.DEFEAT;
  };

  const handlePlayerSelect = useCallback(async (move: MoveType) => {
    setPlayerMove(move);
    setCommentary(""); // Clear previous commentary
    playSound(SOUND_EFFECTS.SELECT);
    
    // Simulate "thinking" delay for dramatic effect
    setTimeout(async () => {
      // Random CPU Move
      const moves = Object.values(MoveType);
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      setCpuMove(randomMove);

      // Calculate Result
      const gameResult = determineWinner(move, randomMove);
      setResult(gameResult);

      // Play Result Sound
      if (gameResult === GameResult.VICTORY) playSound(SOUND_EFFECTS.VICTORY);
      else if (gameResult === GameResult.DEFEAT) playSound(SOUND_EFFECTS.DEFEAT);
      else playSound(SOUND_EFFECTS.DRAW);

      // Update Stats
      setStats(prev => ({
        matches: prev.matches + 1,
        playerScore: gameResult === GameResult.VICTORY ? prev.playerScore + 1 : prev.playerScore,
        cpuScore: gameResult === GameResult.DEFEAT ? prev.cpuScore + 1 : prev.cpuScore,
      }));

      // Fetch AI Commentary
      setIsCommentaryLoading(true);
      const text = await generateCommentary(move, randomMove, gameResult);
      setCommentary(text);
      setIsCommentaryLoading(false);
      playSound(SOUND_EFFECTS.COMMENTARY);

    }, 600);
  }, [playSound]);

  const resetGame = () => {
    playSound(SOUND_EFFECTS.SELECT);
    setPlayerMove(null);
    setCpuMove(null);
    setResult(null);
    setCommentary("");
  };

  // Auto-scroll to commentary
  useEffect(() => {
    if (commentary && commentaryRef.current) {
      commentaryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commentary]);

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 overflow-x-hidden">
      
      {/* Navbar / Header */}
      <header className="w-full py-6 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-lg transform rotate-3 flex items-center justify-center shadow-lg shadow-cyan-900/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 to-blue-200 hextech-text">
              RIFT RUMBLE
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Mute Toggle */}
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
              title={isMuted ? "Unmute Sound" : "Mute Sound"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* KDA / Scoreboard */}
            <div className="hidden sm:flex items-center gap-6 text-sm font-mono bg-slate-900 border border-slate-700 px-4 py-2 rounded-full">
              <div className="flex items-center gap-2 text-cyan-400">
                <Trophy className="w-4 h-4" />
                <span>W: {stats.playerScore}</span>
              </div>
              <div className="flex items-center gap-2 text-red-400">
                <Skull className="w-4 h-4" />
                <span>L: {stats.cpuScore}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Minus className="w-4 h-4" />
                <span>D: {stats.matches - stats.playerScore - stats.cpuScore}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex flex-col items-center min-h-[80vh]">
        
        {/* Main Game View */}
        {!playerMove ? (
          <div className="w-full max-w-5xl animate-in fade-in zoom-in duration-500">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-100 mb-4 tracking-wide">CHOOSE YOUR CHAMPION</h2>
              <p className="text-slate-400 max-w-lg mx-auto">
                Select your fighter to enter the arena. Will you crush with Rock, stun with Paper, or snip with Scissors?
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
              {Object.values(CHAMPIONS).map((champ) => (
                <ChampionCard 
                  key={champ.id} 
                  champion={champ} 
                  onClick={handlePlayerSelect} 
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <GameArena 
              playerMove={playerMove} 
              cpuMove={cpuMove} 
              result={result} 
              isThinking={!cpuMove}
              onReset={resetGame}
            />

            {/* Shoutcaster Box */}
            <div 
              ref={commentaryRef}
              className={`mt-12 w-full max-w-2xl transition-all duration-700 ${result ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <div className="relative bg-slate-900/80 border-2 border-yellow-600/30 p-6 rounded-lg text-center shadow-2xl">
                {/* Ornamental Corners */}
                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-500" />
                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-500" />
                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-500" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-500" />
                
                <h3 className="text-yellow-500 uppercase tracking-widest text-xs font-bold mb-3">
                  Summoner's Rift Commentary
                </h3>
                
                {isCommentaryLoading ? (
                   <div className="flex justify-center space-x-2 animate-pulse">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animation-delay-200"></div>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animation-delay-400"></div>
                   </div>
                ) : (
                  <p className="text-lg md:text-xl italic text-slate-200 font-serif leading-relaxed">
                    "{commentary}"
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="w-full py-6 border-t border-slate-800/50 text-center text-slate-600 text-xs">
        <p>Rift Rumble is a fan project. Not affiliated with Riot Games.</p>
      </footer>
    </div>
  );
};

export default App;