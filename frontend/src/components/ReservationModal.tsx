import { useState, useRef, useEffect } from 'react'
import type { Reservation } from '../types'
import './NameModal.css'

interface Props {
  defaultDate: string
  reservation?: Reservation
  onSave: (startDate: string, endDate: string, name: string) => void
  onDelete?: () => void
  onClose: () => void
}

export function ReservationModal({ defaultDate, reservation, onSave, onDelete, onClose }: Props) {
  const [startDate, setStartDate] = useState(reservation?.startDate ?? defaultDate)
  const [endDate, setEndDate] = useState(reservation?.endDate ?? defaultDate)
  const [name, setName] = useState(reservation?.name ?? '')
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  const isValid = name.trim().length > 0 && startDate <= endDate

  const handleSave = () => {
    if (!isValid) return
    onSave(startDate, endDate, name.trim())
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{reservation ? '予約を編集' : '予約を追加'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">開始日</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="name-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">終了日</label>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={e => setEndDate(e.target.value)}
              className="name-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">名前</label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="名前を入力"
              className="name-input"
            />
          </div>
        </div>
        <div className="modal-footer">
          {onDelete && (
            <button className="btn-delete" onClick={() => { onDelete(); onClose() }}>削除</button>
          )}
          <button className="btn-cancel" onClick={onClose}>キャンセル</button>
          <button className="btn-save" onClick={handleSave} disabled={!isValid}>保存</button>
        </div>
      </div>
    </div>
  )
}
