"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Monitor, Database, Terminal, Cpu, FileCode2 } from "lucide-react";
import { useIsDesktop } from "@/hooks/useIsDesktop";

interface FileCardProps {
  title: string;
  filename: string;
  desc: string;
  icon: React.ReactNode;
  borderColor: string;
  glowColor: string;
  xTransform: any;
  yTransform: any;
  rotateTransform: any;
  opacityTransform: any;
}

function FileCard({
  title,
  filename,
  desc,
  icon,
  borderColor,
  glowColor,
  xTransform,
  yTransform,
  rotateTransform,
  opacityTransform,
}: FileCardProps) {
  return (
    <motion.div
      style={{
        x: xTransform,
        y: yTransform,
        rotate: rotateTransform,
        opacity: opacityTransform,
      }}
      whileHover={{ scale: 1.05, zIndex: 30 }}
      className={`absolute w-[240px] md:w-[280px] p-5 rounded-2xl bg-[#0f0c1b]/95 border ${borderColor} backdrop-blur-md shadow-2xl cursor-pointer select-none transition-colors duration-300 z-10`}
    >
      <div 
        className="absolute inset-0 rounded-2xl opacity-10 transition-opacity duration-300 group-hover:opacity-20 blur-md pointer-events-none"
        style={{ boxShadow: `0 0 20px ${glowColor}` }}
      />
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono text-neutral-400 tracking-wider flex items-center gap-1.5">
          <FileCode2 className="w-3.5 h-3.5 text-neutral-400" />
          {filename}
        </span>
        <div className={`p-2 rounded-lg bg-white/5 border border-white/10`}>
          {icon}
        </div>
      </div>
      <h4 className="text-md font-bold text-white mb-1.5">{title}</h4>
      <p className="text-xs text-neutral-400 font-light leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export default function CosmicFolder() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  // Acoplado à rolagem do contêiner da pasta
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 30%"],
  });

  // Tampa da pasta abre (rotaciona no eixo X em 3D)
  const lidRotateX = useTransform(scrollYProgress, [0, 0.45], [0, -115]);
  const lidOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0.9]);

  // Fanning out dos arquivos (Desktop vs Mobile)
  const fX1 = useTransform(scrollYProgress, [0.25, 0.85], [0, isDesktop ? -160 : -45]);
  const fY1 = useTransform(scrollYProgress, [0.25, 0.85], [0, isDesktop ? -150 : -140]);
  const fR1 = useTransform(scrollYProgress, [0.25, 0.85], [0, -12]);
  const fO1 = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  const fX2 = useTransform(scrollYProgress, [0.25, 0.85], [0, isDesktop ? 160 : 45]);
  const fY2 = useTransform(scrollYProgress, [0.25, 0.85], [0, isDesktop ? -160 : -140]);
  const fR2 = useTransform(scrollYProgress, [0.25, 0.85], [0, 12]);
  const fO2 = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);

  const fX3 = useTransform(scrollYProgress, [0.25, 0.85], [0, isDesktop ? -180 : -55]);
  const fY3 = useTransform(scrollYProgress, [0.25, 0.85], [0, isDesktop ? 80 : 35]);
  const fR3 = useTransform(scrollYProgress, [0.25, 0.85], [0, -6]);
  const fO3 = useTransform(scrollYProgress, [0.22, 0.45], [0, 1]);

  const fX4 = useTransform(scrollYProgress, [0.25, 0.85], [0, isDesktop ? 180 : 55]);
  const fY4 = useTransform(scrollYProgress, [0.25, 0.85], [0, isDesktop ? 70 : 35]);
  const fR4 = useTransform(scrollYProgress, [0.25, 0.85], [0, 6]);
  const fO4 = useTransform(scrollYProgress, [0.22, 0.45], [0, 1]);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[580px] md:h-[620px] flex items-center justify-center z-10"
      style={{ perspective: "1500px" }}
    >
      <div 
        className="relative w-[280px] md:w-[320px] h-[200px] md:h-[220px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ================= BACK OF THE FOLDER ================= */}
        <div className="absolute inset-0 bg-[#161229]/95 border border-white/10 rounded-2xl shadow-2xl z-0">
          {/* Orelha/Aba da Pasta */}
          <div className="absolute top-[-16px] left-[20px] w-[90px] h-[16px] bg-[#161229]/95 border-t border-x border-white/10 rounded-t-lg" />
        </div>

        {/* ================= ARCHIVES (FILES FLYING OUT) ================= */}
        <FileCard
          filename="front-end.ts"
          title="Front-end Cósmico"
          desc="Interfaces imersivas e fluidas usando React, Next.js e Framer Motion."
          icon={<Monitor className="w-5 h-5 text-[var(--color-cyan)]" />}
          borderColor="border-[var(--color-cyan)]/30 hover:border-[var(--color-cyan)]"
          glowColor="var(--color-cyan)"
          xTransform={fX1}
          yTransform={fY1}
          rotateTransform={fR1}
          opacityTransform={fO1}
        />

        <FileCard
          filename="back-end.py"
          title="Telemetria Espacial"
          desc="APIs escaláveis e microsserviços em Node.js e Python com PostgreSQL."
          icon={<Database className="w-5 h-5 text-[var(--color-accent)]" />}
          borderColor="border-[var(--color-accent)]/30 hover:border-[var(--color-accent)]"
          glowColor="var(--color-accent)"
          xTransform={fX2}
          yTransform={fY2}
          rotateTransform={fR2}
          opacityTransform={fO2}
        />

        <FileCard
          filename="architecture.sh"
          title="Arquitetura Limpa"
          desc="Sistemas desacoplados, pipelines de CI/CD e infraestrutura na nuvem."
          icon={<Terminal className="w-5 h-5 text-[var(--color-pink)]" />}
          borderColor="border-[var(--color-pink)]/30 hover:border-[var(--color-pink)]"
          glowColor="var(--color-pink)"
          xTransform={fX3}
          yTransform={fY3}
          rotateTransform={fR3}
          opacityTransform={fO3}
        />

        <FileCard
          filename="generative.math"
          title="Design Generativo"
          desc="Cálculos matemáticos e simulações estelares traduzidas em arte digital."
          icon={<Cpu className="w-5 h-5 text-white" />}
          borderColor="border-white/20 hover:border-white"
          glowColor="white"
          xTransform={fX4}
          yTransform={fY4}
          rotateTransform={fR4}
          opacityTransform={fO4}
        />

        {/* ================= FRONT OF THE FOLDER (LID) ================= */}
        <motion.div
          style={{
            rotateX: lidRotateX,
            opacity: lidOpacity,
            transformOrigin: "bottom",
          }}
          className="absolute inset-0 bg-[#221c3d]/90 border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm z-20 flex flex-col justify-between p-6 pointer-events-none select-none"
        >
          {/* Holograma ou Selo na capa da pasta */}
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-cyan)] animate-pulse" />
            </div>
            <span className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase">Secret Dossier</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">EXPLORAÇÕES DE ENGENHARIA</h3>
            <p className="text-[10px] text-neutral-400 font-mono">Eduardo Santos Bezerra // Art & Software</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
