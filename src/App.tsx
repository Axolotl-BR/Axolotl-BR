import { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Toast } from './components/Toast'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { Universe } from './sections/Universe'
import { Community } from './sections/Community'
import { DiscordSection } from './sections/DiscordSection'
import { Servers } from './sections/Servers'
import { Lab } from './sections/Lab'
import { BuiltPublic } from './sections/BuiltPublic'
import { StatusSection } from './sections/StatusSection'
import { News } from './sections/News'
import { Social } from './sections/Social'
import { usePointerGlow } from './hooks/usePointerGlow'
import { useTypingEgg, consoleNote, eggMessages } from './lib/easterEggs'

export function App() {
  const [toast, setToast] = useState<string | null>(null)
  usePointerGlow(true)

  const showToast = (msg: string) => setToast(msg)

  useEffect(() => {
    consoleNote()
    const t = setTimeout(() => showToast('🫟 bem-vindo ao hub. explora com calma.'), 1200)
    return () => clearTimeout(t)
  }, [])

  useTypingEgg(() => showToast(eggMessages.typing))

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3800)
    return () => clearTimeout(t)
  }, [toast])

  return (
    <>
      <a href="#hub" className="skip-link">
        pular para o conteúdo
      </a>
      <Navbar />
      <main id="hub">
        <Hero onEgg={showToast} />
        <Manifesto />
        <Universe />
        <Community />
        <DiscordSection />
        <Servers />
        <Lab />
        <BuiltPublic />
        <StatusSection />
        <News />
        <Social />
      </main>
      <Footer onEgg={showToast} />
      <Toast message={toast} />
    </>
  )
}