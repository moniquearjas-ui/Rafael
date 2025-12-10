
import React from 'react';
import type { Game } from '../types';

interface GameWrapperProps {
  game: Game;
  onBack: () => void;
  children: React.ReactNode;
}

const BackArrowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const GameWrapper: React.FC<GameWrapperProps> = ({ game, onBack, children }) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors duration-200 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <BackArrowIcon />
          <span>Voltar ao Menu</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 text-purple-400">{game.icon}</div>
          <h2 className="text-2xl font-bold text-slate-200">{game.name}</h2>
        </div>
      </div>
      <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 shadow-xl border border-slate-700">
        {children}
      </div>
    </div>
  );
};

export default GameWrapper;
