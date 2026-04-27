/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Direction, Point, GameState } from '../types';
import { Trophy, RefreshCw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: 'RIGHT',
    score: 0,
    isGameOver: false,
    isPaused: true,
    highScore: Number(localStorage.getItem('snake-high-score')) || 0,
  });

  const directionRef = useRef<Direction>('RIGHT');
  const lastUpdateRef = useRef<number>(0);
  const requestRef = useRef<number>(0);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      snake: [{ x: 10, y: 10 }],
      food: generateFood([{ x: 10, y: 10 }]),
      direction: 'RIGHT',
      score: 0,
      isGameOver: false,
      isPaused: false,
    }));
    directionRef.current = 'RIGHT';
  };

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused) return prev;

      const newHead = { ...prev.snake[0] };
      const currentDir = directionRef.current;

      switch (currentDir) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        const newHighScore = Math.max(prev.score, prev.highScore);
        localStorage.setItem('snake-high-score', newHighScore.toString());
        return { ...prev, isGameOver: true, highScore: newHighScore };
      }

      // Check self collision
      if (prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        const newHighScore = Math.max(prev.score, prev.highScore);
        localStorage.setItem('snake-high-score', newHighScore.toString());
        return { ...prev, isGameOver: true, highScore: newHighScore };
      }

      const newSnake = [newHead, ...prev.snake];
      let newScore = prev.score;
      let newFood = prev.food;

      // Check food collision
      if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
        newScore += 10;
        newFood = generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        direction: currentDir
      };
    });
  }, [generateFood]);

  const update = (time: number) => {
    const speed = Math.max(50, INITIAL_SPEED - Math.floor(gameState.score / 50) * SPEED_INCREMENT);
    
    if (time - lastUpdateRef.current > speed) {
      moveSnake();
      lastUpdateRef.current = time;
    }
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [moveSnake, gameState.score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current !== 'DOWN') directionRef.current = 'UP'; break;
        case 'ArrowDown': if (directionRef.current !== 'UP') directionRef.current = 'DOWN'; break;
        case 'ArrowLeft': if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT'; break;
        case 'ArrowRight': if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT'; break;
        case ' ': togglePause(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Snake
    gameState.snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = '#d946ef'; // Neon Pink/Fuchsia
      ctx.fillStyle = isHead ? '#d946ef' : '#86198f';
      
      // Rounded segments
      const x = segment.x * cellSize + 2;
      const y = segment.y * cellSize + 2;
      const size = cellSize - 4;
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 4);
      ctx.fill();
    });

    // Draw Food
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#06b6d4'; // Neon Cyan
    ctx.fillStyle = '#06b6d4';
    const fx = gameState.food.x * cellSize + cellSize / 2;
    const fy = gameState.food.y * cellSize + cellSize / 2;
    ctx.beginPath();
    ctx.arc(fx, fy, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [gameState]);

  useEffect(() => {
    const resizeCanvas = () => {
      if (containerRef.current && canvasRef.current) {
        const size = Math.min(containerRef.current.clientWidth, 600);
        canvasRef.current.width = size;
        canvasRef.current.height = size;
        draw();
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="flex flex-col items-center gap-6 w-full h-full max-w-2xl font-mono" id="snake-game-container">
      {/* Game Stats */}
      <div className="flex justify-between w-full px-6 py-3 bg-black border border-[#0ff]/40">
        <div className="flex flex-col items-start">
          <span className="text-[10px] uppercase opacity-40">Neural_Score</span>
          <span className="text-2xl font-black text-[#f0f] glitch-text" data-text={gameState.score.toString().padStart(6, '0')}>
            {gameState.score.toString().padStart(6, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end border-l border-[#0ff]/20 pl-8">
          <span className="text-[10px] uppercase opacity-40">Hi_Peak</span>
          <span className="text-2xl font-black text-[#0ff] glitch-text" data-text={gameState.highScore.toString().padStart(6, '0')}>
            {gameState.highScore.toString().padStart(6, '0')}
          </span>
        </div>
      </div>

      {/* Canvas Wrapper */}
      <div 
        ref={containerRef} 
        className="relative w-full aspect-square bg-black border border-[#0ff]/60 shadow-[0_0_20px_#0ff3] overflow-hidden"
      >
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Overlays */}
        <AnimatePresence>
          {gameState.isPaused && !gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-4 z-10"
            >
              <h2 className="text-4xl font-black uppercase text-[#0ff] glitch-text" data-text="SYSTEM_IDLE">SYSTEM_IDLE</h2>
              <button 
                onClick={togglePause}
                className="px-6 py-2 border border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-all font-bold uppercase text-xs"
              >
                &gt; INITIALIZE_STREAM
              </button>
              <p className="opacity-40 text-[9px] uppercase tracking-widest">Awaiting Neural Link [Space]</p>
            </motion.div>
          )}

          {gameState.isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-[#f0f]/10 backdrop-blur-md flex flex-col items-center justify-center gap-6 z-10 p-8"
            >
              <div className="text-center space-y-2">
                <h2 className="text-5xl font-black uppercase text-[#f0f] glitch-text" data-text="KRNL_PANIC">KRNL_PANIC</h2>
                <p className="text-[#f0f] text-[9px] font-bold uppercase tracking-widest bg-black px-2">Illegal Memory Access: Node_Collision</p>
              </div>

              <div className="flex flex-col items-center bg-black border border-[#f0f] p-4">
                <span className="opacity-40 text-[9px] uppercase">Final_Yield</span>
                <span className="text-4xl font-bold text-white">{gameState.score}</span>
              </div>

              <button 
                onClick={resetGame}
                className="px-8 py-3 bg-[#f0f] text-black font-black uppercase text-xs shadow-[0_0_15px_#f0f] hover:scale-105 active:scale-95 transition-all"
              >
                &gt; REBOOT_SESSION
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Legend */}
      <div className="flex gap-8 text-[9px] items-center opacity-30 uppercase tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 border border-[#0ff]/40">WASD</kbd>
          <span>DIR_VECT</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 border border-[#0ff]/40">SPC</kbd>
          <span>INT_SIG</span>
        </div>
      </div>
    </div>
  );
}
