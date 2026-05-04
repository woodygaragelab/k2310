import { useState, useEffect, useCallback } from 'react'
import type { Reservation } from '../types'
import { fetchMonthReservations, createReservation, updateReservation, deleteReservation } from '../api/client'

export function useReservations(year: number, month: number) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchMonthReservations(year, month)
      setReservations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [year, month])

  useEffect(() => { load() }, [load])

  const addReservation = useCallback(async (startDate: string, endDate: string, name: string, memo: string) => {
    const reservation = await createReservation(startDate, endDate, name, memo)
    setReservations(prev => [...prev, reservation])
  }, [])

  const editReservation = useCallback(async (id: string, startDate: string, endDate: string, name: string, memo: string) => {
    const updated = await updateReservation(id, startDate, endDate, name, memo)
    setReservations(prev => prev.map(r => r.id === id ? updated : r))
  }, [])

  const removeReservation = useCallback(async (id: string) => {
    try {
      await deleteReservation(id)
      setReservations(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました')
    }
  }, [])

  return { reservations, loading, error, addReservation, editReservation, removeReservation, reload: load }
}
