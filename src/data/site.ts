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
  { label: 'SOBRE NÓS', href: '#sobre' },
  { label: 'SMP', href: '#smp' },
  { label: 'NOVIDADES', href: '#novidades' },
] as const

export const smp = {
  name: 'AXOLOTL SMP',
  state: 'em desenvolvimento',
  desc: 'O servidor de survival da comunidade. Lore, eventos e construção coletiva · ainda em construção.',
  features: ['minecraft · java', 'survival', 'lore', 'eventos', 'comunidade'],
  note: 'o IP sai no Discord quando abrir.',
} as const

export const owner = {
  name: 'fabi café',
  handle: 'OFabiano1',
  since: '2020',
  facts: ['fundei a comunidade em 2020', 'tô no Discord todo dia'],
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
      { label: 'Sobre nós', href: '#sobre' },
      { label: 'SMP', href: '#smp' },
      { label: 'Novidades', href: '#novidades' },
    ],
  },
  {
    head: 'comunidade',
    links: [
      { label: 'Discord', href: links.discord, external: true },
      { label: 'Wiki do SMP', href: '/wiki/' },
      { label: 'Regras', href: '/regras.html' },
      { label: 'Status', href: '/status/' },
      { label: 'Kit de mídia', href: '/midia.html' },
      { label: 'Todos os links', href: '/links.html' },
    ],
  },
]


