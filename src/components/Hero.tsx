"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import TextReveal from "./TextReveal";
import Scene from "./Scene";
import FloatingTechCards from "./FloatingTechCards";
import LetterReveal from "./LetterReveal";

export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
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
        <motion.div variants={item} className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-accent)]/50 mb-8 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-cyan)] animate-pulse" />
          <span className="text-sm text-neutral-200 font-mono font-bold tracking-widest uppercase">Disponível para novos desafios</span>
        </motion.div>
        
        <motion.h1 variants={item} className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-none">
          Eduardo<br />
          Santos Bezerra<span className="text-[var(--color-accent)] animate-pulse">_</span>
        </motion.h1>
        
        <motion.h2 variants={item} className="text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-accent)] to-[var(--color-pink)] font-black mb-8 tracking-wide animate-gradient-x">
          <LetterReveal text="DESENVOLVEDOR FULL STACK" />
        </motion.h2>
        
        <div className="max-w-2xl mx-auto mb-12">
          <TextReveal 
            text="Construindo ecossistemas digitais de ponta a ponta com alta performance, design imersivo e arquiteturas escaláveis para impactar o seu negócio."
            className="text-lg md:text-xl text-neutral-300 leading-relaxed font-light justify-center"
          />
        </div>
        
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
          <a href="#projects" className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-pink)] text-white font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(232,121,249,0.4)] flex items-center gap-3">
            Explorar Projetos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
