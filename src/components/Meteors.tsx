"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const TRAIL_POSITIONS = new Float32Array([0, 0, 0, -1.1, 0.55, 0]);

function Meteor({ seed, onDone }: { seed: number; onDone: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const progressRef = useRef(0);
  const [{ start, speed }] = useState(() => {
    const rand = seededRandom(seed);
    return {
      start: [-7 - rand() * 2, 2.5 + rand() * 2.5, -3 - rand() * 2] as [number, number, number],
      speed: 5 + rand() * 3,
    };
  });

  useFrame((_, delta) => {
    progressRef.current += delta * speed * 0.15;
    const p = progressRef.current;
    if (groupRef.current) {
      groupRef.current.position.set(start[0] + p * 9, start[1] - p * 5, start[2]);
    }
    if (matRef.current) {
      matRef.current.opacity = p < 0.15 ? p / 0.15 : Math.max(0, 1 - (p - 0.15) / 0.85);
    }
    if (p >= 1) onDone();
  });

  return (
    <group ref={groupRef} rotation={[0, 0, -0.45]}>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[TRAIL_POSITIONS, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={matRef} color="#ffffff" transparent opacity={0} />
      </line>
    </group>
  );
}

// Estrela cadente rara: dispara em intervalos aleatórios de 4-12s, cruza a tela e some
export default function Meteors() {
  const [meteors, setMeteors] = useState<{ id: number; seed: number }[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 4000 + Math.random() * 8000;
      timeout = setTimeout(() => {
        idRef.current += 1;
        setMeteors((prev) => [...prev, { id: idRef.current, seed: idRef.current * 37 + 11 }]);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {meteors.map((m) => (
        <Meteor key={m.id} seed={m.seed} onDone={() => setMeteors((prev) => prev.filter((x) => x.id !== m.id))} />
      ))}
    </>
  );
}
