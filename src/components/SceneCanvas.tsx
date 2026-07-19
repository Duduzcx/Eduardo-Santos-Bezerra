"use client";

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

export default function SceneCanvas() {
  return (
    <Canvas
      className="!fixed !inset-0"
      style={{ position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
    >
      <View.Port />
    </Canvas>
  );
}
