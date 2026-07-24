"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LetterReveal from "./LetterReveal";

export default function IntroLoader() {
  const [exited, setExited] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setExited(true);
      document.body.style.overflow = "";
    }, 1700);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!exited && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[var(--background)]"
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
          animate={{ clipPath: "circle(150% at 50% 50%)" }}
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            <LetterReveal text="Eduardo Santos Bezerra" />
          </h1>
          <div className="h-[2px] w-48 md:w-64 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-cyan)] to-[var(--color-pink)]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
