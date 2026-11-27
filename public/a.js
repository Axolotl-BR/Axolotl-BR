// Contador de visitas do Axolotl BR: sem cookie e sem identificador de visitante.
// Manda pro próprio servidor do site, que soma tudo e repassa só os totais ao Lab.
;(() => {
  const send = (e) => {
    const body = JSON.stringify(e)
    if (!(navigator.sendBeacon && navigator.sendBeacon('/api/pulse', body))) {
      fetch('/api/pulse', { method: 'POST', body, keepalive: true }).catch(() => {})
    }
  }
  // sessão = aba nova: a marca some quando a aba fecha e nunca sai do navegador
  let fresh = false
  try {
    fresh = !sessionStorage.getItem('axl-s')
    sessionStorage.setItem('axl-s', '1')
  } catch {
    /* storage bloqueado: conta a visita, não a sessão */
  }
  const q = new URLSearchParams(location.search)
  send({
    t: 'pv',
    p: location.pathname,
    s: fresh ? 1 : 0,
    r: fresh ? document.referrer : '',
    u: q.get('utm_source') || '',
    c: q.get('utm_campaign') || '',
  })
  // "online agora": cada aba visível dá sinal uma vez por minuto
  setInterval(() => {
    if (!document.hidden) send({ t: 'on' })
  }, 60_000)
  document.addEventListener(
    'click',
    (ev) => {
      const a = ev.target instanceof Element ? ev.target.closest('a[href]') : null
      if (a && /discord\.(gg|com\/invite)\//i.test(a.href)) send({ t: 'ck' })
    },
    true,
  )
})()
