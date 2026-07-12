import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme, THEME_PREFERENCES, type ThemePreference } from '@/app/providers/theme-context'
import { MESSAGES } from '@/lib/messages'
import { cn } from '@/lib/utils'

const ICONS: Record<ThemePreference, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

const LABELS: Record<ThemePreference, string> = {
  light: MESSAGES.theme.light,
  dark: MESSAGES.theme.dark,
  system: MESSAGES.theme.system,
}

export function ThemeToggle() {
  const { preference, setPreference } = useTheme()

  return (
    <div
      role="radiogroup"
      aria-label={MESSAGES.theme.label}
      className="flex border border-border-control"
    >
      {THEME_PREFERENCES.map((value, index) => {
        const Icon = ICONS[value]
        const active = preference === value

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={LABELS[value]}
            title={LABELS[value]}
            tabIndex={active ? 0 : -1}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
              event.preventDefault()
              const offset = event.key === 'ArrowRight' ? 1 : THEME_PREFERENCES.length - 1
              const next = THEME_PREFERENCES[(index + offset) % THEME_PREFERENCES.length]
              if (next !== undefined) setPreference(next)
            }}
            onClick={() => {
              setPreference(value)
            }}
            className={cn(
              'flex h-7 w-7 cursor-pointer items-center justify-center transition-colors duration-150 ease-out motion-reduce:transition-none',
              index > 0 && 'border-l border-border-control',
              active
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
