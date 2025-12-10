
import React, { useState, useMemo } from 'react';
// Fix: The 'Game' type is exported from './types', not './games'.
import { games } from './games';
import type { Game } from './types';
import GameCard from './components/GameCard';
import GameWrapper from './components/GameWrapper';
import { AchievementsProvider } from './context/AchievementsContext';
import AchievementsPage from './components/AchievementsPage';
import AchievementToast from './components/AchievementToast';
import { AchievementIcon } from './components/icons';


const App: React.FC = () => {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [view, setView] = useState<'menu' | 'achievements'>('menu');

  const selectedGame = useMemo(
    () => games.find((g) => g.id === selectedGameId),
    [selectedGameId]
  );

  const handleSelectGame = (gameId: string) => {
    setView('menu');
    setSelectedGameId(gameId);
  };

  const handleBackToMenu = () => {
    setSelectedGameId(null);
    setView('menu');
  };

  const showAchievements = () => {
    setSelectedGameId(null);
    setView('achievements');
  }

  return (
    <AchievementsProvider>
      <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8 font-sans">
        <header className="text-center mb-8 relative">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Mini Game Arcade
          </h1>
          <p className="text-slate-400 mt-2 text-lg">25 Jogos Divertidos Para Jogar Offline</p>
          <button 
            onClick={showAchievements} 
            className="absolute top-0 right-0 mt-2 mr-2 p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            aria-label="Ver Conquistas"
          >
            <AchievementIcon />
          </button>
        </header>

        <main>
          {view === 'achievements' ? (
            <AchievementsPage onBack={handleBackToMenu} />
          ) : selectedGame ? (
            <GameWrapper game={selectedGame} onBack={handleBackToMenu}>
              <selectedGame.component />
            </GameWrapper>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {games.map((game) => (
                <GameCard key={game.id} game={game} onSelect={handleSelectGame} />
              ))}
            </div>
          )}
        </main>
        <footer className="text-center mt-12 text-slate-500 text-sm">
            <p>Criado com React, Tailwind CSS e muito carinho.</p>
          </footer>
      </div>
      <AchievementToast />
    </AchievementsProvider>
  );
};

export default App;
