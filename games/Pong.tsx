
import React, { useRef, useEffect, useState } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const Pong: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scores, setScores] = useState({ player: 0, computer: 0 });
  const [gameOver, setGameOver] = useState(false);
  const { updateStat } = useAchievements();
  
  const gameData = useRef({
      ballX: 250, ballY: 200, ballSpeedX: 4, ballSpeedY: 4,
      playerY: 150, computerY: 150,
      paddleHeight: 100, paddleWidth: 10,
  }).current;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const W = 500, H = 400;

    const move = () => {
        if(gameOver) return;
        
        // AI movement
        if(gameData.computerY + gameData.paddleHeight/2 < gameData.ballY) gameData.computerY += 3;
        if(gameData.computerY + gameData.paddleHeight/2 > gameData.ballY) gameData.computerY -= 3;

        gameData.ballX += gameData.ballSpeedX;
        gameData.ballY += gameData.ballSpeedY;

        if (gameData.ballY < 0 || gameData.ballY > H) gameData.ballSpeedY *= -1;

        if (gameData.ballX < 0) {
            if (gameData.ballY > gameData.playerY && gameData.ballY < gameData.playerY + gameData.paddleHeight) {
                gameData.ballSpeedX *= -1;
            } else {
                setScores(s => ({...s, computer: s.computer + 1}));
                resetBall();
            }
        }
        if (gameData.ballX > W) {
            if (gameData.ballY > gameData.computerY && gameData.ballY < gameData.computerY + gameData.paddleHeight) {
                gameData.ballSpeedX *= -1;
            } else {
                setScores(s => ({...s, player: s.player + 1}));
                resetBall();
            }
        }
    };
    
    const resetBall = () => {
        gameData.ballX = W/2;
        gameData.ballY = H/2;
        gameData.ballSpeedX *= -1;
    }

    const draw = () => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, W, H);
      
      // Player paddle
      ctx.fillStyle = '#db2777';
      ctx.fillRect(0, gameData.playerY, gameData.paddleWidth, gameData.paddleHeight);
      
      // Computer paddle
      ctx.fillStyle = '#9333ea';
      ctx.fillRect(W - gameData.paddleWidth, gameData.computerY, gameData.paddleWidth, gameData.paddleHeight);

      // Ball
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(gameData.ballX, gameData.ballY, 8, 0, Math.PI * 2);
      ctx.fill();
    };

    const handleMouseMove = (e) => {
        const rect = canvas.getBoundingClientRect();
        gameData.playerY = e.clientY - rect.top - gameData.paddleHeight / 2;
    }
    canvas.addEventListener('mousemove', handleMouseMove);

    const gameInterval = setInterval(() => {
        move();
        draw();
    }, 1000/60);

    return () => {
        clearInterval(gameInterval);
        canvas.removeEventListener('mousemove', handleMouseMove);
    }
  }, [gameOver, gameData]);
  
  useEffect(() => {
      if(scores.player >= 5 || scores.computer >= 5) {
          setGameOver(true);
          updateStat('gamesPlayed', 1);
          if (scores.player >= 5) {
              updateStat('totalWins', 1);
              updateStat('differentGamesWon', 'pong');
          }
      }
  }, [scores, updateStat]);

  const resetGame = () => {
      setScores({player: 0, computer: 0});
      setGameOver(false);
      resetBall();
  };

  const resetBall = () => {
        gameData.ballX = 250;
        gameData.ballY = 200;
        gameData.ballSpeedX *= Math.random() > 0.5 ? 1 : -1;
  }

  return (
    <div className="flex flex-col items-center">
        <div className="text-2xl mb-2">{scores.player} - {scores.computer}</div>
        <canvas ref={canvasRef} width="500" height="400" className="bg-slate-800 rounded-lg"></canvas>
        {gameOver && (
            <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold">{scores.player >= 5 ? 'Você Venceu!' : 'Computador Venceu!'}</h2>
                <button onClick={resetGame} className="mt-2 px-4 py-2 bg-pink-600 rounded">Jogar Novamente</button>
            </div>
        )}
    </div>
  );
};

export default Pong;
