// arquivo separado: o CSP do servidor (script-src 'self') bloqueia script inline.
var opts = {}
try { opts.signal = AbortSignal.timeout(8000) } catch (e) {}
fetch('/api/status', opts)
  .then(function (r) { return r.ok ? r.json() : null })
  .then(function (d) {
    var pill = document.getElementById('discord-pill')
    if (!pill || !d) return
    pill.textContent = d.discord ? 'no ar' : 'fora do ar'
    pill.className = d.discord ? 'pill ok' : 'pill warn'
    var sub = document.getElementById('discord-sub')
    if (sub && typeof d.online === 'number') sub.textContent = d.online + ' pessoas online agora'
    var alt = document.getElementById('alt-pill')
    if (alt) {
      if (d.alt === true) { alt.textContent = 'online'; alt.className = 'pill ok' }
      else if (d.alt === false) { alt.textContent = 'offline'; alt.className = 'pill warn' }
      else { alt.textContent = 'sem checagem'; alt.className = 'pill dim' }
    }
  })
  .catch(function () {})

fetch('/api/now-playing', opts)
  .then(function (r) { return r.ok ? r.json() : null })
  .then(function (d) {
    var t = d && (d.playing ? d : d.last)
    if (!t) return
    var label = document.getElementById('now-label')
    var sub = document.getElementById('now-sub')
    var pill = document.getElementById('now-pill')
    if (label && !d.playing) label.textContent = 'última que tocou'
    if (sub) sub.textContent = (t.title || 'sem título') + ' · ' + (t.artist || 'desconhecido')
    if (pill && d.playing) { pill.textContent = 'tocando'; pill.className = 'pill ok' }
  })
  .catch(function () {})
