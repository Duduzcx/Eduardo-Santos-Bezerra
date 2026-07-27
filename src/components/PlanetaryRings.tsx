"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PlanetaryRingsProps {
  scrollProgress?: any;
}

export default function PlanetaryRings({ scrollProgress }: PlanetaryRingsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const moonRef1 = useRef<THREE.Mesh>(null);
  const moonRef2 = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (scrollProgress && scrollProgress.get() > 1.2) return;

    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }

    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.04;
    }

    if (ringRef2.current) {
      ringRef2.current.rotation.z -= delta * 0.02;
    }

    // Órbita da Lua/Satélite 1
    const time = state.clock.getElapsedTime();
    if (moonRef1.current) {
      const radius = 3.2;
      const angle = time * 0.4;
      moonRef1.current.position.x = Math.cos(angle) * radius;
      moonRef1.current.position.z = Math.sin(angle) * radius;
      moonRef1.current.position.y = Math.sin(angle * 2) * 0.4;
      moonRef1.current.rotation.y += delta * 0.5;
    }

    // Órbita da Lua/Satélite 2
    if (moonRef2.current) {
      const radius = 4.5;
      const angle = -time * 0.25 + 1.5;
      moonRef2.current.position.x = Math.cos(angle) * radius;
      moonRef2.current.position.z = Math.sin(angle) * radius;
      moonRef2.current.position.y = Math.cos(angle * 1.5) * 0.6;
      moonRef2.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[1.8, 0, 0]} rotation={[0.45, 0.2, 0.3]}>
      {/* Anel Planetário Principal estilo Saturno (Ciano/Neon) */}
      <mesh ref={ringRef1} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.7, 64]} />
        <meshStandardMaterial
          color="#67e8f9"
          emissive="#67e8f9"
          emissiveIntensity={0.35}
          side={THREE.DoubleSide}
          transparent
          opacity={0.55}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Anel Secundário Externo (Violeta) */}
      <mesh ref={ringRef2} rotation={[Math.PI / 2.1, 0, 0]}>
        <ringGeometry args={[2.85, 3.1, 64]} />
        <meshStandardMaterial
          color="#a855f7"
          emissive="#a855f7"
          emissiveIntensity={0.25}
          side={THREE.DoubleSide}
          transparent
          opacity={0.4}
          roughness={0.3}
          metalness={0.9}
        />
      </mesh>

      {/* Satélite / Lua Orbitante 1 (Esfera Cobre/Ciano brilhante) */}
      <mesh ref={moonRef1}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#67e8f9"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.9}
        />
        <pointLight color="#67e8f9" intensity={0.8} distance={2} />
      </mesh>

      {/* Satélite / Lua Orbitante 2 (Esfera Violeta) */}
      <mesh ref={moonRef2}>
        <sphereGeometry args={[0.06, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#e879f9"
          emissiveIntensity={0.9}
          roughness={0.1}
          metalness={0.9}
        />
        <pointLight color="#e879f9" intensity={0.6} distance={1.8} />
      </mesh>
    </group>
  );
}
