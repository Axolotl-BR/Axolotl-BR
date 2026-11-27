# Google Search & Ads — Axolotl BR

**Site:** https://axolotl-br.shardweb.app/  
**Branch:** `seo/google-presence`  
**Status:** initial SEO foundation; Search Console and Ads account setup still require an authorized human.

## Goals

1. Make the official site discoverable for branded searches such as "Axolotl BR".
2. Help search engines understand the community, its projects and its official links.
3. Test paid Search campaigns only after the landing page, conversion measurement and account ownership are ready.

No SEO change guarantees indexing, a Knowledge Panel or a first-place ranking. Google chooses what to crawl, index and display.

## Current repository findings

- The site uses React, TypeScript and Vite.
- The build prerenders the React app into `dist/index.html`, so verify the final built HTML, not only the source template.
- `public/robots.txt` already allows crawling and points to the sitemap.
- `public/sitemap.xml` already lists the main site pages.
- `index.html` already had canonical, Open Graph and Organization structured data; the SEO branch refines the homepage title, description and graph.
- The public site describes Axolotl BR as a community, not a registered company or physical business. Do not create a fake Google Business Profile or invent an address.

## Technical SEO files

| File | Purpose |
| --- | --- |
| `index.html` | Homepage title, description, canonical, social metadata and JSON-LD |
| `public/robots.txt` | Crawler access and sitemap discovery |
| `public/sitemap.xml` | Canonical public URLs to discover |
| `SEO_GOOGLE.md` | This implementation and launch checklist |

### Rules

- Keep one canonical host. Do not mix `axolotl-br.shardweb.app` with old preview or staging hosts.
- Only put public, useful, indexable URLs in the sitemap.
- Update `lastmod` only when a page's meaningful content changes; never set future or fabricated dates.
- Do not add keyword-stuffing meta tags. Google does not use the `meta keywords` tag for ranking.
- Keep the Organization schema factual and consistent with visible site content.
- Use only official social/profile URLs in `sameAs`. Add more when the profiles are verified and public.
- Do not claim Axolotl BR is a company, registered business, or local establishment unless that becomes factually true.
- Each standalone HTML page should eventually have its own descriptive title, description and canonical URL.
- Keep important content as crawlable HTML links and headings; verify the prerendered output after every build.

## Search Console launch

1. An owner with access to the site should open Google Search Console: https://search.google.com/search-console
2. Add the URL-prefix property `https://axolotl-br.shardweb.app/`.
3. Complete the ownership verification method offered by Google. Do not commit verification tokens to the repository or expose them in chat.
4. Submit `https://axolotl-br.shardweb.app/sitemap.xml`.
5. Inspect the homepage and the most important public pages.
6. Review Page indexing, Sitemaps and Core Web Vitals after Google has had time to crawl.
7. Use `site:axolotl-br.shardweb.app` as a rough diagnostic, not as a complete index report.

Search Console is free. Submission requests discovery; it does not guarantee indexing or ranking.

## Content plan

Prioritize genuinely useful pages, not keyword doorway pages:

- Home: what Axolotl BR is and who it is for.
- About/community: history, values, how to join and what happens in Discord.
- Projects: factual descriptions and links for ALT Bot, Axolotl SMP, Prism and other public projects.
- SMP: status, game edition, gameplay, rules, how to follow launch updates.
- News: original updates with publication dates and links to the relevant project.

Suggested branded queries to monitor: `Axolotl BR`, `Axolotl BR Discord`, `Axolotl SMP`, `ALT Bot Axolotl`, `Axolotl BR projetos`. Do not promise rankings for generic terms like "comunidade gamer".

## Google Ads plan

**Do not launch ads yet.** First confirm that the landing page clearly explains the community, that the Discord invite works, and that conversion measurement is privacy-reviewed.

Suggested first experiment after readiness:

- Campaign type: Search only.
- Goal: visits that lead to a voluntary click on the official Discord invite.
- Geography: Brazil, only if that is the intended audience.
- Keywords: tightly themed branded terms such as `Axolotl BR` and `Axolotl BR Discord`.
- Ad copy: accurately describe the community; do not imply prizes, official game affiliation or benefits that do not exist.
- Landing page: the official homepage or a dedicated community page.
- Measurement: aggregate click counts; no remarketing, customer lists, fingerprinting or cross-site tracking.
- Budget: small capped test approved and paid by the adult account owner; review search terms and pause irrelevant spend.

Google states that Google Ads users must be 18 or older. A responsible adult must own and manage the Ads account and billing; do not misstate age or identity. Google also disables personalized advertising for users under 18 and applies additional teen ad protections. Keep the campaign contextual and avoid audience lists or remarketing.

Official policy: https://support.google.com/adspolicy/answer/9703665

## Privacy and audience

The community includes teenagers. Keep analytics aggregate and minimal. Do not upload Discord member lists, emails, phone numbers, or visitor identifiers to Google Ads. Do not build remarketing audiences. Explain any analytics and advertising measurement in the site's privacy notice and review LGPD obligations before deployment.

## Release checklist

- [ ] Review the SEO branch diff.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build`.
- [ ] Inspect `dist/index.html` and verify the rendered H1 and metadata.
- [ ] Validate JSON-LD with Google's Rich Results Test / Schema Markup Validator.
- [ ] Confirm the live robots and sitemap URLs return HTTP 200.
- [ ] Merge and deploy the branch.
- [ ] Verify Search Console ownership.
- [ ] Submit sitemap and inspect URLs.
- [ ] Review page-specific metadata for standalone pages.
- [ ] Only then prepare the adult-managed Google Ads experiment.

## Official references

- Google Search Essentials: https://developers.google.com/search/docs/essentials
- SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Organization structured data: https://developers.google.com/search/docs/appearance/structured-data/organization
- Google Ads advertiser verification / age: https://support.google.com/adspolicy/answer/9703665
- Teen ad protections: https://support.google.com/adspolicy/answer/12205906
