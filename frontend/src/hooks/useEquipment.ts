import { useState, useEffect, useCallback } from 'react'
import type { EquipmentItem } from '../types'
import { fetchEquipment } from '../api/client'

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

  return { items, loading, error, reload: load }
}
