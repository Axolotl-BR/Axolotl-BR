import { useCallback, useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Toast } from './components/Toast'
import { Marquee } from './components/Marquee'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { Community } from './sections/Community'
import { DiscordSection } from './sections/DiscordSection'
import { Servers } from './sections/Servers'
import { Wiki } from './sections/Wiki'
import { AltBot } from './sections/AltBot'
import { Owner } from './sections/Owner'
import { NowPlaying } from './sections/NowPlaying'
import { News } from './sections/News'
import { useTypingEgg, consoleNote, eggMessages } from './lib/easterEggs'
import { useToastTimer } from './hooks/useToastTimer'

export function App() {
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => setToast(msg), [])
  const dismissToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    consoleNote()
  }, [])

  useTypingEgg(() => showToast(eggMessages.typing))
  useToastTimer(toast, dismissToast)

  return (
    <>
      <a href="#inicio" className="skip-link">
        pular para o conteúdo
      </a>
      <Navbar />
      <main id="inicio">
        <Hero onEgg={showToast} />
        <Marquee />
        <Manifesto />
        <Community />
        <DiscordSection />
        <Servers />
        <Wiki />
        <AltBot />
        <Owner />
        <NowPlaying />
        <News />
      </main>
      <Footer />
      <Toast message={toast} />
    </>
  )
}
