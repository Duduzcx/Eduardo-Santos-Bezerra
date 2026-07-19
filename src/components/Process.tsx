"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const PROCESS_STEPS = [
  ["01", "Arquitetura de Banco de Dados", "Estruturação escalável, normalização e modelagem relacional voltadas a consultas de alta performance."],
  ["02", "Lógica de Back-end", "Serviços robustos, endpoints seguros e regras de negócio confiáveis para produtos que crescem."],
  ["03", "Integração de APIs e IoT", "Conexão entre software, telemetria e dados em tempo real, com uma arquitetura preparada para evoluir."],
  ["04", "UI/UX de Alta Conversão", "Interfaces rápidas, responsivas e acessíveis, projetadas para tornar cada jornada mais clara."],
];

const STEP_IMAGES = [
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=900&auto=format&fit=crop",
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 80%", "end 30%"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  return (
    <section ref={sectionRef} id="process" className="relative w-full overflow-hidden border-y border-white/[0.06] bg-neutral-950/70 py-28 md:py-36">
      <motion.div aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} className="pointer-events-none absolute -right-28 top-24 h-72 w-72 rounded-full border border-[var(--color-accent)]/15" />
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-cyan)]">Como eu trabalho</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-5xl">Uma jornada que evolui a cada etapa.</h2>
        </motion.div>
        <div className="relative">
          <div aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 hidden w-px bg-white/10 md:block" />
          <motion.div aria-hidden="true" className="absolute bottom-auto left-[7px] top-0 hidden h-full w-px origin-top bg-gradient-to-b from-[var(--color-cyan)] via-[var(--color-accent-light)] to-[var(--color-pink)] md:block" style={{ scaleY: lineScale }} />
          {PROCESS_STEPS.map(([number, title, description], index) => (
            <motion.div key={number} initial={{ opacity: 0, x: index % 2 === 0 ? -34 : 34, y: 24 }} whileInView={{ opacity: 1, x: 0, y: 0 }} whileHover={{ x: 12 }} viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.62, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }} className="group relative grid gap-4 border-t border-white/[0.09] py-9 pl-0 md:grid-cols-[120px_1fr] md:gap-8 md:pl-12">
              <span className="relative text-sm font-medium text-[var(--color-cyan)]"><span className="absolute -left-[42px] top-1 hidden h-[14px] w-[14px] rounded-full border-2 border-[var(--color-cyan)] bg-neutral-950 shadow-[0_0_16px_rgba(103,232,249,0.8)] md:block" />{number}</span>
              <div className="grid gap-5 md:grid-cols-[1fr_170px] md:items-center"><div><h3 className="text-xl font-medium text-white md:text-2xl">{title}</h3><p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400 md:text-base">{description}</p></div><div className="relative hidden aspect-[16/10] overflow-hidden rounded-xl border border-white/10 md:block"><img src={STEP_IMAGES[index]} alt="" className="h-full w-full object-cover opacity-45 transition-all duration-700 group-hover:scale-110 group-hover:opacity-90" /><div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-accent)]/50 to-transparent mix-blend-color" /></div></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
