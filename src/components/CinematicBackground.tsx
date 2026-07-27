"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, type MotionValue } from "framer-motion";

interface CinematicBackgroundProps {
  videoSrc?: string;
  fallbackImage: string;
  alt?: string;
  glow?: boolean;
  scale?: MotionValue<number>;
  opacity?: MotionValue<number>;
}

// Wrapper de fundo cinematográfico: aceita um .webm em loop (só toca quando a seção está perto da tela,
// evita decode custando CPU fora de vista) e cai pro <img> estático se nenhum vídeo for passado ainda.
export default function CinematicBackground({ videoSrc, fallbackImage, alt = "", glow = false, scale, opacity }: CinematicBackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const glowX = useMotionValue(0.5);
  const glowY = useMotionValue(0.5);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "200px 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView) video.play().catch(() => {});
    else video.pause();
  }, [inView]);

  // Gradiente radial que segue o mouse, recalculado só quando glowX/glowY mudam (sem custo em seções sem glow)
  const [glowBg, setGlowBg] = useState("radial-gradient(240px circle at 50% 50%, rgba(103,232,249,0.18), transparent 70%)");
  useEffect(() => {
    if (!glow) return;
    const update = () => setGlowBg(`radial-gradient(240px circle at ${glowX.get() * 100}% ${glowY.get() * 100}%, rgba(103,232,249,0.22), transparent 70%)`);
    const unsubX = glowX.on("change", update);
    const unsubY = glowY.on("change", update);
    return () => {
      unsubX();
      unsubY();
    };
  }, [glow, glowX, glowY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!glow || !wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    glowX.set((e.clientX - rect.left) / rect.width);
    glowY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div ref={wrapperRef} onMouseMove={handleMouseMove} style={{ scale, opacity }} className="absolute inset-0">
      {videoSrc ? (
        <video ref={videoRef} src={videoSrc} muted loop playsInline preload="none" poster={fallbackImage} className="h-full w-full object-cover" />
      ) : (
        <img src={fallbackImage} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover grayscale" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/70 to-[var(--background)]/40" />
      {glow && <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glowBg }} />}
    </motion.div>
  );
}
