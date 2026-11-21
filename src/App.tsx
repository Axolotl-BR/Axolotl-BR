import { useCallback, useEffect } from 'react'
import { useToast } from 'prism'
import { Navbar } from './components/Navbar'
import { Fx } from './components/Fx'
import { Mascot } from './components/Mascot'
import { Footer } from './components/Footer'
import { Marquee } from './components/Marquee'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { DiscordSection } from './sections/DiscordSection'
import { Smp } from './sections/Smp'
import { Projects } from './sections/Projects'
import { Updates } from './sections/Updates'
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

  // spotlight roxo seguindo o cursor nos cards (só com mouse: sem cursor não tem o que seguir)
  useEffect(() => {
    const ok = window.matchMedia('(hover: hover)').matches
    if (!ok) return
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest<HTMLElement>('.discord-door, .news-item, .smp-art, .proj-card')
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${e.clientX - r.left}px`)
      card.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })

    // botões magnéticos: seguem o mouse de leve e voltam ao soltar
    let mag: HTMLElement | null = null
    const release = () => {
      if (!mag) return
      mag.classList.add('is-magnet-out')
      mag.style.setProperty('--tx', '0px')
      mag.style.setProperty('--ty', '0px')
      mag = null
    }
    const onMag = (e: PointerEvent) => {
      const btn = (e.target as HTMLElement | null)?.closest<HTMLElement>('.prism-button')
      if (btn !== mag) release()
      if (!btn) return
      mag = btn
      btn.classList.remove('is-magnet-out')
      const r = btn.getBoundingClientRect()
      btn.style.setProperty('--tx', `${(e.clientX - (r.left + r.width / 2)) * 0.22}px`)
      btn.style.setProperty('--ty', `${(e.clientY - (r.top + r.height / 2)) * 0.32}px`)
    }
    document.addEventListener('pointermove', onMag, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointermove', onMag)
    }
  }, [])

  return (
    <div className="axl-root">
      <Fx />
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
        <Projects />
        <Updates />
        <Fabi />
        <Timeline />
      </main>
      <Footer />
      <Mascot />
    </div>
  )
}
