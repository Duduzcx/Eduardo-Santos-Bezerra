"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import CinematicBackground from "./CinematicBackground";
import GlassOrbs from "./GlassOrbs";
import Starfield from "./Starfield";

const CHAPTERS = [
  {
    label: "01 · Origem",
    title: "De onde eu vim",
    text: "Comecei mexendo em lógica e dados antes de mexer em interface. Hoje curso Engenharia de Software na Uniasselvi e Ciência de Dados na Fatec, duas frentes que se completam.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop",
    tags: ["Engenharia de Software // Estrutura", "Ciência de Dados // Lógica Preditiva"],
  },
  {
    label: "02 · Presente",
    title: "O que eu construo",
    text: "Sistemas web de ponta a ponta: banco de dados, back-end e a interface que o usuário final toca. Prefiro entender o problema inteiro a entregar só a parte visível.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop",
    stack: "Stack: React_ Next.js_ Node.js_ SQL_ Python_",
  },
  {
    label: "03 · Direção",
    title: "Pra onde eu vou",
    text: "Dominar engenharia de ponta a ponta pra construir ecossistemas robustos e inteligentes — código com performance, dados bem estruturados, design que faz sentido.",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1600&auto=format&fit=crop",
  },
];

function Chapter({ chapter, index, total }: { chapter: (typeof CHAPTERS)[number]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 25%"] });
  const { scrollYProgress: exitProgress } = useScroll({ target: ref, offset: ["center start", "end start"] });
  const [stackHovered, setStackHovered] = useState(false);

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 1], [0.3, 0.85]);
  const textY = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const isLast = index === total - 1;
  // Último capítulo: em vez de só sumir, o texto estoura de tamanho + borra — sensação de "atravessar" pro futuro
  const exitTextOpacity = useTransform(exitProgress, [0, 1], [1, isLast ? 0 : 0.15]);
  const exitTextY = useTransform(exitProgress, [0, 1], [0, isLast ? 0 : -40]);
  const exitTextScale = useTransform(exitProgress, [0, 1], [1, isLast ? 1.7 : 1]);
  const exitTextBlurPx = useTransform(exitProgress, [0, 1], [0, isLast ? 18 : 0]);
  const exitTextFilter = useTransform(exitTextBlurPx, (v) => `blur(${v}px)`);

  return (
    <div ref={ref} className="relative flex min-h-[70vh] md:min-h-[85vh] items-center justify-center overflow-hidden">
      <CinematicBackground fallbackImage={chapter.image} scale={imageScale} opacity={imageOpacity} glow={index === 0} />

      {index === 0 && (
        <div aria-hidden="true" className="absolute inset-0 z-[1] opacity-40">
          <Starfield />
        </div>
      )}
      {index === 1 && <GlassOrbs />}

      <motion.div
        style={{ y: textY, opacity: useTransform([textOpacity, exitTextOpacity], ([a, b]: number[]) => Math.min(a, b)) }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.div style={{ y: exitTextY, scale: exitTextScale, filter: exitTextFilter }}>
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-cyan)]">{chapter.label}</span>
          <motion.h3
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            whileInView={{ clipPath: "inset(0% 0 0 0)" }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl"
          >
            {chapter.title}
          </motion.h3>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-300 md:text-lg">{chapter.text}</p>

          {chapter.tags && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {chapter.tags.map((tag, i) => (
                <motion.span
                  key={tag}
                  animate={{ opacity: [0.55, 1, 0.55] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs text-neutral-200 backdrop-blur-md"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          )}

          {chapter.stack && (
            <button
              type="button"
              onMouseEnter={() => setStackHovered(true)}
              onMouseLeave={() => setStackHovered(false)}
              className="mt-8 font-mono text-xs tracking-widest text-[var(--color-cyan)] transition-opacity duration-500"
              style={{ opacity: stackHovered ? 1 : 0.2 }}
            >
              {chapter.stack}
            </button>
          )}
        </motion.div>
      </motion.div>

      {!isLast && (
        <div className="pointer-events-none absolute bottom-0 left-0 h-24 w-full bg-gradient-to-b from-transparent to-[var(--background)] z-[6]" />
      )}
    </div>
  );
}

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const headingClip = useTransform(scrollYProgress, [0, 0.15], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);

  return (
    <section ref={sectionRef} className="relative w-full bg-[var(--background)] py-24 md:py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-cyan)]">Minha história</p>
        <div className="relative mt-4 max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-white/10 md:text-5xl">Uma trajetória em três capítulos.</h2>
          <motion.h2 style={{ clipPath: headingClip }} className="absolute inset-0 text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Uma trajetória em três capítulos.
          </motion.h2>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-6 md:gap-10">
        {CHAPTERS.map((chapter, index) => (
          <Chapter key={chapter.title} chapter={chapter} index={index} total={CHAPTERS.length} />
        ))}
      </div>
    </section>
  );
}
