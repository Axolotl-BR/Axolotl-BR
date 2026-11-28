// Calendário: lê /eventos/eventos.json e separa próximos de passados.
// Formato de cada evento: { "titulo", "data": "2026-12-20T20:00:00-03:00", "tipo": "live|campeonato|encontro|reunião", "desc", "link"? }
// Arquivo separado: o CSP do servidor (script-src 'self') bloqueia script inline.
;(function () {
  var up = document.getElementById('upcoming')
  var past = document.getElementById('past')
  var MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

  function empty(list, msg) {
    list.textContent = ''
    var li = document.createElement('li')
    li.className = 'empty'
    li.textContent = msg
    list.appendChild(li)
  }

  function item(ev) {
    var d = ev.when
    var li = document.createElement('li')
    var t = document.createElement('time')
    t.dateTime = ev.data
    var day = document.createElement('b')
    day.textContent = String(d.getDate())
    var mon = document.createElement('span')
    mon.textContent = MES[d.getMonth()] + ' ' + String(d.getFullYear()).slice(2)
    t.append(day, mon)

    var body = document.createElement('div')
    var tag = document.createElement('small')
    var hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
    tag.textContent = (ev.tipo || 'evento') + ' · ' + hora
    var h = document.createElement('h3')
    if (typeof ev.link === 'string' && /^https?:\/\//.test(ev.link)) {
      var a = document.createElement('a')
      a.href = ev.link
      a.textContent = ev.titulo
      a.style.color = 'inherit'
      h.appendChild(a)
    } else {
      h.textContent = ev.titulo
    }
    body.append(tag, h)
    if (ev.desc) {
      var p = document.createElement('p')
      p.textContent = ev.desc
      body.appendChild(p)
    }
    li.append(t, body)
    return li
  }

  fetch('/eventos/eventos.json')
    .then(function (r) { return r.ok ? r.json() : Promise.reject() })
    .then(function (list) {
      var now = Date.now()
      var evs = (Array.isArray(list) ? list : [])
        .filter(function (e) { return e && typeof e.titulo === 'string' && !isNaN(Date.parse(e.data)) })
        .map(function (e) { e.when = new Date(e.data); return e })
      // um evento conta como "próximo" até 3h depois de começar
      var next = evs.filter(function (e) { return e.when.getTime() + 3 * 3600e3 >= now }).sort(function (a, b) { return a.when - b.when })
      var done = evs.filter(function (e) { return e.when.getTime() + 3 * 3600e3 < now }).sort(function (a, b) { return b.when - a.when })
      if (next.length) { up.textContent = ''; next.forEach(function (e) { up.appendChild(item(e)) }) }
      else empty(up, 'Nada marcado agora. Quando tiver, aparece aqui e no Discord.')
      if (done.length) { past.textContent = ''; done.forEach(function (e) { past.appendChild(item(e)) }) }
      else empty(past, 'O histórico começa com o primeiro evento registrado aqui.')
    })
    .catch(function () {
      empty(up, 'Não deu pra carregar agora · confere no Discord.')
      empty(past, '—')
    })
})()
