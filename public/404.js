// arquivo separado: o CSP do servidor (script-src 'self') bloqueia script inline.
// Mensagem sorteada + axolote em pixel que reage ao clique.
var msgs = [
  'você saiu do mapa.',
  'o axolote procurou em tudo. essa página não está aqui.',
  'esse caminho não leva a lugar nenhum (ainda).',
  'aqui só tem água. a página que você queria, não.',
  'a página foi pra outro servidor.',
]
var h1 = document.getElementById('msg')
if (h1) h1.textContent = msgs[Math.floor(Math.random() * msgs.length)]

// sprite 15x10: P corpo, D guelra, E olho, M boca
var sprite = [
  '..D.........D..',
  '.DD..PPPPP..DD.',
  'D.DPPPPPPPPPD.D',
  '..DPPEPPPEPPD..',
  'D.DPPPPPPPPPD.D',
  '..DPPPPMPPPPD..',
  '...PPPPPPPPP...',
  '...PPPPPPPPP...',
  '..PP.PPPPP.PP..',
  '..PP.......PP..',
]
var colors = { P: '#f7a8c4', D: '#e0608f', E: '#1b1020', M: '#c9496f' }
var cv = document.getElementById('sprite')
if (cv && cv.getContext) {
  var S = 8
  var ctx = cv.getContext('2d')
  var draw = function (blink) {
    ctx.clearRect(0, 0, cv.width, cv.height)
    sprite.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        var ch = row[x]
        if (ch === '.') continue
        ctx.fillStyle = colors[ch === 'E' && blink ? 'P' : ch]
        ctx.fillRect(x * S, y * S, S, S)
      }
    })
  }
  draw(false)
  var clicks = 0
  var note = document.getElementById('note')
  var lines = ['', 'ele piscou.', 'de novo?', 'tá, já entendi que você gosta dele.', 'ele quer que você volte pra central.']
  cv.addEventListener('click', function () {
    clicks++
    draw(true)
    setTimeout(function () { draw(false) }, 160)
    if (note) note.textContent = lines[Math.min(clicks, lines.length - 1)]
  })
}
