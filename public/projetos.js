// arquivo separado: o CSP do servidor (script-src 'self') bloqueia script inline.
var list = document.getElementById('changelog')
fetch('/api/changelog')
  .then(function (r) { return r.ok ? r.json() : null })
  .then(function (d) {
    if (!list) return
    list.textContent = ''
    var items = (d && d.alt) || []
    if (!items.length) {
      var li = document.createElement('li')
      li.textContent = 'não deu pra carregar agora · veja no GitHub.'
      list.appendChild(li)
      return
    }
    items.forEach(function (it) {
      var li = document.createElement('li')
      var day = new Date(it.date).toLocaleDateString('pt-BR')
      li.textContent = it.msg
      var s = document.createElement('small')
      s.textContent = day
      li.appendChild(s)
      list.appendChild(li)
    })
  })
  .catch(function () {})
