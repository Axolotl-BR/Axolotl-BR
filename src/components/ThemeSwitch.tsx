import { Moon, Sun } from 'lucide-react'
import { IconButton, useTheme } from 'prism'
import { useLang } from '../lib/i18n'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const { c } = useLang()
  const toLight = theme === 'dark'
  return (
    <IconButton
      size="sm"
      variant="ghost"
      icon={toLight ? Sun : Moon}
      label={toLight ? c.themeToLight : c.themeToDark}
      onClick={() => setTheme(toLight ? 'light' : 'dark')}
    />
  )
}
