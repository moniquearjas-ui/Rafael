
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

// Simple pre-defined puzzle
const puzzle = [
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9]
];

const solution = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
];

const Sudoku = () => {
    const [board, setBoard] = useState(JSON.parse(JSON.stringify(puzzle)));
    const [selectedCell, setSelectedCell] = useState(null);
    const [isWon, setIsWon] = useState(false);
    const { updateStat } = useAchievements();

    const checkSolution = () => {
        if (JSON.stringify(board) === JSON.stringify(solution)) {
            setIsWon(true);
            updateStat('totalWins', 1);
            updateStat('gamesPlayed', 1);
            updateStat('differentGamesWon', 'sudoku');
        } else {
            alert("Solução incorreta, tente novamente!");
        }
    };
    
    const handleCellChange = (e, r, c) => {
        const val = parseInt(e.target.value) || 0;
        if (val >= 0 && val <= 9) {
            const newBoard = board.map(row => [...row]);
            newBoard[r][c] = val;
            setBoard(newBoard);
        }
    }
    
    const resetGame = () => {
        setBoard(JSON.parse(JSON.stringify(puzzle)));
        setIsWon(false);
        setSelectedCell(null);
    }
    
    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-9">
                {board.map((row, r) => row.map((cell, c) => (
                    <input key={`${r}-${c}`} type="number" min="1" max="9" value={cell === 0 ? '' : cell}
                        onChange={(e) => handleCellChange(e, r, c)}
                        readOnly={puzzle[r][c] !== 0}
                        className={`w-10 h-10 text-center text-xl font-semibold border border-slate-600 bg-slate-800
                            ${puzzle[r][c] !== 0 ? 'text-slate-400' : 'text-white'}
                            ${(c % 3 === 2 && c < 8) ? 'border-r-2 border-slate-400' : ''}
                            ${(r % 3 === 2 && r < 8) ? 'border-b-2 border-slate-400' : ''}
                        `}
                    />
                )))}
            </div>
            {isWon ? (
                <div className="mt-4 text-center">
                    <h2 className="text-2xl font-bold text-green-400">Resolvido!</h2>
                    <button onClick={resetGame} className="mt-2 px-4 py-2 bg-purple-600 rounded">Jogar Novamente</button>
                </div>
            ) : (
                 <button onClick={checkSolution} className="mt-4 px-4 py-2 bg-pink-600 rounded">Verificar Solução</button>
            )}
        </div>
    );
};

export default Sudoku;
