
import React, { useRef, useEffect, useState } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const DoodleClone: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { updateStat } = useAchievements();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let W = 500, H = 600;
    canvas.width = W;
    canvas.height = H;

    let player = { x: W / 2 - 25, y: H - 50, w: 50, h: 50, vy: 0, isJumping: false };
    let platforms = [];
    let platformCount = 7;
    let gravity = 0.5;
    let leftPressed = false, rightPressed = false;
    let localScore = 0;

    for (let i = 0; i < platformCount; i++) {
        platforms.push({ x: Math.random() * (W - 80), y: i * 85, w: 80, h: 15 });
    }
    platforms[platformCount-1].x = player.x - 15;
    platforms[platformCount-1].y = player.y + player.h;

    const keyDown = (e) => {
        if(e.key === 'ArrowRight') rightPressed = true;
        if(e.key === 'ArrowLeft') leftPressed = true;
    }
    const keyUp = (e) => {
        if(e.key === 'ArrowRight') rightPressed = false;
        if(e.key === 'ArrowLeft') rightPressed = false;
    }
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    function gameLoop() {
      if (gameOver) return;
      
      ctx.clearRect(0, 0, W, H);

      // Player
      if(rightPressed) player.x += 5;
      if(leftPressed) player.x -= 5;
      if(player.x > W) player.x = -player.w;
      if(player.x < -player.w) player.x = W;
      
      player.vy += gravity;
      player.y += player.vy;

      if (player.y > H) {
        setGameOver(true);
        updateStat('gamesPlayed', 1);
        if(localScore > 0) {
            updateStat('totalWins', 1);
            updateStat('differentGamesWon', 'doodle-clone');
        }
        return;
      }
      
      if (player.vy > 0) {
          platforms.forEach(p => {
              if (player.x < p.x + p.w && player.x + player.w > p.x &&
                  player.y + player.h > p.y && player.y + player.h < p.y + p.h) {
                  player.vy = -12;
              }
          });
      }

      if (player.y < H / 2) {
        player.y = H/2;
        platforms.forEach(p => {
            p.y -= player.vy;
            if(p.y > H) {
                p.y = 0;
                p.x = Math.random() * (W - 80);
                localScore += 10;
                setScore(s => s + 10);
            }
        });
      }
      
      ctx.fillStyle = '#db2777';
      ctx.fillRect(player.x, player.y, player.w, player.h);
      
      // Platforms
      ctx.fillStyle = '#16a34a';
      platforms.forEach(p => {
          ctx.fillRect(p.x, p.y, p.w, p.h);
      });

      requestAnimationFrame(gameLoop);
    }
    
    gameLoop();
    
    return () => {
        document.removeEventListener('keydown', keyDown);
        document.removeEventListener('keyup', keyUp);
    }

  }, [gameOver, updateStat]);

    const resetGame = () => {
        setScore(0);
        setGameOver(false);
    }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-xl">Pontos: {score}</div>
      <div className="relative">
        <canvas ref={canvasRef} className="bg-slate-700 rounded-lg"></canvas>
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

export default DoodleClone;
