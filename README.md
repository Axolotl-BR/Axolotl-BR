# AXOLOTL BR

**A central oficial do universo Axolotl BR.**

> Sua comunidade na internet. De player para player.

Este site é o lugar digital onde o universo Axolotl BR vive: comunidade, jogos, servidores, projetos, laboratório e o que mais aparecer no caminho.

## o que tem aqui

- **início** — identidade e a chamada pra entrar
- **comunidade** — o discord e o que acontece lá
- **servidores** — smp e experiências de jogo
- **projetos** — o que está sendo construído
- **código** — repos abertos no github
- **dono** — quem manda aqui
- **ouvindo** — tocando agora no spotify
- **novidades** — a história conforme acontece

## rodando

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm start
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
├── hooks/          # scrollspy
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

host próprio (ShardCloud): `npm run build && node index.js` serve `dist/` na raiz — ver `.shardcloud` e `index.js`. sem GitHub Pages.

## tocando agora (spotify)

a seção `ouvindo` mostra o que o fabi tá ouvindo, ao vivo, via `GET /api/now-playing` (servido pelo `index.js`). sem credencial, mostra "o fabi não tá ouvindo nada agora." — nada inventado.

pra ativar, configura no host como variáveis de ambiente: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`. nunca commitar esses valores.

o passo a passo pra gerar o `refresh_token` (com a conta do fabi) tá no `FAZER.txt` local — não versionado, não sobe pro git.

---

🫟 axolotl 

_de player pra player · feito na internet._
