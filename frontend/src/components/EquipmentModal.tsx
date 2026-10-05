import { useState, useRef, useEffect } from 'react'
import type { EquipmentItem, EquipmentAttachment } from '../types'
import { equipmentAttachmentUrl, uploadEquipmentAttachment } from '../api/client'
import './NameModal.css'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const STATUS_OPTIONS: EquipmentItem['status'][] = ['使用可能', '貸出中', '修理中', '廃棄予定']

interface Props {
  item?: EquipmentItem
  defaultCategory?: string
  onSave: (item: Omit<EquipmentItem, 'id'>) => void
  onDelete?: () => void
  onClose: () => void
}

export function EquipmentModal({ item, defaultCategory, onSave, onDelete, onClose }: Props) {
  const [name, setName] = useState(item?.name ?? '')
  const [category, setCategory] = useState(item?.category ?? defaultCategory ?? '')
  const [quantity, setQuantity] = useState(item?.quantity ?? 1)
  const [location, setLocation] = useState(item?.location ?? '')
  const [status, setStatus] = useState<EquipmentItem['status']>(item?.status ?? '使用可能')
  const [notes, setNotes] = useState(item?.notes ?? '')
  const [attachment, setAttachment] = useState<EquipmentAttachment | undefined>(item?.attachment)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    nameRef.current?.focus()
  }, [])

  const isValid = name.trim().length > 0 && category.trim().length > 0 && location.trim().length > 0 && quantity >= 0 && !uploading

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('ファイルサイズは10MB以下にしてください')
      return
    }
    setUploading(true)
    setUploadError('')
    try {
      setAttachment(await uploadEquipmentAttachment(file))
    } catch {
      setUploadError('ファイルのアップロードに失敗しました')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = () => {
    if (!isValid) return
    onSave({ name: name.trim(), category: category.trim(), quantity, location: location.trim(), status, notes: notes.trim(), attachment })
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
          <h2>{item ? '備品を編集' : '備品を追加'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">備品名</label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="備品名を入力"
              className="name-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">カテゴリ</label>
            <input
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="カテゴリを入力"
              className="name-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">数量</label>
            <input
              type="number"
              min={0}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              onKeyDown={handleKeyDown}
              className="name-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">保管場所</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="保管場所を入力"
              className="name-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label">状態</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as EquipmentItem['status'])}
              className="name-input"
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">備考</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="備考を入力（任意）"
              className="memo-input"
              rows={10}
            />
          </div>
          <div className="form-group">
            <label className="form-label">添付ファイル</label>
            <div className="attachment-row">
              {attachment && (
                item && attachment.key === item.attachment?.key ? (
                  <a className="attachment-link" href={equipmentAttachmentUrl(item.id)} target="_blank" rel="noreferrer">
                    {attachment.name}
                  </a>
                ) : (
                  <span className="attachment-link">{attachment.name}（保存後にリンクが有効になります）</span>
                )
              )}
              <input ref={fileRef} type="file" hidden onChange={handleFileChange} />
              <button type="button" className="attachment-btn" disabled={uploading} onClick={() => fileRef.current?.click()}>
                {uploading ? 'アップロード中...' : attachment ? 'ファイルを変更' : 'ファイルを添付'}
              </button>
              {attachment && !uploading && (
                <button type="button" className="attachment-btn" onClick={() => setAttachment(undefined)}>削除</button>
              )}
            </div>
            {uploadError && <span className="attachment-error">{uploadError}</span>}
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
