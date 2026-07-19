"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion, type MotionValue } from "framer-motion";
import * as THREE from "three";

export type ShapeGeometry = "icosahedron" | "torus" | "dodecahedron" | "octahedron" | "torusknot";

interface AnimatedShapeProps {
  color: string;
  opacity: number;
  geometry: ShapeGeometry;
  scrollProgress?: MotionValue<number>;
}

export function AnimatedShape({ color, opacity, geometry, scrollProgress }: AnimatedShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const prefersReducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    if (!prefersReducedMotion) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (scrollProgress) {
      const progress = scrollProgress.get();
      meshRef.current.rotation.z = progress * Math.PI * 0.5;
      meshRef.current.scale.setScalar(0.85 + progress * 0.25);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        {geometry === "torus" ? (
          <torusGeometry args={[1.3, 0.45, 8, 32]} />
        ) : geometry === "dodecahedron" ? (
          <dodecahedronGeometry args={[1.5, 0]} />
        ) : geometry === "octahedron" ? (
          <octahedronGeometry args={[1.6, 0]} />
        ) : geometry === "torusknot" ? (
          <torusKnotGeometry args={[1, 0.35, 100, 12]} />
        ) : (
          <icosahedronGeometry args={[1.5, 1]} />
        )}
        <meshStandardMaterial color={color} wireframe transparent opacity={opacity} />
      </mesh>
    </Float>
  );
}
