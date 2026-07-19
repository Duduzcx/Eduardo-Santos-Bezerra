# Design: Animações estilo presell no portfólio

Data: 2026-07-19

## Contexto

Referência: https://gustavocampelo.com.br/a-nova-era-presell/ (site "presell" de lançamento, animações estilo GSAP/ScrollTrigger comuns nesse nicho: objeto 3D girando em loop na hero, palavra circulada em vermelho que "completa" o traço conforme o scroll, cards flutuando na lateral, texto surgindo letra a letra).

Não é reformulação do portfólio — só adiciona camada de animação/interação em cima da estrutura existente (Hero, About, Process, Skills, Laboratory, Projects, Contact).

Stack já disponível, sem novas libs: `framer-motion`, `gsap`, `lenis`, `@react-three/fiber`, `@react-three/drei`, `three`.

Achado relevante: `Scene.tsx` (icosaedro wireframe rotacionando via r3f) e `AnimatedBackground.tsx` (importa `GlobalScene`, arquivo inexistente — import quebrado) existem no repo mas não são usados em lugar nenhum hoje. `About.tsx` já tem um SVG decorativo rotativo com comentário "estilo Thor" — é a referência que o usuário tinha em mente pro "loop" pedido.

## Escopo

### 1. Hero — objeto 3D em loop + cards laterais flutuantes

- Reaproveitar/ajustar `Scene.tsx`: cores trocadas pro brand (`--color-accent`, `--color-cyan`), montado dentro de `Hero.tsx` como camada absoluta atrás do texto, combinando com o vídeo de fundo já existente (não substitui — mantém vídeo com opacity atual).
- Novo componente `src/components/FloatingTechCards.tsx`: 3–4 chips (React, Node.js, TypeScript, Next.js) posicionados nas laterais esquerda/direita da hero.
  - Float contínuo (oscilação senoidal em Y, `animate` do framer-motion com `repeat: Infinity`).
  - Parallax leve ligado ao scroll via `useScroll`/`useTransform` (mesmo padrão de `FloatingObjects.tsx`, mas com cards reais em vez de formas geométricas soltas).
  - Escondido ou com opacity reduzida em mobile (`hidden lg:block` ou equivalente) pra não colidir com o texto central.
- `AnimatedBackground.tsx`/`GlobalScene` import quebrado: fora de escopo, não é usado em lugar nenhum — não mexer (não faz parte do fluxo de render atual).

### 2. CircleReveal — palavra "obsoletos" circulada em vermelho

- Novo componente genérico `src/components/CircleReveal.tsx`:
  - Props: `word: string`, `className?: string`.
  - Envolve a palavra num `<span>` posicionado relativo, com um `<svg>` absoluto por cima contendo uma elipse/path tipo rabisco.
  - `strokeDasharray` = perímetro do path; `strokeDashoffset` animado de `perímetro` → `0` via `useScroll({ target: wordRef, offset: ["start 0.8", "start 0.35"] })` + `useTransform` (não usa `whileInView` binário — precisa ser scrubbed pelo progresso do scroll, replicando o efeito "completa conforme arrasta a tela" descrito).
  - Cor do traço: vermelho puro (`#ef4444`), levemente irregular (path desenhado à mão, não círculo perfeito, pra imitar o rabisco do site de referência).
  - Reutilizável — não fica hardcoded pra essa palavra específica.
- Copy nova em `About.tsx`: adicionar frase curta ao final do bloco de texto, ex.: *"Chega de sistemas **obsoletos** — eu construo o que sua empresa vai precisar nos próximos 10 anos."*, com `obsoletos` envolto por `<CircleReveal word="obsoletos" />`.

### 3. LetterReveal — texto surgindo letra a letra

- Novo componente `src/components/LetterReveal.tsx`:
  - Split por letra (diferente do `TextReveal.tsx` atual, que já existe e faz split por palavra — esse continua intacto e em uso nos parágrafos).
  - Cada letra: `opacity 0→1`, `filter: blur(8px)→blur(0)`, `y: 20→0`, stagger curto (~0.02s) entre letras.
  - Trigger `whileInView`, `viewport={{ once: true }}`.
  - Aplicado em: H1/H2 da Hero (`Hero.tsx`) e nos títulos de seção (`h2` "Sobre mim" em `About.tsx`, e equivalentes em `Process.tsx`, `Skills.tsx`, `Laboratory.tsx`, `Projects.tsx`, `Contact.tsx` — só o título, não o corpo do texto), substituindo as entradas atuais de scale/rotateX desses títulos especificamente.

### 4. CTA magnético (bônus)

- Botão "Explorar Projetos" (`Hero.tsx`): efeito magnético — ao passar o mouse dentro de um raio (~60–80px) do botão, ele se desloca sutilmente em direção ao cursor (`useMotionValue` + `useSpring`); ao sair do raio, volta ao centro com spring.
- Implementação local no próprio `Hero.tsx` ou componente pequeno `MagneticButton.tsx` caso valha reaproveitar em outro CTA depois (ex. Contact).

## Fora de escopo

- Reestruturação de seções, remoção/adição de conteúdo além das frases pontuais citadas.
- Novas dependências.
- Corrigir o import quebrado de `GlobalScene` em `AnimatedBackground.tsx` (componente não usado, não afeta o pedido).
- Efeitos do site de referência não mencionados pelo usuário (ex. FAQ accordion, seções de módulos) — fora do pedido.

## Teste / verificação

- Rodar `npm run dev`, visitar `/` no browser, checar:
  - Hero: objeto 3D girando visível atrás do texto, vídeo ainda presente, cards laterais flutuando (desktop), some/reduzido em mobile.
  - Scroll até About: círculo vermelho em volta de "obsoletos" completa progressivamente conforme a seção passa pelo viewport (não é on/off, é scrubbed).
  - Títulos de seção (Hero, About, Process, Skills, Laboratory, Projects, Contact) aparecem letra a letra com blur-in ao entrar no viewport.
  - Hover no CTA "Explorar Projetos": leve atração magnética ao cursor.
  - Sem quebra de layout em mobile (375px) e desktop (1440px).
  - `npm run lint` limpo.
