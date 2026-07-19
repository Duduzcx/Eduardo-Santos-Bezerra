"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useInView } from "framer-motion";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

interface LazySceneProps {
  color?: string;
  opacity?: number;
  geometry?: "icosahedron" | "torus";
  className?: string;
}

export default function LazyScene({ className, ...sceneProps }: LazySceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });

  return (
    <div ref={ref} className={className}>
      {inView && <Scene {...sceneProps} />}
    </div>
  );
}
