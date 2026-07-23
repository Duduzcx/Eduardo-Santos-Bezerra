"use client";

import { useMemo } from "react";

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

export default function Starfield() {
  const layers = useMemo<Layer[]>(
    () => [
      { shadow: buildLayer(190, 2000, 1, 11), size: 1, twinkleDuration: 6, driftDuration: 70 },
      { shadow: buildLayer(95, 2000, 2, 47), size: 2, twinkleDuration: 4.5, driftDuration: 95 },
      { shadow: buildLayer(45, 2000, 3, 91), size: 3, twinkleDuration: 8, driftDuration: 55 },
    ],
    []
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
