
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const SIZE = 15;
const CELL_SIZE = 25;

// Basic maze generation (recursive backtracking)
const generateMaze = () => {
  const maze = Array.from({ length: SIZE }, () => Array(SIZE).fill(1)); // 1 for wall, 0 for path
  const stack = [[1, 1]];
  maze[1][1] = 0;

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];
    const neighbors = [];
    [[0, 2], [0, -2], [2, 0], [-2, 0]].forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;
      if (nr > 0 && nr < SIZE - 1 && nc > 0 && nc < SIZE - 1 && maze[nr][nc] === 1) {
        neighbors.push([nr, nc, r + dr / 2, c + dc / 2]);
      }
    });

    if (neighbors.length > 0) {
      const [nr, nc, wallR, wallC] = neighbors[Math.floor(Math.random() * neighbors.length)];
      maze[nr][nc] = 0;
      maze[wallR][wallC] = 0;
      stack.push([nr, nc]);
    } else {
      stack.pop();
    }
  }
  maze[1][0] = 0; // Entrance
  maze[SIZE - 2][SIZE - 1] = 0; // Exit
  return maze;
};

const MazeRunner = () => {
  const [maze, setMaze] = useState(generateMaze());
  const [playerPos, setPlayerPos] = useState({ r: 1, c: 0 });
  const [isWon, setIsWon] = useState(false);
  const { updateStat } = useAchievements();
  
  useEffect(() => {
    if (isWon) {
        updateStat('totalWins', 1);
        updateStat('gamesPlayed', 1);
        updateStat('differentGamesWon', 'maze-runner');
    }
  }, [isWon, updateStat]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
        if(isWon) return;
        setPlayerPos(prev => {
            let { r, c } = prev;
            if (e.key === 'ArrowUp' && maze[r - 1]?.[c] === 0) r--;
            if (e.key === 'ArrowDown' && maze[r + 1]?.[c] === 0) r++;
            if (e.key === 'ArrowLeft' && maze[r]?.[c-1] === 0) c--;
            if (e.key === 'ArrowRight' && maze[r]?.[c+1] === 0) c++;

            if (r === SIZE - 2 && c === SIZE - 1) setIsWon(true);
            return {r, c};
        });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [maze, isWon]);

  const resetGame = () => {
      setMaze(generateMaze());
      setPlayerPos({ r: 1, c: 0 });
      setIsWon(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative bg-slate-800" style={{ width: SIZE * CELL_SIZE, height: SIZE * CELL_SIZE }}>
        {maze.map((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} style={{
              position: 'absolute', top: r * CELL_SIZE, left: c * CELL_SIZE,
              width: CELL_SIZE, height: CELL_SIZE,
              backgroundColor: cell === 1 ? '#334155' : 'transparent',
          }}/>
        )))}
        <div style={{
            position: 'absolute', top: playerPos.r * CELL_SIZE, left: playerPos.c * CELL_SIZE,
            width: CELL_SIZE, height: CELL_SIZE, backgroundColor: '#db2777',
            transition: 'top 0.1s linear, left 0.1s linear'
        }} />
        <div style={{position: 'absolute', top: (SIZE-2)*CELL_SIZE, left:(SIZE-1)*CELL_SIZE, width: CELL_SIZE, height: CELL_SIZE, backgroundColor: '#16a34a' }}/>
      </div>
      {isWon && (
        <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold text-green-400">Você Escapou!</h2>
            <button onClick={resetGame} className="mt-2 px-4 py-2 bg-purple-600 rounded">Novo Labirinto</button>
        </div>
      )}
    </div>
  );
};

export default MazeRunner;
