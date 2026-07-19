"use client";

import { motion, type Variants } from "framer-motion";
import { useForceReveal } from "@/hooks/useForceReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface LetterRevealProps {
  text: string;
  className?: string;
}

const NBSP = " ";

export default function LetterReveal({ text, className = "" }: LetterRevealProps) {
  const forceReveal = useForceReveal();
  const prefersReducedMotion = usePrefersReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.02 } },
  };

  const letterVariant: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, rotateX: -70, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: { duration: prefersReducedMotion ? 0.01 : 0.45, ease: "easeOut" },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{ perspective: 400 }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      animate={forceReveal ? "visible" : undefined}
      viewport={{ once: true, margin: "-80px" }}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <motion.span key={i} variants={letterVariant} className="inline-block origin-bottom" aria-hidden="true">
          {char === " " ? NBSP : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
