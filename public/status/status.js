// arquivo separado: o CSP do servidor (script-src 'self') bloqueia script inline.
var opts = {}
try { opts.signal = AbortSignal.timeout(8000) } catch (e) {}
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
