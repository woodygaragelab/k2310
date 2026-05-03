import { useState, useEffect, useCallback } from 'react'
import type { CalendarEntry } from '../types'
import { fetchMonthEntries, putEntry, deleteEntry } from '../api/client'

export function useCalendarEntries(year: number, month: number) {
  const [entries, setEntries] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMonthEntries(year, month)
      const map: Record<string, string[]> = {}
      data.forEach((e: CalendarEntry) => { map[e.date] = e.names })
      setEntries(map)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [year, month])

  useEffect(() => { load() }, [load])

  const saveEntry = useCallback(async (date: string, names: string[]) => {
    if (names.length === 0) {
      await deleteEntry(date)
      setEntries(prev => {
        const next = { ...prev }
        delete next[date]
        return next
      })
    } else {
      await putEntry(date, names)
      setEntries(prev => ({ ...prev, [date]: names }))
    }
  }, [])

  return { entries, loading, error, saveEntry, reload: load }
}
