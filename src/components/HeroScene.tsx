"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import StarParticles from "./StarParticles";

function Moon() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/hero-moon.glb", "/draco/");

  useEffect(() => {
    // Sem isso o glTF vem com specular alto/metálico (bola de plástico) — força rocha fosca em todos os materiais da malha
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.roughness = 1;
            mat.metalness = 0;
          }
        });
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Rotação lenta contínua (sempre "viva") + segue o mouse por cima, com inércia
    groupRef.current.rotation.y += delta * 0.05;
    const targetRotX = state.pointer.y * 0.25;
    const targetPosX = 1.8 + state.pointer.x * 0.4;
    const targetPosY = state.pointer.y * 0.25;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.04);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.03);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.03);
  });

  return (
    <group ref={groupRef} scale={4} position={[1.8, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      className="!absolute !inset-0 !w-full !h-full"
      style={{ pointerEvents: "none" }}
    >
      {/* Fosco e dramático: luz lateral rasante (crateras com sombra), sem luz frontal que estoura o material */}
      <ambientLight intensity={0.06} />
      <directionalLight position={[8, 1, 2]} intensity={2.2} color="#ffffff" />
      <StarParticles />
      <Suspense fallback={null}>
        <Moon />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/hero-moon.glb", "/draco/");
