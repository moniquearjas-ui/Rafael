
import React, { useState, useEffect, useRef } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const GRID_SIZE = 20;
const TILE_SIZE = 20;

const Snake: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const { updateStat } = useAchievements();

    const gameData = useRef({
        snake: [{ x: 8, y: 12 }, { x: 7, y: 12 }, { x: 6, y: 12 }],
        food: { x: 5, y: 5 },
        direction: { x: 1, y: 0 },
        nextDirection: { x: 1, y: 0 },
    }).current;
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            const { direction, nextDirection } = gameData;
            if (e.key === 'ArrowUp' && direction.y === 0) nextDirection.y = -1; nextDirection.x = 0;
            if (e.key === 'ArrowDown' && direction.y === 0) { nextDirection.y = 1; nextDirection.x = 0; }
            if (e.key === 'ArrowLeft' && direction.x === 0) { nextDirection.x = -1; nextDirection.y = 0; }
            if (e.key === 'ArrowRight' && direction.x === 0) { nextDirection.x = 1; nextDirection.y = 0; }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameData]);

    useEffect(() => {
        if (gameOver) {
            updateStat('gamesPlayed', 1);
            if(score > 0) {
                updateStat('totalWins', 1);
                updateStat('differentGamesWon', 'snake');
            }
            return;
        };

        const gameLoop = () => {
            const { snake, food, nextDirection } = gameData;
            gameData.direction = { ...nextDirection };
            
            const head = { x: snake[0].x + gameData.direction.x, y: snake[0].y + gameData.direction.y };

            if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE || snake.some(s => s.x === head.x && s.y === head.y)) {
                setGameOver(true);
                return;
            }
            
            const newSnake = [head, ...snake];
            if (head.x === food.x && head.y === food.y) {
                setScore(s => s + 1);
                gameData.food = {
                    x: Math.floor(Math.random() * GRID_SIZE),
                    y: Math.floor(Math.random() * GRID_SIZE),
                };
            } else {
                newSnake.pop();
            }
            gameData.snake = newSnake;

            draw();
        };

        const draw = () => {
            const ctx = canvasRef.current.getContext('2d');
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 0, GRID_SIZE * TILE_SIZE, GRID_SIZE * TILE_SIZE);
            
            ctx.fillStyle = 'lime';
            gameData.snake.forEach(s => ctx.fillRect(s.x * TILE_SIZE, s.y * TILE_SIZE, TILE_SIZE, TILE_SIZE));

            ctx.fillStyle = 'red';
            ctx.fillRect(gameData.food.x * TILE_SIZE, gameData.food.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        };
        
        const interval = setInterval(gameLoop, 150);
        return () => clearInterval(interval);

    }, [gameOver, score, updateStat, gameData]);
    
    const resetGame = () => {
        gameData.snake = [{ x: 8, y: 12 }, { x: 7, y: 12 }, { x: 6, y: 12 }];
        gameData.food = { x: 5, y: 5 };
        gameData.direction = { x: 1, y: 0 };
        gameData.nextDirection = { x: 1, y: 0 };
        setScore(0);
        setGameOver(false);
    }

    return (
        <div className="flex flex-col items-center">
            <div className="text-xl mb-4">Pontos: {score}</div>
            <div className="relative">
                <canvas ref={canvasRef} width={GRID_SIZE * TILE_SIZE} height={GRID_SIZE * TILE_SIZE} className="bg-slate-800 rounded-lg"/>
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

export default Snake;
