
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const COLORS = ['green', 'red', 'yellow', 'blue'];
const COLOR_CLASSES = {
    green: 'bg-green-500 hover:bg-green-400',
    red: 'bg-red-500 hover:bg-red-400',
    yellow: 'bg-yellow-500 hover:bg-yellow-400',
    blue: 'bg-blue-500 hover:bg-blue-400',
};
const ACTIVE_CLASSES = {
    green: 'bg-green-300', red: 'bg-red-300', yellow: 'bg-yellow-300', blue: 'bg-blue-300'
}

const SimonSays = () => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [activeButton, setActiveButton] = useState('');
  const [gameState, setGameState] = useState('start'); // start, showing, playing, lost
  const [score, setScore] = useState(0);
  const { updateStat } = useAchievements();

  const nextTurn = () => {
    setGameState('showing');
    const newSequence = [...sequence, COLORS[Math.floor(Math.random() * 4)]];
    setSequence(newSequence);
    setPlayerSequence([]);
    
    newSequence.forEach((color, index) => {
      setTimeout(() => {
        setActiveButton(color);
        setTimeout(() => setActiveButton(''), 300);
      }, (index + 1) * 600);
    });
    
    setTimeout(() => setGameState('playing'), newSequence.length * 600 + 300);
  };

  const handleColorClick = (color) => {
    if (gameState !== 'playing') return;
    const newPlayerSeq = [...playerSequence, color];
    setPlayerSequence(newPlayerSeq);

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      setGameState('lost');
      updateStat('gamesPlayed', 1);
      if(score > 0) {
          updateStat('totalWins', 1); // Win if score > 0
          updateStat('differentGamesWon', 'simon-says');
      }
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      setScore(s => s + 1);
      setTimeout(nextTurn, 1000);
    }
  };
  
  const resetGame = () => {
      setSequence([]);
      setPlayerSequence([]);
      setScore(0);
      setGameState('start');
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl mb-4">Pontuação: {score}</h2>
      <div className="grid grid-cols-2 gap-4">
        {COLORS.map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorClick(color)}
            className={`w-32 h-32 rounded-lg transition-colors ${COLOR_CLASSES[color]} ${activeButton === color ? ACTIVE_CLASSES[color] : ''}`}
          />
        ))}
      </div>
      {gameState === 'start' && (
        <button onClick={nextTurn} className="mt-6 px-6 py-2 bg-purple-600 rounded">Iniciar</button>
      )}
      {gameState === 'lost' && (
        <div className="mt-6 text-center">
            <h3 className="text-2xl font-bold text-red-500">Fim de Jogo!</h3>
            <button onClick={resetGame} className="mt-2 px-4 py-2 bg-purple-600 rounded">Jogar Novamente</button>
        </div>
      )}
    </div>
  );
};

export default SimonSays;
