// ─────────────────────────────────────────────
// AXOLOTL BR — fonte única de verdade
// links, nomes e status reais. nada inventado.
// ─────────────────────────────────────────────


export const site = {
  brand: 'AXOLOTL BR',
  product: 'Axolotl BR',
  tagline: 'Sua comunidade na internet. De player para player.',
  url: 'https://axolotl-br.shardweb.app/',
  year: 2026,
  copyright: '© 2020 – 2026 axolotl br • de player pra player · by fabi',
} as const

export const links = {
  discord: 'https://discord.gg/AxolotlBR',
} as const

export const nav = [
  { label: 'INÍCIO', href: '#inicio' },
  { label: 'COMUNIDADE', href: '#comunidade' },
  { label: 'SMP', href: '#servidores' },
  { label: 'WIKI', href: '#wiki' },
  { label: 'BOT', href: '#bot' },
  { label: 'NOVIDADES', href: '#novidades' },
] as const

export type StatusState = 'online' | 'offline' | 'maintenance' | 'development'

export const owner = {
  name: 'fabi café',
  handle: 'OFabiano1',
  since: '2020',
  facts: ['fundou a comunidade em 2020', 'tá no Discord todo dia'],
} as const

export const stateLabel: Record<StatusState, string> = {
  online: 'ONLINE',
  offline: 'OFFLINE',
  maintenance: 'MANUTENÇÃO',
  development: 'EM DESENVOLVIMENTO',
}

export const servers = [
  {
    name: 'AXOLOTL SMP',
    state: 'development' as StatusState,
    version: null,
    players: null,
    desc: 'O servidor de Minecraft da comunidade. Survival com lore, eventos e construção coletiva · ainda em construção.',
    features: ['lore', 'eventos', 'survival', 'comunidade'],
  },
] as const

export const bot = {
  name: 'ALT BOT',
  role: 'o bot do único servidor',
  desc: 'Moderação, economia, níveis e tickets · direto no Discord. Ainda ligando os fios.',
  status: 'em breve',
  features: ['moderação', 'economia', 'níveis', 'tickets'],
  note: 'quando ligar, ele aparece no Discord. sem instalar nada.',
} as const

export type NewsKind = 'NEWS' | 'UPDATE' | 'PROJECT' | 'EVENT' | 'COMMUNITY'

export const news = [
  {
    kind: 'UPDATE' as NewsKind,
    date: '2026',
    title: 'este site',
    desc: 'A casa nova da comunidade. Você tá nela.',
  },
  {
    kind: 'COMMUNITY' as NewsKind,
    date: '2020',
    title: 'o começo',
    desc: 'Um grupo de amigos monta um servidor no Discord. Sem plano, sem nome chique.',
  },
  {
    kind: 'EVENT' as NewsKind,
    date: '2021 – 2022',
    title: 'primeiros eventos',
    desc: 'Campeonatinhos internos, testes de servidor e os primeiros traços da identidade.',
  },
  {
    kind: 'PROJECT' as NewsKind,
    date: '2023 – 2024',
    title: 'a coisa cresce',
    desc: 'Bot próprio, ideias de jogo e os primeiros rascunhos do SMP.',
  },
  {
    kind: 'UPDATE' as NewsKind,
    date: '2025',
    title: 'mão na massa',
    desc: 'Site, bots e labs saindo do papel.',
  },
] as const

export type FooterLink = {
  label: string
  href: string
  external?: boolean
}

export type FooterCol = {
  head: string
  links: readonly FooterLink[]
}

export const footerCols: readonly FooterCol[] = [
  {
    head: 'navegar',
    links: [
      { label: 'Início', href: '#inicio' },
      { label: 'Comunidade', href: '#comunidade' },
      { label: 'SMP', href: '#servidores' },
      { label: 'Wiki', href: '#wiki' },
      { label: 'BOT', href: '#bot' },
      { label: 'Novidades', href: '#novidades' },
    ],
  },
  {
    head: 'servidor',
    links: [
      { label: 'Axolotl SMP', href: '/smp.html' },
      { label: 'Wiki do SMP', href: '/wiki.html' },
      { label: 'Regras', href: '/regras.html' },
      { label: 'Status', href: '/status/' },
    ],
  },
  {
    head: 'comunidade',
    links: [
      { label: 'Discord', href: links.discord, external: true },
      { label: 'ALT BOT', href: '#bot' },
      { label: 'Kit de mídia', href: '/midia.html' },
      { label: 'Todos os links', href: '/links.html' },
    ],
  },
]


