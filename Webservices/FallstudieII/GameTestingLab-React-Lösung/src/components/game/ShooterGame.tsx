import React, { useEffect, useRef, useState } from 'react';

interface GameObject {
  x: number;
  y: number;
  rotation: number;
  velocity: { x: number; y: number };
  size: number;
}

const ShooterGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState<GameObject>({
    x: 400,
    y: 300,
    rotation: 0,
    velocity: { x: 0, y: 0 },
    size: 20,
  });
  const [bullets, setBullets] = useState<GameObject[]>([]);
  const [asteroids, setAsteroids] = useState<GameObject[]>([]);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  const gameLoopRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    // Initialize asteroids
    const initialAsteroids = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      rotation: Math.random() * Math.PI * 2,
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
      size: 30,
    }));
    setAsteroids(initialAsteroids);

    // Handle keyboard input
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key]: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys((prev) => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateGame = (deltaTime: number) => {
      // Update player position
      if (keys['ArrowLeft']) {
        setPlayer((prev) => ({
          ...prev,
          rotation: prev.rotation - 0.1,
        }));
      }
      if (keys['ArrowRight']) {
        setPlayer((prev) => ({
          ...prev,
          rotation: prev.rotation + 0.1,
        }));
      }
      if (keys['ArrowUp']) {
        setPlayer((prev) => ({
          ...prev,
          velocity: {
            x: prev.velocity.x + Math.cos(prev.rotation) * 0.2,
            y: prev.velocity.y + Math.sin(prev.rotation) * 0.2,
          },
        }));
      }
      if (keys[' ']) {
        // Shoot bullet
        setBullets((prev) => [
          ...prev,
          {
            x: player.x,
            y: player.y,
            rotation: player.rotation,
            velocity: {
              x: Math.cos(player.rotation) * 5,
              y: Math.sin(player.rotation) * 5,
            },
            size: 5,
          },
        ]);
      }

      // Update player position
      setPlayer((prev) => ({
        ...prev,
        x: (prev.x + prev.velocity.x + canvas.width) % canvas.width,
        y: (prev.y + prev.velocity.y + canvas.height) % canvas.height,
        velocity: {
          x: prev.velocity.x * 0.99,
          y: prev.velocity.y * 0.99,
        },
      }));

      // Update bullets
      setBullets((prev) =>
        prev
          .map((bullet) => ({
            ...bullet,
            x: bullet.x + bullet.velocity.x,
            y: bullet.y + bullet.velocity.y,
          }))
          .filter(
            (bullet) =>
              bullet.x >= 0 &&
              bullet.x <= canvas.width &&
              bullet.y >= 0 &&
              bullet.y <= canvas.height
          )
      );

      // Update asteroids
      setAsteroids((prev) =>
        prev.map((asteroid) => ({
          ...asteroid,
          x: (asteroid.x + asteroid.velocity.x + canvas.width) % canvas.width,
          y: (asteroid.y + asteroid.velocity.y + canvas.height) % canvas.height,
          rotation: asteroid.rotation + 0.01,
        }))
      );
    };

    const render = () => {
      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw player
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.rotation);
      ctx.beginPath();
      ctx.moveTo(player.size, 0);
      ctx.lineTo(-player.size / 2, player.size / 2);
      ctx.lineTo(-player.size / 2, -player.size / 2);
      ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.restore();

      // Draw bullets
      bullets.forEach((bullet) => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
      });

      // Draw asteroids
      asteroids.forEach((asteroid) => {
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        ctx.rotate(asteroid.rotation);
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          const radius = asteroid.size * (0.8 + Math.random() * 0.4);
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.restore();
      });
    };

    const gameLoop = (timestamp: number) => {
      if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
      const deltaTime = timestamp - lastUpdateRef.current;
      lastUpdateRef.current = timestamp;

      updateGame(deltaTime);
      render();

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [player, bullets, asteroids, keys]);

  return (
    <div className="flex justify-center items-center h-full">
      <canvas
        ref={canvasRef}
        className="border border-white"
        style={{ width: '800px', height: '600px' }}
      />
    </div>
  );
};

export default ShooterGame; 