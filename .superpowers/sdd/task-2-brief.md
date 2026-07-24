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

