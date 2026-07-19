"use client";

import { motion, AnimatePresence, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

export default function TransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenis = useLenis();

  // Curva de Bézier Premium
  const ease = [0.76, 0, 0.24, 1] as const;

  const modernTransition: Variants = {
    initial: { opacity: 0, y: 10 },
    enter: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.45, ease, delay: 0.05 } 
    },
    exit: { 
      opacity: 0, 
      y: -8,
      transition: { duration: 0.25, ease } 
    }
  };

  return (
    <AnimatePresence 
      mode="wait" 
      onExitComplete={() => {
        lenis?.scrollTo(0, { immediate: true });
      }}
    >
      <div key={pathname} className="w-full relative">
        <motion.div 
          className="w-full relative bg-transparent"
          initial="initial"
          animate="enter"
          exit="exit"
          variants={modernTransition}
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
