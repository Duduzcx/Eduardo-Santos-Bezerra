"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function subscribe(callback: () => void) {
  const mql = window.matchMedia("(pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getSnapshot() {
  return window.matchMedia("(pointer: fine)").matches;
}
function getServerSnapshot() {
  return false;
}

export default function CustomCursor() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isActive, setIsActive] = useState(false);

  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const ringX = useSpring(dotX, { damping: 25, stiffness: 300, mass: 0.5 });
  const ringY = useSpring(dotY, { damping: 25, stiffness: 300, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;

    function handleMove(event: MouseEvent) {
      dotX.set(event.clientX);
      dotY.set(event.clientY);
      const target = (event.target as Element | null)?.closest("[data-magnetic], a, button");
      setIsActive(Boolean(target));
    }

    document.addEventListener("mousemove", handleMove);
    document.body.classList.add("custom-cursor-active");
    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.body.classList.remove("custom-cursor-active");
    };
  }, [enabled, dotX, dotY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-white pointer-events-none"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        aria-hidden="true"
        className="fixed left-0 top-0 z-[9999] rounded-full border pointer-events-none"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: isActive ? 56 : 32,
          height: isActive ? 56 : 32,
          borderColor: isActive ? "rgba(103,232,249,0.9)" : "rgba(255,255,255,0.5)",
          backgroundColor: isActive ? "rgba(103,232,249,0.15)" : "rgba(255,255,255,0)",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </>
  );
}
