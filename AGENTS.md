# AGENTS — AxolotlBR (site oficial)

## Marca (resumo MASTER UNIVERSE)

- **AXOLOTL BR — Sua comunidade na internet. De player para player. JOGAR. CRIAR. CONECTAR.** Sensação alvo: `"Finalmente achei minha galera."`
- Hero: afirmação de identidade (`AXOLOTL BR` + tagline + `ENTRAR NA COMUNIDADE` / `EXPLORAR`), nunca `"Bem-vindo ao nosso site."`
- Site = porta de entrada do universo, nunca landing abandonada: mostrar novidades/projetos/eventos reais. Nunca inventar números, status, parceiros, eventos.
- Visual: internet + gaming + cultura digital + design contemporâneo, dark premium com profundidade (superfícies/camadas/bordas), sem neon/RGB, sem glassmorphism excessivo, sem template gamer genérico. Axolote 🫟 como assinatura/easter egg, com moderação.
- Copy PT-BR curto, confiante, humano. Regra de ouro antes de criar: parece Axolotl? fortalece? ajuda a comunidade? é útil? Se não, não criar.

## Stack / comandos

- React 18 + TS + Vite 5 + CSS puro (`src/styles/`) + `lucide-react`. Sem Tailwind/styled.
- `npm install` / `npm run dev` (5173, `open:true`) / `npm run typecheck` (`tsc --noEmit`) / `npm run build` (`vite build` só) / `npm run preview`.
- QUIRK: caminho com `#` (`#Projetos`) quebra `vite dev/build`. Rodar de cópia em caminho limpo (`C:\Temp`).
- `vite.config.ts`: `base:'/'` (host próprio na raiz), `preview.open:false` (evita `xdg-open ENOENT`), `chunkSizeWarningLimit:800`.
- `tsconfig`: `strict` + `noUnusedLocals` + `noUnusedParameters` + `noFallthroughCasesInSwitch`.

## Onde mexer

- Fonte única: `src/data/site.ts` (brand, links, nav, status, servers, lab). Nunca espalhar URL/hex, nunca inventar estado.
- `src/sections/` = casas da página (hero, manifesto, comunidade, discord, servidores, lab, built, owner, nowplaying, news...), `src/components/` = navbar/section/footer/toast, `src/lib/` = easter eggs, `src/hooks/` = scrollspy.
- Easter eggs oficiais: digitar `axolote`, clicar no axolote repetidamente, console. Sem popup automático. Não quebrar UX por causa deles.
- Visual: flat, sem gradiente/glow/orbe/shimmer. Um acento roxo + detalhes em verde-água. Se parece template de IA, corta.
- Deploy: host próprio (ShardCloud, `npm run build && node index.js` servindo `dist/` na raiz). Sem GitHub Pages. URL canônica em `site.url` + `index.html` (og/canonical).
