# 🫟 AXOLOTL BR

**A central oficial do universo Axolotl BR.**

> Sua comunidade na internet. De player para player.

Este site é o lugar digital onde o universo Axolotl BR vive: comunidade, jogos, servidores, projetos, laboratório e o que mais aparecer no caminho.

## o que tem aqui

- **hub** — identidade e a sensação de entrar no universo
- **universo** — todo mundo conectado ao mesmo axolote
- **comunidade** — o discord e o que acontece lá
- **servidores** — smp e experiências de jogo
- **projetos** — o axolotl lab e o que está sendo construído
- **news** — a história do universo conforme acontece

## rodando

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

> rodando o `npm run dev`/`build` num caminho com `#` (ex.: `#Projetos`) quebra o vite. usar um caminho limpo.

## stack

- react + typescript
- vite
- css puro com design system (`src/styles/`)
- lucide icons

## estrutura

```
src/
├── components/     # navbar, section, footer, toast, status dot
├── sections/       # as "casas" da página (hero, universo, lab, news...)
├── hooks/          # scrollspy, pointer glow, reduced motion
├── lib/            # easter eggs e helpers
├── data/           # fonte única de verdade (links, status, projetos)
└── styles/         # tokens, globals, componentes e seções
```

## links e conteúdo

**Nunca espalhar URL pelo código.** tudo mora em `src/data/site.ts` — discord, github, status, projetos, news, changelog. se mudar um link, muda num lugar só.

**Nada inventado.** status e dados só aparecem se existirem. o que for demonstrativo está marcado como tal.

## easter eggs

- digite `axolote` em qualquer lugar
- clique no axolote (de novo e de novo)
- leia o console

## deploy

`.github/workflows/static.yml` builda o vite e publica `dist/` no GitHub Pages.

---

🫟 axolotl online.

_powered by cool axolotl club · feito na internet._