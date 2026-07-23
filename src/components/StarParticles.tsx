"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 600;

// Gerador com seed fixa (não Math.random) — determinístico, satisfaz a regra de pureza do React e evita reshuffle a cada render
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildPositions(): Float32Array {
  const rand = seededRandom(17);
  const arr = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    arr[i * 3] = (rand() - 0.5) * 12;
    arr[i * 3 + 1] = (rand() - 0.5) * 8;
    arr[i * 3 + 2] = (rand() - 0.5) * 6 - 2;
  }
  return arr;
}

export default function StarParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => buildPositions(), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.pointer.x * 0.08;
    pointsRef.current.rotation.x = state.pointer.y * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.02} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}
