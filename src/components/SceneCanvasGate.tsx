"use client";

import dynamic from "next/dynamic";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

export default function SceneCanvasGate() {
  const isDesktop = useIsDesktop();
  if (!isDesktop) return null;
  return <SceneCanvas />;
}
