import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/app/providers/theme-context'
import { MESSAGES } from '@/lib/messages'

export function ThemeToggle() {
  const { resolved, setPreference } = useTheme()

  const goingDark = resolved === 'light'
  const Icon = goingDark ? Moon : Sun
  const label = goingDark ? MESSAGES.theme.switchToDark : MESSAGES.theme.switchToLight

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={resolved === 'dark'}
      onClick={() => {
        setPreference(goingDark ? 'dark' : 'light')
      }}
      className="flex h-7 w-7 cursor-pointer items-center justify-center text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground motion-reduce:transition-none"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  )
}
