import { useCallback, useEffect } from 'react'
import { useToast } from 'prism'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Marquee } from './components/Marquee'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { DiscordSection } from './sections/DiscordSection'
import { Smp } from './sections/Smp'
import { Fabi } from './sections/Fabi'
import { Timeline } from './sections/Timeline'
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
        <Hero onEgg={showToast} />
        <Marquee />
        <About />
        <DiscordSection />
        <Smp />
        <Fabi />
        <Timeline />
      </main>
      <Footer />
    </div>
  )
}
