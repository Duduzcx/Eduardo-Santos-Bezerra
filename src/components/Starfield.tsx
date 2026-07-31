"use client";

import { useMemo, useSyncExternalStore } from "react";

interface Layer {
  shadow: string;
  size: number;
  twinkleDuration: number;
  driftDuration: number;
}

function buildLayer(count: number, spread: number, size: number, seed: number): string {
  let value = "";
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rand() * spread);
    const y = Math.floor(rand() * spread);
    value += `${i === 0 ? "" : ", "}${x}px ${y}px #fff`;
  }
  return value;
}

function subscribe(callback: () => void) {
  const mq = window.matchMedia("(max-width: 767px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getSnapshot() {
  return window.matchMedia("(max-width: 767px)").matches;
}
function getServerSnapshot() {
  return false;
}

export default function Starfield({ density = 1 }: { density?: number }) {
  // Mobile ganha metade das estrelas — menos box-shadow pra pintar, mesma sensação visual
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const effectiveDensity = isMobile ? density * 0.5 : density;

  const layers = useMemo<Layer[]>(
    () => [
      { shadow: buildLayer(Math.round(190 * effectiveDensity), 2000, 1, 11), size: 1, twinkleDuration: 6, driftDuration: 70 },
      { shadow: buildLayer(Math.round(95 * effectiveDensity), 2000, 2, 47), size: 2, twinkleDuration: 4.5, driftDuration: 95 },
      { shadow: buildLayer(Math.round(45 * effectiveDensity), 2000, 2, 91), size: 2, twinkleDuration: 8, driftDuration: 55 },
    ],
    [effectiveDensity]
  );

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      {layers.map((layer, i) => (
        <div
          key={i}
          className="absolute left-0 top-0 rounded-full"
          style={{
            width: layer.size,
            height: layer.size,
            background: "transparent",
            boxShadow: layer.shadow,
            animation: `twinkle ${layer.twinkleDuration}s ease-in-out ${i * 0.6}s infinite, star-drift ${layer.driftDuration}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
