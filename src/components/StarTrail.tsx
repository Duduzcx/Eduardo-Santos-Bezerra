"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const MAX_PARTICLES = 60;

class Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = (Math.random() - 0.5) * 0.8;
    this.maxLife = Math.random() * 40 + 40;
    this.life = this.maxLife;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
    this.size *= 0.95;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.life / this.maxLife})`;
    ctx.fill();
  }
}

function subscribe(callback: () => void) {
  const mql = window.matchMedia("(pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}
function getServerSnapshot() {
  return false;
}

export default function StarTrail() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particlesArray: Particle[] = [];
    let animationFrameId: number;
    let running = false;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesArray.length - 1; i >= 0; i--) {
        particlesArray[i].update();
        particlesArray[i].draw(ctx);
        if (particlesArray[i].life <= 0 || particlesArray[i].size <= 0.1) {
          particlesArray.splice(i, 1);
        }
      }

      // Só continua o loop enquanto houver partículas vivas — parado o rAF some o custo em idle
      if (particlesArray.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        running = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (particlesArray.length < MAX_PARTICLES) {
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        particlesArray.push(new Particle(e.clientX + offsetX, e.clientY + offsetY));
      }
      if (!running) {
        running = true;
        animate();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9998]" />;
}
