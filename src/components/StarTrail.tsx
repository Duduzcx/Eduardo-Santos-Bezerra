"use client";

import { useEffect, useRef } from "react";

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
    // Tamanho aleatório entre 0.5 e 2.5 pixels (poeira estelar)
    this.size = Math.random() * 2 + 0.5;
    // Velocidade de dispersão ultra-leve para todos os lados
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = (Math.random() - 0.5) * 0.8;
    // Duração do rastro
    this.maxLife = Math.random() * 40 + 40;
    this.life = this.maxLife;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 1;
    this.size *= 0.95; // A partícula encolhe suavemente
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Para dar o brilho (Glow) da estrela
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
    
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.life / this.maxLife})`;
    ctx.fill();
    
    // Reset da sombra para não sobrecarregar
    ctx.shadowBlur = 0;
  }
}

export default function StarTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particlesArray: Particle[] = [];
    let animationFrameId: number;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const handleMouseMove = (e: MouseEvent) => {
      // Ao mover o mouse, criamos de 1 a 3 partículas nesse exato pixel
      const particleCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < particleCount; i++) {
        // Offset aleatório para não saírem exatamente do mesmo centro do cursor
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        particlesArray.push(new Particle(e.clientX + offsetX, e.clientY + offsetY));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      // Clear da tela a cada frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw(ctx);
        
        // Remove a partícula se sua vida ou tamanho chegar perto de 0
        if (particlesArray[i].life <= 0 || particlesArray[i].size <= 0.1) {
          particlesArray.splice(i, 1);
          i--;
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      // Z-index muito alto para ficar por cima de quase tudo,
      // mas `pointer-events-none` garante que não bloqueie cliques.
      className="fixed inset-0 pointer-events-none z-[9998]" 
    />
  );
}
