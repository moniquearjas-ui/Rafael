
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { achievementsList, Achievement, StatType } from '../achievements';

interface PlayerStats {
  totalWins: number;
  gamesPlayed: number;
  ticTacToeWins: number;
  rpsWins: number;
  memoryGameBest: number | null; // Lower is better
  reactionTimeBest: number | null; // Lower is better
  differentGamesWon: string[]; // Array of game IDs
}

interface AchievementsContextType {
  playerStats: PlayerStats;
  unlockedAchievements: Set<string>;
  updateStat: (stat: StatType, value: number | string) => void;
  lastUnlocked: Achievement | null;
  clearLastUnlocked: () => void;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

const initialStats: PlayerStats = {
  totalWins: 0,
  gamesPlayed: 0,
  ticTacToeWins: 0,
  rpsWins: 0,
  memoryGameBest: null,
  reactionTimeBest: null,
  differentGamesWon: [],
};

const STATS_KEY = 'miniGameArcadeStats';
const ACHIEVEMENTS_KEY = 'miniGameArcadeAchievements';

export const AchievementsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    try {
      const savedStats = localStorage.getItem(STATS_KEY);
      return savedStats ? JSON.parse(savedStats) : initialStats;
    } catch (error) {
      return initialStats;
    }
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(() => {
     try {
      const savedAchievements = localStorage.getItem(ACHIEVEMENTS_KEY);
      return savedAchievements ? new Set(JSON.parse(savedAchievements)) : new Set();
    } catch (error) {
      return new Set();
    }
  });
  
  const [lastUnlocked, setLastUnlocked] = useState<Achievement | null>(null);

  useEffect(() => {
    localStorage.setItem(STATS_KEY, JSON.stringify(playerStats));
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(Array.from(unlockedAchievements)));
  }, [playerStats, unlockedAchievements]);

  const clearLastUnlocked = () => setLastUnlocked(null);

  const updateStat = (stat: StatType, value: number | string) => {
    setPlayerStats(prevStats => {
      const newStats = { ...prevStats };
      
      switch (stat) {
        case 'totalWins':
        case 'gamesPlayed':
        case 'ticTacToeWins':
        case 'rpsWins':
          if (typeof value === 'number') {
            newStats[stat] = (newStats[stat] || 0) + value;
          }
          break;
        case 'memoryGameBest':
        case 'reactionTimeBest':
          if (typeof value === 'number' && (!newStats[stat] || value < newStats[stat]!)) {
             newStats[stat] = value;
          }
          break;
        case 'differentGamesWon':
          if (typeof value === 'string' && !newStats.differentGamesWon.includes(value)) {
            newStats.differentGamesWon = [...newStats.differentGamesWon, value];
          }
          break;
      }
      
      // Check for new achievements
      achievementsList.forEach(achievement => {
        if (!unlockedAchievements.has(achievement.id)) {
          let currentVal;
          if (achievement.type === 'differentGamesWon') {
              currentVal = newStats.differentGamesWon.length;
          } else {
              currentVal = newStats[achievement.type];
          }

          if (currentVal === null) return;
          
          const goalMet = (achievement.type === 'memoryGameBest' || achievement.type === 'reactionTimeBest')
            ? currentVal <= achievement.goal
            : currentVal >= achievement.goal;

          if (goalMet) {
            setUnlockedAchievements(prevUnlocked => new Set(prevUnlocked).add(achievement.id));
            setLastUnlocked(achievement);
          }
        }
      });

      return newStats;
    });
  };

  return (
    <AchievementsContext.Provider value={{ playerStats, unlockedAchievements, updateStat, lastUnlocked, clearLastUnlocked }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = (): AchievementsContextType => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};
