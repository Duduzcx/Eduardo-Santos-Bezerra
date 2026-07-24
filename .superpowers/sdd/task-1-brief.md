### Task 1: Hero 3D loop object (`Scene.tsx` recolor + mount)

**Files:**
- Modify: `src/components/Scene.tsx` (full file, currently 45 lines)
- Modify: `src/components/Hero.tsx:1-5` (imports) and `Hero.tsx:34-36` (insert new layer after the video wrapper `</div>`)

**Interfaces:**
- Produces: `Scene` (default export, no props) — already existed, unused until now. This task recolors it and removes its own default background z-index so the consumer controls stacking.

- [ ] **Step 1: Recolor and unpin `Scene.tsx`**

Replace the full contents of `src/components/Scene.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function AnimatedShape() {
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
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#67e8f9"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
    </Float>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimatedShape />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
```

(Two changes from the original: `color` `#ffffff` → `#67e8f9`, `opacity` `0.15` → `0.35`; dropped the hardcoded `-z-10` from the wrapper `div` so the parent controls stacking.)

- [ ] **Step 2: Mount `Scene` in the hero**

In `src/components/Hero.tsx`, replace the import block:

```tsx
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import TextReveal from "./TextReveal";
```

with:

```tsx
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import TextReveal from "./TextReveal";
import Scene from "./Scene";
```

(`Download` was imported but never used — dropped while touching this line.)

Then replace:

```tsx
        {/* Máscara escura para garantir leitura absoluta do texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0814]/40 via-[#0a0814]/70 to-[var(--background)]" />
      </div>

      <motion.div 
```

with:

```tsx
        {/* Máscara escura para garantir leitura absoluta do texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0814]/40 via-[#0a0814]/70 to-[var(--background)]" />
      </div>

      {/* Objeto 3D em loop, estilo Thor, combinado com o vídeo de fundo */}
      <div className="absolute inset-0 z-[1] opacity-60 pointer-events-none">
        <Scene />
      </div>

      <motion.div 
```

- [ ] **Step 3: Lint the touched files**

Run: `npx eslint src/components/Scene.tsx src/components/Hero.tsx`
Expected: no output (no errors, no warnings — the `Download` warning that existed before is now gone since the import was removed).

- [ ] **Step 4: Manual visual check**

Run: `npm run dev` (leave it running for the rest of this plan)
Open `http://localhost:3000`, confirm:
- A wireframe icosahedron rotates continuously behind the hero text, tinted cyan, combined with the existing video background (video still visible, not replaced).
- Open the browser console: if you see repeated errors/warnings about loading the `Environment` HDRI (network failure, CORS, or a multi-second delay before the shape appears), remove the `<Environment preset="city" />` line from `Scene.tsx` and re-check — the `ambientLight`/`directionalLight` already present are enough to light the wireframe without it.

- [ ] **Step 5: Commit**

```bash
git add src/components/Scene.tsx src/components/Hero.tsx
git commit -m "feat: mount looping 3D wireframe in hero background"
```

---

