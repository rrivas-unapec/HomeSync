import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex shrink-0 items-center border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-widest',
  {
    variants: {
      tone: {
        neutral: 'border-border-control text-muted-foreground',
        outline: 'border-foreground text-foreground',
        danger: 'border-destructive text-destructive',
        onImage: 'border-transparent bg-card text-foreground',
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
