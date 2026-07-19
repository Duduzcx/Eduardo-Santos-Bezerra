"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { View } from "@react-three/drei";
import { AnimatedShape, type ShapeGeometry } from "./Scene";

interface LazySceneProps {
  color?: string;
  opacity?: number;
  geometry?: ShapeGeometry;
  className?: string;
}

export default function LazyScene({ className, color = "#67e8f9", opacity = 0.35, geometry = "icosahedron" }: LazySceneProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });

  return (
    <View ref={ref} className={className}>
      {inView && (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedShape color={color} opacity={opacity} geometry={geometry} />
        </>
      )}
    </View>
  );
}
