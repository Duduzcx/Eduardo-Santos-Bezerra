"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NavigationTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function navigate(event: MouseEvent) {
      const target = event.target as Element | null;
      const link = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      const href = link?.getAttribute("href");
      if (!href || href === "#" || event.defaultPrevented || event.metaKey || event.ctrlKey) return;

      const section = document.querySelector(href);
      if (!section) return;

      event.preventDefault();
      setOrigin({ x: `${event.clientX}px`, y: `${event.clientY}px` });
      setIsTransitioning(true);
      timeoutId = setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", href);
        setIsTransitioning(false);
      }, 580);
    }

    document.addEventListener("click", navigate);
    return () => {
      document.removeEventListener("click", navigate);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const particleAngles = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[90] pointer-events-none overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: `radial-gradient(circle at ${origin.x} ${origin.y}, rgba(103,232,249,0.9), rgba(124,58,237,0.5) 40%, transparent 70%)` }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 0.6], scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-[var(--color-accent)] via-[var(--color-cyan)] to-[var(--color-pink)]"
            initial={{ clipPath: "polygon(0 0, 0 0, -20% 100%, -20% 100%)" }}
            animate={{ clipPath: "polygon(0 0, 120% 0, 100% 100%, -20% 100%)" }}
            exit={{ clipPath: "polygon(120% 0, 120% 0, 120% 100%, 100% 100%)" }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-[#0a0814]"
            initial={{ clipPath: "polygon(0 0, 0 0, -20% 100%, -20% 100%)" }}
            animate={{ clipPath: "polygon(0 0, 120% 0, 100% 100%, -20% 100%)" }}
            exit={{ clipPath: "polygon(120% 0, 120% 0, 120% 100%, 100% 100%)" }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
          />
          {particleAngles.map((angle, i) => (
            <motion.span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-[var(--color-cyan)]"
              style={{ left: origin.x, top: origin.y }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], x: Math.cos(angle) * 140, y: Math.sin(angle) * 140, scale: [0.5, 1, 0.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
