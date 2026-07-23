"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useReducedMotion, type MotionValue } from "framer-motion";
import * as THREE from "three";
import StarParticles from "./StarParticles";

interface AstronautProps {
  scrollProgress: MotionValue<number>;
}

function Astronaut({ scrollProgress }: AstronautProps) {
  const groupRef = useRef<THREE.Group>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scene, animations } = useGLTF("/models/hero-astronaut.glb", "/draco/");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    const first = animations[0]?.name;
    if (first && actions[first]) actions[first].reset().play();
  }, [actions, animations]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // Modelo tem o pivô nos pés (bbox Y de ~0 a ~2.64), não no centro — offset fixo recentraliza no frame da câmera
    const centerOffset = -1.45;
    if (!prefersReducedMotion) {
      // Flutuação orgânica em gravidade zero — física procedural via seno, independente da animação de esqueleto (walk cycle)
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.position.y = centerOffset + Math.sin(t * 0.6) * 0.12;
      groupRef.current.rotation.z = Math.sin(t * 0.4) * 0.05;
    } else {
      groupRef.current.position.y = centerOffset;
    }
    groupRef.current.rotation.x = scrollProgress.get() * Math.PI * 0.15;
    // Recuo no eixo Z conforme rola — o astronauta se afasta pra não atrapalhar as seções seguintes
    groupRef.current.position.z = -scrollProgress.get() * 3;
  });

  return (
    <group ref={groupRef} scale={1.1} position={[0.6, -1.45, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Moon({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/models/hero-moon.glb", "/draco/");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    const first = animations[0]?.name;
    if (first && actions[first]) actions[first].reset().play();
  }, [actions, animations]);

  useFrame(() => {
    if (!groupRef.current) return;
    // Parallax mais lento que o astronauta — camada intermediária, sensação de profundidade
    groupRef.current.position.y = 0.6 + scrollProgress.get() * 1.2;
  });

  return (
    <group ref={groupRef} position={[-2.4, 0.6, -10]} scale={0.9}>
      <primitive object={scene} />
    </group>
  );
}

function Sun() {
  const { scene } = useGLTF("/models/hero-sun.glb", "/draco/");
  return (
    <group position={[3, 1.5, -35]} scale={9}>
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
      {/* Ambiente quase escuro de propósito — a "luz" vem do sol distante, não de uma luz genérica de estúdio */}
      <ambientLight intensity={0.12} />
      {/* Rim light vindo da direção do sol, batendo na lateral/costas do astronauta */}
      <directionalLight position={[3, 1.5, -20]} intensity={3.5} color="#e6f0ff" />
      <directionalLight position={[-3, -1, 3]} intensity={0.5} color="#67e8f9" />
      <StarParticles />
      <Suspense fallback={null}>
        <Sun />
        <Moon scrollProgress={scrollProgress} />
        <Astronaut scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/hero-astronaut.glb", "/draco/");
useGLTF.preload("/models/hero-moon.glb", "/draco/");
useGLTF.preload("/models/hero-sun.glb", "/draco/");
