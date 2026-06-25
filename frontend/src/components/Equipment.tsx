import { useEquipment } from '../hooks/useEquipment'
import './Equipment.css'

const statusColors: Record<string, string> = {
  '使用可能': '#4caf50',
  '貸出中': '#ff9800',
  '修理中': '#f44336',
  '廃棄予定': '#9e9e9e',
}

export function Equipment() {
  const { items, loading, error } = useEquipment()

  if (loading) return <div className="equipment-wrapper"><p className="equipment-placeholder">読み込み中...</p></div>
  if (error) return <div className="equipment-wrapper"><p className="equipment-error">{error}</p></div>

  return (
    <div className="equipment-wrapper">
      <h2 className="equipment-title">備品一覧</h2>
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
            <tr key={item.id}>
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
    </div>
  )
}
