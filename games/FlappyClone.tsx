
import React, { useRef, useEffect, useState } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const FlappyClone: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { updateStat } = useAchievements();

  useEffect(() => {
    if (gameOver) return;
    
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let W = 500, H = 400;
    canvas.width = W;
    canvas.height = H;

    let bird = { x: 50, y: 150, width: 30, height: 30 };
    let gravity = 0.5;
    let velocity = 0;
    let lift = -10;
    let pipes = [];
    let pipeWidth = 40;
    let pipeGap = 120;
    let frameCount = 0;
    let localScore = 0;

    const flap = () => velocity = lift;
    document.addEventListener('keydown', (e) => {
        if(e.code === 'Space') flap();
    });
    canvas.addEventListener('click', flap);

    function gameLoop() {
      if (gameOver) return;

      ctx.clearRect(0, 0, W, H);
      
      // Bird
      velocity += gravity;
      bird.y += velocity;
      if (bird.y > H - bird.height || bird.y < 0) {
        setGameOver(true);
        updateStat('gamesPlayed', 1);
        if(localScore > 0) {
            updateStat('totalWins', 1);
            updateStat('differentGamesWon', 'flappy-clone');
        }
      }
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
      
      // Pipes
      if (frameCount % 100 === 0) {
        let pipeY = Math.random() * (H - pipeGap - 100) + 50;
        pipes.push({ x: W, y: 0, height: pipeY });
        pipes.push({ x: W, y: pipeY + pipeGap, height: H - pipeY - pipeGap });
      }

      ctx.fillStyle = '#16a34a';
      pipes.forEach(p => {
        p.x -= 2;
        ctx.fillRect(p.x, p.y, pipeWidth, p.height);

        // Collision
        if (bird.x < p.x + pipeWidth && bird.x + bird.width > p.x &&
            bird.y < p.y + p.height && bird.y + bird.height > p.y) {
            setGameOver(true);
            updateStat('gamesPlayed', 1);
            if(localScore > 0) {
                updateStat('totalWins', 1);
                updateStat('differentGamesWon', 'flappy-clone');
            }
        }
      });
      
      pipes = pipes.filter(p => p.x > -pipeWidth);
      
      // Score
      if(pipes.length > 0 && pipes[0].x === bird.x - pipeWidth) {
          localScore++;
          setScore(s => s + 1);
      }

      frameCount++;
      if (!gameOver) requestAnimationFrame(gameLoop);
    }
    
    gameLoop();

  }, [gameOver, updateStat]);

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
  }

  return (
    <div className="flex flex-col items-center">
        <div className="mb-2 text-xl">Pontos: {score}</div>
        <div className="relative">
            <canvas ref={canvasRef} className="bg-sky-400 rounded-lg"></canvas>
            {gameOver && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                    <h2 className="text-3xl font-bold">Fim de Jogo</h2>
                    <button onClick={resetGame} className="mt-4 px-4 py-2 bg-purple-600 rounded">Tentar Novamente</button>
                </div>
            )}
        </div>
    </div>
  );
};

export default FlappyClone;
