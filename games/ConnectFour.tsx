
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const ROWS = 6;
const COLS = 7;

const createEmptyBoard = () => Array.from({ length: ROWS }, () => Array(COLS).fill(0));

const ConnectFour = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [player, setPlayer] = useState(1);
  const [winner, setWinner] = useState(null);
  const { updateStat } = useAchievements();
  
  useEffect(() => {
    if (winner) {
        updateStat('gamesPlayed', 1);
        if (winner === 1) { // Assuming player is always 1
            updateStat('totalWins', 1);
            updateStat('differentGamesWon', 'connect-four');
        }
    }
  }, [winner, updateStat]);

  const checkWinner = (currentBoard) => {
    // Horizontal, Vertical, and Diagonal checks
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const p = currentBoard[r][c];
        if (p === 0) continue;
        if (c + 3 < COLS && p === currentBoard[r][c+1] && p === currentBoard[r][c+2] && p === currentBoard[r][c+3]) return p;
        if (r + 3 < ROWS) {
          if (p === currentBoard[r+1][c] && p === currentBoard[r+2][c] && p === currentBoard[r+3][c]) return p;
          if (c + 3 < COLS && p === currentBoard[r+1][c+1] && p === currentBoard[r+2][c+2] && p === currentBoard[r+3][c+3]) return p;
          if (c - 3 >= 0 && p === currentBoard[r+1][c-1] && p === currentBoard[r+2][c-2] && p === currentBoard[r+3][c-3]) return p;
        }
      }
    }
    return null;
  };
  
  const handleColumnClick = (c) => {
    if (winner || board[0][c] !== 0) return;
    const newBoard = board.map(row => [...row]);
    for (let r = ROWS - 1; r >= 0; r--) {
      if (newBoard[r][c] === 0) {
        newBoard[r][c] = player;
        break;
      }
    }
    setBoard(newBoard);
    const newWinner = checkWinner(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else {
      setPlayer(player === 1 ? 2 : 1);
      // Simple AI move
      if (player === 1) {
          setTimeout(aiMove, 500);
      }
    }
  };
  
  const aiMove = () => {
      let validCols = [];
      for(let i=0; i<COLS; i++) {
          if(board[0][i] === 0) validCols.push(i);
      }
      const randomCol = validCols[Math.floor(Math.random() * validCols.length)];
      
      const newBoard = board.map(row => [...row]);
      for (let r = ROWS - 1; r >= 0; r--) {
        if (newBoard[r][randomCol] === 0) {
          newBoard[r][randomCol] = 2; // AI is player 2
          break;
        }
      }
      setBoard(newBoard);
      const newWinner = checkWinner(newBoard);
      if (newWinner) setWinner(newWinner);
      else setPlayer(1);
  };
  
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setPlayer(1);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-7 gap-1 bg-blue-600 p-2 rounded-lg">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} onClick={() => handleColumnClick(c)} className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer">
              {cell !== 0 && (
                <div className={`w-10 h-10 rounded-full ${cell === 1 ? 'bg-red-500' : 'bg-yellow-400'}`}></div>
              )}
            </div>
          ))
        )}
      </div>
      {winner && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold">Vencedor: Jogador {winner}!</h2>
          <button onClick={resetGame} className="mt-2 px-4 py-2 bg-purple-600 rounded">Jogar Novamente</button>
        </div>
      )}
    </div>
  );
};

export default ConnectFour;
