'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { IconButton } from './IconButton'

interface Props {
  title: string
  isOpen: boolean
  onClose: () => void
  side?: 'left' | 'right'
  children: React.ReactNode
  width?: number
}

export function Sidebar({ title, isOpen, onClose, side = 'left', children, width = 320 }: Props) {
  const xFrom = side === 'left' ? -width : width

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: xFrom, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: xFrom, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{ width }}
            className={[
              'fixed top-0 z-40 flex h-full flex-col glass-light',
              side === 'left' ? 'left-0' : 'right-0',
            ].join(' ')}
          >
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <span className="text-sm font-semibold text-white/80">{title}</span>
              <IconButton label="Close panel" size="sm" onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}
