"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  // "Planeta" viaja pela barra como se orbitasse a borda da tela — transform puro (x em %), não mexe em left/layout
  const orbitX = useTransform(scrollYProgress, [0, 1], ["0vw", "100vw"]);

  return (
    <div aria-hidden="true" className="fixed left-0 top-0 z-[80] h-[2px] w-full">
      <motion.div
        className="h-full w-full origin-left bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-accent-light)] to-[var(--color-pink)]"
        style={{ scaleX }}
      />
      <motion.div
        style={{ x: orbitX }}
        className="absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-cyan)] shadow-[0_0_10px_2px_rgba(103,232,249,0.8)]"
      />
    </div>
  );
}
