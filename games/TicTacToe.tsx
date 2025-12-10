
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

type Player = 'X' | 'O' | null;

const Square: React.FC<{ value: Player; onClick: () => void }> = ({ value, onClick }) => (
  <button
    className={`w-20 h-20 sm:w-24 sm:h-24 m-1 bg-slate-700 rounded-lg flex items-center justify-center text-4xl sm:text-5xl font-bold transition-colors duration-200
      ${value === 'X' ? 'text-pink-400' : 'text-purple-400'}
      hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500`}
    onClick={onClick}
    aria-label={`Square ${value ? `with ${value}` : 'empty'}`}
  >
    {value}
  </button>
);

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const { updateStat } = useAchievements();
  
  const winner = calculateWinner(board);

  useEffect(() => {
    if (winner && !isGameOver) {
      updateStat('totalWins', 1);
      updateStat('ticTacToeWins', 1);
      updateStat('gamesPlayed', 1);
      updateStat('differentGamesWon', 'tic-tac-toe');
      setIsGameOver(true);
    } else if (board.every(Boolean) && !isGameOver) {
      updateStat('gamesPlayed', 1);
      setIsGameOver(true);
    }
  }, [winner, board, isGameOver, updateStat]);

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setIsGameOver(false);
  };

  const getStatus = () => {
    if (winner) {
      return `Vencedor: ${winner}`;
    }
    if (board.every(Boolean)) {
      return 'Empate!';
    }
    return `Próximo Jogador: ${xIsNext ? 'X' : 'O'}`;
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-semibold mb-4 text-slate-300 h-8">{getStatus()}</p>
      <div className="grid grid-cols-3">
        {board.map((_, i) => (
          <Square key={i} value={board[i]} onClick={() => handleClick(i)} />
        ))}
      </div>
      <button
        onClick={resetGame}
        className="mt-6 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg transition-transform duration-200 hover:scale-105"
      >
        Reiniciar Jogo
      </button>
    </div>
  );
};

function calculateWinner(squares: Player[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default TicTacToe;
