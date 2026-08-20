import { useState, useEffect, useCallback } from 'react'
import type { EquipmentItem } from '../types'
import { fetchEquipment, createEquipment, updateEquipment, deleteEquipment } from '../api/client'

export function useEquipment() {
  const [items, setItems] = useState<EquipmentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchEquipment()
      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const addEquipment = useCallback(async (item: Omit<EquipmentItem, 'id'>) => {
    const created = await createEquipment(item)
    setItems(prev => [...prev, created])
  }, [])

  const editEquipment = useCallback(async (id: string, item: Omit<EquipmentItem, 'id'>) => {
    const updated = await updateEquipment(id, item)
    setItems(prev => prev.map(i => i.id === id ? updated : i))
  }, [])

  const removeEquipment = useCallback(async (id: string) => {
    await deleteEquipment(id)
    setItems(prev => prev.filter(i => i.id !== id))
  }, [])

  return { items, loading, error, reload: load, addEquipment, editEquipment, removeEquipment }
}
