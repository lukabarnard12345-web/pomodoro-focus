'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  pill?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-light',
  secondary: 'bg-surface-3 text-white/70 hover:bg-surface-2 hover:text-white',
  ghost: 'text-white/50 hover:text-white',
  danger: 'bg-surface-3 text-white/50 hover:text-red-400',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'secondary', size = 'md', pill = false, className = '', children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={[
          'inline-flex items-center justify-center gap-1.5 font-medium transition-colors disabled:opacity-40',
          pill ? 'rounded-full' : 'rounded-lg',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(' ')}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    )
  },
)

Button.displayName = 'Button'
