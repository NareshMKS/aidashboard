import type { Task, TaskStats } from '@/types'
import { generateId } from '@/lib/utils'

const STORAGE_KEY = 'ai-dashboard-tasks'

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch {
    return []
  }
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  window.dispatchEvent(new CustomEvent('tasks-updated'))
}

export function getTasks(): Task[] {
  return loadTasks()
}

export function createTask(title: string): Task {
  const tasks = loadTasks()
  const task: Task = {
    id: generateId(),
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  }
  tasks.unshift(task)
  saveTasks(tasks)
  return task
}

export function deleteTask(id: string): boolean {
  const tasks = loadTasks()
  const filtered = tasks.filter((t) => t.id !== id)
  if (filtered.length === tasks.length) return false
  saveTasks(filtered)
  return true
}

export function completeTask(id: string): Task | null {
  const tasks = loadTasks()
  const task = tasks.find((t) => t.id === id)
  if (!task) return null
  task.completed = true
  task.completedAt = new Date().toISOString()
  saveTasks(tasks)
  return task
}

export function getTaskStats(): TaskStats {
  const tasks = loadTasks()
  const completed = tasks.filter((t) => t.completed).length
  const total = tasks.length
  return {
    total,
    completed,
    pending: total - completed,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  }
}
