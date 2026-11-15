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

  // spotlight roxo seguindo o cursor nos cards (só com mouse e sem reduced-motion)
  useEffect(() => {
    const ok = window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches
    if (!ok) return
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>('.discord-door, .news-item, .smp-art')
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])

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
