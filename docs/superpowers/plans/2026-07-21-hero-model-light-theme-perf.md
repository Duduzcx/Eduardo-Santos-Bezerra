# Real GLTF Hero Model + Light Theme Fix + Intro Perf Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix light-theme color contrast and hardcoded dark colors, cut the intro loader's blocking delay, remove the 7-section abstract wireframe 3D decoration, and replace it with a single real, license-safe, compressed GLTF model (sci-fi helmet) in the Hero that reacts to scroll and mouse.

**Architecture:** Theme/perf fixes are small, independent edits. The 3D work is a straight swap: delete the shared-canvas wireframe system (`Scene.tsx`, `LazyScene.tsx`, `LazySceneContent.tsx`, `SceneCanvas.tsx`, `SceneCanvasGate.tsx`) entirely — it existed to support 7 simultaneous abstract shapes, a problem that no longer exists once only Hero has 3D — and replace it with one dedicated `HeroScene.tsx` (its own `<Canvas>`, loaded via `next/dynamic({ssr:false})`, gated on the existing `useIsDesktop()` hook).

**Tech Stack:** `@react-three/fiber`, `@react-three/drei` (`useGLTF`), `three`, `framer-motion` — all already installed, no new dependencies. Model asset: Khronos `SciFiHelmet` (CC0), compressed via `@gltf-transform/cli` (run once via `npx`, a build-time tool — not a runtime dependency).

Spec: `docs/superpowers/specs/2026-07-21-hero-model-light-theme-perf-design.md`

## Global Constraints

- No new npm dependencies. `@gltf-transform/cli` is invoked via `npx` as a one-off asset-processing tool during Task 4 only — it is never imported by application code and must not be added to `package.json`.
- No automated test suite in this repo — verification per task is `npx eslint <files>`, `npx tsc --noEmit`, `npm run build`.
- Current lint baseline: 2 pre-existing warnings (`@next/next/no-img-element` in `Laboratory.tsx`, `Process.tsx`), zero errors. Don't fix these — out of scope.
- Git discipline: every commit runs `git add <exact files>`, never `-A`/`.`.
- Light-theme color replacements (exact values, from the design spec): `--color-accent: #6d28d9` (was `#7c3aed`), `--color-accent-light: #9333ea` (was `#a855f7`), `--color-pink: #a21caf` (was `#e879f9`), `--color-cyan: #0e7490` (was `#67e8f9`). Dark theme is untouched — these are `:root[data-theme="light"]`-only overrides.
- The model source is `https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SciFiHelmet/glTF/` — CC0 1.0 Universal (public domain). Already download-and-compress verified in this environment before this plan was written: 30.29MB → 376KB via `@gltf-transform/cli` `copy` → `resize --width 512 --height 512` → `webp --slots "*" --quality 75` → `draco`. Task 4 below reproduces those exact commands.
- The Draco decoder files ship inside the already-installed `three` package at `node_modules/three/examples/jsm/libs/draco/gltf/` — copy them into `public/draco/`, do not fetch from a CDN.
- Windows/PowerShell dev environment; all commands below are plain `npm`/`npx`/`curl`, usable from either shell (curl.exe ships with Windows 10+; if unavailable, `Invoke-WebRequest -Uri <url> -OutFile <path>` is the PowerShell equivalent for every `curl -sL -o` command in this plan).

---

### Task 1: Light theme colors + hardcoded dark-color sweep

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/IntroLoader.tsx`
- Modify: `src/components/NavigationTransition.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:** None — pure styling fix, no component API changes.

- [ ] **Step 1: Add light-theme color overrides**

In `src/app/globals.css`, replace:

```css
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

  color-scheme: light;
}
```

with:

```css
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

Without this, `--color-accent`/`--color-cyan`/`--color-pink` inherit their dark-theme values (`#7c3aed`/`#67e8f9`/`#e879f9`) unchanged in light mode — the two brightest ones (cyan, pink) are pastel colors tuned for a near-black background and have very poor contrast against the light theme's near-white `--background`/`--background-panel`.

- [ ] **Step 2: Fix hardcoded dark backgrounds in overlay components**

In `src/components/IntroLoader.tsx`, replace:

```tsx
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[#0a0814]"
```

with:

```tsx
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-[var(--background)]"
```

In `src/components/NavigationTransition.tsx`, replace:

```tsx
            className="absolute inset-0 bg-[#0a0814]"
```

with:

```tsx
            className="absolute inset-0 bg-[var(--background)]"
```

Both were hardcoded to the dark theme's background hex — in light mode they painted a jarring dark flash over the light UI during the intro and every section-navigation click.

- [ ] **Step 3: Fix Hero's gradient mask**

In `src/components/Hero.tsx`, replace:

```tsx
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#0a0814]/40 via-[#0a0814]/70 to-[var(--background)]" />
```

with:

```tsx
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[var(--background)]/40 via-[var(--background)]/70 to-[var(--background)]" />
```

- [ ] **Step 4: Fix body's hardcoded text color**

In `src/app/layout.tsx`, replace:

```tsx
        className={`${inter.variable} font-sans bg-transparent text-neutral-50 antialiased overflow-x-hidden selection:bg-white selection:text-black`}
```

with:

```tsx
        className={`${inter.variable} font-sans bg-transparent text-[var(--foreground)] antialiased overflow-x-hidden selection:bg-white selection:text-black`}
```

`text-neutral-50` is a Tailwind utility class; as a class selector it has higher CSS specificity than the `body { color: var(--foreground); }` rule already in `globals.css`, so it silently wins and keeps body text near-white even in light theme, regardless of what `--foreground` is set to.

- [ ] **Step 5: Lint and typecheck**

Run: `npx eslint src/app/globals.css src/components/IntroLoader.tsx src/components/NavigationTransition.tsx src/components/Hero.tsx src/app/layout.tsx`
Expected: no output (eslint doesn't lint `.css`, it'll just skip that arg silently — this confirms the 4 `.tsx` files are clean).

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 6: Manual visual check** (needs a real browser — none available in this environment; document for the user)

Toggle to light theme (`ThemeToggle` in the navbar), check: no dark flash in the intro loader or when clicking a menu link; accent/cyan/pink colors (badges, borders, gradient text) are legible against the light background; body text isn't washed out.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/components/IntroLoader.tsx src/components/NavigationTransition.tsx src/components/Hero.tsx src/app/layout.tsx
git commit -m "fix: correct light theme color contrast and hardcoded dark colors"
```

---

### Task 2: Cut IntroLoader's blocking delay

**Files:**
- Modify: `src/components/IntroLoader.tsx`

**Interfaces:** None.

- [ ] **Step 1: Shorten the forced display time and progress-bar animation**

In `src/components/IntroLoader.tsx`, replace:

```tsx
    const timer = setTimeout(() => {
      setExited(true);
      document.body.style.overflow = "";
    }, 1700);
```

with:

```tsx
    const timer = setTimeout(() => {
      setExited(true);
      document.body.style.overflow = "";
    }, 600);
```

Then replace:

```tsx
              transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
```

with:

```tsx
              transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
```

(This is the progress-bar fill animation — it needs to finish inside the new 600ms window instead of the old 1.3s one, otherwise it gets cut off mid-fill.)

- [ ] **Step 2: Lint and typecheck**

Run: `npx eslint src/components/IntroLoader.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 3: Manual check** (needs a real browser)

Clear `sessionStorage` (or open a private window), load the site: intro loader shows briefly (~600ms, progress bar fills to 100% right as it exits) instead of blocking for 1.7s.

- [ ] **Step 4: Commit**

```bash
git add src/components/IntroLoader.tsx
git commit -m "perf: cut IntroLoader's blocking delay from 1.7s to 600ms"
```

---

### Task 3: Remove the abstract wireframe 3D system

**Files:**
- Modify: `src/components/About.tsx`
- Modify: `src/components/Process.tsx`
- Modify: `src/components/Skills.tsx`
- Modify: `src/components/Laboratory.tsx`
- Modify: `src/components/Projects.tsx`
- Modify: `src/components/Contact.tsx`
- Modify: `src/components/Hero.tsx`
- Modify: `src/app/layout.tsx`
- Delete: `src/components/Scene.tsx`
- Delete: `src/components/LazyScene.tsx`
- Delete: `src/components/LazySceneContent.tsx`
- Delete: `src/components/SceneCanvas.tsx`
- Delete: `src/components/SceneCanvasGate.tsx`

**Interfaces:**
- Removes: `LazyScene` (default export), `AnimatedShape`/`ShapeGeometry` (from `Scene.tsx`), `SceneCanvas`, `SceneCanvasGate` — none of these exist after this task.
- Keeps: `src/hooks/useIsDesktop.ts` — still needed by Task 5's `HeroScene`. Do not delete it.
- Hero.tsx is left with an empty (but present) mouse-parallax wrapper `<motion.div>` after this task — Task 5 fills it with the real `HeroScene`. This is an intentional, independently-buildable intermediate state (Hero simply shows no 3D between Task 3 and Task 5).

- [ ] **Step 1: Remove from About.tsx**

Replace:

```tsx
import TextReveal from "./TextReveal";
import LetterReveal from "./LetterReveal";
import LazyScene from "./LazyScene";
```

with:

```tsx
import TextReveal from "./TextReveal";
import LetterReveal from "./LetterReveal";
```

Replace:

```tsx
      </motion.div>

      <LazyScene className="absolute inset-0 pointer-events-none" geometry="dodecahedron" color="#67e8f9" opacity={0.35} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
```

with:

```tsx
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
```

- [ ] **Step 2: Remove from Process.tsx**

Replace:

```tsx
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, animate } from "framer-motion";
import LazyScene from "./LazyScene";
```

with:

```tsx
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, animate } from "framer-motion";
```

Replace:

```tsx
      <motion.div aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} className="pointer-events-none absolute -right-28 top-24 h-72 w-72 rounded-full border border-[var(--color-accent)]/15" />
      <LazyScene className="absolute inset-0 pointer-events-none" geometry="octahedron" color="#7c3aed" opacity={0.35} />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
```

with:

```tsx
      <motion.div aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 26, repeat: Infinity, ease: "linear" }} className="pointer-events-none absolute -right-28 top-24 h-72 w-72 rounded-full border border-[var(--color-accent)]/15" />
      <div className="relative z-10 mx-auto max-w-6xl px-6">
```

- [ ] **Step 3: Remove from Skills.tsx**

Replace:

```tsx
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import LetterReveal from "./LetterReveal";
import LazyScene from "./LazyScene";
```

with:

```tsx
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import LetterReveal from "./LetterReveal";
```

Replace:

```tsx
      <motion.div 
        animate={{ rotateZ: -360, rotateX: -360, rotateY: 180 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute right-[-5%] top-[20%] w-[40vw] h-[40vw] border border-[var(--color-cyan)]/10 rounded-full pointer-events-none"
      />
      <LazyScene className="absolute inset-0 pointer-events-none" geometry="torusknot" color="#e879f9" opacity={0.35} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
```

with:

```tsx
      <motion.div 
        animate={{ rotateZ: -360, rotateX: -360, rotateY: 180 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute right-[-5%] top-[20%] w-[40vw] h-[40vw] border border-[var(--color-cyan)]/10 rounded-full pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
```

- [ ] **Step 4: Remove from Laboratory.tsx**

Replace:

```tsx
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import LetterReveal from "./LetterReveal";
import LazyScene from "./LazyScene";
import { Activity, Box, Variable, Cpu } from "lucide-react";
```

with:

```tsx
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import LetterReveal from "./LetterReveal";
import { Activity, Box, Variable, Cpu } from "lucide-react";
```

Replace:

```tsx
      {/* Objeto 3D em loop, estilo Thor, bem sutil no fundo da seção */}
      <LazyScene className="absolute inset-0 pointer-events-none" color="#7c3aed" opacity={0.4} />

      <div className="px-6 md:px-12 lg:px-24 mb-16 max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-10 relative z-10">
```

with:

```tsx
      <div className="px-6 md:px-12 lg:px-24 mb-16 max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-10 relative z-10">
```

- [ ] **Step 5: Remove from Projects.tsx**

Replace:

```tsx
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ImageOff } from "lucide-react";
import LazyScene from "./LazyScene";
```

with:

```tsx
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ImageOff } from "lucide-react";
```

Replace:

```tsx
      <motion.div aria-hidden="true" style={{ y: sceneY }} className="pointer-events-none absolute left-[-18vw] top-[42%] h-[38vw] w-[38vw] rounded-[3rem] border border-[var(--color-pink)]/10" />
      <LazyScene className="absolute inset-0 pointer-events-none" geometry="torus" color="#67e8f9" opacity={0.35} />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
```

with:

```tsx
      <motion.div aria-hidden="true" style={{ y: sceneY }} className="pointer-events-none absolute left-[-18vw] top-[42%] h-[38vw] w-[38vw] rounded-[3rem] border border-[var(--color-pink)]/10" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
```

- [ ] **Step 6: Remove from Contact.tsx**

Replace:

```tsx
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import LazyScene from "./LazyScene";
```

with:

```tsx
import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";
```

Replace:

```tsx
      {/* Objeto 3D em loop, estilo Thor, atrás do formulário */}
      <LazyScene className="absolute inset-0 pointer-events-none" color="#67e8f9" opacity={0.3} />

      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
```

with:

```tsx
      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
```

- [ ] **Step 7: Remove from Hero.tsx (leave the parallax wrapper empty — Task 5 fills it)**

Replace:

```tsx
import { useRef } from "react";
import { motion, useMotionValue, useSpring, type Variants } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import TextReveal from "./TextReveal";
import LazyScene from "./LazyScene";
import FloatingTechCards from "./FloatingTechCards";
import LetterReveal from "./LetterReveal";
import Starfield from "./Starfield";
```

with:

```tsx
import { useRef } from "react";
import { motion, useMotionValue, useSpring, type Variants } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import TextReveal from "./TextReveal";
import FloatingTechCards from "./FloatingTechCards";
import LetterReveal from "./LetterReveal";
import Starfield from "./Starfield";
```

Replace:

```tsx
      {/* Objeto 3D em loop, ocupa o espaço do vídeo removido, reage à posição do mouse */}
      <motion.div style={{ x: sceneSpringX, y: sceneSpringY }} className="absolute inset-0 z-[1] pointer-events-none">
        <LazyScene className="absolute inset-0 pointer-events-none" opacity={0.75} />
      </motion.div>
```

with:

```tsx
      {/* Objeto 3D real entra na Task 5 (HeroScene) — wrapper de parallax de mouse já fica pronto aqui */}
      <motion.div style={{ x: sceneSpringX, y: sceneSpringY }} className="absolute inset-0 z-[1] pointer-events-none" />
```

- [ ] **Step 8: Remove from layout.tsx**

Replace:

```tsx
import NavigationTransition from "@/components/NavigationTransition";
import CustomCursor from "@/components/CustomCursor";
import IntroLoader from "@/components/IntroLoader";
import SceneCanvasGate from "@/components/SceneCanvasGate";
```

with:

```tsx
import NavigationTransition from "@/components/NavigationTransition";
import CustomCursor from "@/components/CustomCursor";
import IntroLoader from "@/components/IntroLoader";
```

Replace:

```tsx
        <ColorfulBackground />
        <FloatingObjects />
        <SceneCanvasGate />

        <SmoothScroll>
```

with:

```tsx
        <ColorfulBackground />
        <FloatingObjects />

        <SmoothScroll>
```

- [ ] **Step 9: Delete the old 3D files**

```bash
git rm src/components/Scene.tsx src/components/LazyScene.tsx src/components/LazySceneContent.tsx src/components/SceneCanvas.tsx src/components/SceneCanvasGate.tsx
```

- [ ] **Step 10: Confirm no remaining references**

Run: `grep -rln "SceneCanvas\|LazyScene\|from \"./Scene\"" src/`
Expected: no output (empty — everything was removed in Steps 1-8).

- [ ] **Step 11: Lint, typecheck, build**

Run: `npx eslint src/components/About.tsx src/components/Process.tsx src/components/Skills.tsx src/components/Laboratory.tsx src/components/Projects.tsx src/components/Contact.tsx src/components/Hero.tsx src/app/layout.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run build`
Expected: `✓ Compiled successfully`, all routes static, no errors.

- [ ] **Step 12: Manual visual check** (needs a real browser)

At ≥1024px width, scroll through the whole page: no wireframe shapes anywhere (About/Process/Skills/Laboratory/Projects/Contact all show only their existing non-3D decorations and content). Hero shows no 3D yet (expected — Task 5 adds it).

- [ ] **Step 13: Commit**

```bash
git add src/components/About.tsx src/components/Process.tsx src/components/Skills.tsx src/components/Laboratory.tsx src/components/Projects.tsx src/components/Contact.tsx src/components/Hero.tsx src/app/layout.tsx
git commit -m "refactor: remove abstract wireframe 3D system from all sections"
```

(The `git rm` from Step 9 stages the deletions separately — they'll be included in this same commit since they're already staged; running `git add` on the modified files above and then committing captures both the deletions and the edits in one commit. If `git status` shows the deletions as already staged from Step 9, that's expected — don't re-stage them, just don't unstage them either.)

---

### Task 4: Download and compress the hero model asset

**Files:**
- Create: `public/models/hero-helmet.glb`
- Create: `public/draco/draco_decoder.wasm`
- Create: `public/draco/draco_wasm_wrapper.js`
- Modify: `src/components/Contact.tsx` (CC0 credit line)

**Interfaces:**
- Produces: a static file servable at `/models/hero-helmet.glb` and a Draco decoder servable at `/draco/`. Task 5 consumes both by exact path.

- [ ] **Step 1: Download the source model**

```bash
mkdir -p /tmp/scifi-helmet-src
cd /tmp/scifi-helmet-src
curl -sL -o SciFiHelmet.gltf "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SciFiHelmet/glTF/SciFiHelmet.gltf"
curl -sL -o SciFiHelmet.bin "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SciFiHelmet/glTF/SciFiHelmet.bin"
curl -sL -o SciFiHelmet_AmbientOcclusion.png "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SciFiHelmet/glTF/SciFiHelmet_AmbientOcclusion.png"
curl -sL -o SciFiHelmet_BaseColor.png "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SciFiHelmet/glTF/SciFiHelmet_BaseColor.png"
curl -sL -o SciFiHelmet_MetallicRoughness.png "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SciFiHelmet/glTF/SciFiHelmet_MetallicRoughness.png"
curl -sL -o SciFiHelmet_Normal.png "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SciFiHelmet/glTF/SciFiHelmet_Normal.png"
ls -la
```

Expected: 6 files, roughly 30MB combined (the four PNGs are the bulk of it).

- [ ] **Step 2: Compress with @gltf-transform/cli**

Run each command in sequence (each one's output feeds the next):

```bash
cd /tmp/scifi-helmet-src
npx --yes @gltf-transform/cli copy SciFiHelmet.gltf step1.glb
npx --yes @gltf-transform/cli resize step1.glb step2.glb --width 512 --height 512
npx --yes @gltf-transform/cli webp step2.glb step3.glb --slots "*" --quality 75
npx --yes @gltf-transform/cli draco step3.glb final.glb
ls -la final.glb
```

Expected: `final.glb` is roughly 350-400KB (verified in this environment at 376KB before this plan was written — exact byte count may vary slightly by `@gltf-transform/cli` version, that's fine).

- [ ] **Step 3: Verify the compressed file is structurally valid**

Run: `npx --yes @gltf-transform/cli inspect /tmp/scifi-helmet-src/final.glb`
Expected: a table output showing `extensionsUsed: EXT_texture_webp, KHR_draco_mesh_compression`, one scene, no errors.

- [ ] **Step 4: Place the model in the repo**

```bash
mkdir -p public/models
cp /tmp/scifi-helmet-src/final.glb public/models/hero-helmet.glb
ls -la public/models/hero-helmet.glb
```

- [ ] **Step 5: Self-host the Draco decoder**

```bash
mkdir -p public/draco
cp node_modules/three/examples/jsm/libs/draco/gltf/draco_decoder.wasm public/draco/draco_decoder.wasm
cp node_modules/three/examples/jsm/libs/draco/gltf/draco_wasm_wrapper.js public/draco/draco_wasm_wrapper.js
ls -la public/draco/
```

These two files already ship inside the installed `three` package — no download, no new dependency, no CDN reference at runtime.

- [ ] **Step 6: Add the CC0 credit line**

In `src/components/Contact.tsx`, replace:

```tsx
      <footer className="relative z-10 max-w-6xl mx-auto mt-20 pt-6 border-t border-[var(--border-subtle)] text-sm text-[var(--text-tertiary)]">© {new Date().getFullYear()} Eduardo Santos Bezerra. Todos os direitos reservados.</footer>
```

with:

```tsx
      <footer className="relative z-10 max-w-6xl mx-auto mt-20 pt-6 border-t border-[var(--border-subtle)] text-sm text-[var(--text-tertiary)]">
        © {new Date().getFullYear()} Eduardo Santos Bezerra. Todos os direitos reservados.
        <span className="block mt-1 text-xs opacity-70">Modelo 3D &quot;SciFi Helmet&quot; por Michael Pavlovic e Norbert Nopper (Khronos Group), licença CC0 1.0.</span>
      </footer>
```

- [ ] **Step 7: Clean up the temp working directory**

```bash
rm -rf /tmp/scifi-helmet-src
```

- [ ] **Step 8: Lint and typecheck**

Run: `npx eslint src/components/Contact.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

- [ ] **Step 9: Commit**

`public/models/hero-helmet.glb` and `public/draco/*` are binary files — `git add` them explicitly by path (binary files don't diff meaningfully, that's expected and fine for `git add`/`git status`/`git commit`, just don't try to inspect their diff content).

```bash
git add public/models/hero-helmet.glb public/draco/draco_decoder.wasm public/draco/draco_wasm_wrapper.js src/components/Contact.tsx
git commit -m "feat: add compressed CC0 hero helmet model + self-hosted draco decoder"
```

---

### Task 5: Build HeroScene and wire it into Hero

**Files:**
- Create: `src/components/HeroScene.tsx`
- Modify: `src/components/Hero.tsx`

**Interfaces:**
- Produces: `HeroScene` (default export) — `{ scrollProgress: MotionValue<number> }`. Renders its own `<Canvas>`, loads `/models/hero-helmet.glb` via `useGLTF` with the local `/draco/` decoder path, gates continuous rotation behind `prefers-reduced-motion` (scroll-linked tilt stays active regardless, matching the established pattern from the previous 3D work).
- Consumes: `useIsDesktop` (from `src/hooks/useIsDesktop.ts`, already exists, not modified by this task).

- [ ] **Step 1: Create `HeroScene.tsx`**

```tsx
"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useReducedMotion, type MotionValue } from "framer-motion";
import * as THREE from "three";

interface HelmetProps {
  scrollProgress: MotionValue<number>;
}

function Helmet({ scrollProgress }: HelmetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scene } = useGLTF("/models/hero-helmet.glb", "/draco/");

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    if (!prefersReducedMotion) {
      groupRef.current.rotation.y += delta * 0.25;
    }
    groupRef.current.rotation.x = scrollProgress.get() * Math.PI * 0.15;
  });

  return (
    <group ref={groupRef} scale={1.6}>
      <primitive object={scene} />
    </group>
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
        <Helmet scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/hero-helmet.glb", "/draco/");
```

`useGLTF`'s second argument (`useDraco`) accepts either `true` (fetches the decoder from Google's CDN) or a string (a custom decoder base path) — passing `"/draco/"` here points it at the self-hosted files from Task 4, so no CDN request happens. Two manually-positioned `directionalLight`s (cyan + pink, matching the site's brand palette) stand in for HDRI/`<Environment>` lighting — same cost-tradeoff decision made earlier in this project for the wireframe shapes, but now doing real work since this model has actual PBR textures to catch the light. The continuous Y-axis spin is gated behind `prefers-reduced-motion`; the scroll-linked X-axis tilt (via `scrollProgress`, a `MotionValue<number>` driven by Hero's own scroll range) is not — same rationale as the rest of this codebase: scroll-linked motion is tied to a deliberate user action, not an autoplaying loop.

- [ ] **Step 2: Wire it into Hero.tsx**

Replace the import block:

```tsx
import { useRef } from "react";
import { motion, useMotionValue, useSpring, type Variants } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import TextReveal from "./TextReveal";
import FloatingTechCards from "./FloatingTechCards";
import LetterReveal from "./LetterReveal";
import Starfield from "./Starfield";
```

with:

```tsx
import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useScroll, type Variants } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import TextReveal from "./TextReveal";
import FloatingTechCards from "./FloatingTechCards";
import LetterReveal from "./LetterReveal";
import Starfield from "./Starfield";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });
```

Then, right after the line `export default function Hero() {`, add:

```tsx
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
```

Then replace the `<section>` opening tag:

```tsx
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" onMouseMove={handleHeroMouseMove}>
```

with:

```tsx
    <section ref={sectionRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden" onMouseMove={handleHeroMouseMove}>
```

Then replace:

```tsx
      {/* Objeto 3D real entra na Task 5 (HeroScene) — wrapper de parallax de mouse já fica pronto aqui */}
      <motion.div style={{ x: sceneSpringX, y: sceneSpringY }} className="absolute inset-0 z-[1] pointer-events-none" />
```

with:

```tsx
      {/* Capacete 3D real (CC0), gira com o scroll da seção e reage à posição do mouse */}
      <motion.div style={{ x: sceneSpringX, y: sceneSpringY }} className="absolute inset-0 z-[1] pointer-events-none">
        {isDesktop && <HeroScene scrollProgress={scrollYProgress} />}
      </motion.div>
```

`sectionRef` is typed `useRef<HTMLElement>(null)` (not `HTMLDivElement`) because it's attached to a `<section>` element — same convention already used for section-level scroll refs elsewhere in this codebase (e.g. `Process.tsx`). Gating on `isDesktop` before rendering `<HeroScene>` means the `next/dynamic(..., {ssr:false})` import — and therefore the whole Three.js/drei/model/draco download — never triggers for mobile, the same pattern used everywhere else 3D content is gated in this codebase.

- [ ] **Step 3: Lint, typecheck, build**

Run: `npx eslint src/components/HeroScene.tsx src/components/Hero.tsx`
Expected: no output.

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run build`
Expected: `✓ Compiled successfully`, all routes static, no errors.

- [ ] **Step 4: Manual visual check** (needs a real browser)

At ≥1024px width: the helmet appears in the Hero, catches cyan/pink highlights from the two directional lights, spins continuously on its Y axis, tilts slightly on its X axis as you scroll through the Hero section (and tilts back if you scroll up), and drifts subtly with mouse movement (the existing parallax wrapper). Below 1024px: no 3D, no network request to `/models/hero-helmet.glb` or `/draco/*` (check DevTools Network tab). With the OS "reduce motion" setting on: the helmet stops continuously spinning but still tilts with scroll.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroScene.tsx src/components/Hero.tsx
git commit -m "feat: add real GLTF hero helmet with scroll-linked rotation"
```

---

## Final check (all tasks complete)

- [ ] `npx tsc --noEmit`, `npx eslint src/`, `npm run build` all clean (same 2 pre-existing `<img>` warnings, zero errors).
- [ ] `grep -rln "SceneCanvas\|LazyScene" src/` returns nothing.
- [ ] At 375px, 1024px, 1440px in a real browser: no 3D below 1024px anywhere; at 1024px+, only Hero has 3D (helmet), no other section shows any wireframe shape; light theme has no dark flashes and legible accent colors everywhere; intro loader is brief, not blocking.
- [ ] Compare `npm run build`'s route size output for `/` against the pre-this-plan build to confirm the removal of 6 sections' 3D + shorter intro nets out to a real improvement (the added helmet+draco cost is desktop-only and lazy, so should not show up in the base JS numbers, only in a runtime network-tab check).
