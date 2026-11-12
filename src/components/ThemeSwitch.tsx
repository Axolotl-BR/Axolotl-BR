import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'prism'
import { useLang } from '../lib/i18n'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const { c } = useLang()
  const light = theme === 'light'
  return (
    <button
      type="button"
      className="theme-btn"
      onClick={() => setTheme(light ? 'dark' : 'light')}
      aria-label={light ? c.themeDark : c.themeLight}
      title={light ? c.themeDark : c.themeLight}
    >
      {light ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
    </button>
  )
}
