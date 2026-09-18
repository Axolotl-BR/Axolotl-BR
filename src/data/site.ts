// ─────────────────────────────────────────────
// AXOLOTL HUB — fonte única de verdade
// links, nomes e status reais. nada inventado.
// ─────────────────────────────────────────────

export const site = {
  brand: 'AXOLOTL BR',
  product: 'Axolotl BR',
  tagline: 'Sua comunidade na internet. De player para player.',
  url: 'https://axolotl-br.github.io/Axolotl-BR/',
  year: 2026,
  copyright: '🔌 Powered by Cool Axolotl CLUB © 2020 - 2026 by Fabi',
} as const

export const links = {
  discord: 'https://discord.gg/AxolotlBR',
  githubOrg: 'https://github.com/Axolotl-BR',
  githubSite: 'https://github.com/Axolotl-BR/Axolotl-BR',
  githubAxolotlLang: 'https://github.com/Axolotl-BR/Axolotl',
  githubSiteBeta: 'https://github.com/Axolotl-BR/Axolotl-site-beta',
} as const

export const nav = [
  { label: 'HUB', href: '#hub' },
  { label: 'UNIVERSO', href: '#universo' },
  { label: 'PROJETOS', href: '#projetos' },
  { label: 'SERVIDORES', href: '#servidores' },
  { label: 'COMUNIDADE', href: '#comunidade' },
  { label: 'NOVIDADES', href: '#novidades' },
] as const

// núcleo do ecossistema — o axolote é o centro
export const universeNodes = [
  { name: 'COMMUNITY', hint: 'pessoas e conversa' },
  { name: 'GAMES', hint: 'jogamos juntos' },
  { name: 'SERVERS', hint: 'experiências ativas' },
  { name: 'PROJECTS', hint: 'coisas construídas' },
  { name: 'TECH', hint: 'código e sistemas' },
  { name: 'CREATORS', hint: 'quem cria aqui' },
] as const

export type StatusState = 'online' | 'offline' | 'maintenance' | 'development'

export const status = [
  { label: 'AXOLOTL HUB', state: 'development' as const, note: 'em construção' },
  { label: 'DISCORD', state: 'online' as const, note: 'comunidade ativa' },
  { label: 'GITHUB', state: 'online' as const, note: 'projetos públicos' },
  { label: 'SMP', state: 'development' as const, note: 'em desenvolvimento' },
  { label: 'LAB', state: 'online' as const, note: 'experimentos rodando' },
] as const

export const stateLabel: Record<StatusState, string> = {
  online: 'ONLINE',
  offline: 'OFFLINE',
  maintenance: 'MAINTENANCE',
  development: 'EM DESENVOLVIMENTO',
}

export const servers = [
  {
    name: 'AXOLOTL SMP',
    state: 'development' as StatusState,
    version: null,
    players: null,
    desc: 'O universo Minecraft do Axolotl. Surviving com lore, eventos e relíquias — nada de servidor genérico onde você entra, joga dois dias e esquece.',
    features: ['lore', 'eventos', 'survival', 'comunidade'],
  },
] as const

export type LabStatus = 'em desenvolvimento' | 'em breve' | 'online' | 'planejado'

export type LabProject = {
  name: string
  concept?: string
  role: string
  desc: string
  status: LabStatus
  tags: string[]
  href?: string
}

export const labProjects: readonly LabProject[] = [
  {
    name: 'F.R.I.D.A.Y.',
    concept: 'File Retrieval, Indexing, Directory & Archiving Y-system',
    role: 'organizador inteligente de arquivos para Windows',
    desc: 'Entende antes de organizar. Nunca apaga nada. Toda operação é reversível. Roda 100% local — o axolote não vaza seus arquivos pra internet.',
    status: 'em desenvolvimento',
    tags: ['python', 'desktop', 'local-first', 'undo total'],
  },
  {
    name: 'AXL BOT',
    role: 'a infraestrutura da comunidade',
    desc: 'Bot do Discord com economia, moderação e presença em todo canto do servidor. Parte do DNA do Axolotl desde o começo.',
    status: 'em breve',
    tags: ['discord', 'bot', 'comunidade'],
  },
  {
    name: 'axolotl em 23 linguagens',
    role: 'o meme científico do universo',
    desc: 'a mesma ideia em bf, c, c++, c#, dart, elixir, go, haskell, java, js, kotlin, lua, ml, php, perl, powershell, python, r, ruby, shell, swift, ts e vbs. porque sim.',
    status: 'online',
    tags: ['open source', 'meme', 'código'],
    href: links.githubAxolotlLang,
  },
  {
    name: 'E3 do Axolotl',
    role: 'o showcase do universo',
    desc: 'A apresentação de todas as frentes: SMP, bots, labs, talks, studio, jogos, identidade e os extras que ninguém prevê.',
    status: 'planejado',
    tags: ['evento', 'universo'],
  },
] as const

export type NewsKind = 'NEWS' | 'UPDATE' | 'PROJECT' | 'EVENT' | 'COMMUNITY'

export const news = [
  {
    kind: 'UPDATE' as NewsKind,
    date: '2026',
    title: 'hub v1.0 em construção',
    desc: 'A casa do universo está sendo erguida agora, aqui. Este site é o resultado. O resto vem em seguida.',
  },
  {
    kind: 'COMMUNITY' as NewsKind,
    date: '2020',
    title: 'o começo',
    desc: 'A comunidade nasce como um projeto experimental. De player para player, antes de virar qualquer coisa maior.',
  },
  {
    kind: 'EVENT' as NewsKind,
    date: '2021 – 2022',
    title: 'eventos e identidade',
    desc: 'Primeiros eventos internos, testes de servidores e os primeiros traços da identidade visual que apareceu aqui.',
  },
  {
    kind: 'PROJECT' as NewsKind,
    date: '2023 – 2024',
    title: 'universo em expansão',
    desc: 'Planejamento das frentes do ecossistema: servidores, bots, jogos e o laboratório de projetos.',
  },
  {
    kind: 'UPDATE' as NewsKind,
    date: '2025',
    title: 'mão na massa',
    desc: 'Desenvolvimento ativo de site, bots, jogos e labs. Muita coisa quebrada, consertada e publicada em público.',
  },
] as const

export const changelog = [
  {
    version: 'v1.0',
    date: 'set 2026',
    title: 'hub experience',
    changes: [
      'nova casa digital do universo',
      'o sistema operacional da comunidade',
      'cultura axolotl de player para player',
    ],
  },
] as const

export const socials = [
  {
    name: 'Discord',
    handle: 'AxolotlBR',
    desc: 'o ponto de encontro',
    href: links.discord,
  },
  {
    name: 'GitHub',
    handle: 'Axolotl-BR',
    desc: 'código e experimentos em público',
    href: links.githubOrg,
  },
  {
    name: 'Site',
    handle: 'Axolotl-BR',
    desc: 'a central — você está aqui',
    href: site.url,
  },
] as const

export const githubRepos = [
  {
    name: 'Axolotl-BR',
    desc: 'o site oficial — comunidade, projetos e experimentos',
    lang: 'HTML',
    href: links.githubSite,
  },
  {
    name: 'Axolotl',
    desc: 'a mesma ideia em 23 linguagens de programação',
    lang: 'Java',
    href: links.githubAxolotlLang,
  },
  {
    name: 'Axolotl-site-beta',
    desc: 'versões beta e testes do site',
    lang: 'HTML',
    href: links.githubSiteBeta,
  },
] as const