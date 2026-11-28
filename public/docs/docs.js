// Marca na sidebar a seção que está na tela. Arquivo separado: o CSP bloqueia script inline.
;(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.side a[href^="#"]'))
  if (!links.length || !('IntersectionObserver' in window)) return
  var byId = {}
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a })
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return
      links.forEach(function (a) { a.removeAttribute('aria-current') })
      var a = byId[e.target.id]
      if (a) a.setAttribute('aria-current', 'true')
    })
  }, { rootMargin: '0px 0px -70% 0px' })
  Object.keys(byId).forEach(function (id) {
    var s = document.getElementById(id)
    if (s) io.observe(s)
  })
})()
