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
