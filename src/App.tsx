import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Toast } from './components/Toast'
import { Marquee } from './components/Marquee'
import { Hero } from './sections/Hero'
import { Numbers } from './sections/Numbers'
import { Manifesto } from './sections/Manifesto'
import { Community } from './sections/Community'
import { DiscordSection } from './sections/DiscordSection'
import { Servers } from './sections/Servers'
import { Lab } from './sections/Lab'
import { BuiltPublic } from './sections/BuiltPublic'
import { Owner } from './sections/Owner'
import { NowPlaying } from './sections/NowPlaying'
import { News } from './sections/News'
import { useTypingEgg, consoleNote, eggMessages } from './lib/easterEggs'

export function App() {
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => setToast(msg)

  useEffect(() => {
    consoleNote()
  }, [])

  useTypingEgg(() => showToast(eggMessages.typing))

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <>
      <a href="#inicio" className="skip-link">
        pular para o conteúdo
      </a>
      <Navbar />
      <main id="inicio">
        <Hero onEgg={showToast} />
        <Marquee />
        <Numbers />
        <Manifesto />
        <Community />
        <DiscordSection />
        <Servers />
        <Lab />
        <BuiltPublic />
        <Owner />
        <NowPlaying />
        <News />
      </main>
      <Footer onEgg={showToast} />
      <Toast message={toast} />
    </>
  )
}
