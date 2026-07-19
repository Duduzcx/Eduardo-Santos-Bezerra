"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function FloatingObjects() {
  const { scrollYProgress } = useScroll();
  
  // Transformações agressivas baseadas no scroll para dar a sensação de que 
  // o usuário está "caindo" e os objetos estão passando muito rápido.
  const y1 = useTransform(scrollYProgress, [0, 1], ["0vh", "-200vh"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0vh", "-300vh"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0vh", "-150vh"]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Objeto 1 */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-[30vh] left-[10vw] opacity-20"
      >
        <div className="w-24 h-24 border border-[var(--color-accent)] rounded-lg rotate-12 animate-[spin_10s_linear_infinite]" />
      </motion.div>

      {/* Objeto 2 */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute top-[80vh] right-[15vw] opacity-10"
      >
        <div className="w-32 h-32 border border-[var(--color-cyan)] rounded-full border-dashed animate-[spin_15s_linear_infinite_reverse]" />
      </motion.div>

      {/* Objeto 3 */}
      <motion.div 
        style={{ y: y3 }}
        className="absolute top-[120vh] left-[20vw] opacity-20"
      >
        <div className="text-6xl text-[var(--color-pink)] font-mono animate-[bounce_4s_infinite]">
          +
        </div>
      </motion.div>

      {/* Objeto 4 */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-[180vh] right-[10vw] opacity-15"
      >
        <div className="w-16 h-16 bg-gradient-to-tr from-[var(--color-accent)] to-transparent rounded-lg rotate-45 animate-pulse" />
      </motion.div>

      {/* Objeto 5 */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute top-[250vh] left-[5vw] opacity-20"
      >
        <div className="w-40 h-1 bg-[var(--color-cyan)] rotate-45" />
      </motion.div>
    </div>
  );
}
