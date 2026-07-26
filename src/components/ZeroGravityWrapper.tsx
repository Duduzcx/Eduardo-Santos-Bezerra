"use client";

import { motion } from "framer-motion";

interface ZeroGravityWrapperProps {
  children: React.ReactNode;
  delay?: number;
  rotate?: boolean;
  className?: string;
}

// Flutuação contínua e dessincronizada — aplique em cards/badges pra dar sensação de "vivo" mesmo sem interação
export default function ZeroGravityWrapper({ children, delay = 0, rotate = false, className }: ZeroGravityWrapperProps) {
  return (
    <motion.div
      animate={{
        y: ["0%", "-3%", "0%"],
        ...(rotate ? { rotateZ: [0, 1.5, 0, -1.5, 0] } : {}),
      }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
