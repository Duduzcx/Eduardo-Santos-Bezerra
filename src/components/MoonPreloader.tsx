"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useProgress } from "@react-three/drei";

export default function MoonPreloader() {
  const { progress, active } = useProgress();

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--background)] pointer-events-none"
        >
          <div className="flex flex-col items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60">
            <span>Iniciando ecossistema...</span>
            <span className="text-lg text-white">{Math.round(progress)}%</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
