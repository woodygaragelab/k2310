import type { CalendarEntry } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export async function fetchMonthEntries(year: number, month: number): Promise<CalendarEntry[]> {
  const monthStr = `${year}-${String(month).padStart(2, '0')}`
  const res = await fetch(`${API_BASE}/entries?month=${monthStr}`)
  if (!res.ok) throw new Error(`Failed to fetch entries: ${res.status}`)
  return res.json()
}

export async function putEntry(date: string, names: string[]): Promise<CalendarEntry> {
  const res = await fetch(`${API_BASE}/entries/${date}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ names }),
  })
  if (!res.ok) throw new Error(`Failed to save entry: ${res.status}`)
  return res.json()
}

export async function deleteEntry(date: string): Promise<void> {
  const res = await fetch(`${API_BASE}/entries/${date}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Failed to delete entry: ${res.status}`)
}
