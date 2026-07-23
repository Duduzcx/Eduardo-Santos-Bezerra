"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Layout, Code, FileCode2, Server } from "lucide-react";

// Posicionadas só dentro da coluna direita (onde fica o objeto 3D) — a coluna esquerda é zona segura só de texto, nunca invadida
const TECHS = [
  { name: "React", icon: <Code className="w-5 h-5" />, color: "text-[#61DAFB]", border: "border-[#61DAFB]/30", side: "left" as const, top: "12%", delay: 0 },
  { name: "Next.js", icon: <Layout className="w-5 h-5" />, color: "text-white", border: "border-white/30", side: "left" as const, top: "80%", delay: 0.6 },
  { name: "TypeScript", icon: <FileCode2 className="w-5 h-5" />, color: "text-[#3178C6]", border: "border-[#3178C6]/30", side: "right" as const, top: "18%", delay: 0.3 },
  { name: "Node.js", icon: <Server className="w-5 h-5" />, color: "text-[#339933]", border: "border-[#339933]/30", side: "right" as const, top: "74%", delay: 0.9 },
];

export default function FloatingTechCards() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const parallaxUp = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const parallaxDown = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div ref={ref} className="absolute inset-0 z-[2] pointer-events-none hidden lg:block">
      {TECHS.map((tech) => (
        <motion.div
          key={tech.name}
          style={{ top: tech.top, y: tech.side === "left" ? parallaxUp : parallaxDown }}
          className={`absolute ${tech.side === "left" ? "left-[54%]" : "right-[4%]"}`}
        >
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 4 + tech.delay, repeat: Infinity, ease: "easeInOut", delay: tech.delay }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--color-surface)]/80 backdrop-blur-md border ${tech.border} shadow-lg`}
          >
            <span className={tech.color}>{tech.icon}</span>
            <span className="text-sm font-mono text-neutral-300">{tech.name}</span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
