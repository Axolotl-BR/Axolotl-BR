import { useLang } from '../lib/i18n'

export function LangSwitch() {
  const { lang, setLang, c } = useLang()
  return (
    <div className="lang-switch" role="group" aria-label={c.langLabel}>
      {(['pt', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          className="lang-btn mono"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
