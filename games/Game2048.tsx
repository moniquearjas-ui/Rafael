
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const SIZE = 4;

const Game2048 = () => {
  const [board, setBoard] = useState(getInitialBoard());
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const { updateStat } = useAchievements();

  function getInitialBoard() {
    let newBoard = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }
  
  function addRandomTile(board) {
    let emptyTiles = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (board[r][c] === 0) emptyTiles.push({ r, c });
      }
    }
    if (emptyTiles.length > 0) {
      const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      board[r][c] = Math.random() > 0.9 ? 4 : 2;
    }
  }

  const rotateRight = (matrix) => matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]).reverse());

  const move = (direction) => {
    if (gameOver) return;
    let currentBoard = board.map(row => [...row]);
    let rotatedBoard = currentBoard;
    let rotations = 0;

    if (direction === 'left') rotations = 0;
    if (direction === 'up') { rotations = 1; rotatedBoard = rotateRight(rotatedBoard); }
    if (direction === 'right') { rotations = 2; rotatedBoard = rotateRight(rotateRight(rotatedBoard)); }
    if (direction === 'down') { rotations = 3; rotatedBoard = rotateRight(rotateRight(rotateRight(rotatedBoard))); }

    let moved = false;
    for (let r = 0; r < SIZE; r++) {
      let row = rotatedBoard[r].filter(val => val);
      let newRow = [];
      for (let i = 0; i < row.length; i++) {
        if (i + 1 < row.length && row[i] === row[i + 1]) {
          newRow.push(row[i] * 2);
          if (row[i] * 2 === 2048) setWin(true);
          i++;
        } else {
          newRow.push(row[i]);
        }
      }
      if (newRow.length !== rotatedBoard[r].length) moved = true;
      while (newRow.length < SIZE) newRow.push(0);
      rotatedBoard[r] = newRow;
    }
    
    for (let i = 0; i < rotations; i++) {
        rotatedBoard = rotateRight(rotateRight(rotateRight(rotatedBoard))); // Rotate left
    }
    
    if (moved) {
        addRandomTile(rotatedBoard);
        setBoard(rotatedBoard);
        checkGameOver(rotatedBoard);
    }
  };

  const checkGameOver = (currentBoard) => {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (currentBoard[r][c] === 0) return;
            if (r < SIZE - 1 && currentBoard[r][c] === currentBoard[r+1][c]) return;
            if (c < SIZE - 1 && currentBoard[r][c] === currentBoard[r][c+1]) return;
        }
    }
    setGameOver(true);
    updateStat('gamesPlayed', 1);
  };

  useEffect(() => {
    if (win) {
        updateStat('totalWins', 1);
        updateStat('differentGamesWon', '2048');
    }
  }, [win, updateStat]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') move('up');
      else if (e.key === 'ArrowDown') move('down');
      else if (e.key === 'ArrowLeft') move('left');
      else if (e.key === 'ArrowRight') move('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, gameOver]);
  
  const resetGame = () => {
      setBoard(getInitialBoard());
      setGameOver(false);
      setWin(false);
  };

  const tileColors = {
    2: 'bg-slate-200 text-slate-800', 4: 'bg-slate-300 text-slate-800',
    8: 'bg-orange-300 text-white', 16: 'bg-orange-400 text-white',
    32: 'bg-red-400 text-white', 64: 'bg-red-500 text-white',
    128: 'bg-yellow-300 text-slate-800', 256: 'bg-yellow-400 text-white',
    512: 'bg-yellow-500 text-white', 1024: 'bg-purple-400 text-white',
    2048: 'bg-purple-600 text-white',
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-slate-600 p-2 rounded-lg relative">
        {board.map((row, r) =>
          row.map((val, c) => (
            <div key={`${r}-${c}`} className={`absolute flex items-center justify-center font-bold text-2xl rounded-md transition-all duration-200`}
                style={{
                    width: '6rem', height: '6rem',
                    top: `${r * 6.5 + 0.5}rem`, left: `${c * 6.5 + 0.5}rem`
                }}>
                <div className={`w-full h-full flex items-center justify-center rounded-md ${val > 0 ? tileColors[val] : 'bg-slate-700'}`}>
                    {val > 0 && val}
                </div>
            </div>
          ))
        )}
        {(gameOver || win) && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg">
                <h2 className="text-3xl font-bold">{win ? 'Você Venceu!' : 'Fim de Jogo!'}</h2>
                <button onClick={resetGame} className="mt-4 px-4 py-2 bg-purple-600 rounded">Jogar Novamente</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Game2048;
