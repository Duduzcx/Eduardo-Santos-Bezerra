"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import { useReducedMotion, type MotionValue } from "framer-motion";
import * as THREE from "three";
import StarParticles from "./StarParticles";

interface AstronautProps {
  scrollProgress: MotionValue<number>;
}

function Astronaut({ scrollProgress }: AstronautProps) {
  const groupRef = useRef<THREE.Group>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scene } = useGLTF("/models/hero-astronaut.glb", "/draco/");

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    if (!prefersReducedMotion) {
      // Flutuação orgânica em gravidade zero + "respiração" — física procedural via seno, sem depender de rig/animação do modelo
      groupRef.current.rotation.y += delta * 0.25;
      groupRef.current.position.y = Math.sin(t * 0.6) * 0.12;
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.05;
    }
    groupRef.current.rotation.x = scrollProgress.get() * Math.PI * 0.15;
  });

  return (
    <group ref={groupRef} scale={1.4}>
      <primitive object={scene} />
    </group>
  );
}

interface PlanetProps {
  position: [number, number, number];
  radius: number;
  color: string;
}

function Planet({ position, radius, color }: PlanetProps) {
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh position={position}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} roughness={0.5} />
      </mesh>
    </Float>
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
      <StarParticles />
      <Suspense fallback={null}>
        <Astronaut scrollProgress={scrollProgress} />
        <Planet position={[-2.1, 1.1, -1.4]} radius={0.35} color="#67e8f9" />
        <Planet position={[2.2, -0.9, -1.8]} radius={0.22} color="#e879f9" />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/hero-astronaut.glb", "/draco/");
