"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const POINT_COUNT = 46;
const MAX_LINKS = 10;
const LINK_DISTANCE = 2.2;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Campo de pontos fixo — quando o mouse chega perto, linhas finas conectam os pontos próximos a ele (rede neural/constelação)
export default function Constellation() {
  const linesRef = useRef<THREE.LineSegments>(null);

  const basePositions = useMemo(() => {
    const rand = seededRandom(17);
    const arr = new Float32Array(POINT_COUNT * 3);
    for (let i = 0; i < POINT_COUNT; i++) {
      arr[i * 3] = (rand() - 0.5) * 9;
      arr[i * 3 + 1] = (rand() - 0.5) * 5;
      arr[i * 3 + 2] = -1 - rand() * 2;
    }
    return arr;
  }, []);

  const pointPositions = useMemo(() => basePositions.slice(), [basePositions]);
  const initialLinePositions = useMemo(() => new Float32Array(MAX_LINKS * 2 * 3), []);

  useFrame((state) => {
    const geo = linesRef.current?.geometry;
    if (!geo) return;
    const attr = geo.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    const mx = state.pointer.x * 4.5;
    const my = state.pointer.y * 2.8;
    const mz = -1.5;

    let linkCount = 0;
    for (let i = 0; i < POINT_COUNT && linkCount < MAX_LINKS; i++) {
      const px = basePositions[i * 3];
      const py = basePositions[i * 3 + 1];
      const pz = basePositions[i * 3 + 2];
      const dx = px - mx;
      const dy = py - my;
      const dz = pz - mz;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < LINK_DISTANCE) {
        const base = linkCount * 6;
        arr[base] = px;
        arr[base + 1] = py;
        arr[base + 2] = pz;
        arr[base + 3] = mx;
        arr[base + 4] = my;
        arr[base + 5] = mz;
        linkCount++;
      }
    }

    attr.needsUpdate = true;
    geo.setDrawRange(0, linkCount * 2);
  });

  return (
    <group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#67e8f9" transparent opacity={0.65} sizeAttenuation depthWrite={false} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[initialLinePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#67e8f9" transparent opacity={0.35} depthWrite={false} />
      </lineSegments>
    </group>
  );
}
