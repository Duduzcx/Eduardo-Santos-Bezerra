"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Monitor, Database } from "lucide-react";
import TextReveal from "./TextReveal";
import LetterReveal from "./LetterReveal";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: titleProgress } = useScroll({
    target: titleRef,
    offset: ["start 90%", "start 30%"],
  });
  const bgTextClip = useTransform(titleProgress, [0, 1], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]);

  // Saída "névoa": desfoque + encolhe + some na segunda metade do trânsito da seção pelo topo da tela
  const { scrollYProgress: exitProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const exitOpacity = useTransform(exitProgress, [0.55, 1], [1, 0]);
  const exitScale = useTransform(exitProgress, [0.55, 1], [1, 0.95]);
  const exitBlurPx = useTransform(exitProgress, [0.55, 1], [0, 10]);
  const exitFilter = useTransform(exitBlurPx, (v) => `blur(${v}px)`);

  const cards = [
    {
      icon: <Monitor className="w-8 h-8 text-[var(--color-cyan)]" />,
      title: "Front-end",
      desc: "Experiências ricas e responsivas usando React, Next.js e animações avançadas.",
      x: -50, y: 0
    },
    {
      icon: <Database className="w-8 h-8 text-[var(--color-accent)]" />,
      title: "Back-end",
      desc: "APIs robustas e escaláveis usando Node.js, Python e PostgreSQL.",
      x: 50, y: 0
    },
    {
      icon: <Code2 className="w-8 h-8 text-[var(--color-pink)]" />,
      title: "Engenharia",
      desc: "Arquitetura limpa, TDD e integração contínua (CI/CD).",
      x: 0, y: 50
    }
  ];

  return (
    <section ref={sectionRef} id="about" className="w-full py-32 relative z-20 bg-[var(--background)] overflow-hidden">
      
      {/* Orrery Cósmico (Planetário de órbitas) */}
      <motion.div
        style={{ opacity: exitOpacity, scale: exitScale }}
        initial={{ opacity: 0, scale: 0.7, rotate: -45 }}
        whileInView={{ opacity: 0.12, scale: 1, rotate: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -left-[10%] top-[20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] pointer-events-none"
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[var(--color-cyan)]" stroke="currentColor" strokeWidth="0.75">
          {/* Sol Central */}
          <circle cx="50" cy="50" r="4" fill="currentColor" className="animate-pulse" />
          
          {/* Órbita 1 e Planeta 1 */}
          <circle cx="50" cy="50" r="16" strokeDasharray="3 3" opacity="0.5" />
          <motion.circle 
            cx="50" cy="50" r="16" 
            stroke="var(--color-accent)" strokeWidth="1.5"
            strokeDasharray="0.1 32" strokeLinecap="round"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ originX: "50px", originY: "50px" }}
          />

          {/* Órbita 2 e Planeta 2 */}
          <circle cx="50" cy="50" r="30" strokeDasharray="4 4" opacity="0.6" />
          <motion.circle 
            cx="50" cy="50" r="30" 
            stroke="var(--color-cyan)" strokeWidth="2"
            strokeDasharray="0.1 60" strokeLinecap="round"
            animate={{ rotate: -360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            style={{ originX: "50px", originY: "50px" }}
          />

          {/* Órbita 3 e Planeta 3 com Lua orbitando ele */}
          <circle cx="50" cy="50" r="44" strokeDasharray="6 4" opacity="0.4" />
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            style={{ originX: "50px", originY: "50px" }}
          >
            {/* Planeta 3 */}
            <circle cx="94" cy="50" r="2.5" fill="var(--color-pink)" />
            {/* Órbita da lua do Planeta 3 */}
            <circle cx="94" cy="50" r="5" stroke="currentColor" strokeWidth="0.25" strokeDasharray="1 1" opacity="0.5" />
            <motion.circle
              cx="94" cy="50" r="5"
              stroke="white" strokeWidth="0.75"
              strokeDasharray="0.1 10"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ originX: "94px", originY: "50px" }}
            />
          </motion.g>
        </svg>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          
          <motion.div style={{ opacity: exitOpacity, scale: exitScale, filter: exitFilter }} className="flex-1 space-y-8">
            <div ref={titleRef} className="relative">
              {/* Texto de fundo gigante, revela progressivamente conforme o scroll passa pela seção */}
              <motion.div
                style={{ clipPath: bgTextClip }}
                className="absolute -top-6 md:-top-14 left-0 text-[16vw] md:text-[7vw] font-black text-white/5 leading-none whitespace-nowrap pointer-events-none select-none -z-10"
                aria-hidden="true"
              >
                SOBRE MIM
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 1.2, rotateX: -45 }}
                whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, type: "spring" }}
              >
                <h2 className="text-3xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 mb-6 tracking-tight">
                  <LetterReveal text="Sobre mim" />
                </h2>
              </motion.div>
            </div>

            <div className="space-y-6 text-[var(--text-secondary)] text-xl leading-relaxed">
              <TextReveal text="Sou um Desenvolvedor Full Stack apaixonado por transformar problemas complexos em interfaces elegantes e sistemas de alta performance." />
              <TextReveal text="Com sólida formação em Engenharia de Software, meu foco é sempre a entrega de valor real. Já atuei no desenvolvimento de plataformas EdTech, automação IoT e análise de dados massivos." />
              <TextReveal text="Recentemente, fui o arquiteto-chefe de uma startup de IA focada no agronegócio, liderando o design de uma infraestrutura em nuvem capaz de processar dados em tempo real e impactar milhares de agricultores." />
              <TextReveal text="Fora do código, também sou um entusiasta por design generativo, onde cruzo matemática e arte para criar experiências visuais que desafiam o comum." />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                Chega de sistemas <span className="text-[var(--foreground)] font-semibold">obsoletos</span> — eu construo o que sua empresa vai precisar nos próximos 10 anos.
              </motion.p>
            </div>
          </motion.div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {cards.map((card, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: card.x, y: card.y }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
                whileHover={{ scale: 1.05, rotate: idx % 2 === 0 ? 2 : -2 }}
                className={`group p-8 rounded-3xl bg-[var(--background-panel)] border border-[var(--border-subtle)] hover:border-[var(--color-cyan)] transition-colors duration-500 cursor-pointer ${idx === 2 ? 'sm:col-span-2' : ''} shadow-2xl relative overflow-hidden`}
              >
                {/* Efeito de brilho de fundo no hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[var(--color-accent)]/5 to-[var(--color-cyan)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="mb-6 bg-[var(--background)] w-16 h-16 rounded-2xl flex items-center justify-center border border-[var(--border-subtle)] relative z-10">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3 relative z-10">{card.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed font-light relative z-10">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
