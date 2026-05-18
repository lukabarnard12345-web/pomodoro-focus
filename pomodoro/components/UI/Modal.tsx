'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CloseIcon } from './Icons'

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  position?: 'center' | 'bottom'
  maxWidth?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  position = 'center',
  maxWidth = 'max-w-sm',
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {position === 'center' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              className={`fixed left-1/2 top-1/2 z-50 w-full ${maxWidth} -translate-x-1/2 -translate-y-1/2 rounded-2xl glass p-6`}
            >
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-surface-3 hover:text-white"
                >
                  <CloseIcon size={14} />
                </button>
              </div>
              {children}
            </motion.div>
          ) : (
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] overflow-y-auto rounded-t-2xl glass-light p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-surface-3 hover:text-white"
                >
                  <CloseIcon size={14} />
                </button>
              </div>
              {children}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
