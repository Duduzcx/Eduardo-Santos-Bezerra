# Presell-Style Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add presell-style motion to the portfolio — a looping 3D object + floating tech chips in the hero, a scroll-scrubbed red circle drawn around a keyword in About, letter-by-letter title reveals across sections, and a magnetic hover effect on the hero CTA.

**Architecture:** Pure client-side additions on top of the existing Next.js/framer-motion/gsap/r3f stack. Two new reusable components (`CircleReveal`, `LetterReveal`) plus one new hero-only component (`FloatingTechCards`), wired into existing section files. No new dependencies, no structural changes, no content changes beyond one new sentence in About.

**Tech Stack:** `framer-motion` (already installed), `@react-three/fiber`/`@react-three/drei`/`three` (already installed, via existing `Scene.tsx`). No new packages.

Spec: `docs/superpowers/specs/2026-07-19-presell-animations-design.md`

## Global Constraints

- No new dependencies — `framer-motion` (^12.42.2), `gsap`, `lenis`, `@react-three/fiber`, `@react-three/drei`, `three` already cover everything needed.
- Brand colors (from `src/app/globals.css`): accent `#7c3aed`, cyan `#67e8f9`, pink `#e879f9`. Circle-reveal stroke is a fixed pure red `#ef4444` (not a brand color — matches the reference site's literal red circle).
- Repo has **no automated test suite** (no jest/vitest, no `test` script in `package.json`). Verification per task is: (a) scoped `npx eslint <touched files>`, (b) manual check in the browser via `npm run dev`.
- The repo's `npm run lint` and `npx tsc --noEmit` **already fail on the pre-existing baseline** (unrelated files: `ColorfulBackground.tsx`, `CustomCursor.tsx`, `Laboratory.tsx`, `Process.tsx`, `StarTrail.tsx`, `TextReveal.tsx`, `TransitionWrapper.tsx`). Do not attempt to fix these — out of scope. Never run bare `npm run lint` or `npx tsc --noEmit` as a pass/fail gate; always scope eslint to the files touched in the current task.
- Known typing trap: this framer-motion version rejects `Variants` objects whose `transition.ease` is a cubic-bezier array (`[0.16, 1, 0.3, 1]`) — that's the cause of several pre-existing `tsc` errors. All new code in this plan uses string easing keywords (`"easeOut"`, `"easeInOut"`) instead, to avoid adding new instances of this same error.
- Scroll-offset syntax: reuse the percentage-string convention already used in this codebase (see `Process.tsx:33`, `offset: ["start 80%", "end 20%"]`) for any new `useScroll` calls, rather than inventing new syntax.
- **Git state:** the working tree already has substantial pre-existing uncommitted changes (the portfolio build itself — `package.json`, `layout.tsx`, `page.tsx`, `globals.css`, all of `src/components/`). This is the user's in-progress work, not something to discard or bundle in. Every commit in this plan must run `git add <exact files listed in that task>` — **never** `git add -A` or `git add .`.
- Windows/PowerShell dev environment, but all commands below are plain `npm`/`npx` and work identically from either shell.

---

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

### Task 2: Floating tech-stack chips in the hero

**Files:**
- Create: `src/components/FloatingTechCards.tsx`
- Modify: `src/components/Hero.tsx` (import + mount)

**Interfaces:**
- Produces: `FloatingTechCards` (default export, no props) — self-contained, positions itself `absolute inset-0`, hidden below `lg` breakpoint.

- [ ] **Step 1: Create `FloatingTechCards.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Layout, Code, FileCode2, Server } from "lucide-react";

const TECHS = [
  { name: "React", icon: <Code className="w-5 h-5" />, color: "text-[#61DAFB]", border: "border-[#61DAFB]/30", side: "left" as const, top: "22%", delay: 0 },
  { name: "Next.js", icon: <Layout className="w-5 h-5" />, color: "text-white", border: "border-white/30", side: "left" as const, top: "62%", delay: 0.6 },
  { name: "TypeScript", icon: <FileCode2 className="w-5 h-5" />, color: "text-[#3178C6]", border: "border-[#3178C6]/30", side: "right" as const, top: "28%", delay: 0.3 },
  { name: "Node.js", icon: <Server className="w-5 h-5" />, color: "text-[#339933]", border: "border-[#339933]/30", side: "right" as const, top: "68%", delay: 0.9 },
];

export default function FloatingTechCards() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const parallaxUp = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const parallaxDown = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div ref={ref} className="absolute inset-0 z-[2] pointer-events-none hidden lg:block">
      {TECHS.map((tech) => (
        <motion.div
          key={tech.name}
          style={{ top: tech.top, y: tech.side === "left" ? parallaxUp : parallaxDown }}
          className={`absolute ${tech.side === "left" ? "left-[6%]" : "right-[6%]"}`}
        >
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 4 + tech.delay, repeat: Infinity, ease: "easeInOut", delay: tech.delay }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--color-surface)]/80 backdrop-blur-md border ${tech.border} shadow-lg`}
          >
            <span className={tech.color}>{tech.icon}</span>
            <span className="text-sm font-mono text-neutral-300">{tech.name}</span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
```

Note the nesting: the outer `motion.div` carries the scroll-linked parallax (`style.y` bound to a `useTransform` MotionValue), the inner `motion.div` carries the independent infinite float loop (`animate` keyframes). Driving `y` both ways on the *same* element would conflict — that's why there are two nested divs.

- [ ] **Step 2: Mount it in the hero**

In `src/components/Hero.tsx`, add the import:

```tsx
import Scene from "./Scene";
import FloatingTechCards from "./FloatingTechCards";
```

Then replace:

```tsx
      {/* Objeto 3D em loop, estilo Thor, combinado com o vídeo de fundo */}
      <div className="absolute inset-0 z-[1] opacity-60 pointer-events-none">
        <Scene />
      </div>

      <motion.div 
```

with:

```tsx
      {/* Objeto 3D em loop, estilo Thor, combinado com o vídeo de fundo */}
      <div className="absolute inset-0 z-[1] opacity-60 pointer-events-none">
        <Scene />
      </div>

      <FloatingTechCards />

      <motion.div 
```

- [ ] **Step 3: Lint the touched files**

Run: `npx eslint src/components/FloatingTechCards.tsx src/components/Hero.tsx`
Expected: no output.

- [ ] **Step 4: Manual visual check**

With `npm run dev` running, open `http://localhost:3000` at a viewport ≥1024px wide:
- Four chips (React, Next.js, TypeScript, Node.js) float at the left/right edges of the hero, each bobbing up and down independently and continuously.
- Scroll down slowly through the hero: the chips drift at a different rate than the page (parallax), not locked 1:1 to scroll.
- Resize the window below 1024px: the chips disappear entirely (no layout shift, no overlap with the centered hero text).

- [ ] **Step 5: Commit**

```bash
git add src/components/FloatingTechCards.tsx src/components/Hero.tsx
git commit -m "feat: add floating tech-stack chips to hero"
```

---

### Task 3: Scroll-scrubbed red circle around "obsoletos"

**Files:**
- Create: `src/components/CircleReveal.tsx`
- Modify: `src/components/About.tsx:1-5` (import) and `About.tsx:59-62` (new paragraph)

**Interfaces:**
- Produces: `CircleReveal({ word: string, className?: string })` (default export) — generic, reusable on any single word/short phrase.

- [ ] **Step 1: Create `CircleReveal.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const CIRCLE_PATH = "M4,32 C2,18 14,4 32,3 C52,2 64,14 63,30 C64,48 50,61 30,62 C12,63 3,50 4,32 Z";
const PATH_LENGTH = 220;

interface CircleRevealProps {
  word: string;
  className?: string;
}

export default function CircleReveal({ word, className = "" }: CircleRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 40%"],
  });

  const dashoffset = useTransform(scrollYProgress, [0, 1], [PATH_LENGTH, 0]);

  return (
    <span ref={ref} className={`relative inline-block px-2 ${className}`}>
      {word}
      <svg viewBox="0 0 66 66" className="absolute -inset-3 w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] pointer-events-none" fill="none">
        <motion.path
          d={CIRCLE_PATH}
          stroke="#ef4444"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ strokeDasharray: PATH_LENGTH, strokeDashoffset: dashoffset }}
        />
      </svg>
    </span>
  );
}
```

`offset: ["start 85%", "start 40%"]` means the stroke starts drawing when the word's top edge crosses 85% down the viewport, and finishes when it crosses 40% down — a scrub tied to actual scroll position, not an on/off trigger.

- [ ] **Step 2: Use it in `About.tsx`**

Add the import — replace:

```tsx
import TextReveal from "./TextReveal";
```

with:

```tsx
import TextReveal from "./TextReveal";
import CircleReveal from "./CircleReveal";
```

Then replace:

```tsx
            <div className="space-y-6 text-neutral-300 text-xl leading-relaxed">
              <TextReveal text="Sou um Desenvolvedor Full Stack apaixonado por transformar problemas complexos em interfaces elegantes e sistemas de alta performance." />
              <TextReveal text="Com sólida formação em Engenharia de Software, meu foco é sempre a entrega de valor real. Já atuei no desenvolvimento de plataformas EdTech, automação IoT e análise de dados massivos." />
            </div>
```

with:

```tsx
            <div className="space-y-6 text-neutral-300 text-xl leading-relaxed">
              <TextReveal text="Sou um Desenvolvedor Full Stack apaixonado por transformar problemas complexos em interfaces elegantes e sistemas de alta performance." />
              <TextReveal text="Com sólida formação em Engenharia de Software, meu foco é sempre a entrega de valor real. Já atuei no desenvolvimento de plataformas EdTech, automação IoT e análise de dados massivos." />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                Chega de sistemas <CircleReveal word="obsoletos" className="text-white font-semibold" /> — eu construo o que sua empresa vai precisar nos próximos 10 anos.
              </motion.p>
            </div>
```

- [ ] **Step 3: Lint the touched files**

Run: `npx eslint src/components/CircleReveal.tsx src/components/About.tsx`
Expected: no output.

- [ ] **Step 4: Manual visual check**

With `npm run dev` running, scroll slowly to the About section:
- A new sentence appears below the two existing paragraphs, ending in "...eu construo o que sua empresa vai precisar nos próximos 10 anos."
- A red, hand-drawn-looking oval traces itself around the word "obsoletos" progressively as you scroll — not appearing all at once, and not fully drawn until the section has scrolled most of the way through the trigger range described in Step 1.
- Scrolling back up should un-draw it (the effect is fully scroll-bound, not `once: true`).

- [ ] **Step 5: Commit**

```bash
git add src/components/CircleReveal.tsx src/components/About.tsx
git commit -m "feat: add scroll-scrubbed circle reveal around 'obsoletos' in About"
```

---

### Task 4: Letter-by-letter title reveals

**Files:**
- Create: `src/components/LetterReveal.tsx`
- Modify: `src/components/Hero.tsx` (H2), `src/components/About.tsx` (H2), `src/components/Process.tsx` (H2), `src/components/Skills.tsx` (H2), `src/components/Laboratory.tsx` (H2), `src/components/Projects.tsx` (H2), `src/components/Contact.tsx` (H2)

**Interfaces:**
- Produces: `LetterReveal({ text: string, className?: string })` (default export) — renders an `inline-block` `motion.span` wrapping one `motion.span` per character; caller wraps it in whatever heading tag they need.

- [ ] **Step 1: Create `LetterReveal.tsx`**

```tsx
"use client";

import { motion } from "framer-motion";

interface LetterRevealProps {
  text: string;
  className?: string;
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.02 },
  },
};

const letterVariant = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function LetterReveal({ text, className = "" }: LetterRevealProps) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {text.split("").map((char, i) => (
        <motion.span key={i} variants={letterVariant} className="inline-block">
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
```

- [ ] **Step 2: Apply to `Hero.tsx` H2**

Add to the import block (below the `FloatingTechCards` import from Task 2):

```tsx
import LetterReveal from "./LetterReveal";
```

Replace:

```tsx
        <motion.h2 variants={item} className="text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-accent)] to-[var(--color-pink)] font-black mb-8 tracking-wide animate-gradient-x">
          DESENVOLVEDOR FULL STACK
        </motion.h2>
```

with:

```tsx
        <motion.h2 variants={item} className="text-2xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] via-[var(--color-accent)] to-[var(--color-pink)] font-black mb-8 tracking-wide animate-gradient-x">
          <LetterReveal text="DESENVOLVEDOR FULL STACK" />
        </motion.h2>
```

(The H1 above it keeps its current word-stagger entrance untouched — it has an embedded `<br />` and an animated `_` cursor `<span>` that don't reduce cleanly to a single `text` string.)

- [ ] **Step 3: Apply to `About.tsx` H2**

Add the import next to the others:

```tsx
import CircleReveal from "./CircleReveal";
import LetterReveal from "./LetterReveal";
```

Replace:

```tsx
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 mb-6 tracking-tight">
                Sobre mim
              </h2>
```

with:

```tsx
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500 mb-6 tracking-tight">
                <LetterReveal text="Sobre mim" />
              </h2>
```

- [ ] **Step 4: Apply to `Process.tsx` H2**

Add the import — replace:

```tsx
import { motion, useScroll, useTransform } from "framer-motion";
```

with:

```tsx
import { motion, useScroll, useTransform } from "framer-motion";
import LetterReveal from "./LetterReveal";
```

Replace:

```tsx
          <h2 className="text-neutral-500 uppercase tracking-widest text-xs font-medium" data-magnetic>
            O Processo
          </h2>
```

with:

```tsx
          <h2 className="text-neutral-500 uppercase tracking-widest text-xs font-medium" data-magnetic>
            <LetterReveal text="O Processo" />
          </h2>
```

- [ ] **Step 5: Apply to `Skills.tsx` H2**

Add the import — replace:

```tsx
import { motion } from "framer-motion";
```

with:

```tsx
import { motion } from "framer-motion";
import LetterReveal from "./LetterReveal";
```

Replace:

```tsx
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            Stack <span className="text-[var(--color-cyan)]">Principal</span>
          </h2>
```

with:

```tsx
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            <LetterReveal text="Stack " />
            <LetterReveal text="Principal" className="text-[var(--color-cyan)]" />
          </h2>
```

- [ ] **Step 6: Apply to `Laboratory.tsx` H2**

Add the import — replace:

```tsx
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
```

with:

```tsx
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import LetterReveal from "./LetterReveal";
```

Replace:

```tsx
        <h2 className="text-neutral-500 uppercase tracking-widest text-xs font-medium" data-magnetic>
          Laboratório & Explorações
        </h2>
```

with:

```tsx
        <h2 className="text-neutral-500 uppercase tracking-widest text-xs font-medium" data-magnetic>
          <LetterReveal text="Laboratório & Explorações" />
        </h2>
```

- [ ] **Step 7: Apply to `Projects.tsx` H2**

Add the import — replace:

```tsx
import { motion } from "framer-motion";
import { GithubIcon } from "./Icons";
```

with:

```tsx
import { motion } from "framer-motion";
import { GithubIcon } from "./Icons";
import LetterReveal from "./LetterReveal";
```

Replace:

```tsx
          <h2 className="text-4xl md:text-7xl font-black text-white mb-4">
            Projetos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-pink)]">Destaque</span>
          </h2>
```

with:

```tsx
          <h2 className="text-4xl md:text-7xl font-black text-white mb-4">
            <LetterReveal text="Projetos " />
            <LetterReveal text="Destaque" className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-cyan)] to-[var(--color-pink)]" />
          </h2>
```

- [ ] **Step 8: Apply to `Contact.tsx` H2**

Add the import — replace:

```tsx
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
```

with:

```tsx
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import LetterReveal from "./LetterReveal";
```

Replace:

```tsx
        <h2 className="text-neutral-500 uppercase tracking-widest text-sm mb-12" data-magnetic>
          Contato
        </h2>
```

with:

```tsx
        <h2 className="text-neutral-500 uppercase tracking-widest text-sm mb-12" data-magnetic>
          <LetterReveal text="Contato" />
        </h2>
```

- [ ] **Step 9: Lint all touched files**

Run: `npx eslint src/components/LetterReveal.tsx src/components/Hero.tsx src/components/About.tsx src/components/Process.tsx src/components/Skills.tsx src/components/Laboratory.tsx src/components/Projects.tsx src/components/Contact.tsx`
Expected: no output.

- [ ] **Step 10: Manual visual check**

With `npm run dev` running, scroll from top to bottom of the page and confirm every section title (hero subtitle, "Sobre mim", "O Processo", "Stack Principal", "Laboratório & Explorações", "Projetos Destaque", "Contato") animates in character-by-character with a blur-to-sharp, fade-and-rise effect as it enters the viewport, instead of appearing all at once.

- [ ] **Step 11: Commit**

```bash
git add src/components/LetterReveal.tsx src/components/Hero.tsx src/components/About.tsx src/components/Process.tsx src/components/Skills.tsx src/components/Laboratory.tsx src/components/Projects.tsx src/components/Contact.tsx
git commit -m "feat: letter-by-letter reveal on all section titles"
```

---

### Task 5: Magnetic hero CTA

**Files:**
- Modify: `src/components/Hero.tsx`

**Interfaces:**
- None — self-contained change to the existing CTA `<a>` in `Hero.tsx`.

- [ ] **Step 1: Add the magnetic tracking logic**

Replace the import block:

```tsx
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import TextReveal from "./TextReveal";
import Scene from "./Scene";
import FloatingTechCards from "./FloatingTechCards";
import LetterReveal from "./LetterReveal";
```

with:

```tsx
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import TextReveal from "./TextReveal";
import Scene from "./Scene";
import FloatingTechCards from "./FloatingTechCards";
import LetterReveal from "./LetterReveal";
```

Then, right after the `item` variant object (after the closing `};` of `const item = {...}`), add:

```tsx
  const btnRef = useRef<HTMLAnchorElement>(null);
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);
  const springX = useSpring(btnX, { damping: 15, stiffness: 150, mass: 0.5 });
  const springY = useSpring(btnY, { damping: 15, stiffness: 150, mass: 0.5 });

  const handleBtnMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    btnX.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    btnY.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  };

  const handleBtnMouseLeave = () => {
    btnX.set(0);
    btnY.set(0);
  };
```

(This mirrors the mouse-tracking pattern already used in `Laboratory.tsx`'s `BentoCard` — same `useMotionValue`/`useSpring` approach, just driving position instead of rotation.)

- [ ] **Step 2: Wire it to the CTA**

Replace:

```tsx
          <a href="#projects" className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-pink)] text-white font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(232,121,249,0.4)] flex items-center gap-3">
            Explorar Projetos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </a>
```

with:

```tsx
          <motion.a
            ref={btnRef}
            href="#projects"
            onMouseMove={handleBtnMouseMove}
            onMouseLeave={handleBtnMouseLeave}
            style={{ x: springX, y: springY }}
            className="group relative px-10 py-5 rounded-2xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-pink)] text-white font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(232,121,249,0.4)] flex items-center gap-3"
          >
            Explorar Projetos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </motion.a>
```

- [ ] **Step 3: Lint the touched file**

Run: `npx eslint src/components/Hero.tsx`
Expected: no output.

- [ ] **Step 4: Manual visual check**

With `npm run dev` running, hover the mouse near/over the "Explorar Projetos" button: it should shift subtly toward the cursor while the mouse is nearby, and spring back to its resting position when the cursor leaves. Click it — confirm it still scrolls to `#projects`.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: add magnetic hover effect to hero CTA"
```

---

## Final check (all tasks complete)

- [ ] Run `npm run dev`, load `http://localhost:3000` at both a mobile width (375px) and a desktop width (1440px):
  - No layout breakage, no horizontal scrollbar, no console errors introduced by the new components (pre-existing warnings from untouched files are expected and out of scope).
  - Hero: 3D wireframe + video combined, tech chips floating (desktop only), CTA magnetic on hover.
  - About: circle-reveal on "obsoletos" scrubs with scroll.
  - All seven section titles reveal letter-by-letter.
