"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import TextReveal from "./TextReveal";
import FloatingTechCards from "./FloatingTechCards";
import LetterReveal from "./LetterReveal";
import Starfield from "./Starfield";
import MagneticButton from "./MagneticButton";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  // Texto principal recua e some logo nos primeiros pixels de scroll (0-35% do scroll da Hero), câmera "descendo pelo portfólio"
  const textExitOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const textExitY = useTransform(scrollYProgress, [0, 0.35], [0, -100]);
  // Nome encolhe + borra em bloco ao rolar, como se recuasse no espaço
  const nameScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.85]);
  const nameBlurPx = useTransform(scrollYProgress, [0, 0.35], [0, 6]);
  const nameFilter = useTransform(nameBlurPx, (v) => `blur(${v}px)`);

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

      {/* Canvas 3D — z acima do texto, abaixo dos badges/botões (True Depth Layering) */}
      <motion.div style={{ x: sceneSpringX, y: sceneSpringY }} className="absolute inset-0 z-[4] pointer-events-none">
        {isDesktop && <HeroScene scrollProgress={scrollYProgress} />}
      </motion.div>

      <FloatingTechCards />

      <div className="w-full max-w-7xl mx-auto px-6 relative flex flex-col lg:flex-row items-center gap-12 lg:gap-6 pt-20 lg:pt-0">
        {/* Coluna de texto: sem transform/z próprio aqui — os dois blocos abaixo controlam sua própria profundidade */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
          <motion.div style={{ opacity: textExitOpacity, y: textExitY }} className="relative z-[2] w-full flex flex-col items-center lg:items-start">
            <motion.div variants={container} initial="hidden" animate="show" className="w-full flex flex-col items-center lg:items-start">
              <motion.div variants={item} animate={{ y: [0, -4, 0] }} transition={{ y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } }} className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 max-w-full">
                <span className="w-2 h-2 rounded-full bg-[var(--color-cyan)] animate-pulse shrink-0" />
                <span className="text-xs sm:text-sm text-neutral-200 font-mono font-bold tracking-wider sm:tracking-widest uppercase truncate">Disponível para novos desafios</span>
              </motion.div>

              {/* Nome revela letra por letra ao carregar (LetterReveal), encolhe/borra em bloco suave ao rolar */}
              <motion.h1 variants={item} style={{ scale: nameScale, filter: nameFilter }} className="fs-hero animate-name-glow origin-center lg:origin-left font-bold tracking-tight text-white mb-6 leading-[1.05] sm:leading-[0.95] font-[family-name:var(--font-display)] max-w-full">
                <span className="block"><LetterReveal text="Eduardo" /></span>
                <span className="block">
                  <LetterReveal text="Santos Bezerra" />
                  <span className="text-[var(--color-accent)] animate-pulse">_</span>
                </span>
              </motion.h1>

              <motion.h2 variants={item} className="fs-h3 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-accent)] to-[var(--color-pink)] font-bold mb-7 tracking-wider sm:tracking-[0.16em] animate-gradient-x max-w-full">
                <LetterReveal text="DESENVOLVEDOR FULL STACK" />
              </motion.h2>

              <div className="max-w-2xl mb-12">
                <TextReveal
                  text="Construindo ecossistemas digitais de ponta a ponta com alta performance, design imersivo e arquiteturas escaláveis para impactar o seu negócio."
                  className="text-sm sm:text-lg md:text-xl text-neutral-300 leading-relaxed font-light justify-center lg:justify-start"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Botões: profundidade própria, acima do Canvas (z-6 > z-4) — não fica preso no stacking context do bloco de texto acima */}
          <motion.div style={{ opacity: textExitOpacity, y: textExitY }} className="relative z-[6] flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-2 w-full sm:w-auto">
            <MagneticButton
              href="#projects"
              className="group relative px-6 py-3.5 rounded-full bg-white text-[#0a0814] font-semibold hover:bg-neutral-100 transition-colors flex items-center gap-2.5"
            >
              Ver projetos selecionados
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
            <MagneticButton
              href="#contact"
              strength={0.25}
              className="group flex items-center gap-2 px-2 py-3.5 text-white/70 hover:text-white font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Falar sobre um projeto
            </MagneticButton>
          </motion.div>
        </div>

        <div className="hidden lg:block lg:flex-1" aria-hidden="true" />
      </div>
    </section>
  );
}
