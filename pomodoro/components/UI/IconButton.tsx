'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  size?: 'sm' | 'md'
  active?: boolean
  showLabel?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, Props>(
  ({ label, size = 'md', active, showLabel = false, className = '', children, ...props }, ref) => {
    const sizeClass = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={label}
        title={label}
        className={[
          'flex flex-col items-center justify-center rounded-lg transition-colors',
          showLabel ? 'gap-0.5 px-1.5 py-1.5 min-w-[44px]' : `gap-0 ${sizeClass}`,
          active
            ? 'bg-brand/20 text-brand-light'
            : 'text-white/50 hover:bg-surface-3 hover:text-white',
          className,
        ].join(' ')}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
        {showLabel && (
          <span className="text-[9px] font-medium tracking-wide leading-none select-none">
            {label}
          </span>
        )}
      </motion.button>
    )
  },
)

IconButton.displayName = 'IconButton'
