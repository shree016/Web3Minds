import { Layout } from "@/components/layout";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showInstruction, setShowInstruction] = useState(true);

  useEffect(() => {
    console.error("404 Error: Attempted route:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const groundY = 180;
    const gravity = 0.3;
    const obstacleHeight = 20; // 🔻 Smaller obstacle

    let character = {
      x: 50,
      y: groundY - 30,
      width: 30,
      height: 30,
      dy: 0,
      jumpPower: -8,
      onGround: true,
    };

    let obstacles: { x: number; width: number }[] = [];
    let speed = 2;
    let spawnTimer = 0;
    let scoreCounter = 0;
    let isGameRunning = !gameOver;

    const handleJump = () => {
      if (character.onGround) {
        character.dy = character.jumpPower;
        character.onGround = false;
      }
    };

    const restartGame = () => {
      character.y = groundY - 30;
      character.dy = 0;
      character.onGround = true;
      obstacles = [];
      spawnTimer = 0;
      scoreCounter = 0;
      setScore(0);
      setGameOver(false);
      setShowInstruction(true);
      isGameRunning = true;
      animationFrameId.current = requestAnimationFrame(update);
    };

    const keyListener = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameOver) {
          restartGame();
        } else {
          handleJump();
          setShowInstruction(false);
        }
      }
    };

    document.addEventListener("keydown", keyListener);

    const update = () => {
      if (!isGameRunning) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = "#333";
      ctx.fillRect(0, groundY, canvas.width, 5);

      // Gravity
      character.dy += gravity;
      character.y += character.dy;

      if (character.y + character.height >= groundY) {
        character.y = groundY - character.height;
        character.dy = 0;
        character.onGround = true;
      }

      // Draw character
      ctx.fillStyle = "#60a5fa";
      ctx.fillRect(character.x, character.y, character.width, character.height);

      // Obstacles
      spawnTimer++;
      if (spawnTimer > 120) {
        obstacles.push({ x: canvas.width, width: 30 + Math.random() * 30 });
        spawnTimer = 0;
      }

      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= speed;
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(obs.x, groundY - obstacleHeight, obs.width, obstacleHeight); // 🔻 Smaller

        // Collision detection
        if (
          character.x < obs.x + obs.width &&
          character.x + character.width > obs.x &&
          character.y + character.height > groundY - obstacleHeight
        ) {
          isGameRunning = false;
          cancelAnimationFrame(animationFrameId.current!);
          setGameOver(true);
          return;
        }

        if (obs.x + obs.width < 0) {
          obstacles.splice(i, 1);
          scoreCounter++;
          setScore(scoreCounter);
        }
      }

      // Score + instructions
      ctx.fillStyle = "white";
      ctx.font = "16px monospace";
      ctx.fillText(`Score: ${scoreCounter}`, 20, 30);

      if (showInstruction) {
        ctx.fillText("Press SPACE to jump", canvas.width / 2 - 80, 60);
      }

      animationFrameId.current = requestAnimationFrame(update);
    };

    if (!gameOver) {
      animationFrameId.current = requestAnimationFrame(update);
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current!);
      document.removeEventListener("keydown", keyListener);
    };
  }, [gameOver]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <h1 className="text-4xl font-bold mb-2">Oops! Page Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          But hey, you can play a mini game while you're here!
        </p>
        <div className="w-full max-w-[600px] overflow-hidden">
  <div className="relative w-full" style={{ aspectRatio: "3 / 1" }}>
    <canvas
      ref={canvasRef}
      width={600}
      height={200}
      className="absolute top-0 left-0 w-full h-full border-2 border-white rounded-lg bg-black"
    />
  </div>
</div>


{!gameOver && (
  <button
    onClick={() => {
      const event = new KeyboardEvent("keydown", { code: "Space" });
      document.dispatchEvent(event);
    }}
    className="md:hidden mt-4 px-6 py-2 rounded-full bg-blue-500 text-white font-semibold shadow-lg hover:bg-blue-600 active:scale-95 transition"
  >
    Jump
  </button>
)}

{gameOver && (
  <div className="mt-6 space-y-4">
    <h2 className="text-xl font-semibold text-red-500">
      Game Over! Final Score: {score}
    </h2>
    <p className="text-white">Press <b>SPACE</b> or tap <b>Jump</b> to play again.</p>
    <Button onClick={() => window.location.reload()}>Play Again</Button>
    <Button variant="link" asChild>
      <Link to="/">Return to Home</Link>
    </Button>
  </div>
)}

      </div>
    </Layout>
  );
};

export default NotFound;