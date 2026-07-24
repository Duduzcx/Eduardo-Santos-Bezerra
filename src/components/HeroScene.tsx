"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import StarParticles from "./StarParticles";

function Moon() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/hero-moon.glb", "/draco/");

  useFrame((state) => {
    if (!groupRef.current) return;
    // Segue o mouse com inércia (lerp) — rotação + leve deslocamento, suave e fluido
    const targetRotY = state.pointer.x * 0.6;
    const targetRotX = state.pointer.y * 0.3;
    const targetPosX = 1.6 + state.pointer.x * 0.3;
    const targetPosY = state.pointer.y * 0.2;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.04);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.04);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.03);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.03);
  });

  return (
    <group ref={groupRef} scale={5.5} position={[1.6, 0, -2]}>
      <primitive object={scene} />
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      className="!absolute !inset-0"
      style={{ pointerEvents: "none" }}
    >
      {/* Alto contraste: um lado iluminado, resto em escuridão profunda — sem luz de preenchimento */}
      <ambientLight intensity={0.04} />
      <directionalLight position={[6, 2, 4]} intensity={4.5} color="#ffffff" />
      <StarParticles />
      <Suspense fallback={null}>
        <Moon />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/hero-moon.glb", "/draco/");
