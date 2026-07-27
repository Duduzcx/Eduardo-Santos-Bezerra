"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

interface ScrollWordProps {
  children: React.ReactNode;
  scrollProgress: MotionValue<number>;
  index: number;
  revealDelay: number;
}

// Cada palavra some/borra em um instante levemente diferente do scroll — nome se desfaz palavra por palavra, não em bloco
export default function ScrollWord({ children, scrollProgress, index, revealDelay }: ScrollWordProps) {
  const start = index * 0.06;
  const end = start + 0.24;
  const opacity = useTransform(scrollProgress, [start, end], [1, 0]);
  const y = useTransform(scrollProgress, [start, end], [0, -30 - index * 12]);
  const blurPx = useTransform(scrollProgress, [start, end], [0, 10]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);

  return (
    <span className="inline-block overflow-hidden align-top mr-[0.28em] last:mr-0">
      <motion.span
        style={{ opacity, y, filter }}
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        animate={{ clipPath: "inset(0% 0 0 0)" }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: revealDelay }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}
