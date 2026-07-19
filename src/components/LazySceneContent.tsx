"use client";

import { View } from "@react-three/drei";
import { AnimatedShape, type ShapeGeometry } from "./Scene";

interface LazySceneContentProps {
  color: string;
  opacity: number;
  geometry: ShapeGeometry;
}

export default function LazySceneContent({ color, opacity, geometry }: LazySceneContentProps) {
  return (
    <View className="absolute inset-0 w-full h-full pointer-events-none">
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <AnimatedShape color={color} opacity={opacity} geometry={geometry} />
    </View>
  );
}
