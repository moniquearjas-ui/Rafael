
import React, { useEffect, useState } from 'react';
import { useAchievements } from '../context/AchievementsContext';
import { AchievementIcon } from './icons';

const AchievementToast: React.FC = () => {
    const { lastUnlocked, clearLastUnlocked } = useAchievements();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (lastUnlocked) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
                // Allow animation to finish before clearing
                setTimeout(clearLastUnlocked, 500);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [lastUnlocked, clearLastUnlocked]);

    if (!lastUnlocked) {
        return null;
    }

    return (
        <div 
            className={`fixed bottom-5 right-5 w-80 p-4 rounded-lg shadow-lg border border-amber-500 bg-slate-800 text-white flex items-center gap-4 transition-all duration-500 ease-in-out
            ${visible ? 'transform translate-x-0 opacity-100' : 'transform translate-x-full opacity-0'}`}
            role="alert"
            aria-live="assertive"
        >
            <div className="flex-shrink-0 text-amber-400">
                <AchievementIcon />
            </div>
            <div>
                <p className="font-bold">Conquista Desbloqueada!</p>
                <p className="text-sm text-slate-300">{lastUnlocked.name}</p>
            </div>
        </div>
    );
};

export default AchievementToast;
