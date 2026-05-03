import { useState, useEffect, useRef } from 'react'
import './NameModal.css'

interface Props {
  date: string
  initialNames: string[]
  onSave: (names: string[]) => void
  onClose: () => void
}

export function NameModal({ date, initialNames, onSave, onClose }: Props) {
  const [names, setNames] = useState<string[]>(initialNames.length > 0 ? initialNames : [''])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const updateName = (index: number, value: string) => {
    setNames(prev => prev.map((n, i) => i === index ? value : n))
  }

  const addName = () => setNames(prev => [...prev, ''])

  const removeName = (index: number) => {
    setNames(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    const filtered = names.map(n => n.trim()).filter(n => n.length > 0)
    onSave(filtered)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (index === names.length - 1) addName()
    }
    if (e.key === 'Escape') onClose()
  }

  const [year, month, day] = date.split('-')
  const displayDate = `${year}年${Number(month)}月${Number(day)}日`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{displayDate}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p className="modal-label">名前を入力してください</p>
          <div className="name-list">
            {names.map((name, i) => (
              <div key={i} className="name-row">
                <input
                  ref={i === 0 ? inputRef : undefined}
                  type="text"
                  value={name}
                  onChange={e => updateName(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(e, i)}
                  placeholder={`名前 ${i + 1}`}
                  className="name-input"
                />
                {names.length > 1 && (
                  <button className="remove-btn" onClick={() => removeName(i)}>×</button>
                )}
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={addName}>+ 名前を追加</button>
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>キャンセル</button>
          <button className="btn-save" onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  )
}
