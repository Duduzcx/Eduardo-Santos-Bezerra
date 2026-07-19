"use client";

import { motion } from "framer-motion";

type SectionRevealVariant = "up" | "left" | "right" | "scale";

interface SectionRevealProps {
  children: React.ReactNode;
  variant?: SectionRevealVariant;
}

export default function SectionReveal({ children, variant = "up" }: SectionRevealProps) {
  const x = variant === "left" ? -28 : variant === "right" ? 28 : 0;
  const y = variant === "scale" ? 18 : variant === "up" ? 32 : 0;

  return (
    <motion.div
      className="w-full relative"
      initial={{ opacity: 0, x, y, scale: 0.985, clipPath: "inset(0 0 6% 0 round 1.5rem)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, clipPath: "inset(0 0 0% 0 round 0rem)" }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-[var(--color-cyan)] to-transparent pointer-events-none z-30"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: [0, 0.9, 0] }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      {children}
    </motion.div>
  );
}
