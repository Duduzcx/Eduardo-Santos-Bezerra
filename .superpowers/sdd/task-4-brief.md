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

