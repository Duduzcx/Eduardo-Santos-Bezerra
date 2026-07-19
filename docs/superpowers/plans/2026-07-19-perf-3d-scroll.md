# Load-Time Performance + Shared-Canvas 3D + Scroll Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut the portfolio's initial load weight (drop the external hero video and the wasted `Environment` HDR download) while adding 3D objects to every section and more scroll-linked motion — without regressing load time, by moving from one `<Canvas>` per section to a single shared canvas.

**Architecture:** One `<Canvas>` mounted once in `layout.tsx` (desktop-only, gated behind a `matchMedia` check so mobile never even downloads the 3D bundle), hosting a `@react-three/drei` `<View.Port />`. Each section keeps using the existing `LazyScene` component as its public API, but internally `LazyScene` now renders a `<View track={...}>` that tunnels its content into the shared canvas instead of creating its own `<Canvas>`/WebGL context. `AnimatedShape` (the wireframe mesh) gains more geometry options and an optional scroll-linked rotation/scale input. No new dependencies — this is a pure refactor + additive usage of libraries already installed.

**Tech Stack:** `framer-motion` (^12.42.2), `@react-three/fiber`, `@react-three/drei` (`View`, `View.Port`, `Float`), `three` — all already installed. `useReducedMotion` (from `framer-motion`) is used for the accessibility task, no new package.

Spec: `docs/superpowers/specs/2026-07-19-perf-3d-scroll-design.md`

## Global Constraints

- No new dependencies. `@react-three/drei`'s `View`/`View.Port` (used for the shared-canvas architecture) already ships in the installed `@react-three/drei@^10.7.7` — confirmed present at `node_modules/@react-three/drei/web/View.js`.
- Repo has **no automated test suite** (no jest/vitest, no `test` script in `package.json`). Verification per task is: (a) scoped `npx eslint <touched files>`, (b) `npx tsc --noEmit` (currently clean, zero errors — keep it that way), (c) a Next.js production/dev compile check, (d) a manual browser check description for the user to run themselves.
- **No real browser available in this execution environment** (no admin rights to install Chrome; `npx playwright install chromium` also fails without `@playwright/test` as a project dependency, which is out of scope to add). Every task's "manual visual check" step must still be written out in full — the user runs it themselves in their own browser. Do not claim a visual/interaction result was confirmed unless it actually was.
- Current lint baseline (before this plan): 3 pre-existing warnings only, no errors — `@next/next/no-img-element` in `Laboratory.tsx:89`, `Process.tsx:112`, `Projects.tsx:53` (all pre-existing `<img>` tags, unrelated to this work). Do not fix these — out of scope. A scoped `npx eslint <files touched this task>` should show **zero new warnings or errors** beyond these three when the touched file is one of those three.
- Brand color tokens (from `src/app/globals.css`): accent `#7c3aed`, accent-light `#a855f7`, pink `#e879f9`, cyan `#67e8f9`. Use these exact hex values when passing `color` to `LazyScene` (its prop is a raw hex string, not a CSS var, matching existing usage in `Laboratory.tsx`/`Contact.tsx`).
- **The `View`-based shared-canvas architecture in Task 1 was already spiked and verified working in this environment** before this plan was written: `npx tsc --noEmit` clean, `npm run build` clean, and the dev server compiled `/` with `GET / 200` and no console/server errors. The spike was reverted (this is the plan, not the implementation), so Task 1 must still be executed and re-verified for real, but the exact code below is known-good, not speculative.
- Each `View` instance gets its **own** lights (`ambientLight`/`directionalLight`) — confirmed by reading `@react-three/drei`'s `View.js` source: every `<View>` creates its own `THREE.Scene()` and portals its children into it, so lights do not leak between sections' views. Do not try to hoist lights into a single shared location — that would leave every section but one unlit.
- **Git state:** repo working tree should be clean before starting (only this plan's own commits). Every commit in this plan must run `git add <exact files listed in that task>` — **never** `git add -A` or `git add .`.
- Windows/PowerShell dev environment, but all commands below are plain `npm`/`npx` and work identically from either shell.
- 3D is desktop-only (`lg` = `min-width: 1024px`). This is enforced in `SceneCanvasGate.tsx` (Task 1) via `window.matchMedia`, not CSS `hidden` — the goal is that mobile never triggers the `next/dynamic` import of the Three.js/drei bundle at all, not just that it's visually hidden.

---

### Task 1: Shared 3D canvas foundation

**Files:**
- Modify: `src/components/Scene.tsx` (full file rewrite, currently 60 lines)
- Modify: `src/components/LazyScene.tsx` (full file rewrite, currently 25 lines)
- Create: `src/components/SceneCanvas.tsx`
- Create: `src/components/SceneCanvasGate.tsx`
- Modify: `src/app/layout.tsx:12` (import) and `src/app/layout.tsx:46` (mount)

**Interfaces:**
- Produces: `AnimatedShape` (named export from `Scene.tsx`) — `{ color: string; opacity: number; geometry: ShapeGeometry }`, no longer a default export, no longer creates its own `<Canvas>`.
- Produces: `ShapeGeometry` (named type export from `Scene.tsx`) — `"icosahedron" | "torus" | "dodecahedron" | "octahedron" | "torusknot"`.
- Produces: `LazyScene` (default export, unchanged public props: `{ color?: string; opacity?: number; geometry?: ShapeGeometry; className?: string }`) — existing callers in `Hero.tsx`, `Laboratory.tsx`, `Contact.tsx` need no changes for this task.
- Produces: `SceneCanvas` (default export, no props) — the single shared `<Canvas>` with `<View.Port />`.
- Produces: `SceneCanvasGate` (default export, no props) — desktop-only gate that dynamically imports and mounts `SceneCanvas`.

- [ ] **Step 1: Rewrite `Scene.tsx`**

Replace the full contents of `src/components/Scene.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export type ShapeGeometry = "icosahedron" | "torus" | "dodecahedron" | "octahedron" | "torusknot";

interface AnimatedShapeProps {
  color: string;
  opacity: number;
  geometry: ShapeGeometry;
}

export function AnimatedShape({ color, opacity, geometry }: AnimatedShapeProps) {
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
        ) : geometry === "dodecahedron" ? (
          <dodecahedronGeometry args={[1.5, 0]} />
        ) : geometry === "octahedron" ? (
          <octahedronGeometry args={[1.6, 0]} />
        ) : geometry === "torusknot" ? (
          <torusKnotGeometry args={[1, 0.35, 100, 12]} />
        ) : (
          <icosahedronGeometry args={[1.5, 1]} />
        )}
        <meshStandardMaterial color={color} wireframe transparent opacity={opacity} />
      </mesh>
    </Float>
  );
}
```

Two things dropped from the original on purpose: the `<Canvas>`/`<ambientLight>`/`<directionalLight>` wrapper (now lives per-`View`, see Step 2) and `<Environment preset="city" />` (downloaded an HDR for a wireframe transparent material that barely reflects it — real network/GPU cost for near-zero visual gain; this is one of the two root causes of slow first load from the spec).

- [ ] **Step 2: Rewrite `LazyScene.tsx`**

Replace the full contents of `src/components/LazyScene.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { View } from "@react-three/drei";
import { AnimatedShape, type ShapeGeometry } from "./Scene";

interface LazySceneProps {
  color?: string;
  opacity?: number;
  geometry?: ShapeGeometry;
  className?: string;
}

export default function LazyScene({ className, color = "#67e8f9", opacity = 0.35, geometry = "icosahedron" }: LazySceneProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });

  return (
    <View ref={ref} className={className}>
      {inView && (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedShape color={color} opacity={opacity} geometry={geometry} />
        </>
      )}
    </View>
  );
}
```

`View` (used outside of a `<Canvas>`, which is the case here — `LazyScene` is rendered from regular section components) renders its own tracked `<div>` under the hood using the `className`/`style` you pass it, and tunnels its children into the shared canvas created in Step 3. You don't need to manage a `track` ref yourself — passing `ref` here just gives `useInView` something to observe (same job the old wrapper `<div ref={ref}>` did).

- [ ] **Step 3: Create `SceneCanvas.tsx`**

```tsx
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
```

This is the **only** `<Canvas>`/WebGL context for the entire site. `<View.Port />` is where every section's `<View>` content (from Step 2) actually gets drawn, each into its own scissored viewport region matching that section's on-screen position.

- [ ] **Step 4: Create `SceneCanvasGate.tsx`**

```tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

export default function SceneCanvasGate() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setEnabled(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  if (!enabled) return null;
  return <SceneCanvas />;
}
```

The `dynamic(() => import("./SceneCanvas"), { ssr: false })` call only actually fetches that JS chunk when `<SceneCanvas />` is rendered — since `enabled` starts `false` (both on the server, which never runs this component's body meaningfully, and on the client before the effect runs), mobile visitors (`< 1024px`) never trigger the download of the Three.js/drei bundle at all, not just a CSS-hidden one.

- [ ] **Step 5: Mount the gate in `layout.tsx`**

In `src/app/layout.tsx`, replace the import block:

```tsx
import NavigationTransition from "@/components/NavigationTransition";
import CustomCursor from "@/components/CustomCursor";
import IntroLoader from "@/components/IntroLoader";
```

with:

```tsx
import NavigationTransition from "@/components/NavigationTransition";
import CustomCursor from "@/components/CustomCursor";
import IntroLoader from "@/components/IntroLoader";
import SceneCanvasGate from "@/components/SceneCanvasGate";
```

Then replace:

```tsx
        <ColorfulBackground />
        <FloatingObjects />
        
        <SmoothScroll>
```

with:

```tsx
        <ColorfulBackground />
        <FloatingObjects />
        <SceneCanvasGate />

        <SmoothScroll>
```

- [ ] **Step 6: Typecheck and lint**

Run: `npx tsc --noEmit`
Expected: no output (clean — same as baseline).

Run: `npx eslint src/components/Scene.tsx src/components/LazyScene.tsx src/components/SceneCanvas.tsx src/components/SceneCanvasGate.tsx src/app/layout.tsx`
Expected: no output.

- [ ] **Step 7: Build check**

Run: `npm run build`
Expected: `✓ Compiled successfully`, all routes prerendered as static content, no errors.

- [ ] **Step 8: Dev server compile + SSR smoke check**

Run: `npm run dev` (leave it running for the rest of this plan — note the port it picks, e.g. `3000`).
In a separate terminal: `curl -s http://localhost:3000/ -w "HTTP %{http_code}\n" -o /dev/null`
Expected: `HTTP 200`, and the dev server's own terminal output shows `GET / 200` with no compile errors (Turbopack would report a module resolution error here if the `AnimatedShape`/`ShapeGeometry`/`View`/`View.Port` imports were wrong).

This confirms SSR doesn't crash and the module graph resolves. It does **not** confirm the WebGL rendering actually looks right — that needs a real browser (see Global Constraints). Note in your task report that this step was browser-unverified if you're in this same constrained environment; if you have a real browser, additionally confirm: open `http://localhost:3000` at ≥1024px width, the hero's wireframe icosahedron still rotates as before, and the browser console shows no WebGL/Three.js errors.

- [ ] **Step 9: Commit**

```bash
git add src/components/Scene.tsx src/components/LazyScene.tsx src/components/SceneCanvas.tsx src/components/SceneCanvasGate.tsx src/app/layout.tsx
git commit -m "perf: move 3D from per-section Canvas to one shared canvas via drei View"
```

---

### Task 2: Remove Hero video, denser mouse-reactive 3D

**Files:**
- Modify: `src/components/Hero.tsx`

**Interfaces:**
- Consumes: `LazyScene` (from Task 1, unchanged public props).
- None produced — self-contained change to `Hero.tsx`.

- [ ] **Step 1: Add a second, wider-radius mouse tracker for the 3D layer**

In `src/components/Hero.tsx`, after the existing CTA button's magnetic-tracking block (right after the closing `};` of `handleBtnMouseLeave`), add:

```tsx
  const sceneX = useMotionValue(0);
  const sceneY = useMotionValue(0);
  const sceneSpringX = useSpring(sceneX, { damping: 25, stiffness: 60, mass: 1 });
  const sceneSpringY = useSpring(sceneY, { damping: 25, stiffness: 60, mass: 1 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { innerWidth, innerHeight } = window;
    sceneX.set((e.clientX - innerWidth / 2) * 0.02);
    sceneY.set((e.clientY - innerHeight / 2) * 0.02);
  };
```

This mirrors the existing `btnX`/`btnY`/`springX`/`springY` pattern just above it, but tracks mouse position across the whole hero (not just near the button) with a much smaller multiplier (`0.02` vs the button's `0.35`) and a softer spring, for a slow ambient drift instead of a snappy magnetic pull.

- [ ] **Step 2: Remove the video, wire the new mouse tracker to the 3D layer**

Replace:

```tsx
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Vídeo Background Full-Screen inspirado no Gustavo Campelo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover mix-blend-screen opacity-20"
        >
          <source src="https://cdn.pixabay.com/video/2021/08/18/85420-590059530_large.mp4" type="video/mp4" />
        </video>
        {/* Máscara escura para garantir leitura absoluta do texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0814]/40 via-[#0a0814]/70 to-[var(--background)]" />
      </div>

      <div className="absolute inset-0 z-[1]">
        <Starfield />
      </div>

      {/* Objeto 3D em loop, estilo Thor, combinado com o vídeo de fundo */}
      <LazyScene className="absolute inset-0 z-[1] opacity-60 pointer-events-none" />

      <FloatingTechCards />
```

with:

```tsx
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" onMouseMove={handleHeroMouseMove}>
      {/* Máscara escura para garantir leitura do texto — antes ficava sobre o vídeo, agora é o próprio fundo */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#0a0814]/40 via-[#0a0814]/70 to-[var(--background)]" />

      <div className="absolute inset-0 z-[1]">
        <Starfield />
      </div>

      {/* Objeto 3D em loop, ocupa o espaço do vídeo removido, reage à posição do mouse */}
      <motion.div style={{ x: sceneSpringX, y: sceneSpringY }} className="absolute inset-0 z-[1] pointer-events-none">
        <LazyScene className="absolute inset-0 opacity-75 pointer-events-none" />
      </motion.div>

      <FloatingTechCards />
```

The `<video>` element, its Pixabay CDN `<source>`, and the wrapper `<div>` are gone entirely. Opacity on the 3D layer goes from `0.60` to `0.75` to fill the visual weight the video used to carry.

- [ ] **Step 3: Lint and typecheck**

Run: `npx eslint src/components/Hero.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 4: Manual visual check** (needs a real browser — see Global Constraints)

With `npm run dev` running, open the hero at ≥1024px width:
- No video element anywhere in the DOM (check DevTools → Elements, or just confirm the network tab has no request to `cdn.pixabay.com`).
- The wireframe 3D shape is more prominent than before (higher opacity).
- Moving the mouse across the whole hero (not just near the CTA button) causes the 3D shape to drift slowly in the direction of the cursor; moving to the opposite side drifts it the other way. The effect should feel slow/ambient, not snappy.
- The CTA button's own magnetic hover effect (unrelated, pre-existing) still works independently.
- Below 1024px width: no 3D layer at all (per Task 1's `SceneCanvasGate`), but the dark gradient mask and `Starfield` are still present — hero should not look broken or have a jarring empty gap where the video used to be.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "perf: remove external hero video, replace with denser mouse-reactive 3D"
```

---

### Task 3: 3D backdrop in About, Process, Skills, Projects

**Files:**
- Modify: `src/components/About.tsx`
- Modify: `src/components/Process.tsx`
- Modify: `src/components/Skills.tsx`
- Modify: `src/components/Projects.tsx`

**Interfaces:**
- Consumes: `LazyScene` (from Task 1).

- [ ] **Step 1: About — dodecahedron**

In `src/components/About.tsx`, replace the import block:

```tsx
import TextReveal from "./TextReveal";
import LetterReveal from "./LetterReveal";
```

with:

```tsx
import TextReveal from "./TextReveal";
import LetterReveal from "./LetterReveal";
import LazyScene from "./LazyScene";
```

Then replace:

```tsx
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
```

with:

```tsx
      </motion.div>

      <LazyScene className="absolute inset-0 opacity-20 pointer-events-none" geometry="dodecahedron" color="#67e8f9" opacity={0.35} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
```

- [ ] **Step 2: Process — octahedron**

In `src/components/Process.tsx`, replace the import block:

```tsx
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, animate } from "framer-motion";
```

with:

```tsx
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, animate } from "framer-motion";
import LazyScene from "./LazyScene";
```

Then replace:

```tsx
      <motion.div aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} className="pointer-events-none absolute -right-28 top-24 h-72 w-72 rounded-full border border-[var(--color-accent)]/15" />
      <div className="relative mx-auto max-w-6xl px-6">
```

with:

```tsx
      <motion.div aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} className="pointer-events-none absolute -right-28 top-24 h-72 w-72 rounded-full border border-[var(--color-accent)]/15" />
      <LazyScene className="absolute inset-0 opacity-20 pointer-events-none" geometry="octahedron" color="#7c3aed" opacity={0.35} />
      <div className="relative mx-auto max-w-6xl px-6">
```

- [ ] **Step 3: Skills — torus-knot**

In `src/components/Skills.tsx`, replace the import block:

```tsx
import { motion } from "framer-motion";
import LetterReveal from "./LetterReveal";
```

with:

```tsx
import { motion } from "framer-motion";
import LetterReveal from "./LetterReveal";
import LazyScene from "./LazyScene";
```

Then replace:

```tsx
      <motion.div 
        animate={{ rotateZ: -360, rotateX: -360, rotateY: 180 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute right-[-5%] top-[20%] w-[40vw] h-[40vw] border border-[var(--color-cyan)]/10 rounded-full pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
```

with:

```tsx
      <motion.div 
        animate={{ rotateZ: -360, rotateX: -360, rotateY: 180 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute right-[-5%] top-[20%] w-[40vw] h-[40vw] border border-[var(--color-cyan)]/10 rounded-full pointer-events-none"
      />
      <LazyScene className="absolute inset-0 opacity-20 pointer-events-none" geometry="torusknot" color="#e879f9" opacity={0.35} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
```

- [ ] **Step 4: Projects — torus**

In `src/components/Projects.tsx`, replace the import block:

```tsx
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ImageOff } from "lucide-react";
```

with:

```tsx
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ImageOff } from "lucide-react";
import LazyScene from "./LazyScene";
```

Then replace:

```tsx
      <motion.div aria-hidden="true" style={{ y: sceneY }} className="pointer-events-none absolute left-[-18vw] top-[42%] h-[38vw] w-[38vw] rounded-[3rem] border border-[var(--color-pink)]/10" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
```

with:

```tsx
      <motion.div aria-hidden="true" style={{ y: sceneY }} className="pointer-events-none absolute left-[-18vw] top-[42%] h-[38vw] w-[38vw] rounded-[3rem] border border-[var(--color-pink)]/10" />
      <LazyScene className="absolute inset-0 opacity-20 pointer-events-none" geometry="torus" color="#67e8f9" opacity={0.35} />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
```

- [ ] **Step 5: Lint and typecheck**

Run: `npx eslint src/components/About.tsx src/components/Process.tsx src/components/Skills.tsx src/components/Projects.tsx`
Expected: no new output (the pre-existing `<img>` warning in `Process.tsx` and `Projects.tsx` from the Global Constraints baseline is expected and fine — no new warnings).

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 6: Manual visual check** (needs a real browser)

At ≥1024px width, scroll through About, Process, Skills, Projects: each now shows a faint rotating wireframe shape in the background (dodecahedron/octahedron/torus-knot/torus respectively), distinct geometry per section, matching that section's accent color. Below 1024px: none of them render any 3D (consistent with Hero/Laboratory/Contact).

- [ ] **Step 7: Commit**

```bash
git add src/components/About.tsx src/components/Process.tsx src/components/Skills.tsx src/components/Projects.tsx
git commit -m "feat: add 3D backdrop shapes to About, Process, Skills, Projects"
```

---

### Task 4: 3D objects react to scroll position, not just time

**Files:**
- Modify: `src/components/Scene.tsx`
- Modify: `src/components/LazyScene.tsx`

**Interfaces:**
- Produces: `AnimatedShape` now also accepts an optional `scrollProgress?: MotionValue<number>` prop (in addition to the Task 1 props).
- Consumes: `MotionValue` type from `framer-motion`.

- [ ] **Step 1: `AnimatedShape` reads scroll progress inside its own render loop**

In `src/components/Scene.tsx`, replace:

```tsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

export type ShapeGeometry = "icosahedron" | "torus" | "dodecahedron" | "octahedron" | "torusknot";

interface AnimatedShapeProps {
  color: string;
  opacity: number;
  geometry: ShapeGeometry;
}

export function AnimatedShape({ color, opacity, geometry }: AnimatedShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });
```

with:

```tsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

export type ShapeGeometry = "icosahedron" | "torus" | "dodecahedron" | "octahedron" | "torusknot";

interface AnimatedShapeProps {
  color: string;
  opacity: number;
  geometry: ShapeGeometry;
  scrollProgress?: MotionValue<number>;
}

export function AnimatedShape({ color, opacity, geometry, scrollProgress }: AnimatedShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
    if (scrollProgress) {
      const progress = scrollProgress.get();
      meshRef.current.rotation.z = progress * Math.PI * 0.5;
      meshRef.current.scale.setScalar(0.85 + progress * 0.25);
    }
  });
```

(Rest of the file — the `<Float>`/`<mesh>` JSX — is unchanged.) `scrollProgress.get()` reads a framer-motion `MotionValue` synchronously, which is safe to call inside r3f's `useFrame` (it runs once per rendered frame, same as any other per-frame read). The continuous time-based rotation (`rotation.x`/`rotation.y`) is untouched — this adds `rotation.z` and `scale` on top, both driven purely by scroll position.

- [ ] **Step 2: `LazyScene` computes scroll progress and passes it down**

Replace the full contents of `src/components/LazyScene.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useInView, useScroll, useTransform } from "framer-motion";
import { View } from "@react-three/drei";
import { AnimatedShape, type ShapeGeometry } from "./Scene";

interface LazySceneProps {
  color?: string;
  opacity?: number;
  geometry?: ShapeGeometry;
  className?: string;
}

export default function LazyScene({ className, color = "#67e8f9", opacity = 0.35, geometry = "icosahedron" }: LazySceneProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "200px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <View ref={ref} className={className}>
      {inView && (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedShape color={color} opacity={opacity} geometry={geometry} scrollProgress={scrollProgress} />
        </>
      )}
    </View>
  );
}
```

`scrollProgress` is `0` when the section is fully off-screen (either edge), rising to `1` right when it's centered in the viewport, back to `0` as it leaves — so each object grows/tilts a bit more as its section is front-and-center, and settles back down as you scroll past. This reuses the same `ref` already used for `useInView`, so no extra DOM element or prop is needed.

- [ ] **Step 3: Lint and typecheck**

Run: `npx eslint src/components/Scene.tsx src/components/LazyScene.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: clean build, same as Task 1.

- [ ] **Step 5: Manual visual check** (needs a real browser)

At ≥1024px width, scroll slowly through any section with a 3D object (Hero, About, Process, Skills, Laboratory, Projects, Contact): each shape should visibly grow slightly and tilt on its Z axis as its section approaches the center of the viewport, then shrink back down as it scrolls away — on top of (not instead of) the constant looping rotation it already had.

- [ ] **Step 6: Commit**

```bash
git add src/components/Scene.tsx src/components/LazyScene.tsx
git commit -m "feat: link 3D object rotation/scale to scroll position per section"
```

---

### Task 5: Skills — scroll-scrubbed fill bar per card

**Files:**
- Modify: `src/components/Skills.tsx`

**Interfaces:**
- Produces: `SkillFillBar` (file-local component, not exported) — `{ scrollYProgress: MotionValue<number>; index: number; total: number }`.

- [ ] **Step 1: Add the scroll target and per-card fill component**

In `src/components/Skills.tsx`, replace the import block:

```tsx
import { motion } from "framer-motion";
import LetterReveal from "./LetterReveal";
import LazyScene from "./LazyScene";
```

with:

```tsx
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import LetterReveal from "./LetterReveal";
import LazyScene from "./LazyScene";
```

Then, right after the `SKILLS` array (after its closing `];`), add:

```tsx
function SkillFillBar({ scrollYProgress, index, total }: { scrollYProgress: MotionValue<number>; index: number; total: number }) {
  const start = index / total;
  const end = Math.min(1, start + 1 / total + 0.15);
  const scaleX = useTransform(scrollYProgress, [start, end], [0, 1]);
  return <motion.div style={{ scaleX }} className="absolute bottom-0 left-0 h-[3px] w-full origin-left bg-[var(--color-cyan)]" />;
}
```

- [ ] **Step 2: Track the grid and stagger each card's fill**

Replace:

```tsx
export default function Skills() {
  return (
```

with:

```tsx
export default function Skills() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start 85%", "end 60%"] });

  return (
```

Then replace:

```tsx
        {/* Animação nova: Cada card não vem de baixo, mas gira em X (estilo moeda caindo) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
```

with:

```tsx
        {/* Animação nova: Cada card não vem de baixo, mas gira em X (estilo moeda caindo) */}
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
```

Then replace:

```tsx
              <span className={`text-[var(--text-secondary)] font-medium group-hover:${skill.color} transition-colors relative z-10`}>
                {skill.name}
              </span>
            </motion.div>
          ))}
```

with:

```tsx
              <span className={`text-[var(--text-secondary)] font-medium group-hover:${skill.color} transition-colors relative z-10`}>
                {skill.name}
              </span>
              <SkillFillBar scrollYProgress={scrollYProgress} index={index} total={SKILLS.length} />
            </motion.div>
          ))}
```

`offset: ["start 85%", "end 60%"]` follows the same percentage-string convention already used in `Process.tsx`. Each card's fill bar animates over its own slice of that single scroll range (`index/total` to roughly `(index+1)/total`, with a small overlap so consecutive bars don't have a dead gap) — one `useScroll` call for the whole grid, not one per card.

- [ ] **Step 3: Lint and typecheck**

Run: `npx eslint src/components/Skills.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 4: Manual visual check** (needs a real browser)

At ≥1024px width, scroll slowly through the Skills section: a thin cyan line under each card should fill from left to right progressively, in roughly left-to-right/top-to-bottom card order, as you scroll through the section — not all at once, and not before the section is mostly in view.

- [ ] **Step 5: Commit**

```bash
git add src/components/Skills.tsx
git commit -m "feat: scroll-scrubbed fill bar per skill card"
```

---

### Task 6: Projects — scroll parallax on card images

**Files:**
- Modify: `src/components/Projects.tsx`

**Interfaces:**
- Consumes: `scrollYProgress` (already computed per-card inside `ProjectCard` since before this plan — no new hook needed).

- [ ] **Step 1: Add the image parallax transform**

In `src/components/Projects.tsx`, replace:

```tsx
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start 95%", "start 55%"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [6, 0]);
```

with:

```tsx
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ["start 95%", "start 55%"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const imageY = useTransform(scrollYProgress, [0, 1], [24, -24]);
```

- [ ] **Step 2: Apply it to the card image**

Replace:

```tsx
            ) : (
              <img
                src={project.image}
                alt=""
                onError={() => setImageFailed(true)}
                className="h-full w-full object-cover opacity-95 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
              />
            )}
```

with:

```tsx
            ) : (
              <motion.img
                src={project.image}
                alt=""
                style={{ y: imageY }}
                onError={() => setImageFailed(true)}
                className="h-full w-full object-cover opacity-95 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
              />
            )}
```

Both the image's parent (`className="relative overflow-hidden bg-gradient-to-br ..."`) and its grandparent (`className="group relative h-full overflow-hidden rounded-2xl ..."`) already have `overflow-hidden`, so the ±24px vertical drift stays clipped inside the card — no layout shift, no visual leak outside the image frame.

- [ ] **Step 3: Lint and typecheck**

Run: `npx eslint src/components/Projects.tsx`
Expected: no new output (the pre-existing `<img>`-element warning goes away for the line you just changed to `motion.img`, since that rule only flags plain `<img>`; no new warnings introduced elsewhere).

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 4: Manual visual check** (needs a real browser)

At ≥1024px width, scroll through Projects: each card's image should drift vertically at a different rate than the card itself as the card scrolls through its entrance range (classic parallax) — image staying fully inside the rounded card frame at all times, no overflow.

- [ ] **Step 5: Commit**

```bash
git add src/components/Projects.tsx
git commit -m "feat: add scroll parallax to project card images"
```

---

### Task 7: Beefed-up section transition (`NavigationTransition`)

**Files:**
- Modify: `src/components/NavigationTransition.tsx`

**Interfaces:**
- None — self-contained change.

- [ ] **Step 1: Add a particle-burst layer and bump the timing**

Replace the full contents of `src/components/NavigationTransition.tsx`:

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NavigationTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function navigate(event: MouseEvent) {
      const target = event.target as Element | null;
      const link = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      const href = link?.getAttribute("href");
      if (!href || href === "#" || event.defaultPrevented || event.metaKey || event.ctrlKey) return;

      const section = document.querySelector(href);
      if (!section) return;

      event.preventDefault();
      setOrigin({ x: `${event.clientX}px`, y: `${event.clientY}px` });
      setIsTransitioning(true);
      timeoutId = setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", href);
        setIsTransitioning(false);
      }, 580);
    }

    document.addEventListener("click", navigate);
    return () => {
      document.removeEventListener("click", navigate);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const particleAngles = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          aria-hidden="true"
          className="fixed inset-0 z-[90] pointer-events-none overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: `radial-gradient(circle at ${origin.x} ${origin.y}, rgba(103,232,249,0.9), rgba(124,58,237,0.5) 40%, transparent 70%)` }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 0.6], scale: 1.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-[var(--color-accent)] via-[var(--color-cyan)] to-[var(--color-pink)]"
            initial={{ clipPath: "polygon(0 0, 0 0, -20% 100%, -20% 100%)" }}
            animate={{ clipPath: "polygon(0 0, 120% 0, 100% 100%, -20% 100%)" }}
            exit={{ clipPath: "polygon(120% 0, 120% 0, 120% 100%, 100% 100%)" }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            className="absolute inset-0 bg-[#0a0814]"
            initial={{ clipPath: "polygon(0 0, 0 0, -20% 100%, -20% 100%)" }}
            animate={{ clipPath: "polygon(0 0, 120% 0, 100% 100%, -20% 100%)" }}
            exit={{ clipPath: "polygon(120% 0, 120% 0, 120% 100%, 100% 100%)" }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
          />
          {particleAngles.map((angle, i) => (
            <motion.span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-[var(--color-cyan)]"
              style={{ left: origin.x, top: origin.y }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], x: Math.cos(angle) * 140, y: Math.sin(angle) * 140, scale: [0.5, 1, 0.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

Changes from the original: the `setTimeout` that triggers the actual scroll goes from `520` to `580` (matching the new longest sub-animation, the 0.5s particle burst with a 0.05s delay ≈ 0.55s, plus a small margin), the two clip-path sweep layers go from `0.36s` to `0.4s` to feel proportionally right against the longer total, and a new sixth layer renders 6 small dots bursting outward from the click point (`origin`), reusing the same `origin.x`/`origin.y` state that already drives the radial gradient.

- [ ] **Step 2: Lint and typecheck**

Run: `npx eslint src/components/NavigationTransition.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 3: Manual visual check** (needs a real browser)

With `npm run dev` running, click any menu link that jumps to a section (`#about`, `#projects`, etc.): besides the existing gradient sweep, six small cyan dots should burst outward from the exact point you clicked and fade out, all before the page finishes scrolling to the target section. Total transition should still feel fast, not sluggish (well under a second).

- [ ] **Step 4: Commit**

```bash
git add src/components/NavigationTransition.tsx
git commit -m "feat: add particle burst layer to section transition"
```

---

### Task 8: Respect `prefers-reduced-motion`

**Files:**
- Modify: `src/components/Scene.tsx`
- Modify: `src/components/SectionReveal.tsx`
- Modify: `src/components/LetterReveal.tsx`

**Interfaces:**
- Consumes: `useReducedMotion` from `framer-motion` (existing package export, confirmed present at `node_modules/framer-motion/dist/es/index.mjs:37`).

- [ ] **Step 1: Stop continuous 3D rotation when reduced motion is preferred**

In `src/components/Scene.tsx`, replace:

```tsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
```

with:

```tsx
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useReducedMotion, type MotionValue } from "framer-motion";
import * as THREE from "three";
```

Then replace:

```tsx
export function AnimatedShape({ color, opacity, geometry, scrollProgress }: AnimatedShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
    if (scrollProgress) {
      const progress = scrollProgress.get();
      meshRef.current.rotation.z = progress * Math.PI * 0.5;
      meshRef.current.scale.setScalar(0.85 + progress * 0.25);
    }
  });
```

with:

```tsx
export function AnimatedShape({ color, opacity, geometry, scrollProgress }: AnimatedShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const prefersReducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    if (!prefersReducedMotion) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
    if (scrollProgress) {
      const progress = scrollProgress.get();
      meshRef.current.rotation.z = progress * Math.PI * 0.5;
      meshRef.current.scale.setScalar(0.85 + progress * 0.25);
    }
  });
```

The infinite time-based spin is what reduced-motion users find most uncomfortable — that's what's gated. The scroll-linked rotation/scale from Task 4 stays: it's directly tied to a deliberate scroll action, not an autoplaying loop.

- [ ] **Step 2: Shorten `SectionReveal`'s entrance for reduced motion**

Replace the full contents of `src/components/SectionReveal.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type SectionRevealVariant = "up" | "left" | "right" | "scale";

interface SectionRevealProps {
  children: React.ReactNode;
  variant?: SectionRevealVariant;
}

export default function SectionReveal({ children, variant = "up" }: SectionRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const x = variant === "left" ? -56 : variant === "right" ? 56 : 0;
  const y = variant === "scale" ? 32 : variant === "up" ? 64 : 0;
  const [forceReveal, setForceReveal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setForceReveal(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const revealed = { opacity: 1, x: 0, y: 0, scale: 1, clipPath: "inset(0 0 0% 0 round 0rem)" };
  const hidden = prefersReducedMotion
    ? revealed
    : { opacity: 0, x, y, scale: 0.94, clipPath: "inset(0 0 10% 0 round 2rem)" };
  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.div
      className="w-full relative"
      initial={hidden}
      whileInView={revealed}
      animate={forceReveal ? revealed : undefined}
      viewport={{ once: true, amount: 0.12 }}
      transition={transition}
    >
      <motion.div
        aria-hidden="true"
        className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-[var(--color-cyan)] to-transparent pointer-events-none z-30"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: [0, 0.9, 0] }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: prefersReducedMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Shorten `LetterReveal`'s per-letter stagger for reduced motion**

Replace the full contents of `src/components/LetterReveal.tsx`:

```tsx
"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useForceReveal } from "@/hooks/useForceReveal";

interface LetterRevealProps {
  text: string;
  className?: string;
}

const NBSP = " ";

export default function LetterReveal({ text, className = "" }: LetterRevealProps) {
  const forceReveal = useForceReveal();
  const prefersReducedMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.02 } },
  };

  const letterVariant: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, rotateX: -70, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: { duration: prefersReducedMotion ? 0.01 : 0.45, ease: "easeOut" },
    },
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{ perspective: 400 }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      animate={forceReveal ? "visible" : undefined}
      viewport={{ once: true, margin: "-80px" }}
      aria-label={text}
    >
      {text.split("").map((char, i) => (
        <motion.span key={i} variants={letterVariant} className="inline-block origin-bottom" aria-hidden="true">
          {char === " " ? NBSP : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
```

- [ ] **Step 4: Lint and typecheck**

Run: `npx eslint src/components/Scene.tsx src/components/SectionReveal.tsx src/components/LetterReveal.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 5: Manual visual check** (needs a real browser)

With your OS's "reduce motion" setting turned on (Windows: Settings → Accessibility → Visual effects → Animation effects, off) and `npm run dev` running:
- 3D objects still show their static wireframe shape (and still react to scroll per Task 4), but no longer spin continuously.
- Section entrances and letter-by-letter titles appear near-instantly instead of animating in.

With "reduce motion" off (default), confirm nothing changed from before this task — full spin, full stagger, full entrance animation.

- [ ] **Step 6: Commit**

```bash
git add src/components/Scene.tsx src/components/SectionReveal.tsx src/components/LetterReveal.tsx
git commit -m "feat: respect prefers-reduced-motion for 3D spin and entrance animations"
```

---

## Final check (all tasks complete)

- [ ] Run `npx tsc --noEmit` and `npx eslint src/` one more time across the whole `src/` tree — expect the same 3 pre-existing `<img>` warnings (now possibly 2, since Task 6 converted the Projects one to `motion.img`) and zero errors.
- [ ] Run `npm run build` — expect a clean static build, same as after Task 1.
- [ ] With `npm run dev` running, in a real browser (this environment cannot do this step — hand off to the user), check at 375px, 1024px, and 1440px widths:
  - **375px (mobile):** no 3D anywhere (confirm via DevTools that no WebGL canvas exists in the DOM), no video, all non-3D animations (Starfield, SectionReveal, LetterReveal, Skills fill bars, Projects parallax, NavigationTransition) still work.
  - **1024px+ (desktop):** exactly one `<canvas>` element in the DOM for all 3D (DevTools → Elements, search for `canvas` — should be 1, not 7). Every section (Hero, About, Process, Skills, Laboratory, Projects, Contact) shows its own 3D shape, each reacting to scroll position (grow/tilt near center of viewport). Hero's shape also drifts with mouse movement. No video anywhere, no request to `cdn.pixabay.com` in the Network tab.
  - Compare a Lighthouse/DevTools Performance run's First Contentful Paint against a run from before this plan (or against `git stash` of all these commits) — should be faster, not slower, given the video + HDR removal.
  - "Reduce motion" OS setting: continuous 3D spin and long entrance animations stop; scroll-linked motion and instant content display remain.
