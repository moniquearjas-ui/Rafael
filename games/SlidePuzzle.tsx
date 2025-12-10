
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const SIZE = 4;
const TILES = Array.from({ length: SIZE * SIZE - 1 }, (_, i) => i + 1).concat(0); // 0 is empty

const SlidePuzzle: React.FC = () => {
  const [tiles, setTiles] = useState(shuffle(TILES));
  const [moves, setMoves] = useState(0);
  const { updateStat } = useAchievements();

  const isSolved = tiles.every((t, i) => t === (i + 1) % (SIZE * SIZE));

  useEffect(() => {
    if (isSolved) {
        updateStat('totalWins', 1);
        updateStat('gamesPlayed', 1);
        updateStat('differentGamesWon', 'slide-puzzle');
    }
  }, [isSolved, updateStat]);

  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    // Basic solvability check (for even grid width) - simplified
    return array;
  }
  
  const handleTileClick = (index) => {
      if(isSolved) return;
      
      const emptyIndex = tiles.indexOf(0);
      const { row: tileRow, col: tileCol } = getCoords(index);
      const { row: emptyRow, col: emptyCol } = getCoords(emptyIndex);
      
      if ((Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
          (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow))
      {
          const newTiles = [...tiles];
          [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
          setTiles(newTiles);
          setMoves(m => m + 1);
      }
  };
  
  const getCoords = (index) => ({
      row: Math.floor(index / SIZE),
      col: index % SIZE,
  });
  
  const resetGame = () => {
      setTiles(shuffle(TILES));
      setMoves(0);
  };

  return (
    <div className="flex flex-col items-center">
        <div className="text-xl mb-4">Movimentos: {moves}</div>
        <div className="grid grid-cols-4 gap-1 p-2 bg-slate-700 rounded-lg">
            {tiles.map((tile, index) => (
                <div key={index} onClick={() => handleTileClick(index)}
                    className={`w-20 h-20 flex items-center justify-center text-2xl font-bold rounded-md cursor-pointer transition-all duration-200
                        ${tile === 0 ? 'bg-slate-800' : 'bg-purple-600'}
                    `}
                >
                    {tile !== 0 && tile}
                </div>
            ))}
        </div>
        {isSolved && (
            <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold text-green-400">Resolvido!</h2>
                <button onClick={resetGame} className="mt-2 px-4 py-2 bg-pink-600 rounded">Jogar Novamente</button>
            </div>
        )}
    </div>
  );
};

export default SlidePuzzle;
