
import React from 'react';
import { useAchievements } from '../context/AchievementsContext';
import { achievementsList } from '../achievements';
import { AchievementIcon } from './icons';

interface AchievementsPageProps {
    onBack: () => void;
}

const BackArrowIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const AchievementsPage: React.FC<AchievementsPageProps> = ({ onBack }) => {
    const { playerStats, unlockedAchievements } = useAchievements();

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
                <h2 className="text-2xl font-bold text-slate-200">Suas Conquistas</h2>
            </div>
            <div className="space-y-4">
                {achievementsList.map(ach => {
                    const isUnlocked = unlockedAchievements.has(ach.id);
                    let currentValue = 0;
                    if (ach.type === 'differentGamesWon') {
                        currentValue = playerStats[ach.type]?.length || 0;
                    } else {
                        currentValue = playerStats[ach.type] || 0;
                    }
                    
                    const isMinType = ach.type === 'memoryGameBest' || ach.type === 'reactionTimeBest';
                    
                    const progress = isMinType 
                        ? (currentValue && currentValue > 0 ? (ach.goal / currentValue) * 100 : 0)
                        : (currentValue / ach.goal) * 100;
                    
                    const displayValue = isMinType
                      ? (currentValue ? `${currentValue}ms` : 'N/A')
                      : `${Math.min(currentValue, ach.goal)} / ${ach.goal}`;

                    return (
                        <div key={ach.id} className={`p-4 rounded-lg flex items-center gap-4 transition-all duration-300 ${isUnlocked ? 'bg-amber-500/20 border-amber-500' : 'bg-slate-800/50 border-slate-700'} border`}>
                            <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full ${isUnlocked ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                                <AchievementIcon />
                            </div>
                            <div className="flex-grow">
                                <h3 className={`font-bold ${isUnlocked ? 'text-amber-400' : 'text-slate-200'}`}>{ach.name}</h3>
                                <p className="text-sm text-slate-400">{ach.description}</p>
                                {!isUnlocked && (
                                     <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
                                        <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                    </div>
                                )}
                            </div>
                            <div className="text-sm font-semibold text-slate-300 w-24 text-right">
                                {isUnlocked ? 'Desbloqueado!' : displayValue}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AchievementsPage;
