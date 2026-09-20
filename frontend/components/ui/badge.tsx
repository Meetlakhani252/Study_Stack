import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-fg [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-selected text-main [a&]:hover:bg-selected/90',
        destructive:
          'border-transparent bg-danger text-white [a&]:hover:bg-danger/90 focus-visible:ring-danger/20',
        success:
          'border-transparent bg-primary text-primary-fg [a&]:hover:bg-primary/90',
        warning:
          'border-transparent bg-warning text-white [a&]:hover:bg-warning/90',
        outline:
          'text-main border-border [a&]:hover:bg-selected [a&]:hover:text-main',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const finalAsChild = asChild ?? false;
  const Comp = finalAsChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
