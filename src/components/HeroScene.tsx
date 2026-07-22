"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useReducedMotion, type MotionValue } from "framer-motion";
import * as THREE from "three";

interface HelmetProps {
  scrollProgress: MotionValue<number>;
}

function Helmet({ scrollProgress }: HelmetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scene } = useGLTF("/models/hero-helmet.glb", "/draco/");

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (!prefersReducedMotion) {
      groupRef.current.rotation.y += delta * 0.25;
    }
    groupRef.current.rotation.x = scrollProgress.get() * Math.PI * 0.15;
  });

  return (
    <group ref={groupRef} scale={1.6}>
      <primitive object={scene} />
    </group>
  );
}

interface HeroSceneProps {
  scrollProgress: MotionValue<number>;
}

export default function HeroScene({ scrollProgress }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      className="!absolute !inset-0"
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 4, 4]} intensity={2.2} color="#67e8f9" />
      <directionalLight position={[-4, -2, -3]} intensity={1.2} color="#e879f9" />
      <Suspense fallback={null}>
        <Helmet scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/hero-helmet.glb", "/draco/");
