# Design: Performance de carregamento + 3D em todas as seções + scroll animations

Data: 2026-07-19

## Contexto

Pedido do usuário: deixar o carregamento inicial do portfólio o mais rápido possível sem remover recursos visuais, e ao mesmo tempo aumentar o foco em animações, objetos 3D e transições de seção acionadas por scroll.

Investigação prévia encontrou duas causas concretas do carregamento lento:

1. `Hero.tsx` carrega um `<video>` de fundo de um CDN externo (`cdn.pixabay.com`), sem otimização, sem poster, com autoplay imediato.
2. `Scene.tsx` (usado por `LazyScene.tsx`, hoje em Hero/Laboratory/Contact) renderiza `<Environment preset="city" />` do `@react-three/drei`, que baixa um HDR de reflexo de ambiente. O material do objeto é `wireframe` transparente, que praticamente não reflete o ambiente — custo de rede/GPU real por ganho visual perto de zero.

Stack já disponível, sem novas dependências: `framer-motion`, `gsap`, `lenis`, `@react-three/fiber`, `@react-three/drei`, `three`.

3D hoje só existe em Hero, Laboratory e Contact (wireframe girando de fundo via `LazyScene`/`Scene`). About, Process, Skills e Projects não têm nenhum elemento 3D.

Site é single-page (seções por âncora: Hero/About/Process/Skills/Laboratory/Projects/Contact). "Transições entre páginas" no pedido do usuário se refere à transição de seção já existente em `NavigationTransition.tsx` (disparada por clique em link `#âncora`), não a rotas separadas do Next.

## Decisões (confirmadas com o usuário)

- Vídeo do Hero é removido, substituído por 3D/CSS — não por vídeo local otimizado.
- 3D é adicionado nas 4 seções que não têm hoje (About, Process, Skills, Projects), além das 3 que já têm.
- 3D roda só em desktop (`lg` breakpoint pra cima). Mobile mantém todas as outras animações (Starfield, framer-motion, SectionReveal, scrubs) — só o WebGL é cortado.
- Arquitetura de 3D muda de "um `<Canvas>` por seção" pra um canvas único compartilhado no layout, usando `<View>` do drei, pra sustentar 7 objetos 3D sem abrir 7 WebGL contexts simultâneos.

## Escopo

### 1. Performance — corte de gordura

- **Remover** o `<video>` do Pixabay em `Hero.tsx` e o `<source>` externo junto.
- **Remover** `<Environment preset="city" />` de `Scene.tsx`. Iluminação fica só `ambientLight` (intensity 0.5) + `directionalLight` (position `[10,10,5]`, intensity 1) — já presentes, sem Environment por cima.
- Nenhuma outra remoção de recurso visual.

### 2. Arquitetura 3D — canvas único compartilhado

- Novo componente `src/components/SceneCanvas.tsx`: monta em `layout.tsx`, um único `<Canvas>` do `@react-three/fiber`, `fixed inset-0 z-[1] pointer-events-none`, full-screen.
  - Só monta acima de `lg` (checagem via `window.matchMedia("(min-width: 1024px)")` antes de montar o `<Canvas>` — não é só CSS `hidden`, é não inicializar WebGL em telas menores).
  - Luzes globais (`ambientLight` + `directionalLight`) definidas uma vez aqui, não repetidas por seção.
- `LazyScene.tsx` é refatorado por dentro: em vez de criar seu próprio `<Canvas>` via `dynamic(() => import("./Scene"))`, passa a renderizar uma `<View>` do drei (`@react-three/drei` já inclui `View` e `View.Track`), ancorada num `div` local (`View.Track` aponta pro track element).
  - **API pública de `LazyScene` não muda**: `<LazyScene className color opacity geometry />` continua funcionando igual pra quem já usa (Hero, Laboratory, Contact) — o ganho de performance é transparente pra esses três.
  - `useInView` que já existe em `LazyScene` continua controlando se a `View` daquela seção participa do render ou não (fora da tela, não entra na lista de render do canvas único).
- `AnimatedShape` (dentro de `Scene.tsx`) ganha suporte a mais geometrias: union type de `geometry` passa de `"icosahedron" | "torus"` para `"icosahedron" | "torus" | "dodecahedron" | "octahedron" | "torusknot"`. `torusknot` usa `THREE.TorusKnotGeometry` (nativa do `three`, sem lib nova).

### 3. 3D por seção

| Seção | Geometria | Cor (token existente) | Observação |
|---|---|---|---|
| Hero | icosahedron (mantém) | `--color-cyan` | opacity sobe de 0.60 pra ~0.75 (ocupa o espaço visual que o vídeo deixou) |
| About | dodecahedron | `--color-cyan` | posicionado atrás do SVG decorativo que já existe em `About.tsx` |
| Process | octahedron | `--color-accent` | canto oposto à timeline arrastável |
| Skills | torusknot | `--color-pink` | fundo, atrás da lista de skills |
| Laboratory | icosahedron (mantém) | `--color-accent` | sem mudança de geometria |
| Projects | torus | `--color-cyan` | fundo dos cards |
| Contact | icosahedron (mantém) | `--color-cyan` | sem mudança de geometria |

Cada seção usa `<LazyScene geometry="..." color="..." opacity="..." className="absolute inset-0 ..." />` seguindo o padrão que já existe em Laboratory/Contact — só adicionando a prop nas 4 seções novas e trocando geometria/cor onde faz sentido.

### 4. Hero sem vídeo

- `<video>` e wrapper removidos de `Hero.tsx`.
- Shape do Hero fica maior/mais opaco (ver tabela acima) e ganha leve parallax de posição ligado ao mouse, via `useMotionValue`/`useSpring` (mesmo padrão já usado no botão magnético do próprio `Hero.tsx`) — não é só rotação por tempo, reage a onde o mouse está.
- `Starfield` (já existe) continua por cima, mesma densidade de hoje.
- Gradiente escuro de leitura (`from-[#0a0814]/40 via-[#0a0814]/70 to-[var(--background)]`) mantido igual — já não dependia do vídeo pra existir.

### 5. 3D reage ao scroll, não só ao tempo

- Cada instância de `AnimatedShape`/`View` de seção ganha `useScroll({ target: <ref da section> })` do framer-motion, com `useTransform` mapeando o progresso de scroll da seção pra:
  - rotação extra somada à rotação contínua existente (`useFrame`);
  - leve escala (0.85 → 1.1) conforme a seção entra/sai do viewport.
- Não substitui a rotação por tempo (`useFrame` com `delta`) — soma a ela.

### 6. Mais scroll-scrub além do que já existe

Já existem (branch anterior): `CircleReveal` (palavra circulada scrubada), texto "SOBRE MIM" com `clip-path` scrubado em About, `SectionReveal` com variantes, timeline arrastável em Process com `scaleY` ligado a scroll.

Adiciona:
- **Skills**: preenchimento/progresso visual por skill scrubado pelo scroll da seção, mesmo mecanismo de `useScroll`+`offset` que `CircleReveal` já usa (não é fade-in on-view, é contínuo com a posição de scroll).
- **Projects**: parallax clássico na imagem de cada card — imagem se move em `y`/`scale` mais devagar que o card ao redor, via `useScroll`+`useTransform` por card.

### 7. `NavigationTransition` mais vistosa

- Mantém as duas camadas de `clip-path` + gradiente radial que já existem.
- Adiciona uma terceira camada: partículas/pontos cruzando na direção do clique (reaproveita a estética do `Starfield` ou um conjunto pequeno de pontos animados via framer-motion), reforçando a sensação de transição.
- Duração total sobe de ~0.42s pra ~0.55s (ainda abaixo do limiar de ~600ms onde transições deixam de parecer instantâneas).

### 8. Acessibilidade — `prefers-reduced-motion`

- Hoje não é respeitado em nenhum componente.
- Novo hook `useReducedMotion` (ou uso do `useReducedMotion` que o próprio `framer-motion` já exporta — checar se cobre o caso) usado para:
  - desligar rotação contínua dos objetos 3D (mantém só a orientação estática);
  - trocar easings longos de `whileInView`/scrub por aparecer direto, sem animação de entrada.

## Fora de escopo

- Rotas separadas do Next (`/projetos`, `/sobre` etc.) — site continua single-page.
- Novas dependências além do que já está instalado.
- Redesenho de conteúdo/copy das seções.
- 3D em mobile (decisão explícita do usuário: só desktop `lg+`).
- Hospedar vídeo local otimizado — decisão explícita foi substituir por 3D/CSS, não otimizar o vídeo existente.

## Teste / verificação

- `npm run build` limpo (typecheck + lint) após cada etapa da implementação.
- `npm run dev`, DevTools → Performance/Lighthouse (mobile e desktop): comparar First Contentful Paint antes/depois da remoção do vídeo + Environment HDR.
- Confirmar via DevTools que existe apenas 1 WebGL context ativo no fim do scroll (hoje seriam 3, crescendo pra até 7 com o escopo novo se fosse canvas-por-seção).
- Passagem manual em 375px / 1024px / 1440px:
  - abaixo de 1024px: nenhum `<Canvas>` monta (verificar no DevTools que não há WebGL context), demais animações continuam normais;
  - 1024px+: cada seção mostra seu objeto 3D com a geometria/cor da tabela, reagindo à posição de scroll (rotação/escala) e, no Hero, ao mouse;
  - clique em link do menu dispara a transição de seção com a terceira camada nova;
  - SO com "reduzir movimento" ativado: rotações contínuas e reveals longos desligam.
