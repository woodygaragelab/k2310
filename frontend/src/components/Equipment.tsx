import { useState } from 'react'
import { useEquipment } from '../hooks/useEquipment'
import { EquipmentModal } from './EquipmentModal'
import type { EquipmentItem } from '../types'
import './Equipment.css'

const statusColors: Record<string, string> = {
  '使用可能': '#4caf50',
  '貸出中': '#ff9800',
  '修理中': '#f44336',
  '廃棄予定': '#9e9e9e',
}

export function Equipment() {
  const { items, loading, error, addEquipment, editEquipment, removeEquipment } = useEquipment()
  const [modalState, setModalState] = useState<{ open: boolean; item?: EquipmentItem }>({ open: false })

  if (loading) return <div className="equipment-wrapper"><p className="equipment-placeholder">読み込み中...</p></div>
  if (error) return <div className="equipment-wrapper"><p className="equipment-error">{error}</p></div>

  return (
    <div className="equipment-wrapper">
      <div className="equipment-header">
        <h2 className="equipment-title">備品一覧</h2>
        <button className="equipment-add-btn" onClick={() => setModalState({ open: true })}>+ 備品を追加</button>
      </div>
      <table className="equipment-table">
        <thead>
          <tr>
            <th>備品名</th>
            <th>カテゴリ</th>
            <th>数量</th>
            <th>保管場所</th>
            <th>状態</th>
            <th>備考</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} onClick={() => setModalState({ open: true, item })} className="equipment-row">
              <td className="equipment-name">{item.name}</td>
              <td>{item.category}</td>
              <td className="equipment-qty">{item.quantity}</td>
              <td>{item.location}</td>
              <td>
                <span
                  className="equipment-status"
                  style={{ backgroundColor: statusColors[item.status] ?? '#9e9e9e' }}
                >
                  {item.status}
                </span>
              </td>
              <td className="equipment-notes">{item.notes}</td>
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
