// node scripts/analytics.test.mjs — confere a soma e a limpeza do contador de visitas
import assert from 'node:assert/strict'
import { record, sourceOf, take } from '../server/analytics.js'

const ua = { ua: 'Mozilla/5.0 (iPhone)', host: 'axolotl-br.shardweb.app' }
assert.equal(sourceOf('https://www.google.com.br/', 'x', ''), 'google')
assert.equal(sourceOf('https://axolotl-br.shardweb.app/smp.html', 'axolotl-br.shardweb.app', ''), 'direct')
assert.equal(sourceOf('', 'x', 'TikTok Bio!'), 'tiktok-bio')
assert.equal(sourceOf('https://www.blog.exemplo.com/post', 'x', ''), 'blog.exemplo.com')

take() // zera
record({ t: 'pv', p: '/', s: 1, r: 'https://discord.com/channels/1', c: 'Volta 2026' }, ua, 1000)
record({ t: 'pv', p: '/smp.html', s: 0 }, ua, 2000)
record({ t: 'pv', p: '/<script>', s: 0 }, ua, 3000)
record({ t: 'ck' }, ua)
record({ t: 'on' }, ua, 4000)
record({ t: 'pv', p: '/', s: 1 }, { ua: 'Googlebot/2.1', host: '' }, 5000) // robô não conta
record('lixo', ua)

const { body } = take(30_000)
assert.deepEqual(body, {
  pageviews: 3, sessions: 1, discord_clicks: 1, mobile: 1, desktop: 0, online: 4,
  pages: { '/': 1, '/smp.html': 1, '/outra': 1 },
  sources: [{ source: 'discord', campaign: 'volta-2026', sessions: 1 }],
})
assert.equal(take(200_000).body.online, 0) // sinais com mais de 1 min somem
console.log('analytics ok')
