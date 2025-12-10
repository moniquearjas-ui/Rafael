
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const WhackAMole = () => {
    const [moles, setMoles] = useState(Array(9).fill(false));
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [isActive, setIsActive] = useState(false);
    const { updateStat } = useAchievements();

    useEffect(() => {
        if (!isActive) return;
        
        if (timeLeft === 0) {
            setIsActive(false);
            updateStat('gamesPlayed', 1);
            if(score > 0) {
                updateStat('totalWins', 1);
                updateStat('differentGamesWon', 'whack-a-mole');
            }
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(t => t - 1);
        }, 1000);

        const moleInterval = setInterval(() => {
            const newMoles = Array(9).fill(false);
            const randomIndex = Math.floor(Math.random() * 9);
            newMoles[randomIndex] = true;
            setMoles(newMoles);
        }, 800);

        return () => {
            clearInterval(timer);
            clearInterval(moleInterval);
        };
    }, [isActive, timeLeft, score, updateStat]);

    const handleWhack = (index) => {
        if (moles[index] && isActive) {
            setScore(s => s + 1);
            setMoles(Array(9).fill(false)); // Remove mole immediately after hit
        }
    };
    
    const startGame = () => {
        setScore(0);
        setTimeLeft(20);
        setIsActive(true);
        setMoles(Array(9).fill(false));
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-around w-full mb-4 text-xl">
                <div>Pontos: {score}</div>
                <div>Tempo: {timeLeft}s</div>
            </div>
            <div className="grid grid-cols-3 gap-4 bg-lime-800 p-4 rounded-lg">
                {moles.map((isMole, index) => (
                    <div key={index} className="w-24 h-24 bg-lime-900 rounded-full flex items-center justify-center cursor-pointer" onClick={() => handleWhack(index)}>
                        {isMole && <div className="text-5xl animate-bounce">鼹</div>}
                    </div>
                ))}
            </div>
            {!isActive && (
                 <button onClick={startGame} className="mt-6 px-6 py-2 bg-purple-600 rounded">
                    {timeLeft === 0 ? 'Jogar Novamente' : 'Iniciar'}
                 </button>
            )}
        </div>
    );
};

export default WhackAMole;
