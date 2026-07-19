"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, type Variants } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import TextReveal from "./TextReveal";
import Scene from "./Scene";
import FloatingTechCards from "./FloatingTechCards";
import LetterReveal from "./LetterReveal";

export default function Hero() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const btnRef = useRef<HTMLAnchorElement>(null);
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const springX = useSpring(btnX, { damping: 15, stiffness: 150, mass: 0.5 });
  const springY = useSpring(btnY, { damping: 15, stiffness: 150, mass: 0.5 });

  const handleBtnMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    btnX.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    btnY.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  };

  const handleBtnMouseLeave = () => {
    btnX.set(0);
    btnY.set(0);
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Vídeo Background Full-Screen inspirado no Gustavo Campelo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover mix-blend-screen opacity-20"
        >
          <source src="https://cdn.pixabay.com/video/2021/08/18/85420-590059530_large.mp4" type="video/mp4" />
        </video>
        {/* Máscara escura para garantir leitura absoluta do texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0814]/40 via-[#0a0814]/70 to-[var(--background)]" />
      </div>

      {/* Objeto 3D em loop, estilo Thor, combinado com o vídeo de fundo */}
      <div className="absolute inset-0 z-[1] opacity-60 pointer-events-none">
        <Scene />
      </div>

      <FloatingTechCards />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center relative z-10 pt-20"
      >
        <motion.div variants={item} animate={{ y: [0, -4, 0] }} transition={{ y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } }} className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-accent)]/50 mb-8 -mt-20 md:-mt-32 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-cyan)] animate-pulse" />
          <span className="text-sm text-neutral-200 font-mono font-bold tracking-widest uppercase">Disponível para novos desafios</span>
        </motion.div>
        
        <motion.h1 variants={item} className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[0.95]">
          Eduardo<br />
          Santos Bezerra<span className="text-[var(--color-accent)] animate-pulse">_</span>
        </motion.h1>
        
        <motion.h2 variants={item} className="text-lg md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-accent)] to-[var(--color-pink)] font-bold mb-7 tracking-[0.16em] animate-gradient-x">
          <LetterReveal text="DESENVOLVEDOR FULL STACK" />
        </motion.h2>
        
        <div className="max-w-2xl mx-auto mb-12">
          <TextReveal 
            text="Construindo ecossistemas digitais de ponta a ponta com alta performance, design imersivo e arquiteturas escaláveis para impactar o seu negócio."
            className="text-lg md:text-xl text-neutral-300 leading-relaxed font-light justify-center"
          />
        </div>
        
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
          <motion.a
            ref={btnRef}
            href="#projects"
            onMouseMove={handleBtnMouseMove}
            onMouseLeave={handleBtnMouseLeave}
            style={{ x: springX, y: springY }}
            className="group relative px-7 py-4 rounded-xl bg-white text-[#0a0814] font-semibold hover:bg-neutral-100 transition-colors shadow-[0_12px_32px_rgba(255,255,255,0.16)] flex items-center gap-3"
          >
            Ver projetos selecionados
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <a href="#contact" className="group px-7 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors flex items-center gap-3">
            <MessageCircle className="w-4 h-4 text-[var(--color-cyan)]" />
            Falar sobre um projeto
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
