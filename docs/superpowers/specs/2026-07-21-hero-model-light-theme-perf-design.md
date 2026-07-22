# Design: Capacete 3D real no Hero, tema claro corrigido, IntroLoader mais rápido

Data: 2026-07-21

## Contexto

Feedback do usuário sobre o trabalho anterior (perf + 3D compartilhado, já em produção):
- Tema claro ficou feio ("tudo branco") — cores saturadas do tema escuro nunca foram ajustadas pro fundo claro, e alguns componentes têm cor escura fixa no código em vez de variável de tema.
- Os objetos 3D wireframe abstratos (icosaedro/torus/dodecaedro/octaedro/torus-knot) espalhados em 7 seções ficaram "estranhos". Referência do usuário: martelo do Thor em site presell — um objeto 3D real e icônico, não formas geométricas genéricas repetidas.
- Site ainda lento.
- Pedido explícito: modelo `.glb` real (não construído por primitivas), mesmo sabendo que isso tensiona com "rápido".

Investigação prévia (nesta sessão) já validou tecnicamente a peça mais arriscada: baixar, comprimir (`@gltf-transform/cli`: resize 512×512 + WebP + Draco) e validar um modelo CC0 real do repositório oficial Khronos (`SciFiHelmet`) — 30MB → 376KB, testado e funcional. Arquivo comprimido salvo em scratchpad pra reuso na implementação. Decoder Draco vem embutido no pacote `three` já instalado (`node_modules/three/examples/jsm/libs/draco/gltf/`), sem CDN externa.

## Escopo

### 1. Tema claro — cores e cores fixas

- `src/app/globals.css`: dentro de `:root[data-theme="light"]`, sobrescrever `--color-accent`, `--color-accent-light`, `--color-pink`, `--color-cyan` com variantes mais escuras/dessaturadas (mantendo a mesma família de cor, ajustando luminosidade pra contraste real em fundo `#f4f2f9`/`#ffffff`). Valores exatos definidos na implementação com checagem de contraste (texto/borda sobre fundo claro).
- Substituir cor fixa `#0a0814` por `var(--background)` (ou equivalente) em: `IntroLoader.tsx`, `NavigationTransition.tsx`, `Hero.tsx`. Essas três eram as únicas com hex fixo fora do sistema de tema (confirmado por grep).
- Fora de escopo: reformular a paleta em si — é ajuste de contraste, não redesign visual.

### 2. Remoção dos objetos 3D genéricos + simplificação de arquitetura

- Remover `<LazyScene>` de: `About.tsx`, `Process.tsx`, `Skills.tsx`, `Laboratory.tsx`, `Projects.tsx`, `Contact.tsx` (6 arquivos, uma linha + import cada).
- Como só o Hero mantém 3D, a arquitetura de canvas compartilhado (`SceneCanvas.tsx`, `SceneCanvasGate.tsx`, `LazyScene.tsx`/`LazySceneContent.tsx` com `View`/`View.Port`) deixa de ter razão de existir — ela resolvia o problema de 7 WebGL contexts simultâneos, que não existe mais com 1 objeto só.
- Substituir por um único componente dedicado (`HeroScene.tsx` ou nome equivalente) com seu próprio `<Canvas>`, carregado via `next/dynamic(..., { ssr: false })` e gate `useIsDesktop()` (hook já existe, mantido) — mesmo princípio de "mobile nunca baixa o bundle 3D", arquitetura mais simples.
- Deletar: `Scene.tsx`, `LazyScene.tsx`, `LazySceneContent.tsx`, `SceneCanvas.tsx`, `SceneCanvasGate.tsx` (toda a família de arquivos da geometria abstrata genérica — nada deles é reaproveitável pro capacete real, que usa `useGLTF` em vez de `meshStandardMaterial` com geometria primitiva).
- `layout.tsx`: remove `<SceneCanvasGate />` (não é mais global — o novo componente do Hero é local ao próprio `Hero.tsx`, não ao layout raiz, já que só uma seção precisa dele).

### 3. Capacete 3D real no Hero

- Asset: `SciFiHelmet` (Khronos glTF-Sample-Assets, CC0 1.0 Universal — domínio público). Comprimido via `@gltf-transform/cli` (resize 512×512, WebP qualidade 75, Draco) para 376KB. Arquivo final fica em `public/models/hero-helmet.glb`.
- Decoder Draco: copiar `node_modules/three/examples/jsm/libs/draco/gltf/{draco_decoder.wasm,draco_wasm_wrapper.js}` para `public/draco/` (sem dependência nova, sem CDN — os arquivos já existem localmente via `three`).
- Componente novo `src/components/HeroScene.tsx`: `<Canvas>` próprio, `useGLTF(path, "/draco/")` do drei (drei já embute suporte a caminho de decoder Draco customizado), luzes diretas manuais (2-3 `directionalLight`/`pointLight` posicionadas, sem `<Environment>`/HDRI — mesma decisão de custo-benefício já tomada antes pro wireframe, mas agora com material PBR real então a posição das luzes importa mais para o resultado visual).
- Comportamento: rotação/tilt ligado a `useScroll`+`useTransform` (framer-motion) na seção Hero — mesmo scrubbing bidirecional já usado no resto do site — mais um leve parallax de posição ligado ao mouse (reaproveita o `useMotionValue`/`useSpring` que já existe em `Hero.tsx` para isso, criado numa etapa anterior).
- Carregamento: `next/dynamic(..., {ssr:false})` + `useIsDesktop()` — mesmo princípio de exclusão mobile que já existia, sem alteração conceitual, só aplicado a um componente mais simples.
- Crédito CC0 (não obrigatório legalmente, mas boa prática): linha discreta no rodapé do `Contact.tsx`/`Footer`, ex. "Modelo 3D: SciFi Helmet (Khronos Group, CC0)".

### 4. Performance — IntroLoader

- `IntroLoader.tsx`: reduzir o `setTimeout` de bloqueio de 1700ms para um valor bem menor (~500-600ms, ajuste fino durante implementação) e/ou parar de travar `document.body.style.overflow` durante a exibição, permitindo interação imediata mesmo com a animação de entrada ainda rodando.
- Medir bundle/build antes e depois das remoções (Seção 2) para confirmar redução real, não só assumir.

### 5. Interações/animações — mantidas, não reconstruídas

A maior parte do que o usuário descreveu (text splitting, staggered reveal, scroll-scrub, mask reveal, AnimatePresence) já existe no código (`LetterReveal.tsx`, `SectionReveal.tsx`, `NavigationTransition.tsx`, parallax em `Projects.tsx`). Não é reconstrução — é:
- Reaproveitar o mesmo mecanismo de scroll-scrub (framer-motion `useScroll`/`useTransform`) para o capacete, em vez de introduzir GSAP/ScrollTrigger (já instalado como dependência mas nunca importado em nenhum arquivo — decisão deliberada de não adicionar peso de bundle quando framer-motion já cobre o efeito pedido).
- Garantir que `NavigationTransition.tsx`/`IntroLoader.tsx` funcionam visualmente corretos nos dois temas (consequência da correção da Seção 1).

## Fora de escopo

- Adicionar GSAP/ScrollTrigger como mecanismo novo (framer-motion já cobre).
- Novo objeto 3D em qualquer seção além do Hero.
- Redesenho de paleta além do ajuste de contraste do tema claro.
- Remover a dependência `gsap` do `package.json` (fora do pedido, não afeta bundle do browser por não ser importada).

## Teste / verificação

- `npm run build` limpo antes/depois, comparar tamanho de bundle da rota `/`.
- Tema claro: conferir manualmente (usuário, sem browser disponível neste ambiente) contraste de texto/bordas em cada seção, ausência de flash escuro no `IntroLoader`/`NavigationTransition`.
- Hero: capacete carrega só em desktop (≥1024px), gira com scroll (scrub bidirecional), reage ao mouse, sem objeto 3D nas outras 6 seções.
- `IntroLoader`: tempo de bloqueio reduzido, sem travar scroll por 1.7s.
