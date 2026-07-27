"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlanetaryRingsProps {
  scrollProgress?: any;
}

const PARTICLE_COUNT = 1400;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function PlanetaryRings({ scrollProgress }: PlanetaryRingsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const moonRef1 = useRef<THREE.Mesh>(null);
  const moonRef2 = useRef<THREE.Mesh>(null);

  // Gera um anel de poeira estelar realista (partículas organizadas em disco com variação de raio e altura)
  const { positions, colors } = useMemo(() => {
    const rand = seededRandom(88);
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const colorCyan = new THREE.Color("#67e8f9");
    const colorGold = new THREE.Color("#fbbf24");
    const colorPurple = new THREE.Color("#c084fc");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribuição em disco (raio interno 2.0 até raio externo 3.4)
      const radius = 2.0 + rand() * 1.4;
      const angle = rand() * Math.PI * 2;
      const thickness = (rand() - 0.5) * 0.18; // Espessura fina realista do anel

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = thickness;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      // Interpolação de cores quentes e frias de poeira estelar
      const choice = rand();
      const tempColor = choice < 0.5 ? colorCyan : choice < 0.8 ? colorGold : colorPurple;

      col[i * 3] = tempColor.r;
      col[i * 3 + 1] = tempColor.g;
      col[i * 3 + 2] = tempColor.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (scrollProgress && scrollProgress.get() > 1.2) return;

    // Rotação suave contínua do anel de poeira 3D
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
    }

    const time = state.clock.getElapsedTime();

    // Satélite/Lua Orbitante 1 (trajetória suave com rastro brilhante)
    if (moonRef1.current) {
      const radius = 3.1;
      const angle = time * 0.35;
      moonRef1.current.position.x = Math.cos(angle) * radius;
      moonRef1.current.position.z = Math.sin(angle) * radius;
      moonRef1.current.position.y = Math.sin(angle * 1.8) * 0.35;
      moonRef1.current.rotation.y += delta * 0.6;
    }

    // Satélite/Lua Orbitante 2
    if (moonRef2.current) {
      const radius = 4.2;
      const angle = -time * 0.22 + 2.0;
      moonRef2.current.position.x = Math.cos(angle) * radius;
      moonRef2.current.position.z = Math.sin(angle) * radius;
      moonRef2.current.position.y = Math.cos(angle * 1.4) * 0.5;
      moonRef2.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[1.8, 0, 0]} rotation={[0.42, 0.15, 0.25]}>
      {/* Anel de Poeira Estelar Realista (Points Particles) */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          vertexColors
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Satélite Orbitante 1 com Atmosfera Ciano */}
      <mesh ref={moonRef1}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#67e8f9"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.9}
        />
        <pointLight color="#67e8f9" intensity={1.2} distance={2.5} />
      </mesh>

      {/* Satélite Orbitante 2 com Atmosfera Ouro Champagne */}
      <mesh ref={moonRef2}>
        <sphereGeometry args={[0.05, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#fbbf24"
          emissiveIntensity={0.95}
          roughness={0.1}
          metalness={0.9}
        />
        <pointLight color="#fbbf24" intensity={0.9} distance={2.0} />
      </mesh>
    </group>
  );
}
