"use client";

import { useEffect } from "react";
import { motion, useSpring } from "framer-motion";

export default function ColorfulBackground() {
  
  // Bolha Magnética que segue o mouse suavemente
  const mouseX = useSpring(-1000, { damping: 40, stiffness: 100, mass: 2 });
  const mouseY = useSpring(-1000, { damping: 40, stiffness: 100, mass: 2 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 300); // centralizar 600x600 bolha
      mouseY.set(e.clientY - 300);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[var(--background)] transition-colors duration-500 pointer-events-none">
      
      {/* Bolha dinâmica seguindo o mouse */}
      <motion.div 
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full mix-blend-screen opacity-40 blur-[100px]"
        style={{
          x: mouseX,
          y: mouseY,
          background: "radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(103,232,249,0.3) 50%, transparent 80%)"
        }}
      />

      {/* Bolhas Flutuantes Animadas no Fundo (Ambient) */}
      <motion.div 
        animate={{
          x: [0, 100, -100, 0],
          y: [0, 50, -50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-600/20 mix-blend-screen blur-[120px] opacity-30"
      />

      <motion.div 
        animate={{
          x: [0, -100, 100, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.5, 0.9, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-600/20 mix-blend-screen blur-[120px] opacity-30"
      />
    </div>
  );
}
