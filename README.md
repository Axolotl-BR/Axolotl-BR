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
- **dono** — quem manda aqui + tocando agora no spotify
- **news** — a história conforme acontece

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

host próprio (ShardCloud): `npm run build && node index.js` serve `dist/` na raiz — ver `.shardcloud` e `index.js`. sem GitHub Pages.

## tocando agora (spotify)

a seção `ouvindo` mostra o que o fabi tá ouvindo, ao vivo, via `GET /api/now-playing` (servido pelo `index.js`). sem credencial, mostra "o fabi não tá ouvindo nada agora." — nada inventado.

pra ativar, com a conta do fabi:

1. cria um app em `developer.spotify.com/dashboard` (qualquer nome, qualquer redirect).
2. abre no navegador (troca `SEU_CLIENT_ID`):
   `https://accounts.spotify.com/authorize?client_id=SEU_CLIENT_ID&response_type=code&redirect_uri=http://localhost:8888/callback&scope=user-read-currently-playing`
3. autoriza e copia o `code` da URL de retorno (`?code=...`).
4. troca os valores e roda:
   `curl -X POST https://accounts.spotify.com/api/token -H "Authorization: Basic $(echo -n CLIENT_ID:CLIENT_SECRET | base64)" -d grant_type=authorization_code -d code=CODIGO -d redirect_uri=http://localhost:8888/callback`
5. pega o `refresh_token` da resposta e configura no host como variáveis de ambiente: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`. nunca commitar esses valores.

---

🫟 axolotl 

_de player pra player · feito na internet._
