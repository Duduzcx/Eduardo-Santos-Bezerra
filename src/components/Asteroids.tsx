"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance } from "@react-three/drei";
import { type MotionValue } from "framer-motion";
import * as THREE from "three";

interface AsteroidsProps {
  scrollProgress: MotionValue<number>;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const COUNT = 12;

// Pedras escuras nas bordas do viewport, parallax pesado atrelado ao scroll, giro lento por instância
export default function Asteroids({ scrollProgress }: AsteroidsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const instanceRefs = useRef<(THREE.Object3D | null)[]>([]);

  const rocks = useMemo(() => {
    const rand = seededRandom(73);
    return Array.from({ length: COUNT }, () => {
      const angle = rand() * Math.PI * 2;
      const radius = 6.5 + rand() * 4.5;
      return {
        position: [Math.cos(angle) * radius, (rand() - 0.5) * 7, Math.sin(angle) * radius - 5] as [number, number, number],
        rotationSpeed: 0.06 + rand() * 0.14,
        scale: 0.14 + rand() * 0.3,
      };
    });
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.y = scrollProgress.get() * 3.5;
    }
    instanceRefs.current.forEach((obj, i) => {
      if (!obj) return;
      obj.rotation.x += delta * rocks[i].rotationSpeed;
      obj.rotation.y += delta * rocks[i].rotationSpeed * 0.6;
    });
  });

  return (
    <group ref={groupRef}>
      <Instances limit={COUNT}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#15101d" roughness={1} metalness={0} />
        {rocks.map((rock, i) => (
          <Instance
            key={i}
            ref={(el) => {
              instanceRefs.current[i] = el as THREE.Object3D | null;
            }}
            position={rock.position}
            scale={rock.scale}
          />
        ))}
      </Instances>
      {/* Luz de contorno fraca vinda de trás — só dá rim light nos asteroides, não alcança a lua */}
      <pointLight position={[0, 0, -11]} intensity={2.5} color="#67e8f9" distance={9} decay={2} />
    </group>
  );
}
