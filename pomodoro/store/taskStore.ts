import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { arrayMove } from '@dnd-kit/sortable'

export type Priority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  priority: Priority
  completed: boolean
  createdAt: number
  order: number
}

interface TaskState {
  tasks: Task[]
  addTask: (title: string, priority: Priority) => void
  completeTask: (id: string) => void
  deleteTask: (id: string) => void
  reorderTasks: (activeId: string, overId: string) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (title, priority) => {
        const tasks = get().tasks
        const task: Task = {
          id: crypto.randomUUID(),
          title: title.trim(),
          priority,
          completed: false,
          createdAt: Date.now(),
          order: tasks.length,
        }
        set({ tasks: [...tasks, task] })
      },

      completeTask: (id) =>
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t,
          ),
        }),

      deleteTask: (id) =>
        set({ tasks: get().tasks.filter((t) => t.id !== id) }),

      reorderTasks: (activeId, overId) => {
        const tasks = get().tasks
        const oldIndex = tasks.findIndex((t) => t.id === activeId)
        const newIndex = tasks.findIndex((t) => t.id === overId)
        if (oldIndex === -1 || newIndex === -1) return
        const reordered = arrayMove(tasks, oldIndex, newIndex).map((t, i) => ({
          ...t,
          order: i,
        }))
        set({ tasks: reordered })
      },
    }),
    {
      name: 'pomodoro-tasks',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
)
