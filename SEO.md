# SEO

## Como funciona
- `npm run build` faz o build, gera o bundle SSR e roda `scripts/prerender.mjs`, que grava o HTML renderizado da home em `dist/index.html` (crawlers veem o conteúdo sem JS). Se o prerender falhar, o site segue como SPA.
- Páginas estáticas ficam em `public/` (cada uma com title, description, canonical, og e BreadcrumbList próprios).
- Imagem de compartilhamento: `public/og.png` (1200×630).
- Página nova: criar o html em `public/`, copiar o `<head>` de outra, e adicionar a URL em `public/sitemap.xml`.

## Pendências do proprietário
- Search Console: pedir revisão do aviso "Harmful downloads" e acompanhar a indexação.
- Bing Webmaster Tools: importar o site do Search Console e enviar `sitemap.xml`.
- Analytics: nenhum configurado. Se for usar GA4, precisa de banner de consentimento e ajuste do CSP (`script-src 'self'`).
- Testar em: Rich Results Test, PageSpeed Insights e o debugger de link do Discord/X.
- Domínio próprio ajuda mais no ranking do que qualquer meta tag (`shardweb.app` é compartilhado).

## Crescimento orgânico
- Links externos legítimos: lista de servidores/comunidades brasileiras, GitHub da org, perfis oficiais apontando pro site.
- Conteúdo útil e real: guia de entrada no SMP, changelog público, páginas dos projetos com documentação. Evitar páginas rasas só por palavra-chave.
