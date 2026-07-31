"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { type MotionValue } from "framer-motion";
import * as THREE from "three";

interface PlanetaryRingsProps {
  scrollProgress?: MotionValue<number>;
}

// Anéis renderizados só com poeira/detritos (sem disco sólido) — é assim que anéis planetários
// leem como "reais" em vez de um CD plano: textura granulada, densidade variando por faixa.
const PARTICLE_COUNT = 2600;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function PlanetaryRings({ scrollProgress }: PlanetaryRingsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const moonRef1 = useRef<THREE.Mesh>(null);
  const moonRef2 = useRef<THREE.Mesh>(null);

  // Geração de poeira e micro-detritos de gelo com a lacuna da Divisão de Cassini
  const { positions, colors } = useMemo(() => {
    const rand = seededRandom(99);
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);

    const colorIce = new THREE.Color("#f8fafc");
    const colorIvory = new THREE.Color("#fef3c7");
    const colorSlate = new THREE.Color("#94a3b8");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Sorteia raio garantindo as lacunas reais: gap C→B e a Divisão de Cassini (2.82 a 2.94)
      let radius: number;
      const zone = rand();
      if (zone < 0.18) {
        // Anel C interno, tênue e translúcido
        radius = 1.62 + rand() * 0.5;
      } else if (zone < 0.75) {
        // Anel B principal, denso
        radius = 2.2 + rand() * 0.62;
      } else {
        // Anel A externo
        radius = 2.94 + rand() * 0.46;
      }

      const angle = rand() * Math.PI * 2;
      const thickness = (rand() - 0.5) * 0.055; // Anel muito fino e realista

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = thickness;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      const choice = rand();
      const tempColor = choice < 0.6 ? colorIce : choice < 0.85 ? colorIvory : colorSlate;

      col[i * 3] = tempColor.r;
      col[i * 3 + 1] = tempColor.g;
      col[i * 3 + 2] = tempColor.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame((state, delta) => {
    if (scrollProgress && scrollProgress.get() > 1.2) return;

    // Rotação orbital constante e realista do sistema de anéis
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.025;
    }

    const time = state.clock.getElapsedTime();

    // Satélite/Lua Orbitante 1 (trajetória suave com brilho gélido)
    if (moonRef1.current) {
      const radius = 3.6;
      const angle = time * 0.28;
      moonRef1.current.position.x = Math.cos(angle) * radius;
      moonRef1.current.position.z = Math.sin(angle) * radius;
      moonRef1.current.position.y = Math.sin(angle * 1.5) * 0.25;
      moonRef1.current.rotation.y += delta * 0.4;
    }

    // Satélite/Lua Orbitante 2
    if (moonRef2.current) {
      const radius = 4.8;
      const angle = -time * 0.18 + 1.8;
      moonRef2.current.position.x = Math.cos(angle) * radius;
      moonRef2.current.position.z = Math.sin(angle) * radius;
      moonRef2.current.position.y = Math.cos(angle * 1.2) * 0.4;
      moonRef2.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[1.8, 0, 0]} rotation={[0.48, 0.1, 0.2]}>
      {/* Micro-poeira de gelo orbital (Partículas cintilantes ao longo das faixas) — só isso forma o anel, sem disco sólido */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.025}
          vertexColors
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Satélite / Lua Orbitante 1 (Gelo Prateado) — sem pointLight: o glow inflava e virava "estrela gigante", e cada luz dinâmica custa render extra */}
      <mesh ref={moonRef1}>
        <sphereGeometry args={[0.045, 24, 24]} />
        <meshStandardMaterial color="#f8fafc" emissive="#e2e8f0" emissiveIntensity={0.25} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Satélite / Lua Orbitante 2 (Marfim sutil) */}
      <mesh ref={moonRef2}>
        <sphereGeometry args={[0.032, 20, 20]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.2} roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}
