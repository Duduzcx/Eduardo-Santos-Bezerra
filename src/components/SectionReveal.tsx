"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type SectionRevealVariant = "up" | "left" | "right" | "scale";

interface SectionRevealProps {
  children: React.ReactNode;
  variant?: SectionRevealVariant;
}

export default function SectionReveal({ children, variant = "up" }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // "up": sobe, ganha escala e perde o rotateX, sensação 3D de "desdobramento".
  const yUp = useTransform(scrollYProgress, [0, 1], ["20%", "0%"]);
  const rotateXUp = useTransform(scrollYProgress, [0, 1], ["15deg", "0deg"]);
  const scaleUp = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  // "left" / "right": entra deslizando lateralmente, sem 3D.
  const xLeft = useTransform(scrollYProgress, [0, 1], ["-6%", "0%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["6%", "0%"]);

  // "scale": só cresce e some o desfoque, sem deslocamento.
  const scaleOnly = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  const variantStyle =
    variant === "left" ? { opacity, x: xLeft } :
    variant === "right" ? { opacity, x: xRight } :
    variant === "scale" ? { opacity, scale: scaleOnly } :
    { opacity, y: yUp, rotateX: rotateXUp, scale: scaleUp };

  return (
    <div ref={ref} className="w-full relative" style={{ perspective: "1200px" }}>
      <motion.div style={{ ...variantStyle, transformStyle: "preserve-3d" }}>
        {children}
      </motion.div>
    </div>
  );
}
