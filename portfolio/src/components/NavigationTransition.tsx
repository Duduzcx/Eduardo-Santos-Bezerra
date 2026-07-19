"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NavigationTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);

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
      setIsTransitioning(true);
      timeoutId = setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", href);
        setIsTransitioning(false);
      }, 380);
    }

    document.addEventListener("click", navigate);
    return () => {
      document.removeEventListener("click", navigate);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[90] pointer-events-none overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-[var(--color-accent)] via-[var(--color-cyan)] to-[var(--color-pink)]"
            initial={{ clipPath: "polygon(0 0, 0 0, -20% 100%, -20% 100%)" }}
            animate={{ clipPath: "polygon(0 0, 120% 0, 100% 100%, -20% 100%)" }}
            exit={{ clipPath: "polygon(120% 0, 120% 0, 120% 100%, 100% 100%)" }}
            transition={{ duration: 0.32, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-[#0a0814]"
            initial={{ clipPath: "polygon(0 0, 0 0, -20% 100%, -20% 100%)" }}
            animate={{ clipPath: "polygon(0 0, 120% 0, 100% 100%, -20% 100%)" }}
            exit={{ clipPath: "polygon(120% 0, 120% 0, 120% 100%, 100% 100%)" }}
            transition={{ duration: 0.32, delay: 0.06, ease: [0.76, 0, 0.24, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
