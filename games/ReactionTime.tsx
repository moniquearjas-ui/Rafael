
import React, { useState, useEffect, useRef } from 'react';
import { useAchievements } from '../context/AchievementsContext';

type GameState = 'waiting' | 'ready' | 'clicked' | 'tooSoon';

const ReactionTime: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  // Fix: The return type for setTimeout in browsers is `number`, not `NodeJS.Timeout`.
  const timerRef = useRef<number | null>(null);
  const { updateStat } = useAchievements();

  useEffect(() => {
    if (gameState === 'waiting') {
      const randomDelay = Math.random() * 4000 + 1000; // 1-5 seconds
      timerRef.current = setTimeout(() => {
        setGameState('ready');
        setStartTime(Date.now());
      }, randomDelay);
    }
    
    if (gameState === 'clicked') {
        const reactionTime = endTime - startTime;
        updateStat('gamesPlayed', 1);
        updateStat('totalWins', 1); // A successful click is a "win"
        updateStat('differentGamesWon', 'reaction-time');
        updateStat('reactionTimeBest', reactionTime);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const handleClick = () => {
    if (gameState === 'ready') {
      setEndTime(Date.now());
      setGameState('clicked');
    } else if (gameState === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setGameState('tooSoon');
      updateStat('gamesPlayed', 1); // A failed attempt still counts as a game played
    }
  };

  const resetGame = () => {
    setGameState('waiting');
    setStartTime(0);
    setEndTime(0);
  };

  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting': return 'bg-blue-600';
      case 'ready': return 'bg-green-500';
      case 'clicked': return 'bg-purple-600';
      case 'tooSoon': return 'bg-red-600';
      default: return 'bg-blue-600';
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case 'waiting':
        return (
          <>
            <h2 className="text-3xl font-bold">Espere pelo verde...</h2>
            <p className="mt-2">Clique quando a cor mudar.</p>
          </>
        );
      case 'ready':
        return <h2 className="text-5xl font-bold animate-pulse">CLIQUE!</h2>;
      case 'clicked':
        return (
          <>
            <h2 className="text-5xl font-bold">{endTime - startTime} ms</h2>
            <p className="mt-4">Clique para tentar novamente.</p>
          </>
        );
      case 'tooSoon':
        return (
          <>
            <h2 className="text-3xl font-bold">Muito cedo!</h2>
            <p className="mt-4">Clique para tentar novamente.</p>
          </>
        );
      default: return null;
    }
  };

  return (
    <div
      onClick={gameState === 'clicked' || gameState === 'tooSoon' ? resetGame : handleClick}
      className={`h-80 w-full rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 ${getBackgroundColor()}`}
    >
      {renderContent()}
    </div>
  );
};

export default ReactionTime;