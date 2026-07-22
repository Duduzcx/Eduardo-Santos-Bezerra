# Design: Tema só escuro, Hero em 2 colunas, astronauta + planetas, perf

Data: 2026-07-22

## Contexto

Feedback sobre o estado atual (capacete + tema claro, já em produção): tema claro fica feio, remove de vez. Objeto 3D fica atrás do nome (Hero centraliza tudo, objeto é overlay full-bleed) — quer nome à esquerda, objeto à direita. Site é sobre astronomia — trocar capacete por astronauta, adicionar planetas/galáxia. Site precisa ficar mais rápido ainda.

Modelo novo já baixado e comprimido nesta sessão (mesmo pipeline do capacete): astronauta real do repositório oficial `google/model-viewer` (licença Apache 2.0), 2.87MB → **24.6KB** (menor que o capacete, geometria mais simples reage melhor ao Draco). Validado estruturalmente com `gltf-transform inspect`.

Achado de performance novo: `ColorfulBackground.tsx` (montado sempre, sem gate de mobile) tem 3 camadas com `blur-[100px]`/`blur-[120px]` continuamente animadas (posição + escala via framer-motion) em elementos grandes (600px, 50-60vw) — blur grande + transform contínuo é um dos combos mais caros que existe pra GPU, e roda em todo dispositivo, sem exceção.

## Escopo

### 1. Remover tema claro

- `src/components/ThemeToggle.tsx`: deletar arquivo.
- `src/components/Navbar.tsx`: remover import + `<ThemeToggle />`.
- `src/app/globals.css`: remover bloco `:root[data-theme="light"]` inteiro (incluindo os 4 overrides de cor adicionados na sessão anterior — ficam órfãos sem o toggle).
- `src/app/layout.tsx`: remover o `<script>` inline que lê `localStorage`/aplica `data-theme="light"`, e o atributo `data-theme="dark"` na tag `<html>` (não é mais necessário indicar tema já que só existe um).

### 2. Hero em 2 colunas

- Estrutura atual: um único bloco centralizado (`flex flex-col items-center text-center`) com o objeto 3D como camada `absolute inset-0` por trás — texto e objeto competem pelo mesmo espaço central.
- Nova estrutura: `flex flex-col lg:flex-row` — bloco de texto vira `flex-1`, alinhado à esquerda em telas grandes (`lg:items-start lg:text-left`, mantém centralizado em mobile); objeto 3D deixa de ser `absolute inset-0` e vira uma coluna dimensionada (`lg:flex-1`, altura fixa tipo `h-[480px] lg:h-[560px]`) à direita — o `Canvas` dentro do `HeroScene` naturalmente centraliza o astronauta dentro desse espaço menor, sem mudar nada dentro do próprio `HeroScene.tsx`.
- `Starfield` e o gradiente de fundo continuam full-bleed (`absolute inset-0`) — são camada de fundo, não competem por espaço com o conteúdo.

### 3. Astronauta substitui capacete

- Trocar `public/models/hero-helmet.glb` → `public/models/hero-astronaut.glb` (arquivo já comprimido e verificado nesta sessão, 24.6KB).
- `HeroScene.tsx`: só troca o path do `useGLTF`/`preload` — resto (Suspense, luzes, gate `isDesktop`, rotação por scroll/tempo, `prefers-reduced-motion`) continua igual, já testado no round anterior.
- Crédito no rodapé (`Contact.tsx`) atualizado: modelo do repositório `google/model-viewer`, licença Apache 2.0 (troca a linha de crédito do capacete CC0).

### 4. Planetas + galáxia

- 2 planetas procedurais (esfera simples, `sphereGeometry` baixa resolução, `meshStandardMaterial` colorido/emissivo nas cores da marca — cyan e rosa) dentro do mesmo `<Canvas>` do `HeroScene`, ao redor do astronauta, com `Float` do drei (já usado antes) pra flutuação orgânica barata. Zero download extra — é geometria pura, mesmo WebGL context já pago pelo astronauta.
- `Starfield.tsx` (já existe, canvas 2D de partículas) — ajuste de densidade/opacidade pra reforçar a sensação de galáxia, sem mudar a abordagem técnica.
- Fora de escopo: modelos GLTF adicionais de planetas/galáxia (esfera procedural já resolve visualmente e é mais leve).

### 5. Performance

- `ColorfulBackground.tsx`: reduzir de 3 camadas com blur animado pra uma versão mais barata — menos blur (ex. `blur-[60px]` em vez de 100-120px), remover a animação contínua de `scale`/`x`/`y` nas duas bolhas ambiente (deixar estáticas ou com transição bem mais lenta/sutil), manter só a bolha que segue o mouse (já é `useSpring`, suave, sem `blur` gigante).
- Gate de mobile: hoje esse componente roda em qualquer tela. Não precisa de `useIsDesktop` completo (é CSS/DOM, não WebGL) — mas reduzir a intensidade já resolve a maior parte do custo em qualquer dispositivo.
- Medir `npm run build` antes/depois — não é bundle JS que muda aqui (é custo de runtime/GPU), então a verificação real é o número de camadas/blur reduzido, documentado no commit.

## Fora de escopo

- Novos modelos 3D além do astronauta (planetas ficam procedurais).
- Mexer em `FloatingObjects.tsx`/`StarTrail.tsx`/`CustomCursor.tsx`/`ScrollProgress.tsx` — auditados, nenhum tem o mesmo padrão caro de blur+animação contínua do `ColorfulBackground`.
- Qualquer alternância de tema — site fica escuro, ponto final, sem toggle nem preparação pra reintroduzir depois.

## Teste / verificação

- `npm run build` limpo.
- Sem `data-theme` em lugar nenhum, sem `ThemeToggle` no Navbar.
- Hero desktop: nome à esquerda, astronauta+planetas à direita, não sobrepostos.
- Astronauta gira com scroll/tempo, planetas flutuam, tudo dentro do mesmo canvas (1 WebGL context, como antes).
- Mobile: sem 3D, sem astronauta, sem planetas (mesmo gate de sempre).
- Visual de `ColorfulBackground` mais sutil, sem animação de blur grande contínua.
