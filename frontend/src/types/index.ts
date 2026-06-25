export interface Reservation {
  id: string
  startDate: string  // YYYY-MM-DD
  endDate: string    // YYYY-MM-DD
  name: string
  memo?: string
  isCancelled?: boolean
  isProvisional?: boolean
}

export interface EquipmentItem {
  id: string
  name: string
  category: string
  quantity: number
  location: string
  status: '使用可能' | '貸出中' | '修理中' | '廃棄予定'
  notes?: string
}
