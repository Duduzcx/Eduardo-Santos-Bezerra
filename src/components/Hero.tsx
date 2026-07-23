"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useScroll, type Variants } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import TextReveal from "./TextReveal";
import FloatingTechCards from "./FloatingTechCards";
import LetterReveal from "./LetterReveal";
import Starfield from "./Starfield";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

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

  const sceneX = useMotionValue(0);
  const sceneY = useMotionValue(0);
  const sceneSpringX = useSpring(sceneX, { damping: 25, stiffness: 60, mass: 1 });
  const sceneSpringY = useSpring(sceneY, { damping: 25, stiffness: 60, mass: 1 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { innerWidth, innerHeight } = window;
    sceneX.set((e.clientX - innerWidth / 2) * 0.02);
    sceneY.set((e.clientY - innerHeight / 2) * 0.02);
  };

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" onMouseMove={handleHeroMouseMove}>
      {/* Máscara escura para garantir leitura do texto — antes ficava sobre o vídeo, agora é o próprio fundo */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[var(--background)]/40 via-[var(--background)]/70 to-[var(--background)]" />

      <div className="absolute inset-0 z-[1]">
        <Starfield />
      </div>

      <FloatingTechCards />

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-6 pt-20 lg:pt-0">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <motion.div variants={item} animate={{ y: [0, -4, 0] }} transition={{ y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } }} className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-accent)]/50 mb-8 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
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

          <div className="max-w-2xl mb-12">
            <TextReveal
              text="Construindo ecossistemas digitais de ponta a ponta com alta performance, design imersivo e arquiteturas escaláveis para impactar o seu negócio."
              className="text-lg md:text-xl text-neutral-300 leading-relaxed font-light justify-center lg:justify-start"
            />
          </div>

          <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4 mt-2">
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

        {/* Coluna do objeto 3D — astronauta + planetas (Task 4), à direita no desktop */}
        <motion.div style={{ x: sceneSpringX, y: sceneSpringY }} className="relative w-full h-0 lg:h-[560px] lg:flex-1 pointer-events-none">
          {isDesktop && <HeroScene scrollProgress={scrollYProgress} />}
        </motion.div>
      </div>
    </section>
  );
}
