"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyMountProps {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
}

// Só monta o conteúdo pesado (hooks de scroll, cards com física de mouse etc) quando a seção
// está perto da tela — evita que tudo rode no main thread já no primeiro render da página.
export default function LazyMount({ children, minHeight = 600, rootMargin = "600px 0px" }: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, rootMargin]);

  if (mounted) return <>{children}</>;
  return <div ref={ref} style={{ minHeight }} aria-hidden="true" />;
}
