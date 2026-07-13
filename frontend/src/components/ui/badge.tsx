import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex shrink-0 items-center whitespace-nowrap text-[10px] font-medium uppercase tracking-widest',
  {
    variants: {
      tone: {
        neutral: 'text-muted-foreground',
        outline: 'font-semibold text-foreground',
        danger: 'font-semibold text-destructive',
        onImage: 'bg-card px-1.5 py-0.5 text-foreground',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />
}
