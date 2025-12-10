
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

// 2=invalid, 1=peg, 0=empty
const initialBoard = [
    [2,2,1,1,1,2,2],
    [2,2,1,1,1,2,2],
    [1,1,1,1,1,1,1],
    [1,1,1,0,1,1,1],
    [1,1,1,1,1,1,1],
    [2,2,1,1,1,2,2],
    [2,2,1,1,1,2,2],
];

const PegSolitaire = () => {
    const [board, setBoard] = useState(initialBoard);
    const [selected, setSelected] = useState(null);
    const [pegsLeft, setPegsLeft] = useState(32);
    const { updateStat } = useAchievements();

    const isWon = pegsLeft === 1;

    useEffect(() => {
        if(isWon) {
            updateStat('totalWins', 1);
            updateStat('gamesPlayed', 1);
            updateStat('differentGamesWon', 'peg-solitaire');
        }
    }, [isWon, updateStat]);

    const handleClick = (r, c) => {
        if (isWon) return;
        if (selected) {
            const [sr, sc] = selected;
            // Check if valid move
            const dr = r - sr;
            const dc = c - sc;
            if (board[r][c] === 0 && (Math.abs(dr) === 2 && dc === 0) || (Math.abs(dc) === 2 && dr === 0)) {
                const midR = sr + dr / 2;
                const midC = sc + dc / 2;
                if (board[midR][midC] === 1) {
                    const newBoard = board.map(row => [...row]);
                    newBoard[sr][sc] = 0;
                    newBoard[midR][midC] = 0;
                    newBoard[r][c] = 1;
                    setBoard(newBoard);
                    setPegsLeft(p => p - 1);
                }
            }
            setSelected(null);
        } else {
            if (board[r][c] === 1) {
                setSelected([r, c]);
            }
        }
    };
    
    const resetGame = () => {
        setBoard(initialBoard);
        setSelected(null);
        setPegsLeft(32);
    }

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-xl mb-4">Peças Restantes: {pegsLeft}</h2>
            <div className="grid grid-cols-7 gap-1">
                {board.map((row, r) => row.map((cell, c) => {
                    if (cell === 2) return <div key={`${r}-${c}`} className="w-10 h-10" />;
                    return (
                        <div key={`${r}-${c}`} onClick={() => handleClick(r, c)}
                            className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer
                                ${cell === 1 ? 'bg-purple-500' : 'bg-slate-700'}
                                ${selected && selected[0] === r && selected[1] === c ? 'border-2 border-yellow-300' : ''}
                            `}
                        />
                    )
                }))}
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

export default PegSolitaire;
