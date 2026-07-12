import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap border font-medium uppercase tracking-wide transition-[background-color,color,border-color,opacity] duration-150 ease-out cursor-pointer active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100',
  {
    variants: {
      variant: {
        primary: 'border-foreground bg-foreground text-white hover:opacity-80',
        secondary:
          'border-border bg-transparent text-muted-foreground hover:border-foreground hover:text-foreground',
        destructive: 'border-destructive bg-destructive text-white hover:opacity-80',
        ghost: 'border-transparent bg-transparent text-muted-foreground hover:text-foreground',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-6 py-2.5 text-xs',
        lg: 'w-full px-6 py-3 text-sm',
        icon: 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = 'button', ...props }, ref) => {
    const Component = asChild ? Slot : 'button'
    return (
      <Component
        ref={ref}
        type={asChild ? undefined : type}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'
