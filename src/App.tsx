import { useCallback, useEffect } from 'react'
import { useToast } from 'prism'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Marquee } from './components/Marquee'
import { HeroV2 } from './v2/HeroV2'
import { Bento } from './v2/Bento'
import { TimelineV2 } from './v2/TimelineV2'
import { useLang } from './lib/i18n'
import { useTypingEgg, consoleNote, eggMessages } from './lib/easterEggs'

export function App() {
  const { c } = useLang()
  const { show } = useToast()
  const showToast = useCallback(
    (msg: string) => {
      show({ title: msg, tone: 'neutral' })
    },
    [show],
  )

  useEffect(() => {
    consoleNote()
  }, [])

  useTypingEgg(() => showToast(eggMessages.typing))

  return (
    <div className="axl-root">
      <a href="#inicio" className="skip-link">
        {c.skip}
      </a>
      <Navbar />
      <main id="inicio">
        <HeroV2 onEgg={showToast} />
        <Marquee />
        <Bento />
        <TimelineV2 />
      </main>
      <Footer />
    </div>
  )
}
