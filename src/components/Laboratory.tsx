"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import LetterReveal from "./LetterReveal";
import { Activity, Box, Variable, Cpu } from "lucide-react";

// Um Card do Bento Grid com efeitos físicos insanos no Hover
function BentoCard({
  title,
  desc,
  icon,
  className,
  image,
  boosted = false,
}: {
  title: string,
  desc: string,
  icon: React.ReactNode,
  className: string,
  image?: string,
  boosted?: boolean,
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);
  const imageScale = useTransform(mouseX, [-0.5, 0.5], [1.1, 1.2]); // Zoom dinâmico
  const imageX = useTransform(mouseX, [-0.5, 0.5], ["-5%", "5%"]);
  const imageY = useTransform(mouseY, [-0.5, 0.5], ["-5%", "5%"]);
  const [imageFailed, setImageFailed] = useState(false);
  const [forceReveal, setForceReveal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setForceReveal(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={forceReveal ? { opacity: 1, y: 0 } : undefined}
      whileHover={{ scale: 1.015, zIndex: 10 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        boxShadow: boosted ? "0 0 0 1px rgba(103,232,249,0.5), 0 20px 60px rgba(103,232,249,0.15)" : undefined,
      }}
      className={`relative group overflow-hidden rounded-3xl bg-[var(--background-panel)] border border-[var(--border-subtle)] p-8 md:p-12 flex flex-col justify-end cursor-pointer shadow-2xl transition-transform duration-500 ${boosted ? "scale-[1.02]" : ""} ${className}`}
      data-magnetic
    >
      {/* Background Image / Noise com Parallax no Mouse */}
      {image && !imageFailed && (
        <motion.div
          className="absolute inset-0 z-0 opacity-75 group-hover:opacity-95 transition-opacity duration-700"
          style={{
            scale: imageScale,
            x: imageX,
            y: imageY
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/30 to-transparent z-10" />
          <img src={image} alt={title} onError={() => setImageFailed(true)} className="w-full h-full object-cover saturate-[0.6] group-hover:saturate-100 transition-all duration-700" />
        </motion.div>
      )}

      {/* Conteúdo levantado em 3D */}
      <motion.div 
        style={{ transform: "translateZ(60px)" }} 
        className="relative z-20 flex flex-col gap-4 mt-32"
      >
        <div className="text-[var(--foreground)] bg-[var(--foreground)]/10 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-md border border-[var(--border-subtle)] mb-2 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
          {icon}
        </div>
        <h3 className="text-2xl md:text-4xl font-medium tracking-tight text-[var(--foreground)] leading-tight">
          {title}
        </h3>
        <p className="text-[var(--text-secondary)] font-light text-base md:text-lg max-w-sm">
          {desc}
        </p>
      </motion.div>
    </motion.div>
  );
}

function CircleDragReveal({ progress, onProgress }: { progress: number; onProgress: (v: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const ballY = useMotionValue(0);
  const TRACK = 64;

  function handleDrag() {
    const clamped = Math.min(TRACK, Math.max(0, ballY.get()));
    onProgress(clamped / TRACK);
  }

  return (
    <div className="relative mx-auto mb-4 flex h-[168px] w-[168px] items-center justify-center md:mx-0">
      <svg viewBox="0 0 168 168" className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none">
        <circle cx="84" cy="84" r="76" fill="none" stroke="var(--border-subtle)" strokeWidth="2" />
        <motion.circle
          cx="84"
          cy="84"
          r="76"
          fill="none"
          stroke="var(--color-cyan)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ pathLength: progress, opacity: 0.9 }}
        />
      </svg>
      <div ref={trackRef} className="relative h-[64px] w-px bg-[var(--border-subtle)]">
        <motion.div
          drag="y"
          dragConstraints={trackRef}
          dragElastic={0.05}
          dragMomentum={false}
          onDrag={handleDrag}
          style={{ y: ballY, marginLeft: -11 }}
          whileDrag={{ scale: 1.2 }}
          className="absolute top-0 z-10 flex h-[22px] w-[22px] cursor-grab items-center justify-center rounded-full border-2 border-[var(--color-cyan)] bg-[var(--background)] shadow-[0_0_20px_rgba(103,232,249,0.8)] active:cursor-grabbing"
        >
          <div className="h-2 w-2 rounded-full bg-[var(--color-cyan)]" />
        </motion.div>
      </div>
      <span className="absolute -bottom-6 text-[10px] uppercase tracking-widest text-[var(--text-tertiary)]">Arraste</span>
    </div>
  );
}

export default function Laboratory() {
  const [dragProgress, setDragProgress] = useState(0);
  const thresholds = [0.15, 0.4, 0.65, 0.9];

  return (
    <section className="relative w-full py-40 z-20 bg-[var(--background)] overflow-hidden transition-colors duration-500">
      <div className="px-6 md:px-12 lg:px-24 mb-16 max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-10 relative z-10">
        <div className="text-center md:text-left">
          <h2 className="text-neutral-500 uppercase tracking-widest text-xs font-medium" data-magnetic>
            <LetterReveal text="Laboratório & Explorações" />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mt-4 text-3xl md:text-4xl font-light text-[var(--text-secondary)] tracking-tight"
          >
            Onde a engenharia vira arte.
          </motion.p>
        </div>
        <CircleDragReveal progress={dragProgress} onProgress={setDragProgress} />
      </div>

      {/* O Bento Grid Distorcido */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 auto-rows-[450px] gap-6 md:gap-8 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto" style={{ perspective: "2000px" }}>

        {/* Card 1: 3D Modeling (Gigante) */}
        <BentoCard
          className="md:col-span-8"
          title="Modelagem e Renderização 3D"
          desc="Criação de ambientes virtuais e peças funcionais para impressão 3D (Autodesk Maya, Cults 3D). Elevando o design físico e digital."
          icon={<Box className="w-8 h-8" />}
          image="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop"
          boosted={dragProgress >= thresholds[0]}
        />

        {/* Card 2: Algorithms (Pequeno/Alto) */}
        <BentoCard
          className="md:col-span-4"
          title="Modelos Preditivos"
          desc="Estruturação de algoritmos, cálculos de probabilidade e avaliação de odds complexos para análise massiva de dados esportivos."
          icon={<Activity className="w-8 h-8" />}
          image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
          boosted={dragProgress >= thresholds[1]}
        />

        {/* Card 3: Experimentos Físicos */}
        <BentoCard
          className="md:col-span-5"
          title="Microcontroladores & IoT"
          desc="Integração de hardware e software através de ESP32 e C++, unindo o plano físico aos serviços cloud."
          icon={<Cpu className="w-8 h-8" />}
          image="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=2069&auto=format&fit=crop"
          boosted={dragProgress >= thresholds[2]}
        />

        {/* Card 4: Abstract Mathematics */}
        <BentoCard
          className="md:col-span-7 bg-gradient-to-br from-neutral-900 to-neutral-950"
          title="Engenharia de Dados"
          desc="Processamento de Big Data e pipelines escaláveis para arquiteturas orientadas a eventos e tomada de decisão em tempo real."
          icon={<Variable className="w-8 h-8" />}
          image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2070&auto=format&fit=crop"
          boosted={dragProgress >= thresholds[3]}
        />

      </div>
    </section>
  );
}
