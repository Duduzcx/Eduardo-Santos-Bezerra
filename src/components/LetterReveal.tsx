"use client";

import { motion, type Variants } from "framer-motion";

interface LetterRevealProps {
  text: string;
  className?: string;
}

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.02 },
  },
};

const letterVariant: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const NBSP = " ";

export default function LetterReveal({ text, className = "" }: LetterRevealProps) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <motion.span key={i} variants={letterVariant} className="inline-block" aria-hidden="true">
          {char === " " ? NBSP : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
