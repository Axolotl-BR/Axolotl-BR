import { useCallback, useEffect } from 'react'
import { useToast } from 'prism'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Marquee } from './components/Marquee'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { About } from './sections/About'
import { DiscordSection } from './sections/DiscordSection'
import { Smp } from './sections/Smp'
import { Fabi } from './sections/Fabi'
import { NowPlaying } from './sections/NowPlaying'
import { News } from './sections/News'
import { useTypingEgg, consoleNote, eggMessages } from './lib/easterEggs'

export function App() {
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
        pular para o conteúdo
      </a>
      <Navbar />
      <main id="inicio">
        <Hero onEgg={showToast} />
        <Marquee />
        <Manifesto />
        <About />
        <DiscordSection />
        <Smp />
        <Fabi />
        <NowPlaying />
        <News />
      </main>
      <Footer />
    </div>
  )
}
