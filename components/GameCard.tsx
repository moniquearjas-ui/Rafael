
import React from 'react';
import type { Game } from '../types';

interface GameCardProps {
  game: Game;
  onSelect: (gameId: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => {
  const cardClasses = `
    relative group aspect-square rounded-lg p-4 flex flex-col justify-between items-center text-center 
    overflow-hidden cursor-pointer transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    ${game.isAvailable 
      ? 'bg-slate-800 hover:bg-slate-700 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 focus:ring-purple-500' 
      : 'bg-slate-800/50 cursor-not-allowed'}
  `;

  return (
    <div className={cardClasses} onClick={() => game.isAvailable && onSelect(game.id)} onKeyDown={(e) => e.key === 'Enter' && game.isAvailable && onSelect(game.id)} tabIndex={game.isAvailable ? 0 : -1}>
      <div className={`absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${!game.isAvailable && 'hidden'}`}></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className={`w-12 h-12 mb-2 transition-transform duration-300 group-hover:scale-110 ${!game.isAvailable && 'opacity-30'}`}>{game.icon}</div>
        <h3 className={`font-bold text-sm sm:text-base ${!game.isAvailable && 'opacity-50'}`}>{game.name}</h3>
      </div>
      {!game.isAvailable && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-slate-300 bg-slate-700 px-2 py-1 rounded-full">EM BREVE</span>
        </div>
      )}
    </div>
  );
};

export default GameCard;
