"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import type { ShapeGeometry } from "./Scene";

const LazySceneContent = dynamic(() => import("./LazySceneContent"), { ssr: false });

interface LazySceneProps {
  color?: string;
  opacity?: number;
  geometry?: ShapeGeometry;
  className?: string;
}

export default function LazyScene({ className, color = "#67e8f9", opacity = 0.35, geometry = "icosahedron" }: LazySceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const isDesktop = useIsDesktop();

  return (
    <div ref={ref} className={className}>
      {inView && isDesktop && <LazySceneContent color={color} opacity={opacity} geometry={geometry} />}
    </div>
  );
}
