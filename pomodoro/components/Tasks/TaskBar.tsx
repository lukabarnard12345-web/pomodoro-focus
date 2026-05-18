'use client'

import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { AnimatePresence } from 'framer-motion'
import { useTaskStore } from '@/store/taskStore'
import { useTimerStore } from '@/store/timerStore'
import { TaskItem } from './TaskItem'
import { TaskInput } from './TaskInput'

export function TaskBar() {
  const { tasks, addTask, completeTask, deleteTask, reorderTasks } = useTaskStore()
  const { linkedTaskId } = useTimerStore()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      reorderTasks(String(active.id), String(over.id))
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order)
  const linkedTask = tasks.find((t) => t.id === linkedTaskId)

  return (
    <div className="flex h-full flex-col gap-4">
      {linkedTask && (
        <div className="rounded-lg bg-brand/10 px-3 py-2 text-xs text-brand-light ring-1 ring-brand/20">
          <span className="opacity-60">Focusing on:</span> {linkedTask.title}
        </div>
      )}

      <TaskInput onAdd={addTask} />

      <div className="flex-1 overflow-y-auto">
        {sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/15"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            <p className="text-xs text-white/30">No tasks yet</p>
            <p className="text-[10px] text-white/20">Add one above to get started</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={sortedTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-1.5">
                <AnimatePresence>
                  {sortedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onComplete={completeTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {tasks.length > 0 && (
        <p className="text-right text-xs text-white/30">
          {tasks.filter((t) => t.completed).length}/{tasks.length} done
        </p>
      )}
    </div>
  )
}
