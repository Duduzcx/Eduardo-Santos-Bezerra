"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import LetterReveal from "./LetterReveal";
import { 
  FileCode2, 
  Database, 
  Smartphone, 
  Terminal, 
  Server, 
  Layout, 
  Code,
  Layers
} from "lucide-react";

const SKILLS = [
  { name: "Next.js", icon: <Layout strokeWidth={1.5} className="w-8 h-8" />, color: "text-white", bg: "bg-white/10 border-white/20" },
  { name: "React", icon: <Code strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#61DAFB]", bg: "bg-[#61DAFB]/10 border-[#61DAFB]/20" },
  { name: "TypeScript", icon: <FileCode2 strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#3178C6]", bg: "bg-[#3178C6]/10 border-[#3178C6]/20" },
  { name: "Node.js", icon: <Server strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#339933]", bg: "bg-[#339933]/10 border-[#339933]/20" },
  { name: "Python", icon: <Terminal strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#3776AB]", bg: "bg-[#3776AB]/10 border-[#3776AB]/20" },
  { name: "PostgreSQL", icon: <Database strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#4169E1]", bg: "bg-[#4169E1]/10 border-[#4169E1]/20" },
  { name: "Tailwind CSS", icon: <Layers strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#06B6D4]", bg: "bg-[#06B6D4]/10 border-[#06B6D4]/20" },
  { name: "React Native", icon: <Smartphone strokeWidth={1.5} className="w-8 h-8" />, color: "text-[#61DAFB]", bg: "bg-[#61DAFB]/10 border-[#61DAFB]/20" },
];

function SkillFillBar({ scrollYProgress, index, total }: { scrollYProgress: MotionValue<number>; index: number; total: number }) {
  const start = index / total;
  const end = Math.min(1, start + 1 / total + 0.15);
  const scaleX = useTransform(scrollYProgress, [start, end], [0, 1]);
  return <motion.div style={{ scaleX }} className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-[var(--color-cyan)]" />;
}

// Saída "perda de gravidade": cada card flutua pra cima em velocidade diferente e gira levemente fora de eixo, sumindo aos poucos
function SkillExitWrapper({ scrollYProgress, index, children }: { scrollYProgress: MotionValue<number>; index: number; children: React.ReactNode }) {
  const floatDistance = 60 + (index % 4) * 25;
  const y = useTransform(scrollYProgress, [0.5, 1], [0, -floatDistance]);
  const rotateZ = useTransform(scrollYProgress, [0.5, 1], [0, index % 2 === 0 ? 10 : -10]);
  const opacity = useTransform(scrollYProgress, [0.5, 1], [1, 0]);
  return <motion.div style={{ y, rotateZ, opacity }}>{children}</motion.div>;
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start 85%", "end 60%"] });
  const { scrollYProgress: exitProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const exitOpacity = useTransform(exitProgress, [0.55, 1], [1, 0]);
  const exitScale = useTransform(exitProgress, [0.55, 1], [1, 0.9]);

  return (
    <section ref={sectionRef} id="skills" className="w-full py-32 bg-[var(--background)] relative overflow-hidden transition-colors duration-500">
      
      {/* Sistema de Órbitas e Nebulosa de Fundo (Astronomia) */}
      <motion.div
        style={{ opacity: exitOpacity, scale: exitScale }}
        className="absolute right-[-15%] top-[10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] pointer-events-none"
      >
        {/* Nebulosa brilhante pulsante */}
        <motion.div 
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--color-pink)]/10 via-[var(--color-accent)]/8 to-[var(--color-cyan)]/10 blur-[80px]"
        />

        {/* Órbitas Inclinadas 3D */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="w-full h-full"
          style={{ transformStyle: "preserve-3d", perspective: 800 }}
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[var(--color-cyan)]" stroke="currentColor" strokeWidth="0.5">
            {/* Órbita Externa com Planeta */}
            <circle cx="50" cy="50" r="45" strokeDasharray="3 5" opacity="0.4" />
            <motion.circle 
              cx="50" cy="50" r="45" 
              stroke="var(--color-pink)" strokeWidth="1.5"
              strokeDasharray="0.1 90" strokeLinecap="round"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{ originX: "50px", originY: "50px" }}
            />

            {/* Órbita Interna com Planeta */}
            <circle cx="50" cy="50" r="30" strokeDasharray="2 3" opacity="0.5" />
            <motion.circle 
              cx="50" cy="50" r="30" 
              stroke="var(--color-cyan)" strokeWidth="2"
              strokeDasharray="0.1 60" strokeLinecap="round"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              style={{ originX: "50px", originY: "50px" }}
            />
          </svg>
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-semibold text-[var(--foreground)] mb-6">
            <LetterReveal text="Stack " />
            <LetterReveal text="Principal" className="text-[var(--color-cyan)]" />
          </h2>
        </motion.div>

        {/* Animação nova: Cada card não vem de baixo, mas gira em X (estilo moeda caindo) */}
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {SKILLS.map((skill, index) => (
            <SkillExitWrapper key={index} scrollYProgress={exitProgress} index={index}>
            <motion.div
              initial={{ opacity: 0, rotateX: 90, scale: 0.8 }}
              whileInView={{ opacity: 1, rotateX: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, type: "spring", bounce: 0.5 }}
              whileHover={{ scale: 1.1, y: -10, rotateZ: index % 2 === 0 ? 2 : -2 }}
              whileTap={{ scale: 0.96 }}
              className={`group flex flex-col items-center justify-center p-8 bg-[var(--color-surface)] border border-[var(--border-subtle)] rounded-3xl transition-all cursor-pointer shadow-lg hover:border-transparent relative overflow-hidden`}
            >
              {/* Overlay com a cor original da tech no fundo quando dá hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${skill.bg}`} />
              
              <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/10 blur-2xl opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100" />
              <div className={`text-[var(--text-tertiary)] transition-all duration-500 mb-4 group-hover:${skill.color} group-hover:rotate-[12deg] group-hover:scale-110 relative z-10`}>
                {skill.icon}
              </div>
              <span className={`text-[var(--text-secondary)] font-medium group-hover:${skill.color} transition-colors relative z-10`}>
                {skill.name}
              </span>
              <SkillFillBar scrollYProgress={scrollYProgress} index={index} total={SKILLS.length} />
            </motion.div>
            </SkillExitWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
