
import React, { useState, useEffect, useCallback } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 25;

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1, 0], [0, 1, 1]], // Z
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1], [1, 1]],   // O
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
];

const COLORS = ['#9333ea', '#db2777', '#16a34a', '#ca8a04', '#2563eb', '#dc2626', '#ea580c'];

const createEmptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const BlockFall = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [piece, setPiece] = useState(getRandomPiece());
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { updateStat } = useAchievements();

  function getRandomPiece() {
    const rand = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[rand],
      color: COLORS[rand],
    };
  }
  
  const isValidMove = (newBoard, newPosition, newShape) => {
    for (let y = 0; y < newShape.length; y++) {
      for (let x = 0; x < newShape[y].length; x++) {
        if (newShape[y][x]) {
          const newX = newPosition.x + x;
          const newY = newPosition.y + y;
          if (newX < 0 || newX >= COLS || newY >= ROWS || (newBoard[newY] && newBoard[newY][newX])) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const drop = useCallback(() => {
    if (gameOver) return;
    const newPosition = { ...position, y: position.y + 1 };
    if (isValidMove(board, newPosition, piece.shape)) {
      setPosition(newPosition);
    } else {
      // Lock piece
      const newBoard = board.map(row => [...row]);
      piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            newBoard[position.y + y][position.x + x] = piece.color;
          }
        });
      });

      // Clear lines
      let linesCleared = 0;
      for (let y = newBoard.length - 1; y >= 0; y--) {
        if (newBoard[y].every(cell => cell !== 0)) {
          newBoard.splice(y, 1);
          newBoard.unshift(Array(COLS).fill(0));
          linesCleared++;
          y++;
        }
      }
      setScore(prev => prev + linesCleared * 100);

      const newPiece = getRandomPiece();
      if (!isValidMove(newBoard, { x: 3, y: 0 }, newPiece.shape)) {
        setGameOver(true);
        updateStat('gamesPlayed', 1);
        if(score > 0) updateStat('totalWins', 1);
        updateStat('differentGamesWon', 'block-fall');
      } else {
        setBoard(newBoard);
        setPiece(newPiece);
        setPosition({ x: 3, y: 0 });
      }
    }
  }, [board, gameOver, piece.shape, position, score, updateStat]);

  useEffect(() => {
    const gameInterval = setInterval(drop, 500);
    return () => clearInterval(gameInterval);
  }, [drop]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameOver) return;
    if (e.key === 'ArrowLeft') {
      const newPosition = { ...position, x: position.x - 1 };
      if (isValidMove(board, newPosition, piece.shape)) setPosition(newPosition);
    } else if (e.key === 'ArrowRight') {
      const newPosition = { ...position, x: position.x + 1 };
      if (isValidMove(board, newPosition, piece.shape)) setPosition(newPosition);
    } else if (e.key === 'ArrowDown') {
      drop();
    } else if (e.key === 'ArrowUp') {
      // Rotate
      const newShape = piece.shape[0].map((_, colIndex) => piece.shape.map(row => row[colIndex]).reverse());
      if(isValidMove(board, position, newShape)) setPiece(prev => ({...prev, shape: newShape}));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, piece, position, gameOver, drop]);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setPiece(getRandomPiece());
    setPosition({ x: 3, y: 0 });
    setScore(0);
    setGameOver(false);
  };
  
  const displayedBoard = board.map(row => [...row]);
  piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
          if (value) {
              const boardY = position.y + y;
              const boardX = position.x + x;
              if (boardY < ROWS && boardX < COLS) {
                  displayedBoard[boardY][boardX] = piece.color;
              }
          }
      });
  });

  return (
    <div className="flex flex-col items-center">
       <div className="mb-4 text-xl">Pontos: {score}</div>
       <div className="relative border-2 border-slate-600" style={{ width: COLS * BLOCK_SIZE, height: ROWS * BLOCK_SIZE }}>
        {displayedBoard.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className="absolute"
              style={{
                top: y * BLOCK_SIZE,
                left: x * BLOCK_SIZE,
                width: BLOCK_SIZE,
                height: BLOCK_SIZE,
                backgroundColor: cell || '#1e293b',
                border: cell ? '1px solid #0f172a' : 'none'
              }}
            />
          ))
        )}
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <h2 className="text-3xl font-bold">Fim de Jogo</h2>
            <button onClick={resetGame} className="mt-4 px-4 py-2 bg-purple-600 rounded">Jogar Novamente</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockFall;
