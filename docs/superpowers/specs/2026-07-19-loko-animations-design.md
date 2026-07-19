# Design: Intro loader, cursor customizado, wipe loko, mais objetos 3D, imagem faltante

Data: 2026-07-19

## Contexto

Continuação do trabalho de `2026-07-19-presell-animations-design.md` (já implementado: Scene 3D no Hero, chips flutuantes, CircleReveal, LetterReveal, CTA magnético). Pedido do usuário: imagens nos cards, mais animações "estilo Thor" (referência ao objeto 3D wireframe do Hero), transições entre seções mais elaboradas.

Levantamento: `Projects.tsx` já tem imagem em 5/5 cards; `Laboratory.tsx` tem imagem em 3/4 `BentoCard` — falta no card "Engenharia de Dados". `Scene.tsx` (icosaedro wireframe r3f) só é montado no Hero. Atributo `data-magnetic` já existe em vários títulos (`Process.tsx`, `Laboratory.tsx`, `Contact.tsx`) sem nenhum listener consumindo — indício de que um cursor customizado reagindo a esse atributo era intenção não implementada.

## Escopo

### 1. Imagem faltante — `Laboratory.tsx`
Adicionar prop `image` ao card "Engenharia de Dados" (card 4), seguindo o mesmo padrão Unsplash dos outros 3 cards.

### 2. `Scene.tsx` genérico + mais instâncias
Adicionar props opcionais `color` (default mantém o atual `#67e8f9`) e `geometry` (`"icosahedron" | "torus"`, default `"icosahedron"`) ao componente. Comportamento e chamada atual no Hero não muda (mesmos valores default).

Novas instâncias, todas `absolute inset-0 pointer-events-none`, opacidade baixa (0.12–0.25), atrás do conteúdo (z-index abaixo do texto):
- `About.tsx`: torus rosa (`--color-pink`), canto superior direito, tamanho reduzido.
- `Laboratory.tsx`: icosaedro cor accent, cobrindo o fundo da seção, bem sutil.
- `Contact.tsx`: icosaedro ciano, atrás do formulário/conteúdo.

### 3. `NavigationTransition.tsx` — wipe mais loko
Troca do `scaleY` simples por sweep diagonal: `clipPath` de um polígono inclinado animando de 0% a 100% de cobertura, com um gradiente de cor (`accent` → `cyan` → `pink`) cruzando a tela durante a transição em vez de cor sólida. Mesma duração/trigger atual (clique em âncora), só o visual muda.

### 4. `CustomCursor.tsx` (novo)
- Only desktop (`(pointer: fine)` via matchMedia) — não monta em touch.
- Ponto pequeno + anel maior, ambos seguindo `clientX/clientY` via `useMotionValue` + `useSpring` (anel com spring mais solto que o ponto, pra dar delay/arrasto).
- `mouseover`/`mouseout` com `closest('[data-magnetic], a, button')`: anel escala ~2.5x e preenche com cor translúcida enquanto o cursor está sobre o alvo.
- CSS global (`globals.css`): `cursor: none` no `body` só dentro de um media query `(pointer: fine)`, pra não quebrar touch/mobile.
- `pointer-events-none` no cursor customizado, `z-index` acima de tudo exceto o `IntroLoader`.
- Convive com `StarTrail.tsx` (rastro de partículas) — não substitui, é uma camada a mais.

### 5. `IntroLoader.tsx` (novo) + mount em `layout.tsx`
- Tela cheia (`fixed inset-0 z-[100]`), fundo `#0a0814`.
- Nome "Eduardo Santos Bezerra" com `LetterReveal` (componente já existente), barra de progresso 0→100% animada (~1.2–1.6s via `framer-motion`, sem setInterval manual — `animate` de width).
- Ao completar: sai com `clipPath` circular expandindo do centro até cobrir a tela toda (`AnimatePresence`), revelando o site por baixo.
- Só aparece uma vez por sessão de navegador: `sessionStorage.getItem("intro-seen")`; se já visto, componente não renderiza nada (retorna `null` direto, sem montar a animação).
- Enquanto ativo, trava scroll do body (`overflow: hidden`, removido ao sair).
- Client component, montado em `layout.tsx` antes de `StarTrail`/demais camadas.

## Fora de escopo
- `prefers-reduced-motion` (não tratado hoje em nenhuma animação existente do projeto — manter consistência, não introduzir tratamento parcial só nas partes novas).
- Alterar animações já existentes no Hero, Skills, Projects, About (texto), Process — só adiciona camadas novas.
- Novas dependências (tudo com `framer-motion` + `@react-three/fiber`/`drei`/`three` já instalados).
- Imagem nos tiles do `Skills.tsx` (grid de ícones pequenos — imagem ali polui, fora do pedido literal de "cards").

## Teste / verificação
- `npm run dev`, abrir `/` em aba anônima (sessionStorage limpo): loader aparece, revela o site, não reaparece em navegação por âncora nem em reload da mesma aba (sessionStorage) — reaparece só em nova sessão/aba anônima.
- Cursor customizado visível em desktop (mouse), sumindo/não interferindo em viewport mobile/touch; aumenta sobre títulos com `data-magnetic` e sobre links/botões.
- Clique em link de âncora do Navbar: wipe diagonal colorido, não mais a barra sólida anterior.
- Scroll até About/Laboratory/Contact: objetos 3D de fundo visíveis, sutis, sem atrapalhar leitura de texto, sem quebrar layout mobile (375px).
- Laboratory: 4 cards, todos com imagem de fundo.
- `npx eslint` limpo nos arquivos tocados.
