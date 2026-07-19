"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const CIRCLE_PATH = "M4,32 C2,18 14,4 32,3 C52,2 64,14 63,30 C64,48 50,61 30,62 C12,63 3,50 4,32 Z";
const PATH_LENGTH = 220;

interface CircleRevealProps {
  word: string;
  className?: string;
}

export default function CircleReveal({ word, className = "" }: CircleRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 40%"],
  });

  const dashoffset = useTransform(scrollYProgress, [0, 1], [PATH_LENGTH, 0]);

  return (
    <span ref={ref} className={`relative inline-block px-2 ${className}`}>
      {word}
      <svg viewBox="0 0 66 66" className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none" fill="none">
        <motion.path
          d={CIRCLE_PATH}
          stroke="#ef4444"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ strokeDasharray: PATH_LENGTH, strokeDashoffset: dashoffset }}
        />
      </svg>
    </span>
  );
}
