// Aplica o tema salvo antes do React montar, pra não piscar o escuro do prerender.
// Arquivo externo (não inline) por causa do CSP script-src 'self'. Chave igual à de src/main.tsx.
try {
  if (localStorage.getItem('axl-theme') === 'light') {
    document.documentElement.dataset.theme = 'light'
    var root = document.querySelector('#root .prism-root')
    if (root) root.setAttribute('data-theme', 'light')
  }
} catch (e) {}
