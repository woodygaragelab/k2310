import { useState } from 'react'
import { useEquipment } from '../hooks/useEquipment'
import { EquipmentModal } from './EquipmentModal'
import type { EquipmentItem } from '../types'
import './Equipment.css'

function truncate(text: string, max: number) {
  const chars = Array.from(text)
  return chars.length > max ? chars.slice(0, max).join('') + '...' : text
}

export function Equipment() {
  const { items, loading, error, addEquipment, editEquipment, removeEquipment } = useEquipment()
  const [modalState, setModalState] = useState<{ open: boolean; item?: EquipmentItem }>({ open: false })

  const [query, setQuery] = useState('')

  if (loading) return <div className="equipment-wrapper"><p className="equipment-placeholder">読み込み中...</p></div>
  if (error) return <div className="equipment-wrapper"><p className="equipment-error">{error}</p></div>

  const q = query.trim().toLowerCase()
  const filtered = (q
    ? items.filter(item => item.name.toLowerCase().includes(q) || (item.notes ?? '').toLowerCase().includes(q))
    : [...items]
  ).sort((a, b) => a.name.localeCompare(b.name, 'ja'))

  return (
    <div className="equipment-wrapper">
      <div className="equipment-header">
        <input
          className="equipment-search"
          type="search"
          placeholder="備品名・備考で検索"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="equipment-add-btn" onClick={() => setModalState({ open: true })}>追加</button>
      </div>
      <table className="equipment-table">
        <thead>
          <tr>
            <th>備品名</th>
            <th>保管場所</th>
            <th>備考</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(item => (
            <tr key={item.id} onClick={() => setModalState({ open: true, item })} className="equipment-row">
              <td className="equipment-name">{item.name}</td>
              <td>{item.location}</td>
              <td className="equipment-notes">{truncate(item.notes ?? '', 15)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalState.open && (
        <EquipmentModal
          item={modalState.item}
          onSave={data => modalState.item ? editEquipment(modalState.item.id, data) : addEquipment(data)}
          onDelete={modalState.item ? () => removeEquipment(modalState.item!.id) : undefined}
          onClose={() => setModalState({ open: false })}
        />
      )}
    </div>
  )
}
