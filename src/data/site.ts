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
  copyright: '© 2020 – 2026 axolotl br • de player pra player — by fabi',
} as const

export const links = {
  discord: 'https://discord.gg/AxolotlBR',
  githubOrg: 'https://github.com/Axolotl-BR',
  githubSite: 'https://github.com/Axolotl-BR/Axolotl-BR',
  githubAxolotlLang: 'https://github.com/Axolotl-BR/Axolotl',
  githubSiteBeta: 'https://github.com/Axolotl-BR/Axolotl-site-beta',
} as const

export const nav = [
  { label: 'INÍCIO', href: '#inicio' },
  { label: 'COMUNIDADE', href: '#comunidade' },
  { label: 'DONO', href: '#dono' },
  { label: 'SERVIDORES', href: '#servidores' },
  { label: 'PROJETOS', href: '#projetos' },
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
    desc: 'O servidor de Minecraft da comunidade. Survival com lore, eventos e construção coletiva — ainda em construção.',
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
    role: 'organizador de arquivos para Windows',
    desc: 'Entende antes de mexer. Nada é apagado, tudo dá pra desfazer. Roda 100% no seu PC.',
    status: 'em desenvolvimento',
    tags: ['python', 'windows', 'local', 'reversível'],
  },
  {
    name: 'AXL BOT',
    role: 'o bot do servidor',
    desc: 'Moderação, economia e utilidades pro Discord. Sai em breve.',
    status: 'em breve',
    tags: ['discord', 'moderação', 'economia'],
  },
  {
    name: 'axolotl em 23 linguagens',
    role: 'o mesmo programa, 23 vezes',
    desc: 'De brainfuck a swift: a mesma ideia escrita em 23 linguagens. Não pergunta por quê.',
    status: 'online',
    tags: ['código aberto', '23 linguagens'],
    href: links.githubAxolotlLang,
  },
  {
    name: 'E3 do Axolotl',
    role: 'o evento da comunidade',
    desc: 'Um dia pra mostrar tudo que saiu do papel: SMP, bots, jogos e o resto. Ainda no planejamento.',
    status: 'planejado',
    tags: ['evento'],
  },
] as const

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

export const changelog = [
  {
    version: 'v1.0',
    date: 'set 2026',
    title: 'site v1.0',
    changes: ['casa nova da comunidade', 'código aberto desde o dia um'],
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
    desc: 'este site, de verdade',
    lang: 'HTML',
    href: links.githubSite,
  },
  {
    name: 'Axolotl',
    desc: 'o mesmo programa em 23 linguagens',
    lang: 'várias',
    href: links.githubAxolotlLang,
  },
  {
    name: 'Axolotl-site-beta',
    desc: 'testes e rascunhos do site',
    lang: 'HTML',
    href: links.githubSiteBeta,
  },
] as const
