# Dark-Only Theme + Split Hero Layout + Astronaut/Planets + Perf Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the light theme entirely, restructure Hero into a two-column layout (name/text left, 3D right instead of overlapping), swap the hero's helmet for a real astronaut model plus two procedural planets, and cut a real GPU cost (`ColorfulBackground`'s continuous large-blur animation).

**Architecture:** Small, mostly-independent edits. The 3D swap reuses the exact `HeroScene`/`useGLTF`/Draco pattern from the previous round (same file, new model path, plus two cheap procedural sphere meshes in the same Canvas — no new WebGL context, no new dependency).

**Tech Stack:** Same as before — `@react-three/fiber`, `@react-three/drei` (`useGLTF`, `Float`), `three`, `framer-motion`. No new dependencies. New model asset already downloaded and compressed in this session: `google/model-viewer`'s `Astronaut.glb` (Apache-2.0), 2.87MB → 24.6KB via the same `@gltf-transform/cli` pipeline used for the helmet.

Spec: `docs/superpowers/specs/2026-07-22-astronomy-hero-dark-only-design.md`

## Global Constraints

- No new npm dependencies. `@gltf-transform/cli` is invoked via `npx` in Task 3 only, never added to `package.json`.
- No automated test suite — verification is `npx eslint`, `npx tsc --noEmit`, `npm run build`.
- Current lint baseline: 2 pre-existing warnings (`@next/next/no-img-element` in `Laboratory.tsx`, `Process.tsx`), zero errors.
- Git discipline: `git add` exact files per commit, never `-A`/`.`.
- Model source: `https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/Astronaut.glb` — Apache License 2.0 (permissive, from Google's own open-source repo). Compression already verified in this environment: `copy` → `resize 512×512` → `webp quality 75` → `draco` → 24.6KB, `gltf-transform inspect` confirmed structurally valid.
- Draco decoder is already self-hosted at `public/draco/` from the previous round — reused as-is, not re-copied.
- Windows/PowerShell dev environment; all commands are plain `npm`/`npx`/`curl` (or `Invoke-WebRequest -Uri <url> -OutFile <path>` as the PowerShell equivalent for any `curl -sL -o`).

---

### Task 1: Remove the light theme entirely

**Files:**
- Delete: `src/components/ThemeToggle.tsx`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Interfaces:** Removes `ThemeToggle` (default export) — no other file references it after Navbar.tsx is edited.

- [ ] **Step 1: Delete ThemeToggle**

```bash
git rm src/components/ThemeToggle.tsx
```

- [ ] **Step 2: Remove it from Navbar**

In `src/components/Navbar.tsx`, replace:

```tsx
import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon } from "./Icons";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
```

with:

```tsx
import { motion } from "framer-motion";
import { GithubIcon, LinkedinIcon } from "./Icons";
import Link from "next/link";
```

Then replace:

```tsx
          <a href="https://linkedin.com" target="_blank" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-neutral-400 hover:text-[var(--color-cyan)] hover:border-[var(--color-cyan)] transition-all">
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <ThemeToggle />
        </div>
```

with:

```tsx
          <a href="https://linkedin.com" target="_blank" className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-neutral-400 hover:text-[var(--color-cyan)] hover:border-[var(--color-cyan)] transition-all">
            <LinkedinIcon className="w-4 h-4" />
          </a>
        </div>
```

- [ ] **Step 3: Remove the light theme CSS block**

In `src/app/globals.css`, replace:

```css
  color-scheme: dark;
}

:root[data-theme="light"] {
  --background: #f4f2f9;
  --foreground: #0f0a1c;
  --background-alt: #eeeaf6;
  --background-panel: #ffffff;

  --color-surface: #ffffff;
  --color-border: rgba(124, 58, 237, 0.16);
  --border-subtle: rgba(15, 10, 28, 0.09);
  --text-secondary: #52525b;
  --text-tertiary: #71717a;
  --color-accent: #6d28d9;
  --color-accent-light: #9333ea;
  --color-pink: #a21caf;
  --color-cyan: #0e7490;

  color-scheme: light;
}
```

with:

```css
  color-scheme: dark;
}
```

- [ ] **Step 4: Remove the theme-switching script and attribute**

In `src/app/layout.tsx`, replace:

```tsx
    <html lang="pt-BR" className="scroll-smooth" data-theme="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="light")document.documentElement.dataset.theme="light";}catch(e){}`,
          }}
        />
      </head>
```

with:

```tsx
    <html lang="pt-BR" className="scroll-smooth">
      <head />
```

- [ ] **Step 5: Lint, typecheck, build**

Run: `npx eslint src/components/Navbar.tsx src/app/layout.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run build`
Expected: `✓ Compiled successfully`, no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/Navbar.tsx src/app/globals.css src/app/layout.tsx
git commit -m "refactor: remove light theme entirely, dark-only site"
```

(`git rm` from Step 1 stages the deletion separately — it's included in this same commit alongside the edits above; don't unstage it.)

---

### Task 2: Split Hero into two columns (text left, 3D right)

**Files:**
- Modify: `src/components/Hero.tsx`

**Interfaces:** None — internal layout change only, `HeroScene` is still called the same way (`<HeroScene scrollProgress={scrollYProgress} />`), just inside a differently-sized container.

- [ ] **Step 1: Replace the whole `return` block**

In `src/components/Hero.tsx`, replace:

```tsx
  return (
    <section ref={sectionRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" onMouseMove={handleHeroMouseMove}>
      {/* Máscara escura para garantir leitura do texto — antes ficava sobre o vídeo, agora é o próprio fundo */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[var(--background)]/40 via-[var(--background)]/70 to-[var(--background)]" />

      <div className="absolute inset-0 z-[1]">
        <Starfield />
      </div>

      {/* Capacete 3D real (CC0), gira com o scroll da seção e reage à posição do mouse */}
      <motion.div style={{ x: sceneSpringX, y: sceneSpringY }} className="absolute inset-0 z-[1] pointer-events-none">
        {isDesktop && <HeroScene scrollProgress={scrollYProgress} />}
      </motion.div>

      <FloatingTechCards />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center relative z-10 pt-20"
      >
        <motion.div variants={item} animate={{ y: [0, -4, 0] }} transition={{ y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } }} className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-accent)]/50 mb-8 -mt-20 md:-mt-32 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
          <span className="w-2 h-2 rounded-full bg-[var(--color-cyan)] animate-pulse" />
          <span className="text-sm text-neutral-200 font-mono font-bold tracking-widest uppercase">Disponível para novos desafios</span>
        </motion.div>
        
        <motion.h1 variants={item} className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[0.95]">
          Eduardo<br />
          Santos Bezerra<span className="text-[var(--color-accent)] animate-pulse">_</span>
        </motion.h1>
        
        <motion.h2 variants={item} className="text-lg md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-accent)] to-[var(--color-pink)] font-bold mb-7 tracking-[0.16em] animate-gradient-x">
          <LetterReveal text="DESENVOLVEDOR FULL STACK" />
        </motion.h2>
        
        <div className="max-w-2xl mx-auto mb-12">
          <TextReveal 
            text="Construindo ecossistemas digitais de ponta a ponta com alta performance, design imersivo e arquiteturas escaláveis para impactar o seu negócio."
            className="text-lg md:text-xl text-neutral-300 leading-relaxed font-light justify-center"
          />
        </div>
        
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
          <motion.a
            ref={btnRef}
            href="#projects"
            onMouseMove={handleBtnMouseMove}
            onMouseLeave={handleBtnMouseLeave}
            style={{ x: springX, y: springY }}
            className="group relative px-7 py-4 rounded-xl bg-white text-[#0a0814] font-semibold hover:bg-neutral-100 transition-colors shadow-[0_12px_32px_rgba(255,255,255,0.16)] flex items-center gap-3"
          >
            Ver projetos selecionados
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.a>
          <a href="#contact" className="group px-7 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors flex items-center gap-3">
            <MessageCircle className="w-4 h-4 text-[var(--color-cyan)]" />
            Falar sobre um projeto
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

with:

```tsx
  return (
    <section ref={sectionRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" onMouseMove={handleHeroMouseMove}>
      {/* Máscara escura para garantir leitura do texto — antes ficava sobre o vídeo, agora é o próprio fundo */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[var(--background)]/40 via-[var(--background)]/70 to-[var(--background)]" />

      <div className="absolute inset-0 z-[1]">
        <Starfield />
      </div>

      <FloatingTechCards />

      <div className="w-full max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-6 pt-20 lg:pt-0">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <motion.div variants={item} animate={{ y: [0, -4, 0] }} transition={{ y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" } }} className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-accent)]/50 mb-8 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-cyan)] animate-pulse" />
            <span className="text-sm text-neutral-200 font-mono font-bold tracking-widest uppercase">Disponível para novos desafios</span>
          </motion.div>
          
          <motion.h1 variants={item} className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[0.95]">
            Eduardo<br />
            Santos Bezerra<span className="text-[var(--color-accent)] animate-pulse">_</span>
          </motion.h1>
          
          <motion.h2 variants={item} className="text-lg md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-accent)] to-[var(--color-pink)] font-bold mb-7 tracking-[0.16em] animate-gradient-x">
            <LetterReveal text="DESENVOLVEDOR FULL STACK" />
          </motion.h2>
          
          <div className="max-w-2xl mb-12">
            <TextReveal 
              text="Construindo ecossistemas digitais de ponta a ponta com alta performance, design imersivo e arquiteturas escaláveis para impactar o seu negócio."
              className="text-lg md:text-xl text-neutral-300 leading-relaxed font-light justify-center lg:justify-start"
            />
          </div>
          
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4 mt-2">
            <motion.a
              ref={btnRef}
              href="#projects"
              onMouseMove={handleBtnMouseMove}
              onMouseLeave={handleBtnMouseLeave}
              style={{ x: springX, y: springY }}
              className="group relative px-7 py-4 rounded-xl bg-white text-[#0a0814] font-semibold hover:bg-neutral-100 transition-colors shadow-[0_12px_32px_rgba(255,255,255,0.16)] flex items-center gap-3"
            >
              Ver projetos selecionados
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <a href="#contact" className="group px-7 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors flex items-center gap-3">
              <MessageCircle className="w-4 h-4 text-[var(--color-cyan)]" />
              Falar sobre um projeto
            </a>
          </motion.div>
        </motion.div>

        {/* Coluna do objeto 3D — astronauta + planetas (Task 4), à direita no desktop */}
        <motion.div style={{ x: sceneSpringX, y: sceneSpringY }} className="relative w-full h-[400px] lg:h-[560px] lg:flex-1 pointer-events-none">
          {isDesktop && <HeroScene scrollProgress={scrollYProgress} />}
        </motion.div>
      </div>
    </section>
  );
}
```

Text block becomes `flex-1`, left-aligned on `lg:` (centered below that, same as before on mobile). The 3D object's wrapper stops being a full-viewport `absolute inset-0` overlay and becomes a sized column (`h-[400px] lg:h-[560px]`, `lg:flex-1`) next to the text instead of behind it. `HeroScene`'s internal `<Canvas camera={{position:[0,0,5]}}>` naturally centers its content within whatever container it's given, so nothing inside `HeroScene.tsx` needs to change for this — it'll just center within the narrower right column instead of the full viewport.

- [ ] **Step 2: Lint and typecheck**

Run: `npx eslint src/components/Hero.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 3: Manual visual check** (needs a real browser — none available in this environment)

At ≥1024px: name/text sits on the left, 3D object column on the right, not overlapping. Badge/heading/paragraph/buttons all left-aligned. Below 1024px: everything stacks vertically, centered, same as before (no 3D there regardless).

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: split Hero into two columns, name left, 3D object right"
```

---

### Task 3: Download and compress the astronaut model asset

**Files:**
- Create: `public/models/hero-astronaut.glb`
- Modify: `src/components/Contact.tsx` (credit line)

**Interfaces:** Produces a static file at `/models/hero-astronaut.glb`. Task 4 consumes it by exact path. Reuses the Draco decoder already at `public/draco/` from the previous round — nothing to redo there.

- [ ] **Step 1: Download the source model**

```bash
mkdir -p /tmp/astronaut-src
cd /tmp/astronaut-src
curl -sL -o Astronaut.glb "https://raw.githubusercontent.com/google/model-viewer/master/packages/shared-assets/models/Astronaut.glb"
ls -la Astronaut.glb
```

Expected: ~2.87MB.

- [ ] **Step 2: Compress with @gltf-transform/cli**

```bash
cd /tmp/astronaut-src
npx --yes @gltf-transform/cli resize Astronaut.glb r512.glb --width 512 --height 512
npx --yes @gltf-transform/cli webp r512.glb w512.glb --slots "*" --quality 75
npx --yes @gltf-transform/cli draco w512.glb final.glb
ls -la final.glb
```

Expected: `final.glb` roughly 20-30KB (verified in this environment at 24.6KB before this plan was written — this model's simpler geometry compresses further than the previous helmet's).

- [ ] **Step 3: Verify structural validity**

Run: `npx --yes @gltf-transform/cli inspect /tmp/astronaut-src/final.glb`
Expected: table output, `extensionsUsed: EXT_texture_webp, KHR_draco_mesh_compression`, no errors.

- [ ] **Step 4: Place the model, remove the old one**

```bash
cp /tmp/astronaut-src/final.glb public/models/hero-astronaut.glb
git rm public/models/hero-helmet.glb
ls -la public/models/
```

- [ ] **Step 5: Update the footer credit**

In `src/components/Contact.tsx`, replace:

```tsx
        <span className="block mt-1 text-xs opacity-70">Modelo 3D &quot;SciFi Helmet&quot; por Michael Pavlovic e Norbert Nopper (Khronos Group), licença CC0 1.0.</span>
```

with:

```tsx
        <span className="block mt-1 text-xs opacity-70">Modelo 3D &quot;Astronaut&quot; do projeto google/model-viewer, licença Apache 2.0.</span>
```

- [ ] **Step 6: Clean up**

```bash
rm -rf /tmp/astronaut-src
```

- [ ] **Step 7: Lint and typecheck**

Run: `npx eslint src/components/Contact.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 8: Commit**

```bash
git add public/models/hero-astronaut.glb src/components/Contact.tsx
git commit -m "feat: replace helmet with compressed astronaut model (24.6KB)"
```

(The `git rm public/models/hero-helmet.glb` from Step 4 is staged separately and included in this same commit — don't unstage it. `public/models/hero-astronaut.glb` is a binary file; `git add`/`git status`/`git commit` work normally on it, just don't try to inspect its diff content.)

---

### Task 4: Swap HeroScene to the astronaut + add procedural planets + denser starfield

**Files:**
- Modify: `src/components/HeroScene.tsx`
- Modify: `src/components/Starfield.tsx`

**Interfaces:**
- Renames the internal `Helmet` component to `Astronaut` (not exported, internal detail — no external caller depends on the old name; `HeroScene`'s own default-export signature `{ scrollProgress: MotionValue<number> }` is unchanged).
- Adds a new internal `Planet` component (not exported).

- [ ] **Step 1: Replace the full file**

Replace the full contents of `src/components/HeroScene.tsx`:

```tsx
"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import { useReducedMotion, type MotionValue } from "framer-motion";
import * as THREE from "three";

interface AstronautProps {
  scrollProgress: MotionValue<number>;
}

function Astronaut({ scrollProgress }: AstronautProps) {
  const groupRef = useRef<THREE.Group>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scene } = useGLTF("/models/hero-astronaut.glb", "/draco/");

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (!prefersReducedMotion) {
      groupRef.current.rotation.y += delta * 0.25;
    }
    groupRef.current.rotation.x = scrollProgress.get() * Math.PI * 0.15;
  });

  return (
    <group ref={groupRef} scale={1.4}>
      <primitive object={scene} />
    </group>
  );
}

interface PlanetProps {
  position: [number, number, number];
  radius: number;
  color: string;
}

function Planet({ position, radius, color }: PlanetProps) {
  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh position={position}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} roughness={0.5} />
      </mesh>
    </Float>
  );
}

interface HeroSceneProps {
  scrollProgress: MotionValue<number>;
}

export default function HeroScene({ scrollProgress }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      className="!absolute !inset-0"
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 4, 4]} intensity={2.2} color="#67e8f9" />
      <directionalLight position={[-4, -2, -3]} intensity={1.2} color="#e879f9" />
      <Suspense fallback={null}>
        <Astronaut scrollProgress={scrollProgress} />
        <Planet position={[-2.1, 1.1, -1.4]} radius={0.35} color="#67e8f9" />
        <Planet position={[2.2, -0.9, -1.8]} radius={0.22} color="#e879f9" />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/hero-astronaut.glb", "/draco/");
```

`Planet` deliberately does not gate its `Float` animation behind `prefers-reduced-motion` the way `Astronaut`'s spin does — drei's `Float` is a gentle bob/rotate, not a fast continuous spin, and matches the same tier of motion this codebase already treats as acceptable under reduced motion (e.g. the scroll-linked tilt). `sphereGeometry(radius, 24, 24)` is a deliberately low segment count (default is often 32) since these are small background accents, not focal geometry — cheap to render, two extra draw calls in a scene that's already rendering one low-poly astronaut.

- [ ] **Step 2: Denser starfield for a stronger galaxy feel**

In `src/components/Starfield.tsx`, replace:

```tsx
      { shadow: buildLayer(140, 2000, 1, 11), size: 1, twinkleDuration: 6, driftDuration: 70 },
      { shadow: buildLayer(70, 2000, 2, 47), size: 2, twinkleDuration: 4.5, driftDuration: 95 },
      { shadow: buildLayer(30, 2000, 3, 91), size: 3, twinkleDuration: 8, driftDuration: 55 },
```

with:

```tsx
      { shadow: buildLayer(190, 2000, 1, 11), size: 1, twinkleDuration: 6, driftDuration: 70 },
      { shadow: buildLayer(95, 2000, 2, 47), size: 2, twinkleDuration: 4.5, driftDuration: 95 },
      { shadow: buildLayer(45, 2000, 3, 91), size: 3, twinkleDuration: 8, driftDuration: 55 },
```

Star counts go from 140/70/30 (240 total) to 190/95/45 (330 total) — still pure CSS `box-shadow` dots with existing `twinkle`/`star-drift` keyframe animations (no new technique, no JS per-frame cost, no canvas), just a denser field for a stronger "deep space" read.

- [ ] **Step 3: Lint, typecheck, build**

Run: `npx eslint src/components/HeroScene.tsx src/components/Starfield.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run build`
Expected: `✓ Compiled successfully`, no errors.

- [ ] **Step 4: Manual visual check** (needs a real browser)

At ≥1024px: astronaut renders in the right column of the Hero, catches cyan/pink light, spins on Y, tilts with scroll. Two small glowing spheres (cyan and pink) float gently around it. Starfield is visibly denser than before. Below 1024px: no 3D (same `isDesktop` gate as before, untouched by this task), starfield still denser everywhere (it's not gated, always CSS-only). With OS "reduce motion" on: astronaut stops spinning (still tilts with scroll), planets keep their gentle float (unaffected, by design).

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroScene.tsx src/components/Starfield.tsx
git commit -m "feat: swap hero object to astronaut, add planets, denser starfield"
```

---

### Task 5: Cut ColorfulBackground's continuous large-blur animation

**Files:**
- Modify: `src/components/ColorfulBackground.tsx`

**Interfaces:** None — visual-only change, same default export, no props.

- [ ] **Step 1: Reduce blur radius and remove the continuous transform animation on the two ambient blobs**

Replace the full contents of `src/components/ColorfulBackground.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { motion, useSpring } from "framer-motion";

export default function ColorfulBackground() {
  
  // Bolha Magnética que segue o mouse suavemente
  const mouseX = useSpring(-1000, { damping: 40, stiffness: 100, mass: 2 });
  const mouseY = useSpring(-1000, { damping: 40, stiffness: 100, mass: 2 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 300); // centralizar 600x600 bolha
      mouseY.set(e.clientY - 300);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[var(--background)] transition-colors duration-500 pointer-events-none">
      
      {/* Bolha dinâmica seguindo o mouse */}
      <motion.div 
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full mix-blend-screen opacity-40 blur-[100px]"
        style={{
          x: mouseX,
          y: mouseY,
          background: "radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(103,232,249,0.3) 50%, transparent 80%)"
        }}
      />

      {/* Bolhas Flutuantes Ambient — estáticas, sem transform contínuo (blur grande + animação de posição/escala era o combo mais caro pra GPU do site) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-600/20 mix-blend-screen blur-[60px] opacity-20" />

      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-600/20 mix-blend-screen blur-[60px] opacity-20" />
    </div>
  );
}
```

The mouse-following blob keeps its `blur-[100px]` (it's `useSpring`-driven, smooth and bounded to 600px, not the same cost profile as the two ambient ones that used to run an unbounded `repeat: Infinity` transform loop on 50-60vw elements). The two ambient blobs go from continuously-animated (`x`/`y`/`scale` keyframes, `repeat: Infinity`, 20-25s loops) + heavy blur (100-120px) to fully static + lighter blur (60px) — same visual presence (soft glow in two corners), none of the per-frame recomputation cost.

- [ ] **Step 2: Lint and typecheck**

Run: `npx eslint src/components/ColorfulBackground.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 3: Manual check** (needs a real browser)

Scroll/move the mouse around: the two corner glows are present but static (no drifting/pulsing), the mouse-following blob still tracks the cursor smoothly. On a lower-end device or with DevTools' CPU throttling, scrolling should feel noticeably less janky than before.

- [ ] **Step 4: Commit**

```bash
git add src/components/ColorfulBackground.tsx
git commit -m "perf: remove ColorfulBackground's continuous large-blur animation"
```

---

## Final check (all tasks complete)

- [ ] `npx tsc --noEmit`, `npx eslint src/`, `npm run build` all clean (same 2 pre-existing `<img>` warnings, zero errors).
- [ ] `grep -rln "ThemeToggle\|data-theme" src/` returns nothing.
- [ ] `public/models/hero-helmet.glb` no longer exists; `public/models/hero-astronaut.glb` does.
- [ ] Real browser, 375px/1024px/1440px: no theme toggle anywhere, site is always dark; Hero shows name left + astronaut+planets right at 1024px+, stacked centered below that; `ColorfulBackground`'s corner glows are static, not animating; overall scroll feel is smoother than before this plan.
