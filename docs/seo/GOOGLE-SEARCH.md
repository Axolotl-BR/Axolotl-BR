# Google Search + SEO — Axolotl BR

Domínio canônico atual: https://axolotl-br.shardweb.app/

## Estado dos arquivos

- `index.html`: title, description, canonical, Open Graph, Twitter Card e JSON-LD (`WebSite` + `Organization`).
- `public/robots.txt`: permite rastreamento e aponta para o sitemap.
- `public/sitemap.xml`: lista as páginas públicas que devem ser indexadas.
- O site usa Vite com prerender/SSR; manter conteúdo principal e links navegáveis no HTML entregue ao crawler.

## Checklist de publicação

1. Publicar o commit e confirmar que a versão de produção entrega os arquivos abaixo:
   - `https://axolotl-br.shardweb.app/robots.txt`
   - `https://axolotl-br.shardweb.app/sitemap.xml`
2. Confirmar que a página inicial retorna HTTP 200, sem `noindex`, e que canonical aponta para o domínio acima.
3. Verificar o domínio no Google Search Console. Como é um subdomínio hospedado por terceiro, usar a opção de prefixo de URL (`https://axolotl-br.shardweb.app/`) se não houver controle DNS do domínio raiz.
4. Enviar `https://axolotl-br.shardweb.app/sitemap.xml` em Indexação > Sitemaps.
5. Inspecionar a URL inicial e solicitar indexação. Repetir para as páginas principais depois de verificar os respectivos status.
6. Testar o JSON-LD no Rich Results Test e conferir a renderização no URL Inspection.
7. Acompanhar páginas indexadas, consultas, impressões, cliques e CTR semanalmente.

## Regras de conteúdo

- Uma intenção de busca por página; títulos e descrições únicos.
- Texto visível e útil para cada página, não apenas metadados.
- Não inventar endereço físico, CNPJ, telefone, equipe ou status de empresa.
- Não usar `LocalBusiness` ou Google Business Profile: Axolotl BR é uma comunidade exclusivamente online.
- `sameAs` deve conter somente perfis oficiais e controlados pela comunidade.
- Não prometer posição #1: indexação e ranking são decisões automatizadas do Google.

## Próximas melhorias

- Criar uma página institucional /sobre com história, propósito, projetos e links oficiais.
- Revisar o sitemap sempre que páginas públicas forem criadas/removidas.
- Criar páginas próprias e úteis para Comunidade, Axolotl SMP e Projetos, se elas existirem como rotas públicas reais.
- Considerar domínio próprio no futuro; planejar redirecionamento 301 e atualização de canonical/sitemap/Search Console quando migrar.
