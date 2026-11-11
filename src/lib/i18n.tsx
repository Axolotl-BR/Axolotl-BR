import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { copy, type Copy, type Lang } from '../data/copy'

type Ctx = { lang: Lang; setLang: (l: Lang) => void; c: Copy }

const I18n = createContext<Ctx | null>(null)
const KEY = 'axl-lang'

function initial(): Lang {
  try {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'pt'
  } catch {
    return 'pt'
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initial)

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang === 'en' ? 'en' : 'pt-BR'
    // en = versão preto e branco (ver global.css)
    root.dataset.lang = lang
    try {
      localStorage.setItem(KEY, lang)
    } catch {
      /* sem storage: só não lembra a escolha */
    }
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, c: copy[lang] }), [lang])
  return <I18n.Provider value={value}>{children}</I18n.Provider>
}

export function useLang(): Ctx {
  const ctx = useContext(I18n)
  if (!ctx) throw new Error('useLang fora do LangProvider')
  return ctx
}
