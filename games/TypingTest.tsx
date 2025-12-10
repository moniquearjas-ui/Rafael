
import React, { useState, useEffect, useRef } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const TEXTS = [
    "A raposa marrom rápida salta sobre o cachorro preguiçoso.",
    "Os fliperamas são uma ótima maneira de se divertir e desafiar a si mesmo.",
    "Jogar minijogos offline é perfeito para qualquer momento e lugar.",
    "Tente digitar isso o mais rápido que puder para testar sua habilidade.",
];

const TypingTest = () => {
  const [text, setText] = useState(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
  const [userInput, setUserInput] = useState('');
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const { updateStat } = useAchievements();
  
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, timer]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (!isActive && value.length > 0) {
      setIsActive(true);
    }
    setUserInput(value);
    
    if (value === text) {
      setIsActive(false);
      const words = text.split(' ').length;
      const minutes = timer / 60;
      setWpm(Math.round(words / minutes));
      updateStat('gamesPlayed', 1);
      updateStat('totalWins', 1);
      updateStat('differentGamesWon', 'typing-test');
    }
  };

  const resetGame = () => {
      setText(TEXTS[Math.floor(Math.random() * TEXTS.length)]);
      setUserInput('');
      setTimer(0);
      setIsActive(false);
      setWpm(0);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="p-4 bg-slate-700 rounded-lg mb-4 text-lg">
        {text.split('').map((char, index) => (
            <span key={index} className={
                userInput[index] === char ? 'text-green-400' : (userInput[index] ? 'text-red-500' : 'text-slate-400')
            }>{char}</span>
        ))}
      </div>
      <textarea
        value={userInput}
        onChange={handleInputChange}
        className="w-full h-24 p-2 bg-slate-800 border-2 border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Comece a digitar aqui..."
        disabled={wpm > 0}
      />
      <div className="flex justify-around w-full mt-4 text-xl">
        <div>Tempo: {timer}s</div>
        <div>WPM: {wpm}</div>
      </div>
       {wpm > 0 && (
            <button onClick={resetGame} className="mt-4 px-4 py-2 bg-purple-600 rounded">Tentar Novamente</button>
       )}
    </div>
  );
};

export default TypingTest;
