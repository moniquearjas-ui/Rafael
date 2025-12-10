
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const SIZE = 5;

const LightsOut = () => {
  const [board, setBoard] = useState(createInitialBoard());
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const { updateStat } = useAchievements();

  function createInitialBoard() {
    let newBoard = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
    // Randomize board by simulating clicks
    for (let i = 0; i < 15; i++) {
        const r = Math.floor(Math.random() * SIZE);
        const c = Math.floor(Math.random() * SIZE);
        toggleLights(newBoard, r, c);
    }
    return newBoard;
  }

  function toggleLights(currentBoard, r, c) {
    const positions = [[r,c], [r-1,c], [r+1,c], [r,c-1], [r,c+1]];
    positions.forEach(([nr, nc]) => {
        if(nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
            currentBoard[nr][nc] = !currentBoard[nr][nc];
        }
    });
  }

  const handleCellClick = (r, c) => {
    if (isWon) return;
    const newBoard = board.map(row => [...row]);
    toggleLights(newBoard, r, c);
    setBoard(newBoard);
    setMoves(prev => prev + 1);
  };

  useEffect(() => {
    const won = board.flat().every(light => !light);
    if (won) {
        setIsWon(true);
        updateStat('totalWins', 1);
        updateStat('gamesPlayed', 1);
        updateStat('differentGamesWon', 'lights-out');
    }
  }, [board, updateStat]);
  
  const resetGame = () => {
      setBoard(createInitialBoard());
      setMoves(0);
      setIsWon(false);
  }

  return (
    <div className="flex flex-col items-center">
        <h2 className="text-xl mb-4">Movimentos: {moves}</h2>
        <div className={`grid grid-cols-5 gap-1 p-2 rounded-lg bg-slate-700`}>
            {board.map((row, r) => row.map((isOn, c) => (
                <div key={`${r}-${c}`} onClick={() => handleCellClick(r,c)}
                    className={`w-16 h-16 rounded-md cursor-pointer transition-colors duration-200
                        ${isOn ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' : 'bg-slate-800'}
                    `}
                />
            )))}
        </div>
        {isWon && (
             <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold text-green-400">Você Venceu!</h2>
                <button onClick={resetGame} className="mt-2 px-4 py-2 bg-purple-600 rounded">Jogar Novamente</button>
            </div>
        )}
    </div>
  );
};

export default LightsOut;
