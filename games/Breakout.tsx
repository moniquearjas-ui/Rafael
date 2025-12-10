
import React, { useRef, useEffect, useState } from 'react';
import { useAchievements } from '../context/AchievementsContext';

const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const BALL_RADIUS = 8;
const BRICK_ROW_COUNT = 5;
const BRICK_COLUMN_COUNT = 8;
const BRICK_WIDTH = 55;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 30;

const Breakout: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const { updateStat } = useAchievements();

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let paddleX = (canvas.width - PADDLE_WIDTH) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height - 30;
    let dx = 3;
    let dy = -3;
    let rightPressed = false;
    let leftPressed = false;

    let bricks = [];
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      bricks[c] = [];
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const keyDownHandler = (e) => {
      if (e.key == "Right" || e.key == "ArrowRight") rightPressed = true;
      else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = true;
    };
    const keyUpHandler = (e) => {
      if (e.key == "Right" || e.key == "ArrowRight") rightPressed = false;
      else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = false;
    };
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    const collisionDetection = () => {
        for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
            for (let r = 0; r < BRICK_ROW_COUNT; r++) {
                let b = bricks[c][r];
                if (b.status == 1) {
                    if (ballX > b.x && ballX < b.x + BRICK_WIDTH && ballY > b.y && ballY < b.y + BRICK_HEIGHT) {
                        dy = -dy;
                        b.status = 0;
                        if (bricks.flat().every(brick => brick.status === 0)) {
                           setGameWon(true);
                           setGameOver(true);
                           updateStat('totalWins', 1);
                           updateStat('differentGamesWon', 'breakout');
                           updateStat('gamesPlayed', 1);
                        }
                    }
                }
            }
        }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Bricks
      for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
        for (let r = 0; r < BRICK_ROW_COUNT; r++) {
          if(bricks[c][r].status == 1) {
            let brickX = (c * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
            let brickY = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
            ctx.fillStyle = "#9333ea";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
      // Ball
      ctx.beginPath();
      ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "#db2777";
      ctx.fill();
      ctx.closePath();
      // Paddle
      ctx.beginPath();
      ctx.rect(paddleX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillStyle = "#16a34a";
      ctx.fill();
      ctx.closePath();

      collisionDetection();

      if (ballX + dx > canvas.width - BALL_RADIUS || ballX + dx < BALL_RADIUS) dx = -dx;
      if (ballY + dy < BALL_RADIUS) dy = -dy;
      else if (ballY + dy > canvas.height - BALL_RADIUS) {
        if (ballX > paddleX && ballX < paddleX + PADDLE_WIDTH) {
          dy = -dy;
        } else {
            setGameOver(true);
            updateStat('gamesPlayed', 1);
        }
      }

      if (rightPressed && paddleX < canvas.width - PADDLE_WIDTH) paddleX += 7;
      else if (leftPressed && paddleX > 0) paddleX -= 7;

      ballX += dx;
      ballY += dy;
      if(!gameOver) requestAnimationFrame(draw);
    };

    draw();

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, [gameOver, updateStat]);

  const resetGame = () => {
    setGameOver(false);
    setGameWon(false);
  }

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} width="500" height="400" className="bg-slate-700 rounded-lg"></canvas>
      {gameOver && (
        <div className="mt-4">
            <h2 className="text-2xl font-bold text-center mb-2">{gameWon ? 'Você Venceu!' : 'Fim de Jogo!'}</h2>
          <button onClick={resetGame} className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-lg">
            Jogar Novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default Breakout;
