'use client'

import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task, Priority } from '@/store/taskStore'
import { useTimerStore } from '@/store/timerStore'
import { DragIcon, DeleteIcon, CheckIcon } from '@/components/UI/Icons'

interface Props {
  task: Task
  onComplete: (id: string) => void
  onDelete: (id: string) => void
}

const PRIORITY_DOT: Record<Priority, string> = {
  high: 'bg-red-500',
  medium: 'bg-amber-400',
  low: 'bg-green-400',
}

export function TaskItem({ task, onComplete, onDelete }: Props) {
  const { linkedTaskId, setLinkedTask } = useTimerStore()
  const isLinked = linkedTaskId === task.id

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: task.completed,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={[
        'group flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors',
        isLinked ? 'bg-brand/10 ring-1 ring-brand/30' : 'bg-surface-2 hover:bg-surface-3',
        isDragging ? 'shadow-lg' : '',
      ].join(' ')}
    >
      {/* Drag handle */}
      {!task.completed && (
        <button
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="cursor-grab touch-none text-white/20 hover:text-white/50 active:cursor-grabbing"
        >
          <DragIcon size={12} />
        </button>
      )}

      {/* Checkbox */}
      <button
        onClick={() => onComplete(task.id)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        className={[
          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all',
          task.completed
            ? 'border-white/20 bg-white/10'
            : 'border-white/30 hover:border-brand hover:bg-brand/20',
        ].join(' ')}
      >
        {task.completed && <CheckIcon size={8} className="text-white/60" />}
      </button>

      {/* Priority dot */}
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${PRIORITY_DOT[task.priority]}`} />

      {/* Title */}
      <span
        className={[
          'flex-1 truncate text-sm',
          task.completed ? 'text-white/30 line-through' : 'text-white/80',
        ].join(' ')}
      >
        {task.title}
      </span>

      {/* Focus link */}
      {!task.completed && (
        <button
          onClick={() => setLinkedTask(isLinked ? null : task.id)}
          aria-label={isLinked ? 'Unlink from session' : 'Link to session'}
          title={isLinked ? 'Unlink from session' : 'Focus this task'}
          className={[
            'hidden group-hover:flex h-6 w-6 items-center justify-center rounded text-xs transition-colors',
            isLinked ? 'flex text-brand-light' : 'text-white/30 hover:text-brand-light',
          ].join(' ')}
        >
          🎯
        </button>
      )}

      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className="hidden group-hover:flex h-6 w-6 items-center justify-center rounded text-white/30 transition-colors hover:text-red-400"
      >
        <DeleteIcon size={12} />
      </button>
    </motion.div>
  )
}
