
import React, { useState, useEffect } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const ROWS = 10;
const COLS = 10;
const MINES = 15;

const Minesweeper = () => {
    const [board, setBoard] = useState(createInitialBoard());
    const [gameOver, setGameOver] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const { updateStat } = useAchievements();

    function createInitialBoard() {
        let board = Array.from({ length: ROWS }, () => 
            Array.from({ length: COLS }, () => ({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborCount: 0,
            }))
        );

        // Place mines
        let minesPlaced = 0;
        while (minesPlaced < MINES) {
            const r = Math.floor(Math.random() * ROWS);
            const c = Math.floor(Math.random() * COLS);
            if (!board[r][c].isMine) {
                board[r][c].isMine = true;
                minesPlaced++;
            }
        }

        // Calculate neighbors
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (board[r][c].isMine) continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) continue;
                        if (board[r + dr]?.[c + dc]?.isMine) count++;
                    }
                }
                board[r][c].neighborCount = count;
            }
        }
        return board;
    }
    
    useEffect(() => {
        if(gameOver || isWon) {
            updateStat('gamesPlayed', 1);
            if(isWon) {
                updateStat('totalWins', 1);
                updateStat('differentGamesWon', 'minesweeper');
            }
        }
    }, [gameOver, isWon, updateStat]);

    const revealCell = (r, c, currentBoard) => {
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS || currentBoard[r][c].isRevealed) return;
        currentBoard[r][c].isRevealed = true;
        if (currentBoard[r][c].neighborCount === 0 && !currentBoard[r][c].isMine) {
             for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    revealCell(r + dr, c + dc, currentBoard);
                }
            }
        }
    };
    
    const checkWinCondition = (currentBoard) => {
        const nonMineCells = ROWS * COLS - MINES;
        const revealedCount = currentBoard.flat().filter(cell => cell.isRevealed && !cell.isMine).length;
        if (revealedCount === nonMineCells) {
            setIsWon(true);
            setGameOver(true);
        }
    }

    const handleCellClick = (r, c) => {
        if (gameOver) return;
        let newBoard = board.map(row => row.map(cell => ({...cell})));
        if (newBoard[r][c].isMine) {
            setGameOver(true);
            // Reveal all mines
            newBoard.forEach(row => row.forEach(cell => { if (cell.isMine) cell.isRevealed = true; }));
        } else {
            revealCell(r, c, newBoard);
            checkWinCondition(newBoard);
        }
        setBoard(newBoard);
    };

    const handleRightClick = (e, r, c) => {
        e.preventDefault();
        if (gameOver || board[r][c].isRevealed) return;
        const newBoard = board.map(row => [...row]);
        newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
        setBoard(newBoard);
    }
    
    const resetGame = () => {
        setBoard(createInitialBoard());
        setGameOver(false);
        setIsWon(false);
    }

    return (
        <div className="flex flex-col items-center">
            <div className="grid" style={{gridTemplateColumns: `repeat(${COLS}, 2rem)`}}>
                {board.map((row, r) => row.map((cell, c) => (
                    <div key={`${r}-${c}`} onClick={() => handleCellClick(r,c)} onContextMenu={(e) => handleRightClick(e, r,c)}
                        className={`w-8 h-8 border border-slate-600 flex items-center justify-center font-bold text-sm
                            ${!cell.isRevealed ? 'bg-slate-700 cursor-pointer hover:bg-slate-600' : (cell.isMine ? 'bg-red-500' : 'bg-slate-800')}
                        `}
                    >
                       {cell.isRevealed ? (cell.isMine ? '💣' : (cell.neighborCount > 0 && cell.neighborCount)) : (cell.isFlagged && '🚩')}
                    </div>
                )))}
            </div>
             {(gameOver) && (
                <div className="mt-4 text-center">
                    <h2 className="text-2xl font-bold">{isWon ? "Você Venceu!" : "Fim de Jogo!"}</h2>
                    <button onClick={resetGame} className="mt-2 px-4 py-2 bg-purple-600 rounded">Jogar Novamente</button>
                </div>
            )}
        </div>
    );
};

export default Minesweeper;
