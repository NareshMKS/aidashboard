import { useCallback, useEffect, useState } from 'react'
import {
  getTasks,
  createTask,
  deleteTask,
  completeTask,
  getTaskStats,
} from '@/services/taskService'
import type { Task, TaskStats } from '@/types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(getTasks)
  const [stats, setStats] = useState<TaskStats>(getTaskStats)

  const refresh = useCallback(() => {
    setTasks(getTasks())
    setStats(getTaskStats())
  }, [])

  useEffect(() => {
    const handler = () => refresh()
    window.addEventListener('tasks-updated', handler)
    return () => window.removeEventListener('tasks-updated', handler)
  }, [refresh])

  const add = useCallback(
    (title: string) => {
      const task = createTask(title)
      refresh()
      return task
    },
    [refresh],
  )

  const remove = useCallback(
    (id: string) => {
      const ok = deleteTask(id)
      refresh()
      return ok
    },
    [refresh],
  )

  const complete = useCallback(
    (id: string) => {
      const task = completeTask(id)
      refresh()
      return task
    },
    [refresh],
  )

  return { tasks, stats, add, remove, complete, refresh }
}
