"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

interface AnimatedShapeProps {
  color: string;
  opacity: number;
  geometry: "icosahedron" | "torus";
}

function AnimatedShape({ color, opacity, geometry }: AnimatedShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef}>
        {geometry === "torus" ? (
          <torusGeometry args={[1.3, 0.45, 8, 32]} />
        ) : (
          <icosahedronGeometry args={[1.5, 1]} />
        )}
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={opacity}
        />
      </mesh>
    </Float>
  );
}

interface SceneProps {
  color?: string;
  opacity?: number;
  geometry?: "icosahedron" | "torus";
}

export default function Scene({ color = "#67e8f9", opacity = 0.35, geometry = "icosahedron" }: SceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimatedShape color={color} opacity={opacity} geometry={geometry} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
