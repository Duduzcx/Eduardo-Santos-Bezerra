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

