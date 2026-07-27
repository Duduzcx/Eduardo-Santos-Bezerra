"use client";

import { motion } from "framer-motion";

interface Orb {
  size: number;
  top: string;
  left: string;
  duration: number;
  delay: number;
}

const ORBS: Orb[] = [
  { size: 90, top: "18%", left: "12%", duration: 7, delay: 0 },
  { size: 130, top: "58%", left: "78%", duration: 9, delay: 1.2 },
  { size: 60, top: "72%", left: "22%", duration: 6, delay: 0.6 },
];

// Esferas de vidro escuro flutuando entre o vídeo/imagem de fundo e o texto — física de gravidade zero
export default function GlassOrbs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          animate={{ y: ["0%", "-14%", "0%"], x: ["0%", "6%", "0%"] }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut", delay: orb.delay }}
          className="absolute rounded-full border border-white/10 backdrop-blur-md"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(10,8,20,0.5))",
            boxShadow: "inset 0 0 30px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.4)",
          }}
        />
      ))}
    </div>
  );
}
