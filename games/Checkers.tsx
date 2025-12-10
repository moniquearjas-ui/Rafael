
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

// 1: red piece, 2: black piece, 3: red king, 4: black king, 0: empty
const initialBoard = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
];

const Checkers = () => {
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState(1); // 1 for red, 2 for black
  const [selected, setSelected] = useState(null);
  const [winner, setWinner] = useState(null);
  const { updateStat } = useAchievements();
  
  useEffect(() => {
    if (winner) {
        updateStat('gamesPlayed', 1);
        if (winner === 1) { // Assuming player is always red
            updateStat('totalWins', 1);
            updateStat('differentGamesWon', 'checkers');
        }
    }
  }, [winner, updateStat]);

  const resetGame = () => {
      setBoard(initialBoard);
      setTurn(1);
      setSelected(null);
      setWinner(null);
  }

  const handleCellClick = (r, c) => {
    if (winner) return;
    if (selected) {
        // Try to move
        // This is a highly simplified move logic, no captures, no multi-jumps
        const [sr, sc] = selected;
        const piece = board[sr][sc];
        const isKing = piece > 2;
        const moveDir = piece === 1 || piece === 3 ? 1 : -1;

        if (board[r][c] === 0) { // Can only move to empty squares
            // Regular move
            if ((r === sr + moveDir || (isKing && r === sr - moveDir)) && (c === sc - 1 || c === sc + 1)) {
                 movePiece(sr, sc, r, c);
            }
            // Jump move
            else if ((r === sr + 2 * moveDir || (isKing && r === sr - 2 * moveDir)) && (c === sc - 2 || c === sc + 2)) {
                const midR = sr + (r - sr) / 2;
                const midC = sc + (c - sc) / 2;
                const midPiece = board[midR][midC];
                const opponentPieces = (turn === 1) ? [2,4] : [1,3];
                if (opponentPieces.includes(midPiece)) {
                    const newBoard = board.map(row => [...row]);
                    newBoard[midR][midC] = 0; // Capture
                    setBoard(newBoard);
                    movePiece(sr, sc, r, c);
                }
            }
        }
        setSelected(null);
    } else {
        // Select a piece
        const piece = board[r][c];
        if ((turn === 1 && (piece === 1 || piece === 3)) || (turn === 2 && (piece === 2 || piece === 4))) {
            setSelected([r, c]);
        }
    }
  };

  const movePiece = (fromR, fromC, toR, toC) => {
      let piece = board[fromR][fromC];
      // Check for kinging
      if ((piece === 1 && toR === 7) || (piece === 2 && toR === 0)) {
          piece += 2; // Make king
      }
      
      const newBoard = board.map(row => [...row]);
      newBoard[toR][toC] = piece;
      newBoard[fromR][fromC] = 0;
      setBoard(newBoard);
      setTurn(turn === 1 ? 2 : 1);
      checkWinner(newBoard);
  };

  const checkWinner = (currentBoard) => {
      const redPieces = currentBoard.flat().filter(p => p === 1 || p === 3).length;
      const blackPieces = currentBoard.flat().filter(p => p === 2 || p === 4).length;
      if (redPieces === 0) setWinner(2);
      if (blackPieces === 0) setWinner(1);
      // More complex logic needed for no possible moves
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl mb-4">Vez do: {turn === 1 ? 'Vermelho' : 'Preto'}</h2>
      <div className="grid grid-cols-8 border-2 border-slate-600">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              className={`w-12 h-12 flex items-center justify-center cursor-pointer
                ${(r + c) % 2 === 0 ? 'bg-slate-400' : 'bg-slate-700'}
                ${selected && selected[0] === r && selected[1] === c ? 'border-4 border-yellow-400' : ''}
              `}
            >
              {cell !== 0 && (
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${cell === 1 || cell === 3 ? 'bg-red-600' : 'bg-black'}
                    ${cell > 2 ? 'border-2 border-yellow-400' : ''}
                  `}
                >
                  {cell > 2 ? 'K' : ''}
                </div>
              )}
            </div>
          ))
        )}
      </div>
       {winner && (
            <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold">Vencedor: {winner === 1 ? 'Vermelho' : 'Preto'}!</h2>
                <button onClick={resetGame} className="mt-2 px-4 py-2 bg-purple-600 rounded">Jogar Novamente</button>
            </div>
        )}
    </div>
  );
};

export default Checkers;
